const fs = require("fs");

const origSymlink = fs.promises.symlink;
fs.promises.symlink = async function (target, path, type) {
  try {
    await origSymlink.call(fs.promises, target, path, type);
  } catch (e) {
    if (e.code === "EPERM") {
      await fs.promises.cp(target, path, {
        recursive: true,
        verbatimSymlinks: false,
      });
      return;
    }
    throw e;
  }
};

const origSymlinkSync = fs.symlinkSync;
fs.symlinkSync = function (target, path, type) {
  try {
    return origSymlinkSync.call(fs, target, path, type);
  } catch (e) {
    if (e.code === "EPERM") {
      return fs.cpSync(target, path, {
        recursive: true,
        verbatimSymlinks: false,
      });
    }
    throw e;
  }
};
