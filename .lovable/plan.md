# Backend, CMS & Client Portal

## What you'll get

1. **Auth** — Email/password + Google sign-in. Admin role for `okikeenterprises@gmail.com`; everyone else is a client.
2. **Public site reads from the database** — services, packages, portfolio, partners, team, about content all editable from the admin CMS instead of hardcoded.
3. **Admin CMS** at `/admin` — protected, only the admin email can access. Manage:
   - Services, Packages (with pricing + features), Add-ons
   - Portfolio projects, Partners, Team members
   - About / hero copy (key-value site settings)
   - Inquiries → convert into client projects
   - Active client projects: update stage, milestones, notes
4. **Client portal** at `/dashboard` — any signed-in client sees their projects, current stage, milestone progress bar, and admin notes. Auto-linked to inquiries by email.
5. **Live updates** — Realtime subscription so status changes appear without refresh.

## Stages & milestones

Stages: `submitted → reviewing → accepted | declined → in_progress → completed`
Milestones (only when in_progress): Design, Build, Review, Launch — each can be `pending | active | done` with optional note.

## Database (new tables)

- `profiles` (id, user_id, full_name, email, avatar_url) — auto-created on signup via trigger
- `user_roles` (user_id, role enum: admin/client) + `has_role()` security-definer function
- `site_settings` (key, value jsonb) — hero copy, about, contact info
- `services` (title, description, icon, order, published)
- `packages` (name, tagline, price, currency, features jsonb, order, featured, published)
- `addons` (name, description, price, order, published)
- `portfolio_items` (title, description, image_url, url, tags, order, published)
- `partners` (name, logo_url, url, order, published)
- `team_members` (name, role, bio, image_url, order, published)
- `client_projects` (client_user_id, inquiry_id, title, package_name, total, deposit, stage, current_milestone, admin_notes, created_at)
- `project_milestones` (project_id, name, status, note, position)
- `project_updates` (project_id, message, created_by, created_at) — admin-posted updates

RLS: public can read `published=true` rows on content tables. Clients see only their own projects + milestones + updates. Admins can do everything via `has_role(uid, 'admin')`.

Realtime enabled on `client_projects`, `project_milestones`, `project_updates`.

Inquiries auto-link: when a signed-in user submits the builder, `client_user_id` is set. When admin "accepts" an inquiry, it's promoted to `client_projects` and the user (matched by email) sees it in their dashboard.

## New routes

- `/login`, `/signup` — auth pages (email/password + Google button)
- `/_authenticated/dashboard` — client portal: project list + per-project progress
- `/_authenticated/admin` — admin shell (guarded by role check)
  - `/admin` — overview (counts, recent inquiries)
  - `/admin/inquiries` — list, accept/decline, convert to project
  - `/admin/projects` — list + edit stage/milestones/notes
  - `/admin/content/services|packages|addons|portfolio|partners|team` — CRUD tables
  - `/admin/settings` — site settings (hero, about, contact)

Header gets "Sign in" / avatar dropdown ("Dashboard", "Admin" if admin, "Sign out").

## Technical notes

- Server functions (`createServerFn`) for all admin writes; RLS provides defense in depth.
- `requireSupabaseAuth` middleware on all client/admin server fns.
- Public content fetched via plain client queries from components (RLS allows `published=true` reads).
- Seed migration inserts current hardcoded packages/services so the live site doesn't go blank.
- Admin role assigned by trigger: when a user signs up with `okikeenterprises@gmail.com`, insert `admin` role automatically. Otherwise `client`.

## Build order

1. Migration: tables, enums, RLS, triggers, seed data, realtime
2. Auth pages + Google OAuth + header avatar
3. Refactor Services/About/Index pages to read from DB
4. Client `/dashboard` with realtime progress
5. Admin shell + content CRUD + inquiry → project conversion + project stage editor

Builder at `/book` will set `client_user_id` if signed in (and prompt to sign up after submit if not).
