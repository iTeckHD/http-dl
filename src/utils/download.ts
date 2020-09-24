import fs from "fs";
import http, { IncomingMessage } from "http";

export function download(
  url: string,
  filePath: string,
  onData: (contentLength: number, chunk: any) => void
) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    http.get(url, httpCallback).on("error", onError);

    function httpCallback(response: IncomingMessage) {
      const cLength = getContentLength(response);

      response.pipe(file);
      response.on("data", (chunk) => {
        onData(cLength, chunk);
      });

      file.on("finish", function () {
        file.close();
        resolve();
      });
    }

    function getContentLength(response: IncomingMessage) {
      return (response.headers["content-length"] as unknown) as number;
    }

    function onError(err: Error) {
      fs.unlink(filePath, () => void 0);
      reject(err);
    }
  });
}
