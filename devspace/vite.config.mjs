import os from "node:os";
const originalInterfaces = os.networkInterfaces;
os.networkInterfaces = () => { try { return originalInterfaces(); } catch { return {lo:[{address:"127.0.0.1",family:"IPv4",internal:true,netmask:"255.0.0.0",mac:"00:00:00:00:00:00",cidr:"127.0.0.1/8"}]}; } };
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
