# 🚨 Google Analytics 手动配置指南

由于网络连接问题，自动化脚本暂时无法运行。请按照以下步骤手动配置：

## 🔧 手动配置步骤

### 1. 访问 Google Analytics
👉 https://analytics.google.com/

### 2. 创建新媒体资源
1. 点击左下角 **管理** (齿轮图标)
2. 在 **媒体资源** 列，点击 **创建媒体资源**
3. 填写信息：
   - **媒体资源名称**: `Sora2 Video`
   - **时区**: `(GMT+08:00) 中国时间 - 上海`
   - **货币**: `美元 (USD $)`
4. 点击 **下一步**

### 3. 选择行业和规模
- **行业类别**: 技术
- **企业规模**: 小型
- 点击 **下一步**

### 4. 选择业务目标
勾选：
- ✅ 提高在线销售额
- ✅ 生成潜在客户
- ✅ 提高用户互动度
- 点击 **下一步**

### 5. 选择平台
- 选择 **网站**
- 点击 **下一步**

### 6. 设置网站数据流
- **网站网址**: `https://sora2video.online`
- **数据流名称**: `Sora2 Video - Web Stream`
- 点击 **创建数据流**

### 7. 复制测量 ID
创建成功后，你会看到：
- **测量 ID**: `G-XXXXXXXXXX` (类似 G-B10KKVENLG 的格式)
- **数据流 ID**: 一串数字

**重要**: 复制测量 ID

### 8. 更新环境变量
编辑 `.env` 或 `.env.local` 文件，更新或添加：

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # 替换为你的测量 ID
```

### 9. 验证集成
确保你的代码中已包含 GA 集成：

```typescript
// app/layout.tsx 或相似文件
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// 在 <head> 或 <body> 中添加：
{GA_ID && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      strategy="afterInteractive"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}
    </Script>
  </>
)}
```

### 10. 测试
1. 重启开发服务器: `pnpm dev`
2. 访问你的网站
3. 在 GA 界面查看实时数据: **报告** → **实时**

---

## 📊 获取你当前的测量 ID

看起来你的 `.env` 文件中已经有一个测量 ID：
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-B10KKVENLG
```

你可以：
1. **使用现有的**: 如果这个 ID 对应的媒体资源还存在，直接使用即可
2. **创建新的**: 按照上面的步骤创建新媒体资源并更新 ID

---

## 🔍 验证现有 GA 设置

要检查现有的 GA 是否工作：
1. 访问 https://analytics.google.com/
2. 查看是否有 "Sora2 Video" 或类似的媒体资源
3. 如果有，查看实时数据是否正常

---

## 🆘 网络问题解决方案

如果以后想使用自动化脚本，可以尝试：

1. **使用代理**
```bash
export HTTPS_PROXY=http://your-proxy:port
pnpm ga:setup
```

2. **使用 VPN**
连接到稳定的 VPN 后再运行脚本

3. **在云服务器上运行**
在 Google Cloud Shell 或其他云环境中运行脚本

4. **调整超时设置**
修改脚本增加超时时间

---

## ✅ 完成检查清单

- [ ] GA 媒体资源已创建
- [ ] 获得测量 ID (G-XXXXXXXXXX)
- [ ] 测量 ID 已添加到环境变量
- [ ] 代码中包含 GA 集成脚本
- [ ] 重启开发服务器
- [ ] GA 实时数据显示正常

完成以上步骤后，你的 Google Analytics 就配置成功了！