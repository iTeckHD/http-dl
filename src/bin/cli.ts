#!/usr/bin/env node

import { Command } from "commander";
import { isNumber } from "lodash";
import { start } from "../main";
import { browserCompatibiltiySIGINT } from "../utils/browser-compatibility-sigint";
import { setup } from "../download/setup";

browserCompatibiltiySIGINT();

// Delcare programm
const program = new Command();

// Define cli parameters
program
  .version("1.0.0")
  .description("An application to automate simple downloads over HTTP")
  .usage("downloader [ fileName ] [ OPTIONS ]")
  .option("-f, --file", "Text or JSON file to provide download information")
  .option(
    "-d, --dir",
    "Directory to save files to (Defaults to current directory)"
  )
  .option(
    "-p, --parallel",
    "Amount of downloads to start simultaenously (Defaults to 1)"
  )
  .option("-s, --silent", "Downloading files without interface")
  .option("-y, --force", "Immediately start downloads");

// Evaluate cli arguments
program.parse(process.argv);
const filePath: string = program.file ?? program.args[0];
const downloadDir: string = program.dir ?? process.env.PWD;
const parallelDownloads: number =
  program.parallel && isNumber(program.parallel) && program.parallel > 0
    ? program.parallel
    : 1;
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
