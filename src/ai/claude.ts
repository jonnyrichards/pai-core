import {
  query,
  type SDKMessage,
  type SDKResultSuccess,
  type SDKResultError,
  type SDKAssistantMessage,
  type HookCallback,
  type AgentDefinition,
} from "@anthropic-ai/claude-agent-sdk";
import { readFile, readdir, stat } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { resolve, join, relative } from "node:path";

import type { Config } from "../config.js";
import { recordUsage } from "../log/usage.js";
import { debugLog } from "../log/debug.js";
import { sendToOwner } from "../whatsapp/outbound.js";

export type ProgressCallback = (message: string) => void;

const PROJECT_ROOT = resolve(import.meta.dirname, "../..");
const DATA_DIR = process.env.PAI_DATA_DIR
  ? resolve(process.env.PAI_DATA_DIR)
  : resolve(PROJECT_ROOT);
const MEMORY_DIR = resolve(DATA_DIR, "memory");
const MEMORY_FILE = resolve(MEMORY_DIR, "hot-memory.md");
const PATTERNS_FILE = resolve(MEMORY_DIR, "pai-meta", "patterns.md");
const BRIEFING_BRIDGE_FILE = resolve(MEMORY_DIR, "pai-meta", "briefing-bridge.md");
const COMMANDS_DIR = resolve(PROJECT_ROOT, ".claude", "commands");

/** Count non-empty lines in a file. Returns 0 if unreadable. */
async function countLines(filePath: string): Promise<number> {
  try {
    const content = await readFile(filePath, "utf-8");
    return content.split("\n").filter((l) => l.trim()).length;
  } catch {
    return 0;
  }
}

/** Recursively list .md files in a directory. */
async function listMdFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "glacier") {
        results.push(...await listMdFiles(full));
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        results.push(full);
      }
    }
  } catch {
    // dir doesn't exist
  }
  return results;
}

/** Extract a 1-line description from a domain's hot-memory.md first section bullets. */
async function getDomainDescription(domain: string): Promise<string> {
  const hotMemPath = resolve(MEMORY_DIR, domain, "hot-memory.md");
  try {
    const content = await readFile(hotMemPath, "utf-8");
    const lines = content.split("\n");
    let inSection = false;
    const bullets: string[] = [];
    for (const line of lines) {
      if (line.startsWith("## ") && !inSection) { inSection = true; continue; }
      if (line.startsWith("## ") && inSection) break;
      if (inSection && line.startsWith("- ")) {
        const clean = line.slice(2).replace(/\*\*/g, "").replace(/\[\[.*?\]\]/g, "").trim();
        if (clean) bullets.push(clean);
        if (bullets.length >= 3) break;
      }
    }
    const desc = bullets.join(". ");
    return desc.length > 150 ? desc.slice(0, 147) + "..." : desc;
  } catch {
    return "";
  }
}

/** Build a grouped routing index of available memory files by domain. */
async function buildMemoryStats(journalDir: string): Promise<string> {
  const files = await listMdFiles(MEMORY_DIR);

  // Group files by domain
  const domains = new Map<string, Array<{ name: string; lines: number; modified: string }>>();

  for (const file of files.sort()) {
    const rel = relative(MEMORY_DIR, file);
    // Skip hot-memory and patterns (already injected as content)
    if (rel === "hot-memory.md" || rel === "pai-meta/patterns.md") continue;
    // Skip auto-generated index files
    if (rel === "link-index.md" || rel === "glacier/index.md") continue;

    const lines = await countLines(file);
    if (lines === 0) continue;

    const parts = rel.split("/");
    const domain = parts.length > 1 ? parts.slice(0, -1).join("/") : "root";
    const name = parts[parts.length - 1];
    const fileStat = await stat(file).catch(() => null);
    const modified = fileStat
      ? fileStat.mtime.toISOString().slice(0, 10)
      : "unknown";

    if (!domains.has(domain)) domains.set(domain, []);
    domains.get(domain)!.push({ name, lines, modified });
  }

  // Build grouped output with domain descriptions
  let result = "### Memory Router Index\n\n";

  for (const [domain, domainFiles] of domains) {
    const description = await getDomainDescription(domain);
    result += `#### ${domain}${description ? ` — ${description}` : ""}\n`;
    result += "| File | Lines | Last Modified |\n|------|-------|---------------|\n";
    for (const f of domainFiles) {
      result += `| ${f.name} | ${f.lines} | ${f.modified} |\n`;
    }
    result += "\n";
  }

  // Count glacier files
  let glacierCount = 0;
  try {
    const glacierFiles = await listGlacierFiles(resolve(MEMORY_DIR, "glacier"));
    glacierCount = glacierFiles.length;
  } catch {
    // no glacier dir
  }

  // Count journal files
  let journalInfo = "";
  try {
    const journalEntries = await readdir(journalDir);
    const mdFiles = journalEntries.filter((f) => f.endsWith(".md")).sort();
    if (mdFiles.length > 0) {
      const first = mdFiles[0].replace(".md", "");
      const last = mdFiles[mdFiles.length - 1].replace(".md", "");
      journalInfo = `Journal: ${mdFiles.length} daily files (${first} to ${last})`;
    }
  } catch {
    // no journal dir yet
  }

  if (glacierCount > 0) {
    result += `Glacier: ${glacierCount} archived files (read memory/glacier/index.md for catalog)\n`;
  }
  if (journalInfo) {
    result += journalInfo;
  }

  return result;
}

/** Recursively list .md files in glacier directory. */
async function listGlacierFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...await listGlacierFiles(full));
      } else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md") {
        results.push(full);
      }
    }
  } catch {
    // dir doesn't exist
  }
  return results;
}

function buildSystemPrompt(config: Config): string {
  const now = new Date().toLocaleString("en-US", {
    timeZone: config.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const sections = [
    `# currentDate
Current local time: ${now} (${config.timezone})`,

    `You are communicating via WhatsApp self-chat. Additional WhatsApp-specific rules:
- Keep responses concise and WhatsApp-friendly (avoid very long messages)
- Use WhatsApp markdown: *bold*, _italic_, ~strikethrough~, \`\`\`code\`\`\`
- You are talking to your owner directly in their WhatsApp self-chat. Be natural and conversational.`,

    `## Conversation History
Past conversations are saved as daily journal files in ${config.journalDir}/.
Files are named YYYY-MM-DD.md (e.g. 2026-02-21.md).
For quick lookups: Grep with pattern="<keyword>" path="${config.journalDir}/" glob="*.md", then Read matches.
For deep recall (multi-topic, narrative, cross-referencing): use the /history skill.`,

    `## Audio Response Mode
When the user indicates they're driving, in transit, walking, exercising, or otherwise can't read messages,
OR when the user explicitly asks for an audio/voice response:
- Prefix your ENTIRE response with [AUDIO] (including the brackets)
- Keep the response concise and conversational (under 500 words)
- Avoid code blocks, URLs, bullet lists, or visual formatting — speak naturally as if talking
- Don't mention the [AUDIO] prefix to the user — it's an internal signal
- Continue using [AUDIO] prefix for follow-up messages until the user indicates they can read again
- The user can also toggle audio mode manually with /audio`,

    `## Image Generation Mode
When the user asks you to generate, create, draw, or design an image:
- Prefix your response with [IMAGE: detailed description of the image to generate]
- Write a rich, detailed prompt — the description after IMAGE: is sent directly to the image generation model
- After the [IMAGE: ...] line, you can optionally add text on the next line (it becomes the image caption on WhatsApp)
- Don't mention the [IMAGE:] prefix to the user — it's an internal signal

When the user sends an image AND asks you to modify, edit, transform, or recreate it:
- The image is saved at a temp path (you'll see it in the message)
- Prefix your response with [IMAGE: description of desired result | ref:/path/to/image.jpg]
- The ref: part tells the system to use that image as reference input
- Write a detailed prompt describing what the final image should look like

Examples:
- "generate a logo for my podcast" → [IMAGE: Modern minimalist podcast logo with sound wave forming a mountain silhouette, deep purple and gold color scheme]
- User sends photo + "make this a watercolor" → [IMAGE: Transform this photograph into a delicate watercolor painting with soft edges and muted tones | ref:/tmp/pai/image-abc.jpg]`,

    `## Memory Router

Before responding, determine which domain the message relates to using the Memory Router Index below.
Then Read the relevant files for that domain based on what's being asked:
- Schedule, tasks, "what's on" → action-items.md + personal/calendar.md
- Person, thing, "who is", "about X" → entities.md
- Past conversations, "what did I say" → Grep journal files
- Overview, summary, "how's my" → hot-memory.md + action-items.md
- Old/archived data → Read glacier/index.md first
- Adding/updating info → Read target file, then write

Skip for: simple greetings, acknowledgments, follow-ups with context already loaded, skill invocations that handle their own memory.
Do this silently — don't mention routing to the user.`,

    `## Available Tools

### gcalcli — Google Calendar CLI
If \`gcalcli\` is installed and authenticated:
- \`gcalcli agenda --details all\` — next 5 days with full details
- \`gcalcli agenda --details all "YYYY-MM-DD" "YYYY-MM-DD"\` — date range with full details
- \`gcalcli search "query"\` — search events
- \`gcalcli quick "Dentist 3pm tomorrow"\` — quick-add event
- \`gcalcli list\` — list calendars
Use this for calendar queries instead of asking the user to check.`,

  ];

  return sections.join("\n\n");
}

const TIMEOUT_MS = 25 * 60 * 1000; // 25 minutes
const CHAIN_TIMEOUT_MS = TIMEOUT_MS + 60_000; // 26 min — safety net beyond spawn timeout
const MAX_RESPONSE_LENGTH = 12000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label}: timed out after ${ms / 1000}s`));
    }, ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

// ── Module State ──────────────────────────────────────────────────────────────

let sessionId: string = randomUUID();
let sessionCreated = false;

// Serialize messages: only one claude process at a time
let pending: Promise<string> = Promise.resolve("");

const SUMMARY_PROMPT = `Review the conversation so far and save any important information to the memory files in ${MEMORY_DIR}/.
Route information to the correct domain:
- Personal (family, friends, health, calendar) → ${MEMORY_DIR}/personal/
Within each domain, use: observations.md (append-only, timestamped), action-items.md (checkboxes), entities.md (people/things).
Update hot-memory.md files for urgent/top-of-mind items. Update ${MEMORY_DIR}/hot-memory.md for cross-domain urgent items.
Only update files if there is genuinely new information worth preserving. If nothing new, just respond with "Nothing to save."
Be concise — do not duplicate information already in the files.`;

interface SpawnResult {
  response: string;
  costUsd: number;
  numTurns: number;
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
  contextWindow?: number;
  precompactStop?: boolean;
}

const VERBOSE = process.env.PAI_VERBOSE === "1" || process.env.PAI_VERBOSE === "true";

// ── Hooks ────────────────────────────────────────────────────────────────────

/** PreCompact: stop compaction, signal the caller to save session + clear. */
const preCompactHook: HookCallback = async (_input, _toolUseID, _ctx) => {
  console.log("[pai] PreCompact hook fired — will save session and clear instead of compacting");
  return {
    continue: false,
    stopReason: "precompact_session_save",
  };
};

// ── Subagents ────────────────────────────────────────────────────────────────

const PAI_AGENTS: Record<string, AgentDefinition> = {
  "memory-search": {
    description: "Search and read PAI memory files for quick lookups",
    prompt: "You are a memory search helper. Find and return relevant information from PAI memory files. Be concise — return only what was asked for.",
    tools: ["Read", "Grep", "Glob"],
    model: "haiku",
  },
  "calendar": {
    description: "Query Google Calendar via gcalcli for schedule information",
    prompt: "You are a calendar helper. Use gcalcli to query the user's Google Calendar. Return structured, concise results.",
    tools: ["Bash", "Read"],
    model: "haiku",
  },
  "finance-research": {
    description: "Research financial and market data from the web",
    prompt: "You are a finance research helper. Search the web for market data, stock prices, and financial news. Return concise, factual summaries.",
    tools: ["WebSearch", "WebFetch", "Read"],
    model: "haiku",
  },
};

/** Log SDK event details when verbose mode is on. */
function logSdkEvent(msg: SDKMessage): void {
  if (!VERBOSE) return;

  const ts = new Date().toISOString().slice(11, 23);
  const prefix = `[sdk ${ts}]`;

  switch (msg.type) {
    case "assistant": {
      const a = msg as SDKAssistantMessage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blocks = a.message.content.map((b: any) => {
        if (b.type === "text") return `text(${String(b.text).length} chars)`;
        if (b.type === "tool_use") {
          const input = JSON.stringify(b.input);
          const preview = input.length > 120 ? input.slice(0, 120) + "…" : input;
          return `tool_use(${b.name}: ${preview})`;
        }
        if (b.type === "tool_result") return `tool_result(${b.tool_use_id})`;
        return b.type;
      });
      console.log(`${prefix} assistant [${blocks.join(", ")}]`);
      break;
    }
    case "user": {
      const text = typeof msg === "object" && "message" in msg
        ? JSON.stringify((msg as Record<string, unknown>).message).slice(0, 100)
        : "?";
      console.log(`${prefix} user ${text}`);
      break;
    }
    case "result": {
      const r = msg as SDKResultSuccess | SDKResultError;
      console.log(`${prefix} result: ${r.subtype}, ${r.num_turns} turns, $${r.total_cost_usd.toFixed(3)}, ${r.usage.input_tokens}in/${r.usage.output_tokens}out`);
      break;
    }
    default:
      // system, stream_event, status, hook events, etc.
      console.log(`${prefix} ${msg.type}${("subtype" in msg) ? `:${(msg as Record<string, unknown>).subtype}` : ""}`);
  }
}

/** Shorten absolute paths by stripping the project root prefix. */
function shortenPath(p: unknown): string {
  if (typeof p !== "string") return "";
  return p.replace(PROJECT_ROOT + "/", "").replace(/^\/home\/[^/]+\//, "~/");
}

/** Format a tool call into a human-readable progress string with details. */
function formatToolProgress(tool: string, input: Record<string, unknown>): string {
  switch (tool) {
    case "Read":
      return `reading ${shortenPath(input.file_path)}`;
    case "Write":
      return `writing ${shortenPath(input.file_path)}`;
    case "Edit":
      return `editing ${shortenPath(input.file_path)}`;
    case "Bash": {
      const cmd = String(input.command ?? "");
      const preview = cmd.length > 80 ? cmd.slice(0, 80) + "..." : cmd;
      return `running: ${preview}`;
    }
    case "Grep": {
      const pattern = String(input.pattern ?? "");
      const path = input.path ? ` in ${shortenPath(input.path)}` : "";
      return `searching '${pattern}'${path}`;
    }
    case "Glob":
      return `finding files: ${String(input.pattern ?? "")}`;
    case "Task":
      return `sub-task: ${String(input.description ?? "")}`;
    case "WebSearch":
      return `web search: ${String(input.query ?? "")}`;
    case "WebFetch":
      return `fetching: ${String(input.url ?? "")}`;
    case "Skill":
      return `running /${String(input.skill ?? "")}`;
    default:
      return `using ${tool}`;
  }
}

/** Extract all tool call progress strings from an SDK message. */
function getProgressFromMessage(msg: SDKMessage): string[] {
  const results: string[] = [];
  if (msg.type === "assistant") {
    const assistant = msg as SDKAssistantMessage;
    for (const block of assistant.message.content) {
      if (block.type === "tool_use") {
        const input = (block.input ?? {}) as Record<string, unknown>;
        results.push(formatToolProgress(block.name, input));
      }
    }
  }
  return results;
}

// ── System Prompt Builder ─────────────────────────────────────────────────────

async function buildFullSystemPrompt(config: Config): Promise<string> {
  let memoryContent = "";
  try {
    memoryContent = await readFile(MEMORY_FILE, "utf-8");
  } catch {
    // No memory file yet
  }

  let patternsContent = "";
  try {
    patternsContent = await readFile(PATTERNS_FILE, "utf-8");
  } catch {
    // No patterns file yet
  }

  let briefingBridge = "";
  try {
    briefingBridge = await readFile(BRIEFING_BRIDGE_FILE, "utf-8");
  } catch {
    // No briefing bridge yet
  }

  let systemPrompt = buildSystemPrompt(config);
  const memoryStats = await buildMemoryStats(config.journalDir);
  systemPrompt += `\n\n## Memory System Status\n${memoryStats}`;
  if (memoryContent) systemPrompt += `\n\n## Current Memory\n${memoryContent}`;
  if (patternsContent) systemPrompt += `\n\n## PAI Self-Knowledge\n${patternsContent}`;
  if (briefingBridge) systemPrompt += `\n\n## Critical Nudges (from briefing-bridge)\nThe following items are overdue or time-sensitive. Weave relevant nudges naturally into your responses when appropriate — don't dump the whole list, but if the conversation touches a related topic or there's a natural opening, mention the most critical items. Items marked CRITICAL should be raised at the first opportunity.\n\n${briefingBridge}`;

  return systemPrompt;
}

// ── One-Shot Query ────────────────────────────────────────────────────────────

function resetSession(): void {
  sessionId = randomUUID();
  sessionCreated = false;
}

/** Interrupt stub — no-op for one-shot queries. */
export async function interruptCurrentTurn(): Promise<void> {
  // No-op: one-shot queries cannot be interrupted via this API
}

async function querySdk(
  text: string,
  systemPrompt: string,
  config: Config,
  onProgress?: ProgressCallback,
): Promise<SpawnResult> {
  const startTime = Date.now();
  const truncatedPrompt = text.length > 120 ? text.slice(0, 120) + "..." : text;
  console.log(`[pai] SDK query (session=${sessionId.slice(0, 8)}, ${sessionCreated ? "resume" : "new"}): "${truncatedPrompt}"`);
  debugLog("spawn", `session=${sessionId.slice(0, 8)} ${sessionCreated ? "resume" : "new"} prompt="${truncatedPrompt}"`);

  const abortController = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    abortController.abort();
  }, TIMEOUT_MS);

  let response = "";
  let costUsd = 0;
  let numTurns = 0;
  let durationMs = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  let contextWindow: number | undefined;
  let precompactStop = false;

  try {
    const q = query({
      prompt: text,
      options: {
        model: config.model,
        maxBudgetUsd: config.maxBudget,
        systemPrompt: { type: "preset" as const, preset: "claude_code" as const, append: systemPrompt },
        allowedTools: [
          "Read", "Write", "Edit", "Bash", "Glob", "Grep",
          "WebSearch", "WebFetch", "Task", "Skill",
          "NotebookEdit", "AskUserQuestion",
        ],
        permissionMode: "bypassPermissions",
        allowDangerouslySkipPermissions: true,
        cwd: PROJECT_ROOT,
        sessionId: sessionCreated ? undefined : sessionId,
        resume: sessionCreated ? sessionId : undefined,
        abortController,
        agents: PAI_AGENTS,
        hooks: {
          PreCompact: [{ hooks: [preCompactHook] }],
        },
      },
    });

    for await (const msg of q) {
      logSdkEvent(msg);

      if (onProgress) {
        for (const progress of getProgressFromMessage(msg)) {
          onProgress(progress);
        }
      }

      if (msg.type === "result") {
        const result = msg as SDKResultSuccess | SDKResultError;
        costUsd = result.total_cost_usd ?? 0;
        numTurns = result.num_turns ?? 0;
        durationMs = result.duration_ms ?? (Date.now() - startTime);
        inputTokens = result.usage?.input_tokens ?? 0;
        outputTokens = result.usage?.output_tokens ?? 0;

        if (result.modelUsage) {
          const firstModel = Object.values(result.modelUsage)[0];
          contextWindow = firstModel?.contextWindow ?? undefined;
        }

        if (result.subtype === "success") {
          response = (result as SDKResultSuccess).result ?? "";
        } else {
          const errResult = result as SDKResultError;
          const errMsg = errResult.errors?.join("; ") || `Query ended with ${errResult.subtype}`;
          if (errMsg.includes("precompact_session_save")) {
            console.log("[pai] PreCompact stop detected — will save session and clear");
            precompactStop = true;
          } else {
            console.error(`[pai] SDK error: ${errMsg}`);
          }
          if (!response && !precompactStop) {
            response = `(error: ${errResult.subtype})`;
          }
        }
      }
    }
  } catch (err) {
    if (timedOut) {
      const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`[pai] SDK query timed out after ${durationSec}s (limit: ${TIMEOUT_MS / 1000}s), ${response.length} chars accumulated`);
      debugLog("timeout", `${durationSec}s ${response.length}chars`);
      sessionCreated = true;
      return {
        response: response || "(timed out — please try a shorter or simpler message)",
        costUsd, numTurns, durationMs: Date.now() - startTime,
        inputTokens, outputTokens, contextWindow,
        precompactStop: false,
      };
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  const wallDuration = Date.now() - startTime;
  const durationSec = (wallDuration / 1000).toFixed(1);
  console.log(`[pai] SDK done: ${durationSec}s, ${numTurns} turns, $${costUsd.toFixed(3)}, ${response.length} chars${precompactStop ? " (precompact)" : ""}`);
  debugLog("result", `${durationSec}s ${numTurns}turns $${costUsd.toFixed(3)} ${inputTokens}in/${outputTokens}out ${response.length}chars${precompactStop ? " precompact" : ""}`);

  if (response.length > MAX_RESPONSE_LENGTH) {
    response = response.slice(0, MAX_RESPONSE_LENGTH) + "\n\n_(truncated)_";
  }

  sessionCreated = true;

  return {
    response: response || "(no response)",
    costUsd,
    numTurns,
    durationMs,
    inputTokens,
    outputTokens,
    contextWindow,
    precompactStop,
  };
}

// ── Session Management ────────────────────────────────────────────────────────

async function summarizeSession(config: Config, resumeSessionId?: string): Promise<void> {
  let memoryContent = "";
  try {
    memoryContent = await readFile(MEMORY_FILE, "utf-8");
  } catch {
    // No memory file yet
  }

  let patternsContent = "";
  try {
    patternsContent = await readFile(PATTERNS_FILE, "utf-8");
  } catch {
    // No patterns file yet
  }

  let systemPrompt = buildSystemPrompt(config);
  if (memoryContent) systemPrompt += `\n\n## Current Memory\n${memoryContent}`;
  if (patternsContent) systemPrompt += `\n\n## PAI Self-Knowledge\n${patternsContent}`;

  try {
    if (resumeSessionId) {
      // Resume the OLD session in isolation
      const abortController = new AbortController();
      const timeout = setTimeout(() => abortController.abort(), TIMEOUT_MS);
      try {
        const q = query({
          prompt: SUMMARY_PROMPT,
          options: {
            model: config.model,
            maxBudgetUsd: config.maxBudget,
            systemPrompt: { type: "preset" as const, preset: "claude_code" as const, append: systemPrompt },
            allowedTools: ["Read", "Write", "Edit", "Glob", "Grep"],
            permissionMode: "bypassPermissions",
            allowDangerouslySkipPermissions: true,
            cwd: PROJECT_ROOT,
            resume: resumeSessionId,
            abortController,
          },
        });
        for await (const msg of q) {
          logSdkEvent(msg);
        }
      } finally {
        clearTimeout(timeout);
      }
    } else {
      const sysPrompt = await buildFullSystemPrompt(config);
      await querySdk(SUMMARY_PROMPT, sysPrompt, config);
    }
    console.log("[pai] Session summarized to memory files");
  } catch (err) {
    console.error(
      "[pai] Summarization failed:",
      err instanceof Error ? err.message : String(err),
    );
  }
}

async function rotateSession(config: Config): Promise<void> {
  const oldSessionId = sessionId;
  resetSession();
  console.log("[pai] Session rotated to", sessionId.slice(0, 8), "(old:", oldSessionId.slice(0, 8) + ")");

  // Fire summary in background — don't block the user
  summarizeSession(config, oldSessionId).catch((err) => {
    console.error("[pai] Background summary failed:", err instanceof Error ? err.message : String(err));
  });
}

export function clearSession(config: Config): Promise<void> {
  const result = pending.then(
    () => rotateSession(config),
    () => rotateSession(config),
  );
  pending = result.then(() => "", () => "");
  return result;
}

// ── Public API ────────────────────────────────────────────────────────────────

let precompactRetries = 0;
const MAX_PRECOMPACT_RETRIES = 2;

async function runClaude(text: string, config: Config, onProgress?: ProgressCallback): Promise<string> {
  const { prompt: resolvedText, skillName } = await resolveSkill(text);
  if (skillName) {
    console.log(`[pai] Skill activated: /${skillName}`);
    debugLog("skill", `/${skillName} activated`);
  }

  const systemPrompt = await buildFullSystemPrompt(config);

  try {
    const result = await querySdk(resolvedText, systemPrompt, config, onProgress);
    recordUsage({
      source: skillName ? `skill:${skillName}` : "conversation",
      costUsd: result.costUsd,
      numTurns: result.numTurns,
      durationMs: result.durationMs,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      contextWindow: result.contextWindow,
      timestamp: new Date().toISOString(),
    }).catch((err) => console.error("[pai] Failed to record usage:", err));

    if (result.precompactStop) {
      precompactRetries++;
      if (precompactRetries > MAX_PRECOMPACT_RETRIES) {
        console.error("[pai] PreCompact retry limit reached — returning partial response");
        precompactRetries = 0;
        return result.response || "(session context too large — please try a shorter message)";
      }
      const oldSid = sessionId;
      resetSession();
      console.log(`[pai] PreCompact: reset to ${sessionId.slice(0, 8)}, summarizing old session ${oldSid.slice(0, 8)} in background (attempt ${precompactRetries}/${MAX_PRECOMPACT_RETRIES})...`);
      summarizeSession(config, oldSid).catch((err) => {
        console.error("[pai] Background PreCompact summary failed:", err instanceof Error ? err.message : String(err));
      });
      return runClaude(text, config, onProgress);
    }
    precompactRetries = 0;

    return result.response;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("aborted") || msg.includes("timed out")) {
      console.error(`[pai] Query aborted/timed out: ${msg.slice(0, 100)}`);
      resetSession();
      return "(timed out — please try again)";
    }
    if (msg.includes("already in use") || msg.includes("session") || msg.includes("not valid JSON")) {
      console.log(`[pai] Session error (${msg.slice(0, 80)}), rotating to fresh session...`);
      resetSession();
      const retryResult = await querySdk(resolvedText, systemPrompt, config, onProgress);
      recordUsage({
        source: "conversation",
        costUsd: retryResult.costUsd,
        numTurns: retryResult.numTurns,
        durationMs: retryResult.durationMs,
        inputTokens: retryResult.inputTokens,
        outputTokens: retryResult.outputTokens,
        contextWindow: retryResult.contextWindow,
        timestamp: new Date().toISOString(),
      }).catch((err) => console.error("[pai] Failed to record usage:", err));
      return retryResult.response;
    }
    throw err;
  }
}

export async function handleMessage(
  text: string,
  config: Config,
  _onRotation?: (reason: string) => Promise<void>,
  onProgress?: ProgressCallback,
): Promise<string> {
  // Chain messages so they run sequentially, not in parallel.
  const result = pending.then(
    () => withTimeout(
      runClaude(text, config, onProgress),
      CHAIN_TIMEOUT_MS,
      "conversation chain",
    ),
    () => withTimeout(
      runClaude(text, config, onProgress),
      CHAIN_TIMEOUT_MS,
      "conversation chain",
    ),
  ).catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("conversation chain: timed out")) {
      console.error("[pai] Chain guard fired — force-unblocking conversation queue");
      sendToOwner("_Chain guard fired — conversation queue was stuck and has been force-unblocked._").catch(() => {});
    }
    throw err;
  });
  pending = result.then(() => "", () => "");
  return result;
}

/** Resolve /command messages by loading .claude/commands/{name}.md content.
 *  Returns { prompt, skillName } — prompt has skill instructions prepended if matched. */
export async function resolveSkill(text: string): Promise<{ prompt: string; skillName?: string }> {
  const match = text.match(/^\/([a-z][-a-z0-9]*)\s*(.*)?$/is);
  if (!match) return { prompt: text };

  const name = match[1].toLowerCase();
  const args = (match[2] ?? "").trim();
  const skillPath = join(COMMANDS_DIR, `${name}.md`);
  try {
    const content = await readFile(skillPath, "utf-8");
    const prompt = args
      ? `<skill-instructions name="${name}">\n${content}\n</skill-instructions>\n\nUser message: ${args}`
      : `<skill-instructions name="${name}">\n${content}\n</skill-instructions>\n\nExecute this skill now.`;
    console.log(`[pai] Resolved skill /${name} from ${skillPath}`);
    return { prompt, skillName: name };
  } catch {
    // No matching command file — pass through as-is
    return { prompt: text };
  }
}

// ── Background query (isolated, no global session state) ─────────────────────

export interface BackgroundQueryOptions {
  systemPromptSuffix?: string;
  maxBudget?: number;
  onProgress?: ProgressCallback;
}

/**
 * Isolated SDK query that does NOT touch the global session (sessionId, pending).
 * Creates its own ephemeral session. Suitable for background/scheduled tasks.
 */
export async function queryBackground(
  prompt: string,
  config: Config,
  options: BackgroundQueryOptions = {},
): Promise<SpawnResult> {
  const bgSessionId = randomUUID();
  const startTime = Date.now();
  const truncatedPrompt = prompt.length > 120 ? prompt.slice(0, 120) + "..." : prompt;
  console.log(`[pai:bg] SDK query (session=${bgSessionId.slice(0, 8)}): "${truncatedPrompt}"`);
  debugLog("bg-spawn", `session=${bgSessionId.slice(0, 8)} prompt="${truncatedPrompt}"`);

  // Build system prompt (same as buildFullSystemPrompt)
  let memoryContent = "";
  try {
    memoryContent = await readFile(MEMORY_FILE, "utf-8");
  } catch {
    // No memory file yet
  }

  let patternsContent = "";
  try {
    patternsContent = await readFile(PATTERNS_FILE, "utf-8");
  } catch {
    // No patterns file yet
  }

  let systemPrompt = buildSystemPrompt(config);
  const memoryStats = await buildMemoryStats(config.journalDir);
  systemPrompt += `\n\n## Memory System Status\n${memoryStats}`;
  if (memoryContent) systemPrompt += `\n\n## Current Memory\n${memoryContent}`;
  if (patternsContent) systemPrompt += `\n\n## PAI Self-Knowledge\n${patternsContent}`;
  if (options.systemPromptSuffix) systemPrompt += `\n\n${options.systemPromptSuffix}`;

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), TIMEOUT_MS);

  try {
    const q = query({
      prompt,
      options: {
        model: config.model,
        maxBudgetUsd: options.maxBudget ?? config.maxBudget,
        systemPrompt: { type: "preset" as const, preset: "claude_code" as const, append: systemPrompt },
        allowedTools: [
          "Read", "Write", "Edit", "Bash", "Glob", "Grep",
          "WebSearch", "WebFetch", "Task", "Skill",
          "NotebookEdit",
          // No AskUserQuestion — background tasks shouldn't prompt
        ],
        permissionMode: "bypassPermissions",
        allowDangerouslySkipPermissions: true,
        cwd: PROJECT_ROOT,
        sessionId: bgSessionId,
        persistSession: false,
        abortController,
        agents: PAI_AGENTS,
        // No hooks for background queries — avoid control_request overhead
      },
    });

    let response = "";
    let costUsd = 0;
    let numTurns = 0;
    let durationMs = 0;
    let inputTokens = 0;
    let outputTokens = 0;
    let contextWindow: number | undefined;

    for await (const msg of q) {
      logSdkEvent(msg);

      if (options.onProgress) {
        for (const progress of getProgressFromMessage(msg)) {
          options.onProgress(progress);
        }
      }

      if (msg.type === "result") {
        const result = msg as SDKResultSuccess | SDKResultError;
        costUsd = result.total_cost_usd ?? 0;
        numTurns = result.num_turns ?? 0;
        durationMs = result.duration_ms ?? (Date.now() - startTime);
        inputTokens = result.usage?.input_tokens ?? 0;
        outputTokens = result.usage?.output_tokens ?? 0;

        if (result.modelUsage) {
          const firstModel = Object.values(result.modelUsage)[0];
          contextWindow = firstModel?.contextWindow ?? undefined;
        }

        if (result.subtype === "success") {
          response = (result as SDKResultSuccess).result ?? "";
        } else {
          const errResult = result as SDKResultError;
          const errMsg = errResult.errors?.join("; ") || `Query ended with ${errResult.subtype}`;
          console.error(`[pai:bg] SDK error: ${errMsg}`);
          if (!response) response = `(error: ${errResult.subtype})`;
        }
      }
    }

    const wallDuration = Date.now() - startTime;
    const durationSec = (wallDuration / 1000).toFixed(1);
    console.log(`[pai:bg] SDK done: ${durationSec}s, ${numTurns} turns, $${costUsd.toFixed(3)}, ${response.length} chars`);
    debugLog("bg-result", `${durationSec}s ${numTurns}turns $${costUsd.toFixed(3)} ${inputTokens}in/${outputTokens}out ${response.length}chars`);

    if (response.length > MAX_RESPONSE_LENGTH) {
      response = response.slice(0, MAX_RESPONSE_LENGTH) + "\n\n_(truncated)_";
    }

    return {
      response: response || "(no response)",
      costUsd,
      numTurns,
      durationMs,
      inputTokens,
      outputTokens,
      contextWindow,
      precompactStop: false,
    };
  } finally {
    clearTimeout(timeout);
  }
}
