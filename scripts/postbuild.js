const fs = require("fs");

const DIST_LIB_PATH = "lib/";
const patches = ["README.md", "package.json", "LICENSE", "package-lock.json"];

const PATH_TO = DIST_LIB_PATH;

copyReadmeIntoDistFolder();

function copyReadmeIntoDistFolder() {
  if (!patches.every((path) => fs.existsSync(path))) {
    throw new Error("README.md does not exist");
  } else {
    patches.forEach((path) => {
      fs.copyFileSync(path, PATH_TO + path);
    });
  }
}
