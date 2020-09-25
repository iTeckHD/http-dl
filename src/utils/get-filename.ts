export function getFileName(url: string, fileName?: string) {
  return fileName ?? decodeURIComponent(url).split("/").pop()!;
}
