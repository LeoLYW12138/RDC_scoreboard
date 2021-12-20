import WindiCSS from "vite-plugin-windicss";

export default {
  server: {
    port: 3030,
    strictPort: true,
  },
  plugins: [WindiCSS({ config: "./windi.config.js" })],
};
