import { serve } from "bun";
import index from "./index.html";

const _server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
  },
  port: 3001,
  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
