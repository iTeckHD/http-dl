import fs from "fs";
import { DownloadItem, Downloads } from "./download.type";
import path from "path";
import { getFileName } from "./get-filename";
import { downloadSchema } from "./download.schema";

export async function getDownloads(inputFilePath: string, downloadDir: string) {
  return new Promise<Downloads>((resolve, reject) => {
    fs.readFile(inputFilePath, (err, buffer) => {
      if (err) {
        reject();
      }

      let result: Downloads = [];
      const content = buffer.toString();

      try {
        const downloads: Downloads = JSON.parse(content);

        const validationResult = downloadSchema.validate(downloads);
        if (validationResult.error) {
          reject(validationResult);
          return;
        }

        result.push(
          ...downloads.map<DownloadItem>((download) => ({
            url: download.url,
            filePath: path.join(
              downloadDir,
              getFileName(download.url, download.fileName)
            ),
          }))
        );
      } catch {
        result.push(
          ...content.split(/\r?\n/).map((url) => ({
            url,
            filePath: path.join(downloadDir, getFileName(url)),
          }))
        );
      }

      resolve(result);
    });
  });
}
