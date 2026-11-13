import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { createSharedViteConfig } from './vite.shared.mjs'

const shared = createSharedViteConfig()

// Bakes the bundled demo payload into the scifr-data boundary at build time so
// the standalone template (dist/scifr.html) opens with the demo data visible.
// mutate-scifr (or the webapp export) replaces this payload later.
function scifrDemoPayload() {
  return {
    name: 'scifr-demo-payload',
    transformIndexHtml(html) {
      const payloadPath = path.resolve(process.cwd(), 'src/input.columnar.gzip.base64.json')
      const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'))
      const envelope = JSON.stringify({
        startIdx: 'scifr-data-start',
        payload,
        endIdx: 'scifr-data-end',
      }).replace(/<\/script/gi, '<\\/script')

      return html.replace(
        /(<script id="scifr-data"[^>]*>)[\s\S]*?(<\/script>)/,
        `$1${envelope}$2`
      )
    },
  }
}

export default defineConfig({
  ...shared,
  plugins: [...shared.plugins, scifrDemoPayload(), viteSingleFile()],
  // The app build already wrote public assets. A second publicDir copy would
  // overwrite dist/index.html with the public stub.
  publicDir: false,
  build: {
    ...shared.build,
    emptyOutDir: false,
    rollupOptions: {
      input: fileURLToPath(new URL('./scifr.html', import.meta.url)),
    },
  },
})
