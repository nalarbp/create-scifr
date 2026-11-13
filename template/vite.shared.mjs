import react from '@vitejs/plugin-react'
import packageJson from './package.json' with { type: 'json' }

export function createSharedViteConfig() {
  return {
    // Public base path. Defaults to '/' (served from root). Override when the
    // webapp is hosted under a subpath, e.g. SCIFR_BASE=/my-report/ npm run build
    base: process.env.SCIFR_BASE || '/',
    plugins: [react()],
    define: {
      __SCIFR_VERSION__: JSON.stringify(packageJson.version),
    },
    build: {
      assetsInlineLimit: 100000000,
      chunkSizeWarningLimit: 100000000,
    },
  }
}
