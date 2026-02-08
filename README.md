# Sora2 Video 模板

本仓库基于 MkSaaS 的 Next.js 模板，在此基础上扩展了 AI 图像/视频生成、支付计费、本地化、多语言文案以及 Cloudflare 部署脚本等功能。当前默认配置面向 **Sora2 Video** 产品，但该代码库同时作为我们后续孵化新 SaaS 的起点，相比上游 MkSaaS 更贴近自有业务需求。

> 文档默认语言为中文。只有在面向英文市场营销或确需多语言内容时，才保留英文说明。

## 基础模板与参考资料
- 模板来源：[MkSaaS](https://mksaas.com) —— 框架通用用法请查阅官方文档：<https://mksaas.com/docs>
- 产品/业务补充文档统一放在 `content/docs`。若需要更长篇的 SOP、排障指南等，请写入该目录，避免 README 过重。
- 当遇到不明确的行为，先参考官方文档，再在此记录我们特有的差异或约定。

## 快速开始
1. **环境要求**：Node 18+，`pnpm`（若仓库中存在 `.nvmrc` 可按其指定版本）。首次安装依赖执行 `pnpm install`。
2. **环境变量**：将 `env.example` 复制为 `.env` 作为本地默认配置；真实凭证请存放在受控的 Secret 管理工具（例如 1Password、Vault、CI Secrets）。如确需本地 `.env.production`，务必置于 `.gitignore` 管控，并在提交前确认未被纳入 Git。
3. **日常开发**：
   - 启动开发服务：`pnpm dev`
   - 运行单元测试：`pnpm test`
   - 提交前 lint：`pnpm exec biome check <文件或目录>`
4. **类型校验**：改动 TypeScript 类型时执行 `pnpm tsc --noEmit` 或 `pnpm build`。

## 环境变量管理
- `env.example` 已列出全部变量；按需填写后同步至 `.env` 与 `.env.production`。
- 部署前务必确认以下分组：
  - **认证与数据库**：`BETTER_AUTH_*`、`DATABASE_URL`、第三方 OAuth Client ID/Secret。
  - **支付**：`STRIPE_SECRET_KEY`、`STRIPE_WEBHOOK_SECRET`、`NEXT_PUBLIC_STRIPE_PRICE_*` 等价格配置（对应 `src/config/website.tsx`）。
  - **存储**：`STORAGE_*` 用于 Cloudflare R2 或兼容 S3 的服务。
  - **AI 服务商**：`SILICONFLOW_*`、`NANO_BANANA_*`、`KLING_*` 等，应与 `src/lib/ai/` 中的实现一致。
  - **营销与分析**：所有 `NEXT_PUBLIC_*` 域名、跟踪脚本等，复制模板到新项目时必须更新。
- 建议在团队级 Secret 管理中维护 `.env.production` 的内容，不要在仓库目录中存储或提交明文密钥。
- 如需验证 Cloudflare 变量分类，可在部署前运行 `pnpm run cf:preview`（即 `tsx scripts/sync-cloudflare-env.ts`），它会读取当前环境文件并生成 `.cloudflare/worker-*.json`。

## 日常开发 SOP
1. **分支与提交策略**
   - 默认直接在 `main` 分支迭代；如需临时分支仅用于实验，最终仍需合并回 `main`。
   - 由 AI 助手负责开发，无人工代码评审；因此每次提交必须自检到位。
   - 提交信息遵循 Conventional Commits（如 `feat: add sora2 prompt templates`），便于后续追踪。
   - 提交前务必执行 `git status` 和 `git diff`，确认仅包含本次改动。
2. **功能实现要求**
   - 新增或修改功能需同时补充/更新单元测试或集成测试（Vitest 位于 `tests/`）。
   - 若改动涉及多语言文案、SEO 元数据或站点结构，确保同步更新 `messages/*.json`、`src/config/website.tsx`、相关页面及文档。
   - 关键逻辑、业务流程必须添加或更新注释，保证后续复用场景可读。
3. **提交前自动化检查**
   - 代码风格/静态检查：`pnpm exec biome check <改动文件或目录>`
   - 单元测试：`pnpm test`
   - 类型检查：`pnpm tsc --noEmit`
   - 构建验证（确保无编译错误且生成 sitemap/i18n 产物）：`pnpm build`
   - 若本次改动涉及环境变量，再单独运行 `pnpm run cf:preview`，并注意生成的 `.cloudflare/worker-*.json` 不应提交到 Git。
4. **站点质量自检清单**
   - 技术性 SEO：检查 `robots.txt`、`sitemap.xml`、页面 `<head>` 元信息及 canonical 链接。
   - 多语言：在 `src/app/[locale]/` 下新增/改动页面时，确保每种语言均有对应实现与翻译。
   - PageSpeed & UI：本地访问关键页面，确认布局、交互、动画正常；必要时运行 Lighthouse 或等效工具。
   - 可访问性：关注 Biome 报告的 a11y 警告，必要时手动回归键盘导航、辅助技术提示。
5. **提交与记录**
   - 确认测试与检查全部通过后再执行 `git commit` / `git push`。
   - 将执行过的命令和验证结果记录在提交描述或后续的变更日志中，方便追溯。

## Cloudflare 部署 SOP
1. 在安全渠道更新 `.env.production` 的真实值（公开变量统一使用 `NEXT_PUBLIC_` 前缀，其余视为机密），不要将该文件提交到版本库。
2. 执行 `pnpm run cf:preview`，生成/更新 `.cloudflare/worker-vars.json`、`.cloudflare/worker-secrets.json`、`.cloudflare/wrangler.generated.json` 并检查内容。生成文件用于部署参考，不要纳入 Git（仓库已默认忽略 `.cloudflare/`）。
3. 使用  `pnpm run build` `pnpm run deploy` 将最新构建与环境变量一并部署（内部会执行 OpenNext 构建与资产上传）。如仅需同步变量可运行 `pnpm run cf:deploy`。
4. 部署后验证：
   - `wrangler secret list --config .cloudflare/wrangler.generated.json`
   - `cat .cloudflare/worker-vars.json`
5. 若 `.env.production` 删除了某个机密变量，需执行 `wrangler secret delete <NAME>` 以免 Worker 残留旧值。
wrangler 可能没有正确登录，或者 API Token 已经过期/权限不足。

解决方案：重新登录一次 wrangler。在你的终端里运行以下命令，它会打开浏览器让你重新授权：
npx wrangler login
登录成功后，再重新运行 pnpm run build 和 pnpm run deploy。

## 复制为新产品的注意事项
- 更新域名、产品名称与元数据：
  - `src/config/website.tsx`、`messages/*.json`、`public/` 下的图片、`.env` 中的 URL。
- 调整营销路由/内容：`src/app/[locale]/(marketing)/**` 中所有与 “Sora2” 相关的文案、导航、链接都需替换。
- 复核 AI 功能模块：`src/app/api/polaroid/**`、`src/components/ai-tool/**`、`src/lib/ai/**`。如新项目无需相关功能，可重命名或拆除。
- 重新配置定价与支付：`src/config/price-config.tsx`、`src/credits/**`，并同步 Stripe 中的价格 ID。
- 更新 `content/docs` 的产品描述、教程、对外文案，确保与新站点一致。

## 项目文档
- 所有拓展文档、SOP、排障指南请放在 `content/docs`，并保持中文为默认语言。
- 若面向海外市场的页面需英文版本，可在对应文档中提供双语内容。
- 增加新功能时及时更新文档与翻译文件，业务类新增功能的详细说明集中写到 content/docs，README 只保留流程性内容，这样后续项目演进时更好维护。

## 支持与协作
- 通用框架问题参考 MkSaaS 官方文档：<https://mksaas.com/docs>
- 本仓库内的问题请在 GitHub Issue 中描述，或扩展内部文档。
- README 作为轻量级 SOP 索引，便于团队成员或 AI 助手快速执行指定流程。
