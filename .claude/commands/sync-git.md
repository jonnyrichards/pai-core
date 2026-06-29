Sync pai-core and the active data bundle (pai-work) with their remotes.

## Process

1. **Check for uncommitted changes in pai-core** — Run `git status` (never `-uall`).

2. **Commit if needed** — If there are staged or unstaged changes, run the `/commit all` skill first. If there's nothing to commit, skip to step 3.

3. **Pull with rebase (pai-core)** — Run `git pull --rebase origin main`. If there are merge conflicts, stop and show what's conflicting — don't auto-resolve.

4. **Push pai-core** — Run `git push origin main`.

5. **Sync data bundle** — In the `$PAI_DATA_DIR` directory:
   a. Run `git -C "$PAI_DATA_DIR" status` to check for uncommitted changes.
   b. If uncommitted changes exist, run `git -C "$PAI_DATA_DIR" add -A && git -C "$PAI_DATA_DIR" commit -m "sync: manual sync $(date +%Y-%m-%d)"`.
   c. Run `git -C "$PAI_DATA_DIR" pull --rebase origin main`. Stop on conflicts.
   d. Run `git -C "$PAI_DATA_DIR" push origin main`.

6. **Report** — Summarize: commits created/pulled/pushed for both repos.
