const fs = require('fs-extra');
const path = require('path');
const config = require('./config.json');

const PARSED_DOWNLOADS = path.parse(config.downloads_folder_location);
const DOWNLOADS_PATH = path.join(PARSED_DOWNLOADS.dir, PARSED_DOWNLOADS.name);
const FOLDERS = Object.keys(config.folders);

console.log("[Download Cleaner]");

// Helper Methods
const isFile = (fileName) => {
  const filePath = path.join(DOWNLOADS_PATH, fileName);
  return fs.lstatSync(filePath).isFile()
}

// Setup Sorting Folders
for(const folder of FOLDERS) {
  const sortFolder = path.join(DOWNLOADS_PATH, folder);
  console.log(" -> " + sortFolder);
  if(!fs.existsSync(sortFolder)) {
    console.error("   -> Sorting Folder does not Exist!");
    fs.mkdirSync(sortFolder);
    console.log("   -> Created!");
  }
}

// Sort Download Folder
const downloadFiles = fs.readdirSync(DOWNLOADS_PATH).filter(isFile);

for(const file of downloadFiles) {
  console.log(" -> Checking: " + file);
  const currentPath = path.join(DOWNLOADS_PATH, file);
  const extension = path.extname(file).toLocaleLowerCase();

  for(const folder of FOLDERS) {
    const ext = config.folders[folder];

    if(ext.includes(extension)) {
      const newPath = path.join(DOWNLOADS_PATH, folder, file);
      fs.moveSync(currentPath, newPath);
    }
  }
}