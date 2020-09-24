import { DownloadItem } from "./download.type";

export function getFileName(download: DownloadItem) {
  return download.name ?? download.url.split("/").pop()!;
}
