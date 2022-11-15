import WindiCSS from "vite-plugin-windicss";

export default {
  server: {
    port: 3030,
    strictPort: true,
  },
  base: "/RDC2022/",
  build: {
    outDir: "dist/RDC2022",
  },
  plugins: [WindiCSS({ config: "./windi.config.js" })],
};
