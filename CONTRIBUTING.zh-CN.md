# 贡献指南

[English](CONTRIBUTING.md) | [简体中文](CONTRIBUTING.zh-CN.md)

## 语言硬约束

以下规则适用于本地 `opensource/` 下所有 APIGO 项目，并通过 [AGENTS.md](AGENTS.md) 带入可独立克隆的本仓库。

1. 所有代码注释必须使用英文，包括配置、脚本、模板和文档内示例。
2. commit 标题与正文必须使用英文；merge、squash 和普通提交均需审查。例如：`Fix project-site documentation links`。
3. 文档提供等价的英文与简体中文。配对 Markdown 使用 `name.md` 作为英文、`name.zh-CN.md` 作为中文，并相互链接；也可在同一文件内提供内容完整的 `## English` 和 `## 中文` 两节。两个版本在同一次改动中更新。
4. 公开文档采用中英文页面配对，并提供可见的双向语言链接。目前的指南入口为 `/docs/` 和 `/docs/en/`。
5. 本地化 UI 字符串、示例输入和语言规范测试数据可以包含中文，不属于注释或 commit 说明；这些文件中的解释性注释仍须英文。

自动检查可识别注释、提交中的非拉丁文字，以及缺失的文档配对；人工审查还须确认文字确为英文、翻译信息等价。字符检查不能证明这两点。

## 初始化与检查

需要 Git、Node.js 22.12+ 和 npm。在仓库根目录运行：

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

初始化只修改仓库本地 Git 配置，启用 `.githooks`，并设置要求的 author/committer 身份 `avatr-ai <avatr@skymythos.ai>`。认证私钥和 Token 保留在仓库之外。

pre-commit hook 检查暂存内容，未暂存的修正不能掩盖即将提交的违规内容；commit-message hook 检查完整提交信息。CI 在构建与发布前检查全部可达提交历史和语言规范。不能通过关闭或绕过检查来发布不合规改动。

## 审查要求

- 确认文档翻译同步更新，公开指南的语言链接在 `/website/` 前缀下有效。
- 检查真实生产构建及有意义的浏览器交互，保留减少动画、移动布局、键盘导航与官方 Logo。
- 区分已提供功能、规划中的 Community 能力及按合同交付的商业能力；不虚构许可证、发行包、客户数据和性能结果。
- 任务计划和经验采用双语；临时截图、交接、linked worktree、凭据及构建产物不进入发布源码。

## 发布与仓库历史

经过审查的改动推送到 `main` 后触发 GitHub Pages。Pull request 执行规范与构建验证，只有部署任务获得 Pages 写权限。

仓库以一个新的英文初始提交作为起点，包含当前官网与本规范。后续正常保留合规历史；再次重写公开历史需要用户单独明确要求，并对已观察到的远端提交使用 lease 校验。

父目录 `opensource/AGENTS.md` 为现有和未来同级项目建立相同约束。新同级仓库首次发布提交前须将规则纳入自身版本控制并接入适用的本地与 CI 检查；本网站的 hooks 不会自动作用于其它仓库。
