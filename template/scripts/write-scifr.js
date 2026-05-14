//for the sake of windows users, i prefer this goes to just cp chained to npm run build, but lets keep it as it is for now
const fs = require('fs');
const path = require('path');

const distHtmlPath = path.resolve(__dirname, '..', 'dist', 'index.html');
const scifrHtmlPath = path.resolve(__dirname, '..', 'scifr.html');

if (!fs.existsSync(distHtmlPath)) {
  throw new Error(`Expected build output at ${distHtmlPath}`);
}

fs.copyFileSync(distHtmlPath, scifrHtmlPath);
