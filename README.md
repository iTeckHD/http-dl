# http-dl

Uses a file to download data.

## Usage

```bash
npx http-dl [ FILE_PATH ] [ OPTIONS ]
```

## Options

```bash
  -V, --version   output the version number
  -f, --file      text or json file to provide download information
  -d, --dir       directory to save files to (Defaults to current directory)
  -p, --parallel  amount of downloads to start simultaenously (Defaults to 1)
  -s, --silent    downloading files without interface
  -y, --force     immediately start downloads
  -h, --help      display help for command
```

## File structure

### Text

```
https://github-media-downloads.s3.amazonaws.com/GitHub-Logos.zip
https://github-media-downloads.s3.amazonaws.com/GitHub-Mark.zip
```

### JSON

```javascript
[
  {
    url: "https://github-media-downloads.s3.amazonaws.com/GitHub-Logos.zip",
    fileName: "logos.zip",
  },
  {
    url: "https://github-media-downloads.s3.amazonaws.com/GitHub-Mark.zip",
    filePath: "/tmp/marks.zip",
  },
  {
    url: "https://github-media-downloads.s3.amazonaws.com/Octocats.zip",
    // `fileName` will be ignored
    fileName: "Octos.zip",
    filePath: "/tmp/Octocats.zip",
  },
];
```

| Property   | Description                                                                           |
| ---------- | ------------------------------------------------------------------------------------- |
| `url`      | The url to the download the file from.                                                |
| `fileName` | The name of the file to save on the disk. The path will be determined by option `-d`. |
| `filePath` | The path of the file \w name to save on the disk (Ignores property `fileName`).       |
