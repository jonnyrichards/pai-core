import { homedir } from "node:os";
import { resolve } from "node:path";

function resolveUserPath(p: string): string {
  if (p.startsWith("~/") || p === "~") {
    return resolve(homedir(), p.slice(2));
  }
  return resolve(p);
}

export interface Config {
  model: string;
  dataDir: string;
  credentialsDir: string;
  journalDir: string;
  claudeBin: string;
  maxBudget: number;
  sessionIdleMinutes: number;
  openaiApiKey?: string;
  ttsVoice: string;
  ttsModel: string;
  imageModel: string;
  imageSize: string;
  imageQuality: string;
  schedulerEnabled: boolean;
  schedulerMaxBudget: number;
  timezone: string;
  notesVault?: string;
}

export function loadConfig(): Config {
  const model = process.env.PAI_MODEL ?? "sonnet";
  const dataDir = process.env.PAI_DATA_DIR
    ? resolveUserPath(process.env.PAI_DATA_DIR)
    : resolve(process.cwd());
  const credentialsDir = resolveUserPath(
    process.env.PAI_CREDENTIALS_DIR ?? "~/.pai/credentials/whatsapp"
  );
  const journalDir = resolveUserPath(
    process.env.PAI_JOURNAL_DIR ?? "~/.pai/journal"
  );
  const claudeBin = process.env.PAI_CLAUDE_BIN ?? "claude";
  const maxBudget = parseFloat(process.env.PAI_MAX_BUDGET ?? "1.00");
  const sessionIdleMinutes = parseInt(
    process.env.PAI_SESSION_IDLE_MINUTES ?? "30",
    10,
  );

  const openaiApiKey = process.env.OPENAI_API_KEY || undefined;
  const ttsVoice = process.env.PAI_TTS_VOICE ?? "ash";
  const ttsModel = process.env.PAI_TTS_MODEL ?? "gpt-4o-mini-tts";
  const imageModel = process.env.PAI_IMAGE_MODEL ?? "gpt-image-1";
  const imageSize = process.env.PAI_IMAGE_SIZE ?? "1024x1024";
  const imageQuality = process.env.PAI_IMAGE_QUALITY ?? "medium";
  const schedulerEnabled = (process.env.PAI_SCHEDULER_ENABLED ?? "true") === "true";
  const schedulerMaxBudget = parseFloat(process.env.PAI_SCHEDULER_MAX_BUDGET ?? "10.00");
  const timezone = process.env.PAI_TIMEZONE ?? "America/New_York";
  const notesVault = process.env.PAI_NOTES_VAULT
    ? resolveUserPath(process.env.PAI_NOTES_VAULT)
    : undefined;
  return {
    model,
    dataDir,
    credentialsDir,
    journalDir,
    claudeBin,
    maxBudget,
    sessionIdleMinutes,
    openaiApiKey,
    ttsVoice,
    ttsModel,
    imageModel,
    imageSize,
    imageQuality,
    schedulerEnabled,
    schedulerMaxBudget,
    timezone,
    notesVault,
  };
}
