// Polyfills for Node.js APIs required by circomlibjs and other crypto libraries
// This must be imported before any library that uses Buffer

import { Buffer } from 'buffer'

// Make Buffer globally available
window.Buffer = Buffer
globalThis.Buffer = Buffer

// Also polyfill process if needed
if (typeof window.process === 'undefined') {
  window.process = { env: {} } as unknown as NodeJS.Process
}

export {}
