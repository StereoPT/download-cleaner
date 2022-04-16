import fs from 'fs-extra';
import path from 'path';
import { config } from '../config.js';

const PARSED_DOWNLOADS = path.parse(config.downloads_folder_location);
const DOWNLOADS_PATH = path.join(PARSED_DOWNLOADS.dir, PARSED_DOWNLOADS.name);
const FOLDERS = Object.keys(config.folders);
const DATE_REGEX = /^(2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/

// Helper Methods
const isFile = (fileName) => {
  const filePath = path.join(DOWNLOADS_PATH, fileName);
  return fs.lstatSync(filePath).isFile()
}

const moveOrDelete = (folder, file, currentPath) => {
  const newPath = path.join(DOWNLOADS_PATH, folder, file);
  if(!fs.existsSync(newPath)) {
    fs.moveSync(currentPath, newPath);
  } else {
    console.log("   -> File already in Folder! Deleting Duplicate!");
    fs.removeSync(currentPath);
  }
}

// Setup Sorting Folders
const setupFolders = () => {
  for(const folder of FOLDERS) {
    const sortFolder = path.join(DOWNLOADS_PATH, folder);
    console.log(" -> " + sortFolder);
    if(!fs.existsSync(sortFolder)) {
      console.error("   -> Sorting Folder does not Exist!");
      fs.mkdirSync(sortFolder);
      console.log("   -> Created!");
    }
  }
}

// Sort Download Folder
const downloadFiles = fs.readdirSync(DOWNLOADS_PATH).filter(isFile);

const clean = () => {
  for(const file of downloadFiles) {
    console.log(" -> Checking: " + file);
    const currentPath = path.join(DOWNLOADS_PATH, file);
    const extension = path.extname(file).toLocaleLowerCase();
    const fileName = path.basename(file, extension);
    
    const datePortion = fileName.split('_')[1];
    if(datePortion && DATE_REGEX.test(datePortion)) {
      moveOrDelete("Faturas Cafe", file, currentPath);
      continue;
    }
  
    for(const folder of FOLDERS) {
      const ext = config.folders[folder];  
  
      if(ext.includes(extension)) {
        moveOrDelete(folder, file, currentPath);
      }
    }
  }
}

const run = () => {
  console.log("[Download Cleaner]");
  setupFolders();
  clean();
}

export default run;
