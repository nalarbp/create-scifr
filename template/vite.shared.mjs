import react from '@vitejs/plugin-react'
import packageJson from './package.json' with { type: 'json' }

export function createSharedViteConfig() {
  return {
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
