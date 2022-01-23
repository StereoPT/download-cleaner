const fs = require('fs/promises');
const path = require('path');

const DOWNLOADS_PATH = path.parse('C:/Users/GuidoSP/Downloads');

console.log("[Download Cleaner]");

(async() => {
  const download_files = await fs.readdir(path.join(DOWNLOADS_PATH.dir, DOWNLOADS_PATH.name));
  console.log(download_files);
})();