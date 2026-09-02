# CONTRIBUTING

This document is for developers who want to contribute to the project.

## Folder structure

The project is a full stack application built out of a single repository. Due to this there's a `client` and `server` folder, which contain the **front-end** and **back-end** code respectively. The `client` folder contains a Vite based React application, while the `server` folder will contain the back-end code.

<!--TODO: the back-end folder is essentially empty because we haven't decided what the back-end framework at the time of writing -->

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

To start the `server` project in dev mode

```bash
# from the root of the project, go into the server folder
cd server
npm run dev
```
