import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL("./index.html", import.meta.url)),
        docs: fileURLToPath(new URL("./docs/index.html", import.meta.url)),
        docsEn: fileURLToPath(new URL("./docs/en/index.html", import.meta.url)),
        enterprise: fileURLToPath(
          new URL("./enterprise/index.html", import.meta.url),
        ),
        platform: fileURLToPath(
          new URL("./platform/index.html", import.meta.url),
        ),
        resources: fileURLToPath(
          new URL("./resources/index.html", import.meta.url),
        ),
        community: fileURLToPath(
          new URL("./community/index.html", import.meta.url),
        ),
        opensource: fileURLToPath(
          new URL("./opensource/index.html", import.meta.url),
        ),
        editions: fileURLToPath(
          new URL("./editions/index.html", import.meta.url),
        ),
        notFound: fileURLToPath(new URL("./404.html", import.meta.url)),
      },
    },
  },
});
