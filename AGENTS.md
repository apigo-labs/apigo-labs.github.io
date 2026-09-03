# Repository contract / 仓库约束

## English

This repository follows the hard language rules for all APIGO projects beneath `opensource/`:

- Write all code comments and complete Git commit messages in English, including comments in documentation examples and merge/squash commit bodies.
- Maintain every document in equivalent English and Simplified Chinese versions, updated together. Use paired files (`name.md` / `name.zh-CN.md`) or explicit `## English` / `## 中文` sections in one file. Public guides use `/docs/en/` and `/docs/` with reciprocal language links.
- Product UI strings and localized example input may remain Chinese. They must not be mistaken for code comments.
- Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing checks, documentation, Git hooks, or release workflows. Human review must confirm English prose and translation parity in addition to automated checks.
- Use `avatr-ai <avatr@skymythos.ai>` for both Git author and committer in this managed repository. Use the existing `github-enterprises` SSH alias without changing global Git credentials.
- Keep a bilingual plan and review in `context-kg/tasks/todo.md`; record reusable corrections in `context-kg/tasks/lessons.md`. Keep local handoff files and linked worktrees out of commits.
- Run policy checks, their tests, formatting, and both deployment-prefix builds before publishing. Preserve the official Logo, product boundaries, and GitHub Pages workflow.
- These artifact-language rules supersede the inherited Chinese-only output rule. Respond to this user in Chinese.

## 中文

本仓库遵循 APIGO `opensource/` 下所有项目的语言硬约束：

- 所有代码注释和 Git commit 全文使用英文，包括文档示例注释、merge/squash 的标题与正文。
- 每份文档提供等价的英文与简体中文版本，并同步更新。可采用 `name.md` / `name.zh-CN.md` 配对文件，或同文件明确的 `## English` / `## 中文` 两节。公开指南分别位于 `/docs/en/` 与 `/docs/`，并互相提供语言链接。
- 产品界面字符串与本地化示例输入可以保留中文，不将其误判为代码注释。
- 修改检查、文档、Git hooks 或发布流程前阅读 [CONTRIBUTING.zh-CN.md](CONTRIBUTING.zh-CN.md)。自动检查之外，人工确认英文表述和翻译等价性。
- 本受管理仓库的 Git author 与 committer 均使用 `avatr-ai <avatr@skymythos.ai>`。沿用现有 `github-enterprises` SSH 别名，不修改全局 Git 凭据。
- 在 `context-kg/tasks/todo.md` 维护双语计划与 review，在 `context-kg/tasks/lessons.md` 记录可复用纠正；本地交接文件和 linked worktree 不进入提交。
- 发布前通过语言规范及其测试、格式检查和两种部署前缀的构建。保留官方 Logo、产品能力边界和 GitHub Pages 发布流程。
- 本产物语言规范覆盖继承的“仅中文”输出要求，与用户继续使用中文对话。
