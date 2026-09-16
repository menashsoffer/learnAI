# Source & attribution

- Skill: `redesign-existing-projects`
- Upstream: https://github.com/Leonxlnx/taste-skill
- Path in upstream: `skills/redesign-skill/SKILL.md` (folder name differs from skill name)
- Vendored at commit: `e79ca9ec7e071eb3a3b623c4fb752e853fc3ed58`
- License: MIT (see `LICENSE`), Copyright (c) 2026 Leonxlnx

Vendored by hand rather than via `npx skills add`, because in this repo the
folder name (`redesign-skill`) does not match the skill name, and the CLI would
install it under the folder name.

Chosen over the other design skills in the same repo because it is the only one
that is genuinely stack-agnostic: it states "If the project has no framework, use
vanilla CSS" and "Do not migrate frameworks or styling libraries". This project
uses vanilla CSS with no Tailwind.

Caveat for this project: its font suggestions (Geist, Outfit, Cabinet Grotesk,
Satoshi) are Latin-only and have no Hebrew glyphs, and it advises replacing Inter.
For Hebrew type, follow `israeli-ui-design-system` instead (Heebo+Inter,
Rubik+Source Sans 3).
