import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Flowr - Cinderscript',
        namespace: 'npm/vite-plugin-monkey',
        description: 'A free, publicly available collection of QoL features for flowr.fun players.',
        author: 'Applepie (Ideas + bugfixes), PigeonBar (some technical stuff)',
        icon: 'https://www.google.com/s2/favicons?sz=64&domain=flowr.fun',
        match: ['https://flowr.fun/'],
      },
      build: {
        fileName: 'cinderscript.user.js',
      },
    }),
  ],
});
