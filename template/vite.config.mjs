import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

function scifrDataBoundary() {
  const inputJsonPath = path.resolve(process.cwd(), 'src/input.json');
  const startIdx = 'scifr-data-start';
  const endIdx = 'scifr-data-end';

  return {
    name: 'scifr-data-boundary',
    transformIndexHtml(html) {
      const payload = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
      const inputJson = JSON.stringify({
        startIdx,
        payload,
        endIdx
      })
        .replace(/<\/script/gi, '<\\/script');

      return html.replace(
        '</head>',
        `  <script id="scifr-data" type="application/json">${inputJson}</script>\n</head>`
      );
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    scifrDataBoundary(),
    viteSingleFile()
  ],
  build: {
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000
  }
});
