# The Byte — A developer's journal

A modern, responsive CMS-style tech blog, rebuilt from the original Express / Handlebars application. People can publish articles, read community stories, and have discussions.

## What's improved

- Editorial-style homepage, featured story, searchable/sortable story cards, responsive layout, and persistent light/dark theme toggle.
- Readable article pages, comment threads, and a writing studio for creating, editing, and deleting your own articles.
- Better mobile layouts, keyboard focus states, accessible form labels, article reading-time estimates, useful validation and error messages.
- Login/signup session regeneration, hashed passwords, secure production session cookies, and authorization checks preventing one author from editing or deleting another author's content.
- MySQL support for local/legacy instances; PostgreSQL support for straightforward Render deployment.
- Automated JavaScript tests and Handlebars template parsing checks.

## Run locally

Requires Node.js 20+ and MySQL 8+ (or a PostgreSQL connection URL).

1. Clone the repository and enter its directory.
2. Run \`npm install\`.
3. Copy \`.env.Example\` to \`.env\`, set MySQL connection values and a random \`SESSION_SECRET\`.
4. Create the local database if needed: \`CREATE DATABASE blogpost_db;\`
5. Run \`npm start\` and visit http://localhost:3001.
6. Optionally run \`npm run seed\` to populate sample content. **Warning: seeding deletes existing content**.

The app creates missing tables at startup but does not destructively alter existing schemas. Passwords originally hashed using bcrypt remain compatible with bcryptjs.

## Test

\`npm run lint\` checks critical JavaScript syntax; \`npm test\` runs validation, helpers and template-compilation tests.

## Publish on Render

A \`render.yaml\` Blueprint defines a free web service plus a PostgreSQL database. Connect this repository in [Render Blueprints](https://dashboard.render.com/blueprints) and choose the \`main\` branch. Render configures \`DATABASE_URL\` and generates a secure \`SESSION_SECRET\` automatically. The service's \`/health\` endpoint reports readiness.

**Important: Render's free Postgres databases expire after 30 days and have no backups.** This is appropriate for a trial/demo, **not long-term publishing**. Before relying on the site for real content, move to durable PostgreSQL (or a paid persistent plan with your approval) and arrange backups. The free web service also sleeps when idle. Do not mistake committing this Blueprint for a live deployment: a Render account must connect and create the services.

For an existing MySQL deployment, preserve that database and supply its existing \`JAWSDB_URL\` (or \`DB_*\` values) and \`SESSION_SECRET\`. Moving existing content to Postgres requires a separate data migration.

## Security notes

Use HTTPS in production. Do not commit credentials or \`.env\` files. Account signup is open by design, so a public launch may also require abuse protection, moderation, email verification, and backups. Session records are stored in the same database.

## License

MIT