import { defineConfig } from "vite-plugin-windicss";

export default defineConfig({
  attributify: true,
  extract: {
    include: ["**/*.{vue,html,jsx,tsx,js,ts}"],
  },
});
