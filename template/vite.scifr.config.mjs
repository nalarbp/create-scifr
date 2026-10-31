import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { createSharedViteConfig } from './vite.shared.mjs'

const shared = createSharedViteConfig()

export default defineConfig({
  ...shared,
  plugins: [...shared.plugins, viteSingleFile()],
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
