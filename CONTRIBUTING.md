# CONTRIBUTING

This document is for developers who want to contribute to the project.

## Folder structure

The project is a full stack application built out of a single repository. Due to this there's a `client` and `server` folder, which contain the **front-end** and **back-end** code respectively. The `client` folder contains a Vite based React application, while the `server` folder will contain the back-end code.

<!--TODO: the back-end folder is essentially empty because we haven't decided what the back-end framework at the time of writing -->

## Getting started

**All commands are written for Unix systems (Linux/Mac) at the time of writing**.

### nvm - node-version-manager

To run the project locally its recommended to have [nvm](https://github.com/nvm-sh/nvm) installed on your system which can then manage/download the correct/same node version for the project simply by running `nvm use` in the project root.

Both the front-end and back-end projects use the same node version for simplicity, its recommended to use **two** terminal instances, one for front-end and one for back-end development where they both run at the same time.

### First time setup

Install dependencies for both the client and server, from the **root of the project use**:

```bash
cd client
npm install
```

```bash
cd server
npm install
```

### Starting the dev servers

You will need **two terminals**, one for the client and one for the server.

To start the `client` project in dev mode

```bash
cd client
npm run dev
```

To start the `server` project in dev mode

```bash
cd server
npm run dev
```
