# AI Configuration: Global Defaults

Purpose
- Provide a single global configuration that sets the default AI model for all clients.

Files
- `config/global_ai.json` — global defaults consumed by the backend at startup.

How it works
- The backend should read `DEFAULT_AI_MODEL` env var, falling back to `config/global_ai.json`'s `default_model`.
- If `enabled_for_all_clients` is `true`, the backend uses the `default_model` unless a client-specific override exists.

Override
- To override globally at runtime, set the environment variable:

```
export DEFAULT_AI_MODEL="claude-haiku-4.5"
```

Rollback
- Edit `config/global_ai.json` and set `enabled_for_all_clients` to `false`, or change `default_model` back to the previous value.

Commit and deploy
- Commit these files and redeploy/restart the backend so it re-reads configuration.
