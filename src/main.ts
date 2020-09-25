import { config } from "dotenv";
import { start } from "./inquirer";
import { browserCompatibiltiySIGINT } from "./utils/browser-compatibility-sigint";
import { getDownloads } from "./utils/get-downloads";

browserCompatibiltiySIGINT();

// DotEnv Configuration
config();

// Check DotEnv Configuration
if (!process.env.INPUT_FILE) {
  console.log("No INPUT_FILE defined");
  process.exit(1);
}

if (!process.env.DOWNLOAD_DIR) {
  console.log("No DOWNLOAD_DIR defined");
  process.exit(1);
}

// Load input
getDownloads(
  process.env.INPUT_FILE as string,
  process.env.DOWNLOAD_DIR ?? process.env.PWD
).then((downloads) => {
  let parallelDownloads = parseInt(process.env.PARALLEL_DOWNLOADS as string);
  if (isNaN(parallelDownloads) || parallelDownloads < 1) {
    parallelDownloads = 1;
  }

  start(downloads, {
    parallelDownloads,
  });
});
