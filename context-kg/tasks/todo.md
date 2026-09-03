# Language contract and website baseline / 语言规范与官网基线

## English

### Scope

Apply the mandatory language contract to every current and future project under `opensource/`: English code comments and complete commit messages, plus equivalent English and Simplified Chinese documentation. Keep website product UI in its intended language. Preserve the official Logo, immersive design, independent navigation pages, commercial boundaries, and GitHub Pages delivery.

The user explicitly requested replacing the website's previous commit history. Publish one new English initial commit on `main`, retaining the current source snapshot and using `avatr-ai <avatr@skymythos.ai>` as both author and committer. Use an explicit force-with-lease against the observed remote revision. Do not rewrite sibling repositories or global Git authentication.

### Plan

- [x] Inspect repository status, identity, remote refs, and existing documentation.
- [x] Establish bilingual parent and standalone repository contracts.
- [x] Translate repository documentation and add the English public getting-started guide.
- [x] Add versioned hooks, local setup, policy checks, regression tests, and CI gates.
- [x] Verify policy, formatting, root/project-path builds, and public documentation interactions.
- [x] Replace the old `main` history with one compliant initial commit and push with a lease.
- [x] Verify remote history, CI, and the published GitHub Pages artifacts.

### Review

- The parent directory is not a Git repository. Its `AGENTS.md` establishes the local cross-project contract; this website versions its own rules and contribution guides for independent clones.
- The existing `main` had 14 commits and no remote tags or additional branches. History replacement is limited to this website.
- Documentation uses English/Chinese file pairs or explicit bilingual sections. Public guides use `/docs/en/` and `/docs/` with reciprocal links and translated shared controls.
- Automated checks validate comment/message character sets, actual commit identities, documentation counterparts, and the staged snapshot. Human review remains responsible for English prose and semantic translation parity.
- Validation passed: 15 policy regression tests, TypeScript, Prettier, both deployment-prefix builds, and 10 pages with 246 local links/assets. Browser checks confirmed English controls, reciprocal language navigation, copy feedback, and no horizontal overflow at 320, 390, 768, or 1440 pixels.
- The old 14-commit history produced 14 language violations. The replacement root commit passes full-history identity and message checks. The remote exposes only that root commit on `main`, with no other branch or tag.
- Website checks and GitHub Pages deployment completed successfully. All 15 published files, including the custom 404 response, match the local `/website/` build byte for byte.

## 中文

### 范围

为 `opensource/` 下所有现有及未来项目建立语言硬约束：代码注释、commit 全文使用英文，文档提供等价的英文与简体中文。官网产品界面保留其目标语言。保留官方 Logo、沉浸式设计、独立导航页面、商业能力边界及 GitHub Pages 发布。

用户明确要求替换官网此前的提交历史。在 `main` 发布一个新的英文初始提交，保留当前源码快照，author 与 committer 均使用 `avatr-ai <avatr@skymythos.ai>`。使用针对已观察远端版本的显式 force-with-lease。不重写兄弟仓库，不修改全局 Git 认证。

### 计划

- [x] 检查仓库状态、身份、远端引用与现有文档。
- [x] 建立双语父目录规范与独立仓库规范。
- [x] 翻译仓库文档，补充英文公开接入指南。
- [x] 增加版本化 hooks、本地配置、规范检查、回归测试与 CI 门禁。
- [x] 验证规范、格式、根路径/项目路径构建及公开文档交互。
- [x] 将旧 `main` 历史替换为一个合规初始提交，并使用租约推送。
- [x] 验证远端历史、CI 与已发布的 GitHub Pages 产物。

### Review

- 父目录不是 Git 仓库。其 `AGENTS.md` 建立本地跨项目规范；官网独立版本化规则与贡献指南，使单独克隆也保留约束。
- 原 `main` 有 14 条提交，远端没有标签或其它分支。历史替换仅限本官网。
- 文档采用中英文配对文件或明确的双语章节。公开指南位于 `/docs/en/` 与 `/docs/`，提供互相链接及翻译后的共享控件。
- 自动检查覆盖注释/提交字符、实际提交身份、文档对应版本及暂存快照。英文表达和翻译语义等价性仍须人工审查。
- 验证通过：15 项规范回归测试、TypeScript、Prettier、两种部署前缀构建，以及 10 页共 246 条本地链接/资源。浏览器确认英文控件、双向语言导航、复制反馈，并确认 320、390、768、1440 像素无横向溢出。
- 原 14 条提交的历史产生 14 条语言违规；替换后的根提交通过完整历史身份与提交信息检查。远端仅在 `main` 暴露这一条根提交，没有其它分支或标签。
- Website checks 与 GitHub Pages 发布成功。线上 15 个文件（包含自定义 404 响应）与本地 `/website/` 构建逐字节一致。
