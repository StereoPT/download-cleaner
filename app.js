const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const DOWNLOADS_PATH = path.parse(config.downloads_folder_location);
const SORTING_FOLDERS = config.sorting_folders;

console.log("[Download Cleaner]");

// Setup Sorting Folders
for(const folder of SORTING_FOLDERS) {
  const sortFolder = path.join(DOWNLOADS_PATH.dir, DOWNLOADS_PATH.name, folder);
  console.log(" -> " + sortFolder);
  if(!fs.existsSync(sortFolder)) {
    console.error("   -> Sorting Folder does not Exist!");
    fs.mkdirSync(sortFolder);
    console.log("   -> Created!");
  }
}

// Sort Download Folder
const download_files = fs.readdirSync(path.join(DOWNLOADS_PATH.dir, DOWNLOADS_PATH.name));
console.log(download_files);
