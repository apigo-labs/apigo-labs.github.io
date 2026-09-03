import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, relative, sep } from "node:path";

// Check built assets and links to prevent missing resources under a project prefix.
const root = resolve(process.argv[2] ?? "dist");
const base = process.argv[3] ?? "/";
assert(
  base.startsWith("/") && base.endsWith("/"),
  "The deployment prefix must start and end with /",
);
const origin = "https://site.invalid";
const htmlFiles = readdirSync(root, { recursive: true }).filter((file) =>
  file.endsWith(".html"),
);
assert(htmlFiles.includes("index.html"), "Missing homepage");
assert(htmlFiles.includes("404.html"), "Missing 404 page");
let checked = 0;
for (const file of htmlFiles) {
  const html = readFileSync(resolve(root, file), "utf8");
  assert(
    !html.includes("%BASE_URL%"),
    `${file} contains an unresolved deployment prefix`,
  );
  const pageUrl = new URL(base + file.split(sep).join("/"), origin);
  for (const [tag] of html.matchAll(/<(?:a|link|script|img)\b[^>]*>/gi)) {
    const value = /\b(?:href|src)="([^"]+)"/.exec(tag)?.[1];
    if (!value) continue;
    const url = new URL(value.replaceAll("&amp;", "&"), pageUrl);
    if (url.origin !== origin) continue;
    assert(
      url.pathname.startsWith(base),
      `${file} links outside the deployment prefix: ${value}`,
    );
    let target = resolve(
      root,
      decodeURIComponent(url.pathname.slice(base.length)),
    );
    assert(
      !relative(root, target).startsWith(".."),
      `Path escapes the build directory: ${value}`,
    );
    assert(
      existsSync(target),
      `${file} links to a missing local target: ${value}`,
    );
    if (statSync(target).isDirectory()) target = resolve(target, "index.html");
    assert(
      existsSync(target),
      `${file} links to a directory without an index: ${value}`,
    );
    if (url.hash && target.endsWith(".html")) {
      const ids = [
        ...readFileSync(target, "utf8").matchAll(/\bid="([^"]+)"/g),
      ].map((match) => match[1]);
      assert(
        ids.includes(decodeURIComponent(url.hash.slice(1))),
        `${file} links to a missing anchor: ${value}`,
      );
    }
    checked++;
  }
}
console.log(
  `Verified prefix ${base}: ${htmlFiles.length} pages and ${checked} local links and assets.`,
);
