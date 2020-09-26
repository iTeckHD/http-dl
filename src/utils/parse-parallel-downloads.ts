export function parseParallelDownloads(sParallelDownloads: string) {
  const raw = parseInt(sParallelDownloads);

  return !isNaN(raw) && raw > 0 ? raw : 1;
}
