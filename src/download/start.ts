import { prompt } from "inquirer";
import path from "path";
import { zip, from, Subject, timer } from "rxjs";
import { delay, delayWhen, switchMap, take, tap, map } from "rxjs/operators";
import {
  createMultibar,
  createProgressbar,
  stopMultibar,
} from "../utils/progress-bar";
import { Download } from "../utils/types/download.type";
import { download } from "./download";

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

    // Create progressbars
    console.clear();
    createMultibar();
    for (const dl of downloads) {
      dl.bar = createProgressbar(path.basename(dl.filePath));
    }
  }

  // rxjs magic to start downloads
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
            (contentLength, chunkLength) => {
              if (!options.silent) {
                downloadItem!.bar!.setTotal(contentLength);
                downloadItem!.bar!.increment(chunkLength);
              }
            }
          )
        )
      ),
      delayWhen(() => timer(downloads.length ? 200 : 0)),
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
        console.log("Completed");
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
