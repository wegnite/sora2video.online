# 🚀 Google Analytics 快速设置

## 你现在需要做的事情

### 1️⃣ 启用 API (1 分钟)
👉 [点击这里启用 API](https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=aipolariodphoto)
- 点击蓝色 **"启用"** 按钮
- 等待 10 秒

### 2️⃣ 创建服务账户 (2 分钟)
👉 [点击这里创建服务账户](https://console.cloud.google.com/iam-admin/serviceaccounts/create?project=aipolariodphoto)
- **服务账户名称**: `ga-automation`
- **服务账户 ID**: `ga-automation` (自动生成)
- 点击 **"创建并继续"**
- 选择角色: `Google Analytics Admin`
- 点击 **"继续"** → **"完成"**

### 3️⃣ 下载密钥 (1 分钟)
- 在服务账户列表找到 `ga-automation@aipolariodphoto.iam.gserviceaccount.com`
- 点击进入
- 切换到 **"密钥"** 标签
- **"添加密钥"** → **"创建新密钥"** → **JSON** → **"创建"**
- 文件会自动下载

### 4️⃣ 移动密钥文件
```bash
# 将下载的文件移到项目根目录
mv ~/Downloads/aipolariodphoto-*.json ./ga-service-account.json
```

### 5️⃣ 在 GA 中授权
👉 [点击这里打开 GA](https://analytics.google.com/)
- 左下角 **"管理"** (齿轮)
- **"账号用户管理"**
- 右上角 **"+"** → **"添加用户"**
- 输入: `ga-automation@aipolariodphoto.iam.gserviceaccount.com`
- 勾选: ✅ 编辑器 ✅ 管理用户
- 点击 **"添加"**

### 6️⃣ 运行脚本
```bash
pnpm ga:setup
```

## ✅ 完成！

脚本会自动：
- 创建 GA4 媒体资源 "Sora2 Video"
- 创建网站数据流
- 保存测量 ID 到 `.env.local`
- 显示集成代码

---

## 🆘 遇到问题？

### API 未启用错误
→ 返回步骤 1

### 找不到服务账户文件
→ 确认步骤 4，文件名必须是 `ga-service-account.json`

### 权限错误
→ 返回步骤 5，确认已添加服务账户

---

## 📝 备注

每个新项目只需：
1. 复制 `ga-service-account.json`
2. 运行 `pnpm ga:setup`

就这么简单！