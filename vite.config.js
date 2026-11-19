import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    const dependency = id.split('/node_modules/')[1];
                    if (!dependency) return undefined;
                    if (dependency.startsWith('react/') || dependency.startsWith('react-dom/') || dependency.startsWith('scheduler/')) return 'react-vendor';
                    if (dependency.startsWith('@supabase/')) return 'supabase-vendor';
                    if (dependency.startsWith('lucide-react/')) return 'icons-vendor';
                    if (dependency.startsWith('react-router') || dependency.startsWith('@remix-run/')) return 'router-vendor';
                    return 'vendor';
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
