import { SingleBar } from "cli-progress";

interface InputFileEntry {
  // URL to download file
  url: string;

  // Path to store the file, ignores property `fileName`
  filePath?: string;

  // The name of the file to store on disk
  fileName?: string;
}

export type InputFile = InputFileEntry[];
