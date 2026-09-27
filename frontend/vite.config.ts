/**
 * Configuração do Vite, ferramenta usada para desenvolvimento e build.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// defineConfig oferece tipagem/autocomplete para as opções do Vite.
export default defineConfig({
  // Plugin responsável por processar JSX/TSX e recursos do React.
  plugins: [react()],
  // Porta utilizada pelo servidor local de desenvolvimento.
  server: { port: 5173 }
})
