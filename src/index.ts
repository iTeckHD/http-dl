import { config } from "dotenv";
import { setup } from "./download/setup";
import { start } from "./download/start";
import { compatibiltiySIGINT } from "./utils/compatibility-sigint";
import { parseParallelDownloads } from "./utils/parse-parallel-downloads";

compatibiltiySIGINT();

// DotEnv Configuration
config();

// Check DotEnv Configuration
if (!process.env.FILE_PATH) {
  console.log("No INPUT_FILE defined");
  process.exit(1);
}

if (!process.env.DOWNLOAD_DIR) {
  console.log("No DOWNLOAD_DIR defined");
  process.exit(1);
}

// Set configuration
const filePath = process.env.FILE_PATH;
const downloadDir = process.env.DOWNLOAD_DIR ?? process.env.PWD;
const parallelDownloads = parseParallelDownloads(
  process.env.PARALLEL_DOWNLOADS!
);

// Setup downloads
setup(filePath, downloadDir)
  .then((downloads) => {
    // Actually start application
    start(downloads, {
      parallelDownloads,
      silent: false,
      force: false,
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Could not load file");
    console.log("Exiting...");
  });
