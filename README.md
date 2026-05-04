# 🍥 jianl.dev

Astro + Fuwari 个人博客。  
[jianlongliu.github.io](https://jianlongliu.github.io) · [jianl.dev](https://jianl.dev)

## 初始化

```bash
pnpm create fuwari@latest
cd jianlongliu.github.io
pnpm install && pnpm add sharp
```

## 写文章 → 预览 → 构建

```bash
pnpm new-post <filename>   # 新建文章，编辑 src/content/posts/
pnpm dev                   # 本地开发 http://localhost:4321
pnpm build                 # 构建到 dist/
pnpm preview               # 预览构建结果
```

## 部署

```bash
git add . && git commit -m "update" && git push origin main
```

推 `main` → GitHub Actions 自动构建并部署 GitHub Pages，Netlify 镜像自动同步。

## Frontmatter

```yaml
---
title: 标题
published: 2024-01-01
description: 描述
image: ./cover.jpg
tags: [Tag1, Tag2]
category: 分类
draft: false
---
```

## 其他命令

| 命令 | 作用 |
|------|------|
| `pnpm check` | 类型检查 |
| `pnpm format` | 格式化 (Biome) |
| `pnpm lint` | 代码检查 (Biome) |
