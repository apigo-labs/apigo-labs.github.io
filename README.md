# APIGO Open-source Website

[English](README.md) | [简体中文](README.zh-CN.md)

The entry point for APIGO's enterprise MaaS open-source initiative, covering Community foundations, the existing APIGO Cloud, and enterprise private deployment.

**Contribution contract:** code comments and complete commit messages must be in English. Documentation must have equivalent English and Simplified Chinese versions. Read [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md) before contributing.

## Local development

Requires Node.js 22.12+ and npm.

```bash
npm ci
npm run setup
npm run dev
```

`npm run setup` configures repository-local commit identity and versioned Git hooks. It does not change global credentials. The development server listens on localhost; use the address printed in the terminal.

```bash
npm run policy:check
npm run policy:test
npm run build
npm run preview
npm run format:check
```

## Pages and implementation

- `/`: the open-source MaaS slogan, flowing light, multi-provider integration, employee Token FinOps, and commercial intelligent routing.
- `/platform/`: the three product pillars and selectable deployment architecture.
- `/opensource/`: repositories, open-source boundaries, and community FAQ.
- `/editions/`: three delivery options and an expanded capability comparison.
- `/docs/` and `/docs/en/`: equivalent Chinese and English guides, a Python SDK example, code copying, and Community release status.
- `/enterprise/`: private deployment options and a local email draft generator.
- `/resources/`: integration, architecture, editions, and source references.
- `/community/`: repositories, participation, and community FAQ.
- `/404.html`: the not-found page.
- `src/style.css`: shared foundations, themes, navigation, documentation, and forms.
- `src/editorial.css`: open editorial layouts, separators, and responsive behavior.
- `src/immersive.css` / `src/immersive.ts`: continuous dark chapters, scroll parallax, chapter navigation, and routing paths.
- `src/hero-particles.ts`: sparse glowing particles following curved fiber paths, with offscreen suspension.
- `src/main.ts`: navigation, theme and motion preferences, route selection, architecture tabs, copying, and email drafts. Shared controls follow the guide's language.

Built with Vite, TypeScript, and static HTML. No database, environment secrets, third-party fonts, analytics, or externally hosted images are required. Deploy the build output to a static server with directory indexes. A custom domain has not been selected; configure canonical URLs, social images, and a sitemap when one is added. Serve `404.html` with HTTP 404 for missing pages.

The enterprise form assembles an email locally and opens `mailto:sales@apigo.ai`. The visitor sends it themselves. It does not upload, persist, or automatically send information; visitors can also copy the draft.

The five independent navigation sections are Product, Docs, Enterprise, Resources, and Community. Open-source details and edition comparisons remain secondary pages. FinOps and routing graphics are product illustrations, not live business results. Product marketing pages currently use Chinese; public documentation is bilingual.

## GitHub Pages

Public site: [opensource.apigo.ai](https://opensource.apigo.ai/). The repository's Settings → Pages source is GitHub Actions.

Custom-domain configuration:

1. In Settings → Pages → Custom domain, save `opensource.apigo.ai` (without a scheme or path).
2. In the `apigo.ai` DNS zone, keep a CNAME record named `opensource` pointing to `apigo-labs.github.io`.
3. Wait for the DNS check and certificate issuance, then enable Enforce HTTPS. Verify the HTTPS site and the redirect from `https://apigo-labs.github.io/`.

This custom Actions deployment does not require a repository `CNAME` file; the Pages setting is authoritative.

`.github/workflows/pages.yml` runs on pushes to `main` or manual dispatch. It checks policy, tests, formatting, the production build, and local links before uploading and publishing `dist/`. Deployment uses the `github-pages` environment. Pages write and OIDC permissions are scoped to the deployment job; no personal access token is required.

The build prefix comes from `actions/configure-pages`'s `base_path`. HTML links use `%BASE_URL%`, script-generated links use `import.meta.env.BASE_URL`, and Vite handles image and stylesheet paths. Local development and the organization site both use `/`. The repository is named `apigo-labs.github.io`; the local checkout may remain named `website`. The following optional subpath build checks portability and is not the production URL.

```bash
npm run build -- --base=/website/ --outDir=output/pages-dist
node scripts/verify-site.mjs output/pages-dist /website/
npm run preview -- --base=/website/ --outDir=output/pages-dist --port=4175
```

The example preview URL is `http://127.0.0.1:4175/website/`; choose another free port if needed. CI validates all pages, assets, and local anchors under both `/` and `/website/`.

## Product and licensing boundaries

Community is being opened in stages. This website does not invent release packages, installation commands, licenses, customer counts, or performance claims. AI Gateway and control-plane availability follow their own release notes.

Lyra, automatic orchestration, and commercial strategies are outside Community. Enterprise deployment is evaluated through licensed closed-source containers or binaries and does not promise engine source code. Governance, security integrations, and SLAs require an agreed delivery scope. Cloud capabilities and pricing follow [apigo.ai](https://www.apigo.ai/).

No open-source license has been selected for this repository. Public visibility does not grant an open-source license; add a LICENSE after the rights holder confirms it. This repository's licensing decision does not apply to other APIGO components.

## Repository-local Git configuration

The managed repository uses `avatr-ai <avatr@skymythos.ai>` for both author and committer. `npm run setup` installs these local settings and the language/identity hooks:

```bash
git config --local user.name avatr-ai
git config --local user.email avatr@skymythos.ai
git config --local user.useConfigOnly true
git config --local core.hooksPath .githooks
```

This checkout uses `git@github-enterprises:apigo-labs/apigo-labs.github.io.git`. The existing `github-enterprises` SSH alias connects to `ssh.github.com:443`. SSH credentials authenticate the connection; Git author and committer metadata identify commits. Reapply the local setup after cloning. Keep the existing SSH credentials outside the repository.

## Materials and motion

The homepage uses continuous graphite surfaces and full-width optical fibers to express model requests converging and flowing through an enterprise. Integration, FinOps, and routing use open connections, a cost attribution table, and selectable paths. Community, Cloud, and Enterprise use full-width rows. Editorial pages organize content with large headings, whitespace, and thin separators. Original Logo colors appear in selective light and interaction details.

The browser implements Fluent-inspired materials without Windows-native Mica or wallpaper access. [Mica](https://learn.microsoft.com/en-us/windows/apps/design/style/mica) and [Acrylic](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic) inform the distinction between diffuse neutral surfaces and translucent navigation.

- The homepage remains dark. Other pages follow the system theme and support a saved manual preference.
- The original fiber artwork drifts gently, with sparse glowing particles following curved paths above it. The hero pauses offscreen. Pointer parallax and chapter navigation use native scrolling and never intercept the scroll wheel.
- Background animation can be paused. Reduced-motion preferences and background tabs pause movement; touch devices do not use pointer parallax.
- Browsers without `backdrop-filter` use solid navigation. Links and forms remain usable.

## Brand assets

`public/brand/apigo-logo.png` is the original transparent Logo supplied by the owner (588 × 164). Preserve its pixels, proportions, and colors across navigation, footers, product diagrams, and the site icon.

`public/media/maas-fiber-flow.png` is generated decorative artwork (1672 × 941), stored separately from the official Logo. It contains no customer identities or real usage data. It is served locally and preloaded on the homepage. It remains the dominant hero artwork, with particles added as a separate decorative layer. It remains visible when JavaScript is unavailable. Reduced motion keeps the composition static.

The required fiber background is also served as a lossless WebP (1,419,928 bytes versus the 2,131,310-byte PNG). Decoded RGB pixels are identical to the original and the supplied reference. The WebP is preloaded with high priority; the original PNG remains the picture fallback. Particles never replace the background.
