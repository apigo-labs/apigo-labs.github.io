import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { afterEach, test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const projectRoot = new URL("..", import.meta.url).pathname;
const checker = join(projectRoot, "scripts/check-policy.mjs");
const temporaryDirectories = [];

function command(directory, args, options = {}) {
  return execFileSync(args[0], args.slice(1), {
    cwd: directory,
    encoding: "utf8",
    ...options,
  });
}

function createRepository() {
  const directory = mkdtempSync(join(tmpdir(), "check-policy-"));
  temporaryDirectories.push(directory);
  command(directory, ["git", "init", "--quiet"]);
  command(directory, ["git", "config", "user.name", "avatr-ai"]);
  command(directory, ["git", "config", "user.email", "avatr@skymythos.ai"]);
  writeFileSync(
    join(directory, "README.md"),
    "## English\n\nEnglish documentation.\n\n## 中文\n\n中文文档。\n",
  );
  command(directory, ["git", "add", "README.md"]);
  command(directory, [
    "git",
    "commit",
    "--quiet",
    "-m",
    "Initialize policy fixture",
  ]);
  return directory;
}

function writeFixture(directory, path, content) {
  const target = join(directory, path);
  const parent = target.slice(0, target.lastIndexOf("/"));
  if (parent !== directory) command(directory, ["mkdir", "-p", parent]);
  writeFileSync(target, content);
}

function check(directory, ...arguments_) {
  return spawnSync(process.execPath, [checker, ...arguments_], {
    cwd: directory,
    encoding: "utf8",
  });
}

function checkWithEnvironment(directory, arguments_, environment) {
  return spawnSync(process.execPath, [checker, ...arguments_], {
    cwd: directory,
    encoding: "utf8",
    env: { ...process.env, ...environment },
  });
}

afterEach(() => {
  for (const directory of temporaryDirectories) {
    rmSync(directory, { recursive: true, force: true });
  }
  temporaryDirectories.length = 0;
});

test("allows Chinese UI strings while rejecting JavaScript comments", () => {
  const directory = createRepository();
  writeFixture(
    directory,
    "src/app.ts",
    'const uiLabel = "中文 UI";\n// 中文 comment\n',
  );
  command(directory, ["git", "add", "src/app.ts"]);
  const result = check(directory, "--staged");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /src\/app\.ts:2/);

  writeFixture(
    directory,
    "src/app.ts",
    'const uiLabel = "中文 UI";\n// English comment\n',
  );
  command(directory, ["git", "add", "src/app.ts"]);
  assert.equal(check(directory, "--staged").status, 0);

  writeFixture(
    directory,
    "page.html",
    '<script>const uiMarkup = "<!-- 中文 -->";</script><p>What\'s new?</p>\n',
  );
  command(directory, ["git", "add", "page.html"]);
  assert.equal(check(directory, "--staged").status, 0);
});

test("rejects line, block, HTML, and CSS comments with non-Latin text", () => {
  const directory = createRepository();
  writeFixture(
    directory,
    "src/comments.ts",
    "// 中文\n/* 日本語 */\nconst value = 1;\n",
  );
  writeFixture(
    directory,
    "page.html",
    "<div><!-- 한국어 --><span>中文 UI</span></div>\n",
  );
  writeFixture(directory, "src/styles.css", ".a { color: red; /* 中文 */ }\n");
  command(directory, [
    "git",
    "add",
    "src/comments.ts",
    "page.html",
    "src/styles.css",
  ]);
  const result = check(directory, "--staged");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /src\/comments\.ts:1/);
  assert.match(result.stderr, /src\/comments\.ts:2/);
  assert.match(result.stderr, /page\.html:1/);
  assert.match(result.stderr, /src\/styles\.css:1/);
});

test("does not let apostrophes hide HTML or Markdown comments", () => {
  const directory = createRepository();
  writeFixture(
    directory,
    "page.html",
    "What's new? <!-- 中文 --><script>// 日本語</script><style>/* 한국어 */</style>\n",
  );
  writeFixture(
    directory,
    "GUIDE.md",
    "## English\n\nEnglish guide.\n\n## 中文\n\n中文指南。\n\nWhat's new? <!-- 中文 -->\n",
  );
  command(directory, ["git", "add", "page.html", "GUIDE.md"]);
  const result = check(directory, "--staged");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /page\.html:1/);
  assert.match(result.stderr, /GUIDE\.md:9/);
});

test("checks slash and block comments in SCSS, Less, and JSONC", () => {
  const directory = createRepository();
  writeFixture(directory, "src/styles.scss", "// 中文\n.a { /* 日本語 */ }\n");
  writeFixture(directory, "src/styles.less", "// 한국어\n.a { /* 中文 */ }\n");
  writeFixture(
    directory,
    "config.jsonc",
    '// 中文\n{ /* 日本語 */ "enabled": true }\n',
  );
  command(directory, [
    "git",
    "add",
    "src/styles.scss",
    "src/styles.less",
    "config.jsonc",
  ]);
  const result = check(directory, "--staged");
  assert.equal(result.status, 1);
  for (const path of ["src/styles.scss", "src/styles.less", "config.jsonc"]) {
    assert.match(result.stderr, new RegExp(`${path.replace(".", "\\.")}:1`));
    assert.match(result.stderr, new RegExp(`${path.replace(".", "\\.")}:2`));
  }
});

test("checks fenced-code comments in Markdown", () => {
  const directory = createRepository();
  writeFixture(
    directory,
    "GUIDE.md",
    "## English\n\nEnglish guide.\n\n## 中文\n\n中文指南。\n\n```ts\n// 中文\n```\n",
  );
  command(directory, ["git", "add", "GUIDE.md"]);
  const result = check(directory, "--staged");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /GUIDE\.md:10/);
});

test("checks Python comments in Markdown fenced code", () => {
  const directory = createRepository();
  writeFixture(
    directory,
    "PYTHON.md",
    "## English\n\nEnglish guide.\n\n## 中文\n\n中文指南。\n\n```python\n# 中文\n```\n",
  );
  command(directory, ["git", "add", "PYTHON.md"]);
  const result = check(directory, "--staged");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /PYTHON\.md:10/);
});

test("rejects Markdown without a translation pair or bilingual sections", () => {
  const directory = createRepository();
  writeFixture(directory, "GUIDE.md", "# English-only guide\n");
  command(directory, ["git", "add", "GUIDE.md"]);
  const result = check(directory, "--staged");
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /Documentation requires a non-empty paired Chinese\/English Markdown file/,
  );
});

test("requires paired documentation HTML files", () => {
  const directory = createRepository();
  writeFixture(
    directory,
    "docs/index.html",
    '<html lang="zh-CN"><body>中文</body></html>\n',
  );
  command(directory, ["git", "add", "docs/index.html"]);
  const result = check(directory, "--staged");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /docs\/en\/index\.html/);

  writeFixture(
    directory,
    "docs/en/index.html",
    '<html lang="en"><body>English</body></html>\n',
  );
  command(directory, ["git", "add", "docs/en/index.html"]);
  assert.equal(check(directory, "--staged").status, 0);
});

test("rejects non-Latin commit-message bodies", () => {
  const directory = createRepository();
  writeFixture(directory, "message", "Add policy validation\n\n中文 body\n");
  const result = check(directory, "--message=message");
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /Commit message body must use Latin-script English/,
  );
});

test("requires the configured repository identity for commit hooks", () => {
  const directory = createRepository();
  command(directory, ["git", "config", "user.name", "another-user"]);
  writeFixture(directory, "message", "Add policy validation\n");
  const result = check(directory, "--message=message");
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /Git author identity must be avatr-ai <avatr@skymythos\.ai>/,
  );
});

test("uses Git author and committer environment overrides", () => {
  const directory = createRepository();
  writeFixture(directory, "message", "Add policy validation\n");
  const result = checkWithEnvironment(directory, ["--message=message"], {
    GIT_AUTHOR_NAME: "another-user",
    GIT_AUTHOR_EMAIL: "another@example.test",
    GIT_COMMITTER_NAME: "another-user",
    GIT_COMMITTER_EMAIL: "another@example.test",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Git author identity must be avatr-ai/);
  assert.match(result.stderr, /Git committer identity must be avatr-ai/);
});

test("does not require a configured identity for working-tree scans", () => {
  const directory = createRepository();
  command(directory, ["git", "config", "--unset", "user.name"]);
  command(directory, ["git", "config", "--unset", "user.email"]);
  assert.equal(check(directory).status, 0);
});

test("uses the index for staged checks even when the working tree differs", () => {
  const directory = createRepository();
  writeFixture(
    directory,
    "src/app.ts",
    "// English staged comment\nconst value = 1;\n",
  );
  command(directory, ["git", "add", "src/app.ts"]);
  writeFixture(
    directory,
    "src/app.ts",
    "// 中文 working tree comment\nconst value = 1;\n",
  );
  assert.equal(check(directory, "--staged").status, 0);
  assert.equal(check(directory).status, 1);

  command(directory, ["git", "add", "src/app.ts"]);
  writeFixture(
    directory,
    "src/app.ts",
    "// English working tree comment\nconst value = 1;\n",
  );
  assert.equal(check(directory, "--staged").status, 1);
  assert.equal(check(directory).status, 0);
});

test("checks commit history in an isolated temporary repository", () => {
  const directory = createRepository();
  writeFixture(
    directory,
    "src/app.ts",
    "// English comment\nconst value = 1;\n",
  );
  command(directory, ["git", "add", "src/app.ts"]);
  command(directory, [
    "git",
    "commit",
    "--quiet",
    "-m",
    "Add fixture",
    "-m",
    "中文 body",
  ]);
  const result = check(directory, "--history=HEAD");
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /Commit [0-9a-f]+ body must use Latin-script English/,
  );
});

test("checks historical author and committer identities", () => {
  const directory = createRepository();
  writeFixture(
    directory,
    "src/app.ts",
    "// English comment\nconst value = 1;\n",
  );
  command(directory, ["git", "add", "src/app.ts"]);
  command(directory, ["git", "commit", "--quiet", "-m", "Add fixture"], {
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "another-user",
      GIT_AUTHOR_EMAIL: "another@example.test",
    },
  });
  const result = check(directory, "--history=HEAD");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /author must be avatr-ai <avatr@skymythos\.ai>/);
});
