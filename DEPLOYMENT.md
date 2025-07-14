# Cloudflare 部署指南

本指南将帮助你将媒体画廊项目部署到 Cloudflare Pages。

## 📋 前提条件

1. **Cloudflare 账户** - 在 [cloudflare.com](https://cloudflare.com) 注册免费账户
2. **Node.js** - 安装 Node.js 16+ 版本
3. **Git** - 确保项目已初始化为 Git 仓库

## 🚀 部署方法

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **连接 Git 仓库**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 前往 Pages 部分
   - 点击 "Create a project"
   - 连接你的 GitHub/GitLab 仓库

2. **配置构建设置**
   - **项目名称**: `media-gallery`
   - **生产分支**: `main`
   - **构建命令**: `echo 'Static site - no build needed'`
   - **构建输出目录**: `.`

3. **部署**
   - 点击 "Save and Deploy"
   - 等待部署完成（通常需要1-2分钟）
   - 访问提供的 URL

### 方法二：通过 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   # 或者使用项目依赖
   npm install
   ```

2. **登录 Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **创建 Pages 项目（首次部署时）**
   ```bash
   npm run pages:create
   # 或者直接使用 wrangler
   npx wrangler pages project create media-gallery
   ```

4. **部署到生产环境**
   ```bash
   npm run deploy
   # 或者直接使用 wrangler（现在有了 [assets] 配置，更简单）
   npx wrangler pages deploy
   ```

5. **部署到预览环境**
   ```bash
   npm run deploy:dev
   ```

## ⚙️ 配置说明

### wrangler.toml
主要配置文件，包含：
- 项目名称和兼容性日期
- `[assets]` 配置：指定静态文件目录（设置为 "." 表示当前目录）
- 环境配置

### _headers
配置HTTP头信息，确保：
- HLS视频流正确播放
- 适当的缓存策略
- CORS 支持
- 安全头设置

### _redirects
配置重定向规则，确保单页应用路由正常工作。

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 🌐 自定义域名

1. 在 Cloudflare Dashboard 中前往你的 Pages 项目
2. 点击 "Custom domains" 标签
3. 点击 "Set up a custom domain"
4. 输入你的域名并按照指示操作

## 🎯 优化建议

### 性能优化
- 所有静态资源都设置了长期缓存
- HLS 视频流设置了适当的缓存策略
- 启用了 Cloudflare 的自动压缩

### 安全设置
- 配置了安全 HTTP 头
- 启用了 CORS 支持视频播放
- 防止了常见的安全漏洞

### 媒体文件优化
- HLS 视频分段缓存 1 年
- 图片文件缓存 1 年
- 播放列表(.m3u8)不缓存以确保实时更新

## 🚨 常见问题

### 首次部署错误
如果遇到 "error occurred while running deploy command" 错误，请按以下步骤操作：

1. **确保已登录**
   ```bash
   npx wrangler login
   ```

2. **创建 Pages 项目**
   ```bash
   npx wrangler pages project create media-gallery
   ```

3. **重新部署**
   ```bash
   npx wrangler pages deploy . --project-name=media-gallery
   ```

### 视频无法播放
检查 `_headers` 文件是否正确配置了 HLS 相关的 MIME 类型和 CORS 头。

### 404 错误
确保 `_redirects` 文件正确配置了重定向规则。

### 部署失败
- 检查 `wrangler.toml` 配置
- 确保所有必需文件都已提交到仓库
- 查看 Cloudflare Dashboard 中的构建日志

### "assets" 配置错误
这个项目是 Cloudflare Pages 项目，不是 Workers 项目。请使用 `pages deploy` 而不是 `deploy`。

## 📞 技术支持

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [HLS.js 文档](https://github.com/video-dev/hls.js/)

---

🎉 **部署完成后，你的媒体画廊将在全球 CDN 上快速加载！** 