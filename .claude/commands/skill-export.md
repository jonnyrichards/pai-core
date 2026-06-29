# Skill: Export Roadmap Skills to Skillshare Repo

Export the three roadmap skills from jonny-pai into the non-engineer-ai-skillshare repo.

## Steps

1. Copy each skill folder into `../non-engineer-ai-skillshare/product-management/`:
   - `quarterly-priorities` → copies `SKILL.md`
   - `quarterly-roadmap` → copies `SKILL.md`
   - `roadmap-render` → copies `SKILL.md` + `render.cjs`

Use this bash command:
```bash
DEST="/Users/jonathan.richards/code/non-engineer-ai-skillshare/product-management"
SRC="/Users/jonathan.richards/code/jonny-pai/.claude/commands"

for skill in quarterly-priorities quarterly-roadmap roadmap-render; do
  mkdir -p "$DEST/$skill"
  cp -r "$SRC/$skill/." "$DEST/$skill/"
done

echo "Exported to $DEST"
```

2. Report which files were copied and confirm success.
3. Remind the user to commit and push from `../non-engineer-ai-skillshare` when ready.
