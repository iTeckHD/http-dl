import { MultiBar, Presets } from "cli-progress";

let multibar: MultiBar | null = null;

export function createMultibar() {
  if (multibar) {
    multibar.stop();
  }

  multibar = new MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
      format: "[{bar}] {percentage}% | {fileName} | {value}/{total}",
    },
    Presets.shades_grey
  );
}

export function createProgressbar(fileName: string) {
  if (!multibar) {
    throw new Error("Multibar not created");
  }

  return multibar.create(100, 0, { fileName });
}

export function stopMultibar() {
  if (!multibar) {
    return;
  }

  multibar.stop();
}
