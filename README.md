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

Self hosting is the primary and currently the only way to utilize this codebase in a "production" setting. The targeted way is to download the latest release binary from the [releases page](https://github.com/freeCodeCamp-Summer-Cohort-2026/history-heroes).

### Build from source

To get a "final prod build" run the following commands in order from the root of the project. This assumes you've already followed CONTRIBUTING.md and can run the stack locally.

```bash
cd client
npm run build
cd ..
cd server
npm run build
cd ..
npm run compose-prod-build
cd dist
```

The final top level `dist` folder is the final deployment target, you just need `npm install` and to run `npm run start`.

### Download and run stack

TBD... this will provide instructions to the download and running the entire stack as-is as the above "build from source" will be done automatically on merge to main (and tagged).

## Documentation

- [Functional requirements](docs/functional-requirements.md)
