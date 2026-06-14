import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/embedded/310-normal-scene/",
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5177,
  },
});
