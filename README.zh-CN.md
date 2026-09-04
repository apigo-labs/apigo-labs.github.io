# APIGO 开源项目官网

[English](README.md) | [简体中文](README.zh-CN.md)

APIGO 企业级 MaaS 开源计划的官网入口，介绍 Community 基础能力、现有 APIGO Cloud 与企业私有化方案。

**贡献硬约束：**代码注释和 commit 全文必须使用英文，文档必须提供等价的英文与简体中文版本。贡献前阅读 [CONTRIBUTING.zh-CN.md](CONTRIBUTING.zh-CN.md) 与 [AGENTS.md](AGENTS.md)。

## 本地开发

需要 Node.js 22.12+ 和 npm。

```bash
npm ci
npm run setup
npm run dev
```

`npm run setup` 配置仓库本地提交身份与受版本控制的 Git hooks，不修改全局凭据。开发服务器默认仅监听本机，以终端输出的地址为准。

```bash
npm run policy:check
npm run policy:test
npm run build
npm run preview
npm run format:check
```

## 页面与实现

- `/`：开源 MaaS slogan、流动光影，以及多供应商接入 / 员工 Token FinOps / 商业智能路由三项展示。
- `/platform/`：三项产品能力、可切换的部署架构。
- `/opensource/`：开源仓库、开放边界与社区 FAQ。
- `/editions/`：三种版本和默认展开的完整能力对比。
- `/docs/` 与 `/docs/en/`：内容等价的中英文指南、Python SDK 接入示例、代码复制与 Community 发布说明。
- `/enterprise/`：私有化方案和本地邮件草稿生成器。
- `/resources/`：接入指南、架构、版本与代码资料。
- `/community/`：开源仓库、参与方式与社区 FAQ。
- `/404.html`：未找到页面。
- `src/style.css`：全站基础、明暗主题、导航、文档和表单。
- `src/editorial.css`：独立栏目的开放排版、细分隔线和响应式布局。
- `src/immersive.css` / `src/immersive.ts`：首页连续深色章节、光纤主视觉、滚动微视差、章节定位与路由路径展示。
- `src/main.ts`：移动导航、主题与动效偏好、商业路由策略示意切换、光标高光、架构标签页、复制与邮件草稿；通用控件跟随指南语言。

使用 Vite + TypeScript 与静态 HTML。无需数据库、环境密钥、第三方字体、分析脚本或外部图片。构建产物可部署到支持目录索引的静态服务器。自定义域名尚未指定；后续绑定时配置 canonical、社交分享图片及 sitemap。请将服务器的未找到页面映射到 `404.html` 并返回 HTTP 404。

企业表单仅在本地整理内容，通过 `mailto:sales@apigo.ai` 打开邮件草稿，由访问者自行发送；不上传、持久化或自动发送信息。无邮件客户端时可以复制需求内容。

顶部固定为产品、文档、企业、资源、社区五个独立栏目；开源说明与版本对比保留为二级页面。首页 FinOps 和路由图为产品 / 策略示意，不是实时业务结果。产品营销页面目前使用中文，公开文档提供中英文。

## GitHub Pages 发布

公开站点地址：[opensource.apigo.ai](https://opensource.apigo.ai/)。仓库 Settings → Pages 的 Source 使用 GitHub Actions。

自定义域名配置：

1. 在 Settings → Pages → Custom domain 保存 `opensource.apigo.ai`（不带协议或路径）。
2. 在 `apigo.ai` 的 DNS 中保留名为 `opensource`、指向 `apigo-labs.github.io` 的 CNAME 记录。
3. 等待 DNS 检查与证书签发，然后启用 Enforce HTTPS；验证 HTTPS 站点及 `https://apigo-labs.github.io/` 的跳转。

当前自定义 Actions 发布不需要仓库 `CNAME` 文件，以 Pages 设置为准。

`.github/workflows/pages.yml` 在 main 推送或手动触发时检查语言规范、测试、格式、构建与本地链接，再上传并发布 `dist/`。部署使用 `github-pages` 环境；Pages 写权限与 OIDC 仅授予部署任务，不需要个人访问令牌。

构建前缀取自 `actions/configure-pages` 的 `base_path`。HTML 站内链接使用 `%BASE_URL%`，脚本内链接使用 `import.meta.env.BASE_URL`，图片与样式由 Vite 处理。本地开发与组织站点均使用 `/`。仓库名称为 `apigo-labs.github.io`，本地目录可继续命名为 `website`。下面的可选子路径构建用于验证可移植性，不是生产访问地址。

```bash
npm run build -- --base=/website/ --outDir=output/pages-dist
node scripts/verify-site.mjs output/pages-dist /website/
npm run preview -- --base=/website/ --outDir=output/pages-dist --port=4175
```

示例本地验证地址为 `http://127.0.0.1:4175/website/`，端口占用时选择其它空闲端口。构建检查工作流同时验证 `/` 和 `/website/` 两种路径下的全部页面、图片、脚本、样式与站内锚点。

## 内容边界

Community 尚在分阶段开放。本官网不虚构发行包、安装命令、许可证、客户数字或性能结论。AI Gateway 与控制面仓库的状态以对应发布说明为准。

Lyra 引擎、自动编排与商业策略不属于 Community；企业私有化按闭源容器或二进制授权评估，不承诺交付引擎源代码。企业治理、安全集成和 SLA 须按合同确认。云服务可用能力与价格以 [apigo.ai](https://www.apigo.ai/) 为准。

本仓库暂未选择开源许可证。公开可见不等同于授予开源许可；待权利人确认后添加 LICENSE。也不将本官网的许可决定套用于其它 APIGO 组件。

## 当前开发副本的 Git 配置

本受管理仓库的 author 与 committer 均使用 `avatr-ai <avatr@skymythos.ai>`。`npm run setup` 安装以下本地配置与语言、身份检查 hooks：

```bash
git config --local user.name avatr-ai
git config --local user.email avatr@skymythos.ai
git config --local user.useConfigOnly true
git config --local core.hooksPath .githooks
```

当前副本使用 `git@github-enterprises:apigo-labs/apigo-labs.github.io.git`，已有 SSH 别名 `github-enterprises` 连接 `ssh.github.com:443`。SSH 凭据用于认证连接，Git author 和 committer 元数据用于标识提交。克隆后重新运行本地配置，现有 SSH 凭据保留在仓库之外。

## 材质与动画

首页采用连续的石墨色空间，以大幅光纤主视觉呈现模型能力的汇聚与流动。接入、FinOps、路由分别通过开放连线、成本归属表和可切换路径展开，Community / Cloud / Enterprise 采用整行入口。内容不使用层叠卡片；独立栏目用大字标题、留白和细分隔线组织信息。官方 Logo 保持原色，蓝紫橙只在光线和交互细节中呼应。

本网站在浏览器中实现 Fluent 风格的材质效果，不依赖 Windows 原生 Mica 或访问桌面壁纸。材质语义参考 [Mica](https://learn.microsoft.com/en-us/windows/apps/design/style/mica) 与 [Acrylic](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic)：中性漫射底色与半透明导航区分层使用。

- 首页固定使用深色视觉；独立页面默认跟随系统，可手动切换明暗，在浏览器 localStorage 保存偏好。
- 首屏包含光纤缓动与光标微视差，接入和路由展示流动路径；章节导航跟随浏览器原生滚动，内容渐次显现，不接管滚轮。
- 可以暂停背景动画。遵守 `prefers-reduced-motion`，后台页面暂停动效；手机不启用指针微视差。
- 不支持 backdrop-filter 的浏览器使用实色导航回退；所有链接和表单仍可用。

## 品牌素材

`public/brand/apigo-logo.png` 为用户提供的官方透明 Logo 原图（588 × 164），保持原始像素和比例；导航、页脚、首屏与产品图共用这一素材。站点图标同样使用完整原图，不再使用临时绘制的 A 标识。

`public/media/maas-fiber-flow.png` 为本轮生成的装饰性主视觉（1672 × 941），与官方 Logo 分开保存。视觉不包含客户标识或实际业务数据；图片通过本地静态资源加载，首屏预加载，减少动画时保留静态画面。
