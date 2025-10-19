# Contributing

This repository is governed by the KolkhozIO/rulez guidelines and a small set of project-specific rules tailored for AI-assisted development.

- Read the upstream guidelines in docs/rulez/README.md
- Read the local summary in ./.cursorrules
- For overall docs see ./docs/README.md

If you update the upstream rules snapshot, run:

```bash
node scripts/sync-rulez.mjs
```

If you prefer to use a Git submodule instead of a snapshot, see the instructions in docs/README.md.

## Workflow (cto.new tasks)

1) Pick up a ticket and ensure it has clear acceptance criteria. If not, propose them in the ticket (see .github/ISSUE_TEMPLATE/task.md for a template).
2) Work on the dedicated branch provided by the platform.
3) Follow the rules in docs/rulez and .cursorrules. Keep changes focused and incremental.
4) Formatting and style: EditorConfig + Prettier + ESLint. Use LF endings, 2-space indentation, and include a trailing newline.
5) Units and coordinate system (3D editor context): meters, Y-up, default grid snap 0.1 m.
6) Commit messages: clear, imperative subject, concise body with context and decisions.
7) Open a pull request using the PR template. Ensure the checklist is satisfied and link to relevant rulez sections.
8) Do not modify CI/CD workflow files unless specifically requested by a ticket. Fix underlying code issues instead.

## Running quality checks locally

- Lint: `npm run lint`
- Format: `npm run format`

## Documentation updates

- If you introduce or change behavior, update README.md and any relevant docs in docs/.
- Keep examples and usage up to date.

## Security and accessibility

- Avoid introducing secrets into the repo. Use environment variables or secret stores.
- Follow accessibility basics for UI work (labels, keyboard navigation, color contrast, ARIA where appropriate).
