import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { createSharedViteConfig } from './vite.shared.mjs'

const shared = createSharedViteConfig()

export default defineConfig({
  ...shared,
  plugins: [...shared.plugins, viteSingleFile()],
})
