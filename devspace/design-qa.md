# DevSpace integration QA

2026-11-13. Kept the existing light Paper Studio layout, blue actions and serif headings. Added GitHub sync bar, integrations page, project/file details, standalone prompts and an assistant drawer.

Automated validation: build, four original packaging tests and eight integration/security tests. Tests cover pagination, idempotent merge, task/status preservation, secret filename exclusions, standalone context, file blob/tree/commit creation and agent access controls. No test creates a repository on the real account.

Authenticated GitHub creation/upload and paid AI generation require user credentials and have not been run against the user's accounts. Browser testing findings are appended below.

Browser QA succeeded in the managed preview: loaded all 3 public account repositories; opened a repository and verified its real last commit/files; generated the editable standalone prompt; saved a local project and confirmed it persisted after reload. Added branch selection and grounded improvement suggestions from the available file structure/manifests. Build and all 12 tests passed.

Production backend publication is awaiting Netlify's GitHub browser authentication. The selected Google identity leads to GitHub account creation instead of the existing repository owner's account; no account was created. The existing ChatGPT GitHub connector still supports saving code to the existing branch.

## Mobile-only navigation update — 2026-11-13

Reviewed the user's 60-second iPhone recording: prompt text/inputs extend beyond the visible screen, focus zoom makes editing harder, and a long project sheet hides navigation.

Implemented fixed bottom navigation, project cards, full-width mobile sheets, Activity/Files/Prompt section controls, a copy action above the prompt, wrapped 16px form fields, safe-area spacing and visual-viewport keyboard sizing. Body scroll is locked behind a mobile sheet and restored on close. Desktop retains its table/header layout and all project sections.

Browser verification used real rendered 390×844 and 320×700 iframe viewports in the managed preview. At 390px: document width 390, dialog width 390, textarea scroll widths equal client widths, both textarea fonts 16px. At 320px: document/dialog width 320 and visible field font 16px with no horizontal overflow. Verified project opening, section switching, prompt editing/generation and successful clipboard copy. Keyboard resize handling is implemented but an actual iOS software keyboard was not available in this browser; no physical-device verification claim. QA helper HTML is local-only and excluded from the deployment.
