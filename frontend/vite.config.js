import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
base: '/',
plugins: [react()],
server: {
port: 5173,
// Добавляем обработку для SPA роутинга
historyApiFallback: true
},
// Добавляем настройки для правильной работы роутинга при сборке
build: {
outDir: 'dist',
assetsDir: 'assets',
rollupOptions: {
output: {
manualChunks: undefined
}
}
}
})