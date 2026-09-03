import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsers as babelParsers } from "prettier/plugins/babel";
import { parsers as typescriptParsers } from "prettier/plugins/typescript";

const expectedIdentity = {
  name: "avatr-ai",
  email: "avatr@skymythos.ai",
};

const codeExtensions = new Set([
  ".js",
  ".cjs",
  ".mjs",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
  ".less",
  ".html",
  ".htm",
  ".yaml",
  ".yml",
  ".jsonc",
  ".sh",
  ".bash",
  ".zsh",
  ".py",
]);

const fenceExtensions = {
  javascript: ".js",
  js: ".js",
  jsx: ".jsx",
  typescript: ".ts",
  ts: ".ts",
  tsx: ".tsx",
  css: ".css",
  scss: ".scss",
  less: ".less",
  html: ".html",
  yaml: ".yaml",
  yml: ".yaml",
  jsonc: ".jsonc",
  shell: ".sh",
  sh: ".sh",
  bash: ".bash",
  zsh: ".zsh",
  python: ".py",
  py: ".py",
};

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: options.cwd ?? process.cwd(),
    encoding: options.encoding ?? "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 20 * 1024 * 1024,
  });
}

function lineAt(text, offset) {
  return text.slice(0, offset).split("\n").length;
}

function firstDisallowedLanguageCharacter(text) {
  for (const character of text) {
    if (
      /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(
        character,
      ) ||
      (/\p{Letter}/u.test(character) &&
        !/\p{Script_Extensions=Latin}/u.test(character))
    ) {
      return character;
    }
  }
  return undefined;
}

function extractDelimitedComments(text, open, close, respectQuotes = true) {
  const comments = [];
  let quote = "";
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (respectQuotes && quote) {
      if (character === "\\") index++;
      else if (character === quote) quote = "";
      continue;
    }
    if (respectQuotes && (character === '"' || character === "'")) {
      quote = character;
      continue;
    }
    if (!text.startsWith(open, index)) continue;
    const end = text.indexOf(close, index + open.length);
    if (end === -1) break;
    comments.push({
      text: text.slice(index + open.length, end),
      line: lineAt(text, index),
    });
    index = end + close.length - 1;
  }
  return comments;
}

function extractHashComments(text) {
  const comments = [];
  let offset = 0;
  for (const line of text.split("\n")) {
    let quote = "";
    for (let index = 0; index < line.length; index++) {
      const character = line[index];
      if (quote) {
        if (character === "\\") index++;
        else if (character === quote) quote = "";
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === "#") {
        comments.push({
          text: line.slice(index + 1),
          line: lineAt(text, offset + index),
        });
        break;
      }
    }
    offset += line.length + 1;
  }
  return comments;
}

async function extractJavaScriptComments(text, extension) {
  const parser = [".ts", ".tsx"].includes(extension)
    ? typescriptParsers.typescript
    : babelParsers.babel;
  const ast = parser.parse(text, {});
  return (ast.comments ?? []).map((comment) => ({
    text: comment.value,
    line: comment.loc.start.line,
  }));
}

function findHtmlTagEnd(text, start) {
  let quote = "";
  for (let index = start + 1; index < text.length; index++) {
    const character = text[index];
    if (quote) {
      if (character === "\\") index++;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === ">") return index;
  }
  return -1;
}

async function extractHtmlComments(text) {
  const comments = [];
  for (let index = 0; index < text.length; index++) {
    if (text.startsWith("<!--", index)) {
      const end = text.indexOf("-->", index + 4);
      if (end === -1) break;
      comments.push({
        text: text.slice(index + 4, end),
        line: lineAt(text, index),
      });
      index = end + 2;
      continue;
    }
    if (text[index] !== "<") continue;
    const tagEnd = findHtmlTagEnd(text, index);
    if (tagEnd === -1) break;
    const rawText = /^<(script|style)\b/i.exec(text.slice(index, tagEnd + 1));
    if (!rawText) {
      index = tagEnd;
      continue;
    }
    const closing = new RegExp(`<\\/\\s*${rawText[1]}\\s*>`, "ig");
    closing.lastIndex = tagEnd + 1;
    const closingMatch = closing.exec(text);
    const contentEnd = closingMatch?.index ?? text.length;
    const content = text.slice(tagEnd + 1, contentEnd);
    const extension = rawText[1].toLowerCase() === "script" ? ".js" : ".css";
    const embedded = await extractCodeComments(content, extension);
    for (const comment of embedded) {
      comments.push({
        text: comment.text,
        line: lineAt(text, tagEnd + 1) + comment.line - 1,
      });
    }
    index = closingMatch ? closing.lastIndex - 1 : text.length;
  }
  return comments;
}

function extractSlashLineComments(text) {
  const comments = [];
  let offset = 0;
  for (const line of text.split("\n")) {
    let quote = "";
    for (let index = 0; index < line.length - 1; index++) {
      const character = line[index];
      if (quote) {
        if (character === "\\") index++;
        else if (character === quote) quote = "";
        continue;
      }
      if (character === '"' || character === "'") {
        quote = character;
        continue;
      }
      if (line.startsWith("//", index)) {
        comments.push({
          text: line.slice(index + 2),
          line: lineAt(text, offset + index),
        });
        break;
      }
    }
    offset += line.length + 1;
  }
  return comments;
}

async function extractCodeComments(text, extension) {
  if ([".js", ".cjs", ".mjs", ".jsx", ".ts", ".tsx"].includes(extension)) {
    return extractJavaScriptComments(text, extension);
  }
  if ([".css", ".scss", ".less", ".jsonc"].includes(extension)) {
    const comments = extractDelimitedComments(text, "/*", "*/");
    if ([".scss", ".less", ".jsonc"].includes(extension)) {
      comments.push(...extractSlashLineComments(text));
    }
    return comments;
  }
  if ([".html", ".htm"].includes(extension)) return extractHtmlComments(text);
  if ([".yaml", ".yml", ".sh", ".bash", ".zsh", ".py"].includes(extension)) {
    return extractHashComments(text);
  }
  return [
    ...extractDelimitedComments(text, "<!--", "-->"),
    ...extractDelimitedComments(text, "/*", "*/"),
    ...extractHashComments(text),
  ];
}

async function extractMarkdownCodeComments(text) {
  const comments = [];
  const fence = /(^|\n)(`{3,}|~{3,})([^\n]*)\n([\s\S]*?)\n\2(?=\n|$)/g;
  let previousFenceEnd = 0;
  for (const match of text.matchAll(fence)) {
    const prose = text.slice(previousFenceEnd, match.index);
    for (const comment of extractDelimitedComments(
      prose,
      "<!--",
      "-->",
      false,
    )) {
      comments.push({
        text: comment.text,
        line: lineAt(text, previousFenceEnd) + comment.line - 1,
      });
    }
    const language = match[3].trim().split(/\s+/)[0].toLowerCase();
    const extension = fenceExtensions[language];
    previousFenceEnd = match.index + match[0].length;
    if (!extension) continue;
    const content = match[4];
    const contentOffset = match.index + match[0].indexOf(content);
    const embedded = await extractCodeComments(content, extension);
    for (const comment of embedded) {
      comments.push({
        text: comment.text,
        line: lineAt(text, contentOffset) + comment.line - 1,
      });
    }
  }
  for (const comment of extractDelimitedComments(
    text.slice(previousFenceEnd),
    "<!--",
    "-->",
    false,
  )) {
    comments.push({
      text: comment.text,
      line: lineAt(text, previousFenceEnd) + comment.line - 1,
    });
  }
  return comments;
}

function hasNonEmptySection(text, heading) {
  const headingPattern = new RegExp(`^## ${heading}\\s*$`, "m");
  const match = headingPattern.exec(text);
  if (!match) return false;
  const remainder = text.slice(match.index + match[0].length);
  const nextHeading = remainder.search(/^##\s+/m);
  return (
    (nextHeading === -1 ? remainder : remainder.slice(0, nextHeading)).trim()
      .length > 0
  );
}

function isBilingualMarkdown(text) {
  return (
    hasNonEmptySection(text, "English") && hasNonEmptySection(text, "中文")
  );
}

function documentPair(path) {
  if (path.endsWith(".zh-CN.md")) return path.replace(/\.zh-CN\.md$/, ".md");
  if (path.endsWith(".md")) return path.replace(/\.md$/, ".zh-CN.md");
  if (!path.startsWith("docs/") || !path.endsWith(".html")) return undefined;
  if (path.startsWith("docs/en/")) return path.replace(/^docs\/en\//, "docs/");
  return path.replace(/^docs\//, "docs/en/");
}

function isDocumentationHtml(path) {
  return path.startsWith("docs/") && path.endsWith(".html");
}

function codeExtension(path) {
  if (path.startsWith(".githooks/")) return ".sh";
  return extname(path).toLowerCase();
}

function isCheckedTextPath(path) {
  return path.endsWith(".md") || codeExtensions.has(codeExtension(path));
}

function validateDocument(path, text, files) {
  const violations = [];
  if (path.endsWith(".md") && !isBilingualMarkdown(text)) {
    const pair = documentPair(path);
    if (!pair || !files.get(pair)?.trim()) {
      violations.push(
        `${path}: Documentation requires a non-empty paired Chinese/English Markdown file or non-empty ## English and ## 中文 sections.`,
      );
    }
  }
  if (isDocumentationHtml(path)) {
    const pair = documentPair(path);
    if (!files.get(pair)?.trim()) {
      violations.push(
        `${path}: Documentation HTML requires a non-empty paired Chinese or English file (${pair}).`,
      );
    }
  }
  return violations;
}

export async function checkPolicyFiles(files) {
  const violations = [];
  const contentByPath = new Map(files);
  for (const [path, text] of files) {
    if (path.endsWith(".md")) {
      for (const comment of await extractMarkdownCodeComments(text)) {
        const character = firstDisallowedLanguageCharacter(comment.text);
        if (character) {
          violations.push(
            `${path}:${comment.line}: Code comments must use Latin-script English; found "${character}".`,
          );
        }
      }
      violations.push(...validateDocument(path, text, contentByPath));
      continue;
    }
    const extension = codeExtension(path);
    if (!codeExtensions.has(extension)) continue;
    for (const comment of await extractCodeComments(text, extension)) {
      const character = firstDisallowedLanguageCharacter(comment.text);
      if (character) {
        violations.push(
          `${path}:${comment.line}: Code comments must use Latin-script English; found "${character}".`,
        );
      }
    }
    violations.push(...validateDocument(path, text, contentByPath));
  }
  return violations;
}

function trackedPaths() {
  return git(["ls-files", "-z"]).split("\0").filter(Boolean);
}

function workingTreeFiles() {
  return trackedPaths()
    .filter(isCheckedTextPath)
    .filter((path) => existsSync(path))
    .map((path) => [path, readFileSync(path, "utf8")]);
}

function stagedFiles() {
  const files = [];
  for (const path of trackedPaths().filter(isCheckedTextPath)) {
    files.push([path, git(["show", `:${path}`])]);
  }
  return files;
}

function validateIdentity(name, email, label) {
  if (name === expectedIdentity.name && email === expectedIdentity.email)
    return [];
  return [
    `${label} must be ${expectedIdentity.name} <${expectedIdentity.email}>; received ${name} <${email}>.`,
  ];
}

function currentIdentityViolations() {
  const identities = [
    ["GIT_AUTHOR_IDENT", "Git author identity"],
    ["GIT_COMMITTER_IDENT", "Git committer identity"],
  ];
  return identities.flatMap(([variable, label]) => {
    const match = /^(.*) <([^<>]+)> \d+ [+-]\d{4}$/.exec(
      git(["var", variable]).trim(),
    );
    if (!match) {
      return [`${label} must use the configured Git identity format.`];
    }
    return validateIdentity(match[1], match[2], label);
  });
}

export function validateCommitMessage(message, label = "Commit message") {
  const lines = message.replace(/\r\n/g, "\n").split("\n");
  const subject = lines.find((line) => line.trim().length > 0) ?? "";
  const body = lines
    .slice(lines.indexOf(subject) + 1)
    .join("\n")
    .trim();
  const violations = [];
  if (!subject) violations.push(`${label} subject must not be empty.`);
  for (const [part, value] of [
    ["subject", subject],
    ["body", body],
  ]) {
    const character = firstDisallowedLanguageCharacter(value);
    if (character) {
      violations.push(
        `${label} ${part} must use Latin-script English; found "${character}".`,
      );
    }
  }
  return violations;
}

function historyViolations(revision) {
  const violations = [];
  const commits = git(["rev-list", "--reverse", revision])
    .trim()
    .split("\n")
    .filter(Boolean);
  for (const commit of commits) {
    const fields = git([
      "show",
      "-s",
      "--format=%an%x00%ae%x00%cn%x00%ce%x00%B",
      commit,
    ]).split("\0");
    violations.push(
      ...validateIdentity(fields[0], fields[1], `Commit ${commit} author`),
    );
    violations.push(
      ...validateIdentity(fields[2], fields[3], `Commit ${commit} committer`),
    );
    violations.push(
      ...validateCommitMessage(fields.slice(4).join("\0"), `Commit ${commit}`),
    );
  }
  return violations;
}

function parseArguments(argv) {
  const options = { staged: false, history: undefined, message: undefined };
  for (const argument of argv) {
    if (argument === "--staged") options.staged = true;
    else if (argument.startsWith("--history="))
      options.history = argument.slice("--history=".length);
    else if (argument.startsWith("--message="))
      options.message = argument.slice("--message=".length);
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (
    [options.staged, Boolean(options.history), Boolean(options.message)].filter(
      Boolean,
    ).length > 1
  ) {
    throw new Error(
      "Use only one of --staged, --history=<revision>, or --message=<file>.",
    );
  }
  return options;
}

export async function runPolicy(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  if (options.message) {
    return [
      ...currentIdentityViolations(),
      ...validateCommitMessage(readFileSync(options.message, "utf8")),
    ];
  }
  if (options.history) return historyViolations(options.history);
  const files = options.staged ? stagedFiles() : workingTreeFiles();
  const identityViolations = options.staged ? currentIdentityViolations() : [];
  return [...identityViolations, ...(await checkPolicyFiles(files))];
}

async function main() {
  const violations = await runPolicy();
  if (violations.length > 0) {
    console.error(violations.join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log("Language policy checks passed.");
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) main();
