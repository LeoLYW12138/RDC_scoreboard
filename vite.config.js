import WindiCSS from "vite-plugin-windicss";

export default {
  server: {
    port: 3030,
    strictPort: true,
  },
  base: "/RDC2021/",
  build: {
    outDir: "dist/RDC2021",
  },
  plugins: [WindiCSS({ config: "./windi.config.js" })],
};
