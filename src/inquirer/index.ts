import { prompt } from "inquirer";
import path from "path";
import { from, Subject } from "rxjs";
import { delay, map, switchMap, take, tap } from "rxjs/operators";
import {
  createMultibar,
  createProgressbar,
  stopMultibar,
} from "../progress-bar";
import { download } from "../utils/download";
import { Downloads } from "../utils/download.type";
import { getRandomWait } from "../utils/wait";
import { userContinue } from "./continue";

export async function start(
  downloads: Downloads,
  options: {
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
    console.log("Exiting...");
    process.exit(1);
  }

  console.clear();
  createMultibar();
  for (const dl of downloads) {
    dl.bar = createProgressbar(path.basename(dl.filePath));
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
              downloadItem!.bar!.setTotal(contentLength);
              downloadItem!.bar!.increment(chunk.length);
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

  for (let i = 1; i <= options.parallelDownloads; i++) {
    subject.next();
  }

  process.on("SIGINT", () => {
    subject.error(new Error());
  });
}
