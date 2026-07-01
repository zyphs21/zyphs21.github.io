# Hanson Zhang 的技术花园

这是从 Hexo 静态产物迁移到 Astro 的第一版个人技术品牌站雏形。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## GitHub Pages 部署

Astro 可以通过 GitHub Pages 部署。当前仓库使用 `.github/workflows/deploy.yml` 在推送到 `main` 或 `master` 后执行：

1. 安装依赖：`npm install`
2. 构建静态站点：`npm run build`
3. 上传 `dist/` 到 GitHub Pages

仓库设置里需要把 **Settings → Pages → Source** 设为 **GitHub Actions**。当前仓库使用自定义域名，所以 `CNAME` 放在 `public/CNAME`，构建时会被 Astro 复制进最终产物。

## 内容结构

- `src/content/blog`：正式技术文章
- `src/content/notes`：持续生长中的短笔记
- `src/content/projects`：项目与产品
- `src/content/topics`：长期主题地图

第一版先迁移少量代表内容，用于验证视觉风格、内容模型和 Astro 构建流程。
