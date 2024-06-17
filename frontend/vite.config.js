import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5000,
        // prevent CORS errors
        proxy: {
            '/api': {
                target: 'https://api.render.com/deploy/srv-cpnqou08fa8c73b5shh0?key=d9sFA7YcJcc',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
