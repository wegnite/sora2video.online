# 🚀 Google Analytics 自动化配置 SOP

## 当前项目信息
- **项目名称**: Sora2 Video  
- **网站 URL**: https://sora2video.online
- **Google Cloud 项目**: aipolariodphoto (ID: 415148337851)
- **时区**: Asia/Shanghai
- **货币**: USD

---

## 📋 标准操作流程

### Step 1: 启用 Google Analytics Admin API ✅

1. 访问: https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=aipolariodphoto
2. 点击 **"启用"** 按钮
3. 等待 API 启用完成（约 10 秒）

### Step 2: 创建服务账户 🔑

1. 访问: https://console.cloud.google.com/iam-admin/serviceaccounts/create?project=aipolariodphoto
2. 填写服务账户详情：
   - **服务账户名称**: `ga-automation`
   - **服务账户 ID**: `ga-automation` (会自动生成)
   - **服务账户说明**: `用于自动配置 Google Analytics`
3. 点击 **"创建并继续"**
4. 选择角色：
   - 搜索并选择: `Google Analytics Admin`
5. 点击 **"继续"** → **"完成"**

### Step 3: 创建并下载密钥 📥

1. 在服务账户列表中找到刚创建的 `ga-automation@aipolariodphoto.iam.gserviceaccount.com`
2. 点击该服务账户进入详情
3. 切换到 **"密钥"** 标签
4. 点击 **"添加密钥"** → **"创建新密钥"**
5. 选择 **JSON** 格式
6. 点击 **"创建"**
7. 密钥会自动下载，保存为 `ga-service-account.json`
8. 将文件移动到项目根目录：
   ```bash
   mv ~/Downloads/aipolariodphoto-*.json ./ga-service-account.json
   ```

### Step 4: 在 GA 中授权服务账户 🔐

1. 访问: https://analytics.google.com/
2. 点击左下角 **"管理"** (齿轮图标)
3. 在 **"账号"** 列中，点击 **"账号用户管理"**
4. 点击右上角 **"+"** → **"添加用户"**
5. 输入服务账户邮箱: `ga-automation@aipolariodphoto.iam.gserviceaccount.com`
6. 授予权限：
   - ✅ 编辑器
   - ✅ 管理用户
7. 点击 **"添加"**

### Step 5: 运行自动化脚本 🎯

```bash
# 直接运行（脚本会自动读取环境变量）
pnpm tsx scripts/setup-google-analytics-auto.ts
```

---

## 📝 快速检查清单

- [ ] Google Analytics Admin API 已启用
- [ ] 服务账户已创建
- [ ] JSON 密钥文件已下载并放到项目根目录
- [ ] 服务账户已在 GA 中授权
- [ ] 运行脚本

---

## 🆘 故障排除

### 错误：API 未启用
```
Error: 7 PERMISSION_DENIED: Google Analytics Admin API has not been used in project
```
**解决**: 返回 Step 1 启用 API

### 错误：认证失败
```
Error: Could not load the default credentials
```
**解决**: 确认 `ga-service-account.json` 文件存在于项目根目录

### 错误：权限不足
```
Error: 403 The caller does not have permission
```
**解决**: 返回 Step 4 确认服务账户已在 GA 中授权

---

## 📊 脚本输出示例

成功运行后，你会看到：
```
🚀 开始设置 Google Analytics...
✓ 找到 1 个账户
✓ 媒体资源创建成功: Sora2 Video
✓ 数据流创建成功: Sora2 Video - Web Stream
测量 ID: G-XXXXXXXXXX
✓ 配置已保存到 .env.local

✅ Google Analytics 设置完成!

配置信息:
  账户: accounts/123456789
  媒体资源: Sora2 Video
  数据流: Sora2 Video - Web Stream
  测量 ID: G-XXXXXXXXXX
```

---

## 🔄 重复使用

每次创建新项目时：
1. 复制 `ga-service-account.json` 到新项目
2. 更新环境变量中的 `NEXT_PUBLIC_BASE_URL`
3. 运行脚本即可

---

## 📌 注意事项

- 服务账户密钥文件不要提交到 Git（已在 .gitignore 中）
- 每个 Google 账户最多创建 2000 个媒体资源
- 测量 ID 会自动保存到 `.env.local`