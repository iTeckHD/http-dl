import fs from "fs";
import path from "path";
import { getFileName } from "../utils/get-filename";
import { Download } from "../utils/types/download.type";
import { InputFile } from "../utils/types/input-file.type";
import { inputFileSchema, isHttpString } from "../utils/types/validation";

export async function setup(inputFilePath: string, downloadDir: string) {
  return new Promise<Download[]>((resolve, reject) => {
    // Get content of file
    fs.readFile(inputFilePath, (err, buffer) => {
      if (err) {
        // Ups, something occured
        reject(err);
      }

      // Result to resolve afterwards
      let result: Download[] = [];

      // Content of file
      const content = buffer.toString();

      try {
        // Check if file has JSON structure
        const inputFile: InputFile = JSON.parse(content);

        // Validate against json schema
        const validationResult = inputFileSchema.validate(inputFile);
        if (validationResult.error) {
          reject(validationResult);
          return;
        }

        // Transform and add data
        result.push(
          ...inputFile.map((download) => ({
            url: download.url,
            filePath: path.join(
              downloadDir,
              getFileName(download.url, download.fileName)
            ),
          }))
        );
      } catch {
        // We assume that the content is text based
        // Transform, filter and add data
        result.push(
          ...content
            .split(/\r?\n/)
            .filter(isHttpString)
            .map((url) => ({
              url,
              filePath: path.join(downloadDir, getFileName(url)),
            }))
        );
      }

      // Resolve promise
      resolve(result);
    });
  });
}
