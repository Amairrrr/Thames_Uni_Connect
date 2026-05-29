---
name: Zod import in api-server routes
description: esbuild bundler cannot resolve "zod/v4" — use "zod" instead
---

When writing route handlers in `artifacts/api-server/src/routes/`, always import from `"zod"`, not `"zod/v4"`.

**Why:** The api-server uses esbuild to bundle. esbuild cannot resolve the `"zod/v4"` subpath export at build time, causing a hard build failure. The main `"zod"` import works correctly after adding `"zod": "catalog:"` to `artifacts/api-server/package.json` dependencies.

**How to apply:** Any new route file that needs Zod: `import { z } from "zod";`
