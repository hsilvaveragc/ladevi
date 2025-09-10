import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react({
      include: /\.(js|jsx|ts|tsx)$/,
    }),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],

  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
      shared: resolve(__dirname, "./src/shared"),
      screens: resolve(__dirname, "./src/screens"),
      shell: resolve(__dirname, "./src/shell"),
    },
  },

  server: {
    port: 3000,
    host: "localhost",
  },

  build: {
    outDir: "build",
    target: "esnext",
    rollupOptions: {
      // Excluir módulos problemáticos específicamente
      external: id => {
        const problemModules = [
          "globalThis-this",
          "define-globalThis-property",
          "../internals/globalThis-this",
          "../internals/define-globalThis-property",
          "commonjs-external",
        ];
        return problemModules.some(mod => id.includes(mod));
      },
      output: {
        // Proporcionar globals para módulos excluidos
        globals: {
          "../internals/globalThis-this": "globalThis",
          "../internals/define-globalThis-property": "globalThis",
        },
      },
    },
  },

  envPrefix: "VITE_",

  assetsInclude: ["**/*.xlsx"],

  define: {
    global: "globalThis",
    "process.env": "{}",
  },
});
