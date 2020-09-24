import { prompt } from "inquirer";
import { Downloads } from "../utils/download.type";
import path from "path";
import { getFileName } from "../utils/get-filename";
import { userContinue } from "./continue";

export async function start(
  downloads: Downloads,
  downloadDir: string,
  options?: {
    parallelDownloads: number;
  }
) {
  console.clear();
  console.log("Following files will be downloaded:");

  for (const dl of downloads) {
    console.log(dl.url);
  }

  const userResult = await prompt([userContinue]);

  if (!userResult.start) {
    console.log("Exiting prematurely...");
    process.exit(1);
  }

  for (const dl of downloads) {
    console.log(path.join(downloadDir, getFileName(dl)));
  }
}
