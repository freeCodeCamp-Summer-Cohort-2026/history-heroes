## server

The back-end code lives within this folder. This side of the project utilizes a framework called [Nest](https://github.com/nestjs/nest), or Nest.js. Nest.js is described by itself as:

> Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

> Under the hood, Nest makes use of robust HTTP Server frameworks like Express (the default) and optionally can be configured to use Fastify as well!

> Nest provides a level of abstraction above these common Node.js frameworks (Express/Fastify), but also exposes their APIs directly to the developer. This gives developers the freedom to use the myriad of third-party modules which are available for the underlying platform.

---

This was built using the non-strict typescript starter template as defined from [here](https://docs.nestjs.com/first-steps).
The below contents are simplified from the default starter to focus more on usage.

## Project folder structure

The general structure follows this blog post:
https://encore.dev/articles/nestjs-project-structure-best-practices

## Database (SQLite + TypeORM)

The server uses [TypeORM](https://typeorm.io/) with the high-performance synchronous SQLite driver [better-sqlite3](https://github.com/WiseLibs/better-sqlite3).

### Configuration

Database configuration is managed in [src/core/db/database.module.ts](src/core/db/database.module.ts) using environment variables from `.env`:

- `DATABASE_STORAGE`: File path to the SQLite database (defaults to `data/dev.sqlite`).
- `DATABASE_SYNCHRONIZE`: Auto-sync schema on startup in development (`true`).

### Seeding the database

To help setup the database during local development the app has code that "seeds" the data from JSON files, this data is validated by [Zod](https://zod.dev/), so invalid schemas are checked before trying to put them into the database, and if anything during the seeding process into the database fails, the process will stop all together and not add anything, hence its all or nothing on purpose.

If there's already users in the database none of the seeding logic should be executed.

Seeding only runs against a database that has no users in it, so an existing database will not pick up changes to the seed JSON files. After editing any seed data, delete and re-create the database using the steps below.

**note**: Passwords in `data/seeds/initial-users.json` are stored as plaintext and are placeholders, not real credentials. Password hashing is tracked in #46 and is not required for Core, since Core does not implement a login flow.

### delete and re-create the database

To delete and re-create the database, you just need to delete the sqlite database file, and start the server again. The seeding process is part of the server startup, so it will re-create the database and seed it again.

```bash
npm run rm:db
npm run start:dev
```

To visually inspect or edit the database file, you can use:

- **VS Code Extension**: _SQLite Viewer_ (qwtel.sqlite-viewer) or _SQLite_ (alexcvzz.vscode-sqlite).
- **GUI Clients**: [DB Browser for SQLite](https://sqlitebrowser.org/) or [DBeaver](https://dbeaver.io/).

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- Visit [NestJS TypeORM integration guide](https://docs.nestjs.com/techniques/database#typeorm-integration).
- More info on Zod, which is used for data validation on the client-side is here [Zod](https://zod.dev/).
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).
