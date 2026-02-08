# API 访问保护与免费配额策略

## 环境变量核对清单

以下变量缺失会直接导致对应功能不可用（Cloudflare Worker 会抛出 1101）：

| 变量 | 用途 | 相关模块 | 备注 |
| --- | --- | --- | --- |
| `DATABASE_URL` | 访问 Postgres 数据库 | 所有持久化操作 | 未配置时 `src/db/index.ts` 会抛错 |
| `BETTER_AUTH_SECRET`、`GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`、`GITHUB_CLIENT_*` | 第三方登录 | `src/lib/auth.ts` | social login 首次回调会写入数据库、发送邮件 |
| `RESEND_API_KEY`、`RESEND_AUDIENCE_ID` | 邮件与 Newsletter | `src/mail/provider/resend.ts`、`src/newsletter/provider/resend.ts` | 缺失将导致注册/社交登录首次触发 1101 |
| `STRIPE_SECRET_KEY`、`STRIPE_WEBHOOK_SECRET` | 支付与信用点数 | `src/payment/provider/stripe.ts` | 订阅/一次性支付与 webhook 校验 |
| `STORAGE_*` | 作品存储（R2/S3） | `src/storage/**` | 上传与读取素材 |
| 各 AI 提供商 (`SILICONFLOW_*`、`NANO_BANANA_*`、`OPENAI_*`、`FAL_API_KEY` 等) | 模型调用 | `src/lib/ai/**` | 未配置的 provider 会在运行时返回 500 |

> 提示：执行 `pnpm run cf:deploy` 会把 `.env.production` 中的 vars/secrets 同步到 Cloudflare，部署前可用 `pnpm dlx wrangler secret list --config .cloudflare/wrangler.generated.json` 复核。

## 免费配额 / 防滥用设计

- **匿名访客**：无需登录即可调用 Sora2 图像 API（`/api/polaroid/generate`、`/api/generate-images`）最多 2 次。
- **已登录用户**：在上述 2 次基础上，可额外获得 2 次（总共 4 次）免费调用。
- **超额处理**：超过阈值后 API 返回 `402`，前端会弹出提示并引导至定价页。

### 实现要点

1. **持久化计数**：新增 `free_usage_quota` 表，字段包含 `session_id`、`user_id`、`anonymous_uses`、`authenticated_uses` 等。首次访问为匿名请求时分配 `free_usage_session_id` Cookie（有效期 30 天）。
2. **事务控制**：`src/lib/usage/quota.ts` 在单个事务内完成查询、聚合和计数更新，防止并发条件下重复计数。
3. **API 接入**：
   - `src/app/api/polaroid/generate/route.ts`
   - `src/app/api/generate-images/route.ts`
   两个路由会在业务逻辑前调用 `enforceUsageLimit`，并把剩余次数 (`remaining`) 回传给前端。
4. **前端体验**：
   - sora2 首页 (`src/components/ai-tool/sora2-hero.tsx`) 捕获 `402`，使用本地化提示并跳转 Pricing。
   - 多模型画板 (`src/ai/image/components/ImageGenerator.tsx`) 在错误面板中展示 CTA 按钮，鼓励升级。

### 调整策略

- 修改阈值：更新 `src/lib/usage/quota.ts` 中 `ANONYMOUS_LIMIT` 与 `AUTHENTICATED_LIMIT`。
- 重置用户计数：手动清空或更新 `free_usage_quota` 表中对应记录即可（DELETE 或更新字段）。
- 扩展保护范围：在新的 API 路由调用 `enforceUsageLimit`，并为 `feature` 参数新增标识字符串。

## 验证步骤

1. **匿名访问**：清理浏览器 Cookie，连续调用 3 次生成接口。第 3 次应返回 402，并被引导至定价页。
2. **登录用户**：先使用匿名额度，再登录同一账户继续调用，合计 4 次后触发限制。
3. **数据库检查**：在数据库中查询 `free_usage_quota`，确认累计次数与 Cookie `session_id` 对应。
