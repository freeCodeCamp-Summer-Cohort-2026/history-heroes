# history-heroes

Full stack web app for freeCodeCamp-Summer-Cohort-2026

## Team Members

<!--
  TODO: add yourself as a commit and try to keep in alphabetical order, also label yourself "developer" unless you are the team lead, as I think the team-lead gets some "extra credit" for taking on the role :D
-->

- [kaymade](https://github.com/kaymade) - team lead
- [blue](https://github.com/Blue111-png) - developer
- [bradtaniguchi](https://github.com/bradtaniguchi) - developer
- [lorevdh](https://github.com/Lorevdh) - developer
- [riverkarnas](https://github.com/riverkarnas) - developer
- [shy-away](https://github.com/shy-away) - developer
- [tanveenk](https://github.com/tanveenk) - developer

## Getting Started

This project has two halves that run separately. Start with the client if you are working on the interface, or the server if you are working on the API or database.

- [client/README.md](client/README.md) for setup, the dev server and tests
- [server/README.md](server/README.md) for setup, database configuration and seeding

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit conventions and the PR process.

## Self hosting

Self hosting is the primary and currently the only way to utilize this codebase in a "production" setting. The targeted way is to download the latest release bundle from the [releases page](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/releases).

### Download and run stack

1. **Download the latest release archive** (`history-heroes-dist.zip` or `history-heroes-dist.tar.gz`) from the [GitHub Releases](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes/releases) page.

2. **Extract the archive** to a directory of your choice:

   ```bash
   unzip history-heroes-dist.zip -d history-heroes
   cd history-heroes
   ```

   _(or using tar)_:

   ```bash
   mkdir history-heroes
   tar -xzf history-heroes-dist.tar.gz -C history-heroes
   cd history-heroes
   ```

3. **Install production dependencies**:

   ```bash
   npm install --omit=dev
   ```

4. **(Optional) Configure environment variables**:
   By default, the server runs on port `3000` with the SQLite database stored at `data/dev.sqlite`. You can customize settings via environment variables (or by creating a `.env` file):

   ```bash
   PORT=3000
   NODE_ENV=production
   DATABASE_STORAGE=data/app.sqlite
   SESSION_SECRET=replace-with-a-secure-random-secret
   ```

5. **Start the application**:

   ```bash
   npm run start
   ```

   The full-stack application (frontend client and backend API) will now be accessible at `http://localhost:3000`.

### Build from source

To build the production bundle directly from source instead of downloading a release:

```bash
cd client
npm run build
cd ..
cd server
npm run build
cd ..
npm run compose-prod-build
cd dist
npm install --omit=dev
npm run start
```

## Documentation

- [Functional requirements](docs/functional-requirements.md)
