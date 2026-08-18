import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
//
// Markdown content is NOT imported by JS — it lives in `public/posts/` and is
// fetched at runtime, so it never passes through Vite's asset pipeline and
// needs no `assetsInclude` entry.
export default defineConfig({
  plugins: [react()],
})
