# CONTRIBUTING

This document is for developers who want to contribute to the project.

## Folder structure

The project is a full stack application built out of a single repository. Due to this there's a `client` and `server` folder, which contain the **front-end** and **back-end** code respectively. The `client` folder contains a Vite based React application, while the `server` folder will contain the back-end code.

The `server` folder contains a NestJS application using TypeORM and SQLite.

## Getting started

**All commands are written for Unix systems (Linux/Mac) at the time of writing**.

### nvm - node-version-manager

To run the project locally, it is recommended to have [nvm](https://github.com/nvm-sh/nvm) installed. From the root of the project, install and select the project's Node version:

```bash
nvm install
nvm use
```

Both the front-end and back-end projects use the same node version for simplicity, its recommended to use **two** terminal instances, one for front-end and one for back-end development where they both run at the same time.

### First time setup

Install dependencies for both the client and server, from the **root of the project use**:

Install the top level dependencies, these are primarily there for git hooks and Zed and VSCode editor support.

```bash
npm install
```

Then move into the client folder

```bash
# change directory into the nested client server
cd client
npm install
```

Finally move back to the root, and then into the server folder

```bash
# backing out of client
cd ..
```

```bash
# change directory into server
cd server
npm install
```

### Starting the dev servers

You will need **two terminals**, one for the client and one for the server.

To start the `client` project in dev mode

```bash
# from the root of the project, go into the client folder
cd client
npm run dev
```

---

To start the `server` project in dev mode

First time you have to create a `.env` file, this has an example in `.env.example` copy the file into `.env`, which isn't tracked by git. Tweak anything labeled "secret" for best practice.

```bash
# from the root of the project, go into the server folder
cd server
npm run dev
```

## Branch naming

Branch off `main`, and name the branch after the issue you are working on:

```
<type>/<issue-number>/<short-description>
```

For example:

```
feat/69/routes-and-page-shell
feat/37/sqlite
chore/70/setup-client-tests
```

The type is the same set used for commits, listed below. The description is a few words in lowercase with dashes between them, enough that someone reading `git branch` knows what it is without opening the issue.

If the work genuinely has no issue behind it, drop the number:

```
docs/seeding-reset-note
fix/use-lts-node
```

Most work should have an issue, so this should be the exception rather than the habit.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

For example:

```
feat(client): establish first-slice routes and page shell
feat(api): provide ordered lessons for a module
chore(tools): author the seven wonders lesson content
docs: correct auth scope and remove settled open questions
```

### Types

| Type       | Use it for                                                     |
| ---------- | -------------------------------------------------------------- |
| `feat`     | new functionality a user or another developer can see          |
| `fix`      | correcting behavior that was already supposed to work          |
| `docs`     | documentation only, including this file                        |
| `chore`    | tooling, configuration, dependencies, test setup, housekeeping |
| `refactor` | restructuring code without changing what it does               |
| `test`     | adding or correcting tests only                                |

### Scopes

| Scope    | Means                                               |
| -------- | --------------------------------------------------- |
| `client` | anything under `client/`                            |
| `api`    | anything under `server/`                            |
| `tools`  | curriculum content, seed data and authoring scripts |

Leave the scope off when the change is repo-wide and does not belong to one half, such as `docs:` or `chore:` at the root.

### Writing the description

Keep it lowercase, in the imperative, and under about seventy characters. Say what the commit does, not what you did, so `add lesson ordering endpoint` rather than `added lesson ordering endpoint` or `lesson stuff`.

## Pull requests

The PR title follows the same commit convention, because it becomes the commit message when the PR is squashed into `main`. In practice the easiest thing is to use the issue title as the PR title, since issues already follow this format.

Link the issue in the PR description with a closing keyword so it closes on merge:

```
Closes #69
```
