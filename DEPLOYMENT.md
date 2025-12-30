# PETS LOVE - 生产部署指南

## 📋 部署前检查清单

### 必需配置
- [ ] Stripe 生产环境账户设置
- [ ] 域名和 SSL 证书
- [ ] 生产环境变量配置
- [ ] 数据库生产方案确认

### 可选配置
- [ ] 邮件服务设置
- [ ] 错误监控配置
- [ ] 分析工具集成

---

## 🏁 快速开始 (推荐方案)

### 1. 准备 Stripe 生产环境

前往 [Stripe Dashboard](https://dashboard.stripe.com/):

1. **切换到生产模式**
   - 点击左侧 "View test data" 切换开关
   - 确认切换到生产环境

2. **获取生产 API 密钥**
   - 导航至 Developers > API keys
   - 复制 "Publishable key" (pk_live_...)
   - 复制 "Secret key" (sk_live_...)

3. **设置 Webhook 端点**
   - 导航至 Developers > Webhooks
   - 点击 "Add endpoint"
   - 端点 URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - 监听事件: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - 复制 Webhook 签名密钥 (whsec_...)

### 2. 一键部署到 Vercel

点击下方按钮进行部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fpets-love&env=DATABASE_URL,STRIPE_SECRET_KEY,STRIPE_PUBLISHABLE_KEY,STRIPE_WEBHOOK_SECRET,NEXTAUTH_SECRET,NEXTAUTH_URL&envDescription=Environment%20variables%20required%20for%20production&envLink=https%3A%2F%2Fgithub.com%2Fyour-username%2Fpets-love%2Fblob%2Fmain%2F.env.production.template)

### 3. 配置环境变量

在 Vercel 部署界面填入以下环境变量：

```bash
DATABASE_URL=file:./prod.db
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 4. 部署完成验证

部署完成后，访问你的网站并测试：

- ✅ 首页加载正常
- ✅ 产品页面显示
- ✅ 加购流程工作
- ✅ 支付流程（使用真实卡号测试）

---

## 🏗️ 手动部署步骤

### 准备工作

1. **创建 GitHub 仓库**
```bash
# 推送代码到 GitHub
cd /Users/new/Documents/PETS\ LOVE/worktrees/efflora-a898f41f
git remote add origin https://github.com/your-username/pets-love.git
git push -u origin main
```

2. **配置生产环境变量**
```bash
# 复制模板并填入实际值
cp .env.production.template .env.production.local
# 编辑 .env.production.local 文件
```

### Vercel 部署步骤

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账户登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 确认框架检测为 Next.js

3. **配置环境变量**
   - 在部署配置页面添加环境变量
   - 参考 `.env.production.template` 中的配置

4. **点击 "Deploy"**
   - 等待部署完成（通常 2-5 分钟）
   - 获取部署 URL

### 部署后配置

1. **更新 Stripe Webhook URL**
   ```
   旧: http://localhost:3000/api/webhooks/stripe
   新: https://your-domain.vercel.app/api/webhooks/stripe
   ```

2. **更新环境变量中的 NEXTAUTH_URL**
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **测试关键功能**
   - 产品浏览
   - 添加到购物车
   - 结账流程
   - 支付处理

---

## 🔧 高级配置

### 自定义域名配置

1. **在 Vercel 中添加域名**
   - 进入项目设置 > Domains
   - 添加你的域名
   - 配置 DNS 记录

2. **SSL 证书**
   - Vercel 自动提供 SSL 证书
   - 通常在域名配置后 24 小时内生效

### 数据库升级方案

当前项目使用 SQLite，生产环境建议升级：

1. **Vercel Postgres（推荐）**
```bash
# 在 Vercel Dashboard 中启用 Postgres
# 更新 DATABASE_URL 为提供的连接字符串
```

2. **PlanetScale（MySQL 兼容）**
```bash
# 注册 PlanetScale 账户
# 创建数据库并获取连接字符串
# 更新 Prisma schema 为 mysql
```

### 文件存储升级

当前使用本地文件存储，生产环境建议使用：

1. **Vercel Blob**
```bash
npm install @vercel/blob
# 更新上传 API 使用 Blob 存储
```

2. **AWS S3**
```bash
npm install @aws-sdk/client-s3
# 配置 S3 桶和访问凭证
```

### 监控和分析

1. **Vercel Analytics**
   - 在 Vercel Dashboard 中启用
   - 提供性能和用户数据

2. **Sentry 错误监控**
```bash
npm install @sentry/nextjs
# 配置 Sentry DSN
```

3. **Google Analytics**
```bash
# 添加 GA_ID 环境变量
# 在 layout.tsx 中集成 GA 脚本
```

---

## 🔍 故障排除

### 常见部署问题

**构建失败**
```bash
# 本地验证构建
npm run build

# 检查 TypeScript 错误
npm run lint
```

**环境变量问题**
```bash
# 验证所有必需变量已设置
# 检查变量名拼写
# 确认变量值格式正确
```

**Stripe Webhook 失败**
```bash
# 验证 Webhook URL 正确
# 检查 Webhook 签名密钥
# 查看 Vercel Functions 日志
```

### 性能优化

1. **图片优化**
   - 使用 WebP 格式
   - 配置 Next.js Image 组件

2. **缓存策略**
   - 配置适当的 Cache-Control 头
   - 使用 ISR（增量静态再生）

3. **监控指标**
   - Core Web Vitals
   - API 响应时间
   - 错误率

---

## 🎯 部署后验证

### 功能测试清单

- [ ] 网站首页加载
- [ ] 产品列表和筛选
- [ ] 产品详情页
- [ ] 添加到购物车
- [ ] 结账流程
- [ ] 支付处理
- [ ] 订单确认
- [ ] 移动端兼容性

### 支付测试

使用以下测试卡号验证支付：

```
成功支付: 4242 4242 4242 4242
失败支付: 4000 0000 0000 0002
需要验证: 4000 0025 0000 3155

有效期: 任意未来日期
CVC: 任意 3 位数字
```

### 性能指标

- 首页加载时间 < 3s
- API 响应时间 < 500ms
- 移动端性能评分 > 90

---

**🎉 恭喜！你的 PETS LOVE 独立站现在已经成功部署到生产环境！**

如有任何问题，请参考技术文档或联系支持团队。