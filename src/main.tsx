// Polyfills for Node.js APIs used by circomlibjs
// Must be at the very top before any other imports
import { Buffer } from 'buffer'
;(window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
;(globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
