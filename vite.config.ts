import { defineConfig } from "vite";

const repo = process.env["GITHUB_REPOSITORY"]?.split("/")[1];
const base = process.env["VITE_BASE"] ?? (repo ? `/${repo}/` : "/");

export default defineConfig({
  root: ".",
  base,
  publicDir: "public",
  build: {
    target: "es2022",
    cssMinify: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ["gsap", "gsap/ScrollTrigger", "gsap/ScrollToPlugin", "gsap/SplitText", "gsap/CustomEase", "gsap/DrawSVGPlugin"]
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false
  }
});
