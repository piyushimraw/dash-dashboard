const fs = require("fs");
const path = require("path");

const radixRoot = path.join(__dirname, "..", "node_modules", "@radix-ui");

function walkDir(dir, files) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".mjs")) {
      files.push(fullPath);
    }
  }
}

function patchFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const updated = original
    .replace(/react\/jsx-runtime(?!\.js)/g, "react/jsx-runtime.js")
    .replace(/react\/jsx-dev-runtime(?!\.js)/g, "react/jsx-dev-runtime.js");

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
  }
}

const mjsFiles = [];
walkDir(radixRoot, mjsFiles);
mjsFiles.forEach(patchFile);
