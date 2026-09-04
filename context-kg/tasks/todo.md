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

# Organization root site / 组织根站点

## English

### Plan

- [x] Confirm the approved repository rename and root-site requirements.
- [x] Update repository links and bilingual deployment documentation; retain root and subpath build coverage.
- [x] Rename the GitHub repository to `apigo-labs.github.io` and update the local SSH remote.
- [x] Push a new English commit, verify GitHub Actions, and compare the published root-site artifacts.

### Review

The user approved renaming the repository so the site can use `https://apigo-labs.github.io/`. Keep the local `website` directory and normal compliant commit history. The Pages workflow already derives the deployment prefix from GitHub configuration.

The repository and SSH remote now use `apigo-labs/apigo-labs.github.io`. Commit `6a4656e` passed Website checks and Pages deployment. All 15 root-site files, including the custom 404 response, match the local root build byte for byte. Browser checks confirmed root-based navigation, Chinese/English guide switching, the new repository link, and no mobile overflow or page errors. Local validation passed 15 policy tests, formatting, TypeScript, and both root/subpath builds (10 pages, 246 local links/assets each).

## 中文

### 计划

- [x] 确认用户已同意仓库改名及根站点要求。
- [x] 更新仓库链接和双语部署文档，保留根路径与子路径构建覆盖。
- [x] 将 GitHub 仓库改名为 `apigo-labs.github.io`，更新本地 SSH remote。
- [x] 推送新的英文提交，验证 GitHub Actions 并比对已发布的根站点产物。

### Review

用户同意通过仓库改名使用 `https://apigo-labs.github.io/`。保留本地 `website` 目录与正常的合规提交历史。Pages 工作流已从 GitHub 配置获取部署前缀。

仓库与 SSH remote 已使用 `apigo-labs/apigo-labs.github.io`。提交 `6a4656e` 的 Website checks 与 Pages 发布均成功。根站点 15 个文件（含自定义 404 响应）与本地根路径构建逐字节一致。浏览器确认根路径导航、中英文指南切换和新仓库链接有效，移动端无横向溢出、无页面异常。本地通过 15 项规范测试、格式检查、TypeScript 和根路径/子路径构建（各 10 页、246 条本地链接/资源）。

# Custom domain / 自定义域名

## English

- [x] Check DNS and the current GitHub Pages deployment.
- [x] Bind `opensource.apigo.ai` in Pages and verify DNS and HTTPS.
- [x] Update bilingual deployment instructions, push the documentation, and verify public access.

### Review

The existing CNAME points to `apigo-labs.github.io`. The site uses a custom GitHub Actions deployment; the custom domain is configured in Pages settings and does not require a repository CNAME file. GitHub confirmed a successful DNS check and Enforce HTTPS was enabled after certificate provisioning. HTTP requests redirect to HTTPS. All 15 files fetched over HTTPS, including the custom 404 response, match the local root build. Both deployment-prefix builds, 15 policy tests, formatting, and TypeScript checks passed.

## 中文

- [x] 检查 DNS 与当前 GitHub Pages 发布状态。
- [x] 在 Pages 绑定 `opensource.apigo.ai` 并验证 DNS 与 HTTPS。
- [x] 更新双语部署说明、推送文档并验证公开访问。

### Review

现有 CNAME 指向 `apigo-labs.github.io`。站点通过自定义 GitHub Actions 发布；自定义域名在 Pages 设置中配置，不需要仓库 CNAME 文件。GitHub 已确认 DNS 检查成功，证书就绪后已开启 Enforce HTTPS，HTTP 请求会跳转至 HTTPS。通过 HTTPS 获取的全部 15 个文件（包括自定义 404 响应）均与本地根路径构建一致。两种部署前缀构建、15 项规范测试、格式与 TypeScript 检查均通过。

# Digital homepage motion / 首页数字流动效果

## English

### Specification and plan

Keep the current slogan, immersive composition, official Logo, and MaaS product boundaries. Replace the dominant photographic drifting motion with crisp routing traces, discrete packet trains, and restrained node responses. Preserve the original image as a quiet fallback. Do not add simulated business metrics or decorative cards.

- [x] Locate motion controls and inspect the existing hero visual.
- [x] Implement responsive digital signal paths with shared pause/reduced-motion controls and offscreen suspension.
- [x] Verify desktop/mobile appearance, actual animation progression and freezing, navigation, both builds, and policy checks.
- [x] Publish and verify the custom-domain site.

### Review

CodeGraph sync completed with 10 files and 121 nodes. The motion chain is `src/main.ts` → `updateMotion` → root `data-motion`; `src/immersive.ts` controls hero parallax and section navigation. HTML/CSS fall outside the graph index and are inspected directly. Scope is the homepage visual only. The hero now contains 28 SVG signal lanes, packet trains, seven nodes, and a restrained grid/scan. Successive browser screenshots confirm packet movement; pause persists across reloads, and the hero suspends offscreen and resumes on return. Desktop at 1265/1440 px and mobile at 320/390 px have no horizontal overflow. Reduced-motion behavior was checked against the existing shared CSS and preference logic; system preference emulation was not performed. Both deployment-prefix builds pass with 10 pages and 246 local references each; all 15 policy tests, formatting, and TypeScript checks pass. Commit `ed5e86b` was published by successful Pages run `33858538860`. All 15 files served over HTTPS match the local root build. A production browser confirms 28 packet paths and seven nodes with the new asset bundle.

## 中文

### 规格与计划

保留当前 slogan、沉浸式构图、官方 Logo 与 MaaS 能力边界。将占主导的照片漂移动效调整为清晰的路由线、离散数据脉冲与克制的节点响应，原图作为低强度底层与降级展示。不添加虚构业务指标或装饰卡片。

- [x] 定位动效控制，检查现有首屏视觉。
- [x] 实现响应式数字信号路径，接入暂停/减少动画及离屏暂停。
- [x] 验证桌面/手机视觉、实际动画推进与冻结、导航、两种构建和规范检查。
- [x] 发布并验证自定义域名站点。

### Review

CodeGraph 同步完成，覆盖 10 个文件、121 个节点。动效链路为 `src/main.ts` → `updateMotion` → 根节点 `data-motion`；`src/immersive.ts` 控制首屏视差与章节导航。HTML/CSS 不在图索引内，已直接检查。本次范围仅为首页视觉。首屏新增 28 条 SVG 信号线路、数据脉冲、7 个节点及克制的网格/扫描线。连续浏览器截图确认数据包移动；暂停状态在刷新后保留，离屏暂停、返回恢复。1265/1440 像素桌面与 320/390 像素手机视口无横向溢出。减少动画行为已检查现有共享 CSS 与偏好控制逻辑，未模拟系统偏好。两种部署前缀构建各验证 10 个页面和 246 个本地引用；15 项规范测试、格式与 TypeScript 检查均通过。提交 `ed5e86b` 已通过 Pages 任务 `33858538860` 成功发布。HTTPS 返回的全部 15 个文件与本地根路径构建一致，生产浏览器确认新资源包已加载，并生成 28 条数据路径与 7 个节点。

# Restore fiber motion with particles / 恢复光纤并叠加粒子

## English

- [x] Confirm the correction: retain the original fiber image, brightness, drift, and composition.
- [x] Remove the digital circuit overlay and add sparse glowing particles along curved fiber paths.
- [x] Verify desktop/mobile, pause controls, required checks, and publication.

### Review

The previous circuit treatment changed the visual identity too much. This correction restores the original base and adds particles only. Desktop and 390 px mobile previews confirm the restored artwork, no circuit overlay, and no horizontal overflow. The pause control freezes both the image and particles. Both prefix builds and 15 policy tests pass. Pages run `33859685330` successfully published commit `9507abd`. All 15 HTTPS resources match the local build. The production DOM confirms the original 0.84 image opacity and fiber drift, 22 particle paths, and no circuit tracks.

## 中文

- [x] 确认纠正范围：保留原光纤图片、亮度、缓动与构图。
- [x] 移除数字电路覆盖层，仅沿弧形光路添加稀疏发光粒子。
- [x] 验证桌面/手机、暂停控制、必需检查与发布。

### Review

上一版电路化处理过度改变了主视觉，本次恢复原有基底，只添加粒子。桌面与 390 像素手机预览确认原图恢复、电路覆盖层移除且无横向溢出；暂停按钮同时冻结原图与粒子。两种前缀构建与 15 项规范测试通过，Pages 任务 `33859685330` 已成功发布提交 `9507abd`，全部 15 个 HTTPS 资源与本地构建一致。生产 DOM 确认原图透明度恢复为 0.84、光纤缓动启用、存在 22 条粒子路径且电路线条已移除。
