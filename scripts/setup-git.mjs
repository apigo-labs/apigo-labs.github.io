import { execFileSync } from "node:child_process";

// Configure only this checkout; leave global credentials and SSH settings intact.
execFileSync("git", ["rev-parse", "--show-toplevel"], { stdio: "ignore" });
for (const [key, value] of Object.entries({
  "user.name": "avatr-ai",
  "user.email": "avatr@skymythos.ai",
  "user.useConfigOnly": "true",
  "core.hooksPath": ".githooks",
})) {
  execFileSync("git", ["config", "--local", key, value]);
}
console.log("Configured repository-local identity and policy hooks.");
