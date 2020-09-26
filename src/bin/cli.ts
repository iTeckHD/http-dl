#!/usr/bin/env node

import { Command } from "commander";
import { start } from "../download/start";
import { compatibiltiySIGINT } from "../utils/compatibility-sigint";
import { setup } from "../download/setup";
import { parseParallelDownloads } from "../utils/parse-parallel-downloads";

compatibiltiySIGINT();

// Delcare programm
const program = new Command();

// Define cli parameters
program
  .version("1.0.0")
  .description("An application to automate simple downloads over HTTP")
  .usage("http-dl [ FILE ] [ OPTIONS ]")
  .option(
    "-d, --dir <string>",
    "directory to save files to (Defaults to current directory)"
  )
  .option<number>(
    "-p, --parallel <number>",
    "amount of downloads to start simultaenously (Defaults to 1)",
    (value) => parseParallelDownloads(value),
    1
  )
  .option("-s, --silent", "downloading files without interface")
  .option("-y, --force", "immediately start downloads");

// Evaluate cli arguments
program.parse(process.argv);
const filePath: string = program.file ?? program.args[0];
const downloadDir: string = program.dir ?? process.env.PWD;
const parallelDownloads = program.parallel;
const silent: boolean = program.silent === true;
const force: boolean = program.force === true;

// When no file path is defined, show help
if (!filePath) {
  program.help();
}

// Setup downloads
setup(filePath, downloadDir)
  .then((downloads) => {
    // Actually start application
    start(downloads, {
      parallelDownloads,
      silent,
      force,
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Could not load file");
    console.log("Exiting...");
  });
