import { prompt } from "inquirer";
import path from "path";
import { from, Subject } from "rxjs";
import { delay, map, switchMap, take, tap } from "rxjs/operators";
import {
  createMultibar,
  createProgressbar,
  stopMultibar,
} from "../utils/progress-bar";
import { download } from "./download";
import { Download } from "../utils/types/download.type";
import { getRandomWait } from "../utils/wait";

interface Options {
  parallelDownloads: number;
  silent: boolean;
  force: boolean;
}

export async function start(downloads: Download[], options: Options) {
  if (!options.silent) {
    // List files to download
    console.clear();
    console.log("Following files will be downloaded:");
    for (const dl of downloads) {
      console.log("> " + dl.url);
    }

    if (!options.force) {
      // Wait for user to confirm continuation
      const userResult = await prompt([
        {
          type: "confirm",
          name: "start",
          message: "Continue?",
        },
      ]);

      if (!userResult.start) {
        console.log("Exiting...");
        process.exit(0);
      }
    }

    console.clear();

    // Create progressbar
    createMultibar();
    for (const dl of downloads) {
      dl.bar = createProgressbar(path.basename(dl.filePath));
    }
  }

  const subject = new Subject<void>();

  subject
    .pipe(
      take(downloads.length),
      map(() => downloads.shift()!),
      switchMap((downloadItem) =>
        from(
          download(
            downloadItem!.url,
            downloadItem!.filePath,
            (contentLength, chunk) => {
              if (!options.silent) {
                downloadItem!.bar!.setTotal(contentLength);
                downloadItem!.bar!.increment(chunk.length);
              }
            }
          )
        )
      ),
      delay(getRandomWait()),
      tap(() => subject.next())
    )
    .subscribe(
      () => {},
      () => {
        stopMultibar();
        console.log("Aborting downloads...");
        console.log("Unfinished downloads will be deleted.");
      },
      () => {
        stopMultibar();
      }
    );

  // Start simulatenous downloads
  for (let i = 1; i <= options.parallelDownloads; i++) {
    subject.next();
  }

  process.on("SIGINT", () => {
    subject.error(new Error());
  });
}
