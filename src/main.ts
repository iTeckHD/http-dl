import { config } from "dotenv";
import { downloadSchema } from "./utils/download.schema";
import { start } from "./inquirer";
import { Downloads } from "./utils/download.type";

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
const downloads: Downloads = require(process.env.INPUT_FILE);

// Validate
const validationResult = downloadSchema.validate(downloads);
if (validationResult.error) {
  console.log(validationResult);
  process.exit(1);
}

let parallelDownloads = parseInt(process.env.PARALLEL_DOWNLOADS as string);
if (isNaN(parallelDownloads) || parallelDownloads < 1) {
  parallelDownloads = 1;
}

start(downloads, process.env.DOWNLOAD_DIR, {
  parallelDownloads,
});
