# Contributing

[English](CONTRIBUTING.md) | [简体中文](CONTRIBUTING.zh-CN.md)

## Mandatory language contract

These rules apply to every APIGO project under the local `opensource/` directory and are carried into this standalone repository through [AGENTS.md](AGENTS.md).

1. Write every code comment in English, including configuration, scripts, templates, and examples embedded in documentation.
2. Write commit subjects and bodies in English. Review merge and squash messages as well as ordinary commits. Example: `Fix project-site documentation links`.
3. Supply equivalent English and Simplified Chinese documentation. Paired Markdown files use `name.md` for English and `name.zh-CN.md` for Chinese, with reciprocal links. Alternatively, a single document must contain substantive `## English` and `## 中文` sections. Update both versions in the same change.
4. Public documentation uses paired Chinese and English pages with visible reciprocal language links. The current guides are `/docs/` and `/docs/en/`.
5. Localized UI strings, example input, and language-policy test fixtures may contain Chinese. They are not comments or commit prose. All explanatory comments in those files remain English.

Automated checks identify non-Latin comment/message text and missing documentation counterparts. Human review must also verify that prose is English and translations communicate the same information; character checks cannot establish either fact.

## Setup and checks

Requires Git, Node.js 22.12+ and npm. Run from the repository root:

```bash
npm ci
npm run setup
npm run policy:check
npm run policy:test
npm run format:check
npm run build
node scripts/verify-site.mjs dist /
npm run build -- --base=/website/ --outDir=output/pages-dist
node scripts/verify-site.mjs output/pages-dist /website/
```

Setup modifies repository-local Git configuration only. It selects `.githooks` and the required author/committer identity `avatr-ai <avatr@skymythos.ai>`. Keep authentication keys and tokens outside the repository.

The pre-commit hook validates staged content so unstaged edits cannot hide a failing commit. The commit-message hook checks the complete message. CI checks the full reachable history and the language policy before build and publication. Do not disable or bypass these gates to publish a failing change.

## Review requirements

- Confirm that documentation translations were updated together and that public guide language links work at the production root `/` and the optional `/website/` portability prefix.
- Check actual production output and meaningful browser interactions. Preserve reduced motion, mobile layout, keyboard navigation, and the original Logo.
- Distinguish available functionality from planned Community capabilities and contracted commercial delivery. Do not invent licenses, packages, customer data, or performance results.
- Keep task plans and reusable lessons bilingual. Keep temporary screenshots, handoffs, linked worktrees, credentials, and generated build output outside published source.

## Delivery and repository history

Push reviewed changes to `main` to trigger GitHub Pages. Pull requests receive policy and build validation; only the deployment job receives Pages write permissions.

The repository starts from a new English-language initial commit containing the current website and these rules. Future work preserves normal, compliant history. Rewriting public history requires a separate explicit request and a lease against the previously observed remote commit.

The parent `opensource/AGENTS.md` establishes the same rules for current and future sibling projects. A new sibling repository must version its own copy of the contract and add applicable local/CI gates before its first published commit; this website's hooks do not automatically run in another repository.
