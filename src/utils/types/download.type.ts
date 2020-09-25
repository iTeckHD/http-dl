import { SingleBar } from "cli-progress";

export interface Download {
  // URL to download file
  url: string;

  // Path to store the file
  filePath: string;

  // the progress bar, used internally
  bar?: SingleBar;
}
