import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  base: 'https://ztoben.github.io/2d__golf/',
});
