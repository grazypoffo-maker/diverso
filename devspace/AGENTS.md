# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## DevSpace integrations

Keep the Paper Studio light/blue design. The user wants GitHub repositories imported automatically, project creation with source uploads, real file/commit activity and a standalone improvement prompt for an AI with no prior context. Focus GitHub first; Google was deferred by the user. Do not infer current editing activity or completion from repository metadata. Authentication in ChatGPT does not automatically authenticate visitors in this app.

## Mobile navigation

The user wants this iteration focused only on mobile usability. Preserve desktop appearance and existing functionality. Mobile must have no page/modal horizontal overflow, touch targets at least 44px, bottom primary navigation, project cards instead of sideways tables, and separate Activity/Files/Prompt navigation inside project sheets. Inputs must remain at least 16px to avoid iOS focus zoom, respect safe areas and the visible keyboard viewport, and preserve scroll position when closing a sheet. The user's 2026-11-13 recording shows clipped prompt fields and horizontal panning while editing.
