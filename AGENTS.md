# embersave

Open-source shared save syncing for survival games. It is a launcher that hands one shared world around a friend group: your PC becomes the server when it is your turn, saves in the background while you play, and passes the world on when you quit.

See README.md for setup and details.

<!-- BEGIN:18hrshift-standards -->

## 18HRSHIFT working standards

Shared standards for John's and Joe's coding agents in every 18HRSHIFT repo. This block is synced from `18hrshift/misc-tools` (`agent-standards/standards.md`): change it there and re-run the sync, not here. Where this repo's own rules are more specific, they win.

Never put private details (accounts, machines, hosts, client work, credentials) in a public repo.

### Engineering principles

1. **Modularity.** Small, focused, composable pieces. Each unit does one thing well. No god files or god scripts; split responsibility aggressively.
2. **No hacky solutions.** If a fix feels like a workaround, it is. Find the right fix.
3. **Clear over clever.** Write for the next person who reads it.
4. **Config is the single source of truth.** IDs, paths, links and copy live in config and are loaded, not mirrored. A constant that repeats a config value is drift. A test should prove that changing the config changes the behavior.
5. **Secrets never in git.** Keys and tokens go in `.env` files or the host's environment settings. If one is ever committed, rotate it right away; removing the commit is not enough.
6. **Validate at the boundary.** Check external input where it enters the system so bad data fails at the door.
7. **Fail loudly.** Errors surface where someone will see them, not in a silent catch.
8. **Test what you build.** New code ships with tests, and the repo's checks pass before anything reaches the default branch.
9. **Every change ships its docs.** Update the README or this file in the same change. Docs are claims, not wishes: never document a command, route or flag that isn't built, and check docs against the code, not memory.

### Git and delivery

- Pull before starting. Both founders' agents may work in this repo, so check `git status` and the latest default branch first.
- Inspect uncommitted or untracked changes before touching them. Never discard changes you didn't make; if they're unfinished, move them to a `wip/<topic>` branch and push it.
- Stage files deliberately, not the whole tree. Never commit secrets, build output, caches or local data; add a `.gitignore` pattern instead.
- Done means committed and pushed. Commit in logical groups with messages that say what changed and why.
- If pushing the default branch deploys anything, treat that branch as production: run the checks first and keep unfinished work on a branch.
- Never force-push or rewrite published history. If a push is rejected, fetch and sort out the conflict deliberately; don't resolve it blindly.

### Writing and reporting

- Concise and direct. Short sentences. No em dashes, in copy, docs or commit messages.
- Report outcomes as they are: if a check fails, say so with the output; if a step was skipped, say that. Explain the evidence and its limits instead of guessing confidently.
- Credits on any 18HRSHIFT product say 18HRSHIFT with 18hrshift.com, then each person's name and role as the 18hrshift.com site lists them (its people config). Change them there first.

<!-- END:18hrshift-standards -->
