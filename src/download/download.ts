import fs from "fs";
import http, { IncomingMessage } from "http";
import https from "https";
import { compatibiltiySIGINT } from "../utils/compatibility-sigint";

compatibiltiySIGINT();
http.globalAgent.maxSockets = 50;
https.globalAgent.maxSockets = 50;

export function download(
  url: string,
  filePath: string,
  onData: (contentLength: number, chunkLength: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const module = url.startsWith("https://") ? https : http;
    const request = module.get(
      url,
      onResponse(filePath, onData, () => {
        process.off("exit", _onExit);
        process.off("SIGINT", _onExit);
        request.end();
        resolve();
      })
    );
    request.on(
      "error",
      onError(filePath, (err) => reject(err))
    );
    request.on("abort", () => {
      resolve();
    });

    process.on("exit", _onExit);
    process.on("SIGINT", _onExit);

    function _onExit() {
      request.abort();
      fs.unlink(filePath, () => void 0);
    }
  });
}

function onResponse(
  filePath: string,
  onData: (contentLength: number, chunkLength: number) => void,
  onComplete: () => void
) {
  const file = fs.createWriteStream(filePath);

  return function (response: IncomingMessage) {
    const length = parseInt(response.headers["content-length"]!);

    response.pipe(file);
    response.on("data", (chunk) => {
      onData(length, chunk.length);
    });

    file.on("finish", function () {
      file.close();
      onComplete();
    });
  };
}

function onError(filePath: string, cb: (err: Error) => void) {
  return function onError(err: Error) {
    fs.unlink(filePath, () => {
      cb(err);
    });
  };
}
