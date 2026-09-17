import fs from "node:fs/promises";

/**
 * System helper script that is used to compose a production build after the `client` and `server` builds have been completed.
 *
 * The target output of this will be a top level `dist` folder that includes
 * the server code, prepared to run with a production build of the client code
 * served as-is directly from the server.
 */
(async () => {
  // **note** could be optimized, with parallelization, but not doing this for simplicity.
  await fs.cp("./server/dist", "./dist", { recursive: true });
  await fs.rm("./dist/public/index.html", { force: true });
  await fs.cp("./client/dist", "./dist/public", { recursive: true });
  await fs.mkdir("./dist/data/seeds", { recursive: true });
  await fs.cp("./server/data/seeds", "./dist/data/seeds", { recursive: true });
  await fs.cp("./server/package.json", "./dist/package.json");

  // Update dist/package.json scripts to only include "start": "node main"
  const distPkg = JSON.parse(await fs.readFile("./dist/package.json", "utf-8"));
  distPkg.scripts = {
    start: "node main",
  };
  await fs.writeFile(
    "./dist/package.json",
    JSON.stringify(distPkg, null, 2) + "\n",
  );
})();
