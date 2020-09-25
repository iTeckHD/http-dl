import { SingleBar } from "cli-progress";

export interface DownloadItem {
  // URL to download file
  url: string;

  // Path to store the file
  filePath: string;

  // The name of the file to store on disk
  fileName?: string;

  // the progress bar, used internally
  bar?: SingleBar;
}

export type Downloads = DownloadItem[];
