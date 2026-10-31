const SCRIPT_START = '<script id="scifr-data" type="application/json">'
const SCRIPT_END = '</script>'

export const SCIFR_FORMAT = 'scifr'
export const SCIFR_VERSION = 1

function bytesToBase64(bytes) {
  let binary = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return window.btoa(binary)
}

async function gzipText(text) {
  if (typeof CompressionStream === 'undefined') return null
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function packPayload(value) {
  const json = JSON.stringify(value)
  const compressed = await gzipText(json)
  if (!compressed) return value
  return {
    format_version: 1,
    compression: 'gzip',
    encoding: 'base64',
    payload: bytesToBase64(compressed),
  }
}

function replaceDataBoundary(html, payload) {
  const start = html.indexOf(SCRIPT_START)
  if (start < 0) throw new Error('SCIFR data boundary was not found in the template')
  const jsonStart = start + SCRIPT_START.length
  const end = html.indexOf(SCRIPT_END, jsonStart)
  if (end < 0) throw new Error('SCIFR data boundary is incomplete')

  const envelope = JSON.stringify({
    startIdx: 'scifr-data-start',
    payload,
    endIdx: 'scifr-data-end',
  }).replace(/<\/script/gi, '<\\/script')

  return html.slice(0, jsonStart) + envelope + html.slice(end)
}

function safeFilename(value) {
  const clean = String(value || 'scifr-report')
    .replace(/[\\/:*?"<>|]/g, '_')
    .trim()
  return `${clean || 'scifr-report'}.html`
}

async function loadScifrTemplate() {
  if (typeof document === 'undefined') {
    throw new Error('The SCIFR template is unavailable in this environment')
  }
  const templateUrl = new URL('scifr.html', document.baseURI)
  const response = await fetch(templateUrl)
  if (!response.ok) {
    throw new Error(`Could not load the SCIFR template (${response.status})`)
  }
  const html = await response.text()
  // Guard: the built template must have all assets inlined. External src/href
  // means we are running from the dev server, which cannot produce valid exports.
  const hasExternalAssets =
    /<script\b[^>]*\bsrc\s*=/i.test(html) ||
    /<link\b[^>]*\brel\s*=\s*["']stylesheet["']/i.test(html)
  if (hasExternalAssets) {
    throw new Error('SCIFR export requires the built application (npm run build), not the development server')
  }
  return html
}

export function currentScifrVersion() {
  return typeof __SCIFR_VERSION__ === 'undefined' ? 'development' : __SCIFR_VERSION__
}

export async function buildScifrDownload({ snapshot, title }) {
  const metadata = {
    title: String(title || 'SCIFR Report').trim() || 'SCIFR Report',
    generatedAt: new Date().toISOString(),
    generatedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    scifrVersion: currentScifrVersion(),
  }
  const report = {
    format: SCIFR_FORMAT,
    version: SCIFR_VERSION,
    metadata,
    snapshot,
  }
  const template = await loadScifrTemplate()
  const html = replaceDataBoundary(template, await packPayload(report))
  return {
    blob: new Blob([html], { type: 'text/html;charset=utf-8' }),
    filename: safeFilename(metadata.title),
    metadata,
  }
}
