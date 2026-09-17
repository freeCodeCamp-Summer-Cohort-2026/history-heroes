const fs = require("fs");

/**
 * System helper script that is used to compose a production build after the `client` and `server` builds have been completed.
 *
 * The target output of this will be a top level `dist` folder that includes
 * the server code, prepared to run with a production build of the client code
 * served as-is directly from the server.
 */
(async () => {
  // TODO: Implement this script to copy the client build into the server's public folder and prepare the server for production deployment.
  //
  // for client:
  // - move the client into the server's public folder
  // for server:
  // - mkdir /data/seeds
  // - cp -r ../data/seeds ./data/seeds, need to make this optional
})();
