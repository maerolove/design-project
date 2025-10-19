# Project documentation

This repository uses KolkhozIO/rulez as the source of shared engineering guidelines for design, coding, testing, and documentation.

- Upstream guidelines live at: https://github.com/KolkhozIO/rulez
- A vendored copy is kept under docs/rulez to make the rules easily accessible in this repo.
- The copy can be updated at any time using the sync script below.

## Where to start

1) Read docs/rulez/README.md for the full guidelines.
2) For tasks and changes in this project, also read the repository’s .cursorrules at the root. It summarizes key rules tailored for this codebase and for AI-assisted editing.

## Keeping rulez up to date

We support two integration modes:

- Submodule mode (preferred when enabled): docs/rulez is a Git submodule that tracks https://github.com/KolkhozIO/rulez
- Vendored mode (default in this repo): docs/rulez contains a snapshot of README.md, rules/, and examples/ from upstream

Use the provided Node script to sync in either mode:

```bash
# From the repo root
node scripts/sync-rulez.mjs                 # auto-detect mode
node scripts/sync-rulez.mjs --mode=vendor   # force vendored snapshot update
node scripts/sync-rulez.mjs --mode=submodule# update submodule and pull latest
```

If you switch to submodules later, add a submodule via HTTPS:

```bash
git submodule add https://github.com/KolkhozIO/rulez docs/rulez
# Then future updates are as simple as:
node scripts/sync-rulez.mjs --mode=submodule
```

## Conventions to keep in mind

- Formatting: see .editorconfig and Prettier configuration (.prettierrc). Use LF line endings and a trailing newline.
- Units for the upcoming 3D editor: work in meters, Y-up coordinate system, default grid snap 0.1 m.
- See .cursorrules for a curated summary of code style, architecture, testing, docs, performance, and accessibility expectations.
