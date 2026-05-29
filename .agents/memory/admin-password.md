---
name: Admin Password Setup
description: How the admin dashboard is protected and how to change the password
---

The admin password is stored as `ADMIN_PASSWORD` env var (shared environment).

Default set to `TUCadmin2025!` — user should change this in the Secrets tab.

**Why:** Admin routes (`/api/admin/*`) and the status-update route check `req.headers["x-admin-key"]` against `process.env["ADMIN_PASSWORD"]`. The React admin dashboard stores the entered password in `localStorage` as `tuc_admin_key` and sends it on every request.

**How to apply:** If user wants to change the password, delete the `ADMIN_PASSWORD` env var from Secrets and set a new one. The admin dashboard login will work with the new value immediately.
