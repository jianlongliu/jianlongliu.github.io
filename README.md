# jianl.dev

心怡大魔王的个人博客 —— 折腾记录、Linux 桌面、游戏、还有一些开源项目。

在线地址:

- <https://jianl.dev>(主站)
- <https://jianlongliu.github.io>
- <https://jianlongliu.netlify.app>

## 技术栈

基于 [Fumika](https://github.com/iyanarmanda/fumika) —— [Fuwari](https://github.com/saicaca/fuwari) 的活跃继任分支。

- [Astro](https://astro.build) v7
- [Svelte](https://svelte.dev) v5
- [Tailwind CSS](https://tailwindcss.com) v4 + SCSS
- [Pagefind](https://pagefind.app/) 站内搜索

## 本地开发

```sh
pnpm install
pnpm dev                     # 本地开发服务器 http://localhost:4321
pnpm build                   # 构建到 dist/
pnpm preview                 # 预览构建结果
pnpm new-post <filename>     # 新建文章,写到 src/content/posts/
```

## 写文章

文章放在 `src/content/posts/`,支持单文件(`foo.md`)和目录(`foo/index.md`,便于放配图)。

```yaml
---
title: 标题
published: 2026-09-30
description: 摘要
image: ./cover.webp # 可选,封面图,相对当前文件
tags: [Linux, Arch]
category: Linux
draft: false
---
```

正文里还支持 GitHub 仓库卡片 `::github{repo="owner/repo"}`、提示块(admonition)、Mermaid 图、Expressive Code 代码块等扩展语法。

## 部署

推送到 `main` 分支,GitHub Actions(`.github/workflows/gh-pages.yml`)会自动构建并发布到 GitHub Pages。自定义域名与 HTTPS 在仓库的 Pages 设置里。

## 站点配置

`src/config.ts` —— 站点标题、主题色(hue)、导航栏、头像、favicon、社交链接、评论与统计开关都在这里。

## 许可

文章内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/);模板代码为 MIT,见 `LICENSE.txt`(Fuwari / Fumika 上游署名保留)。
