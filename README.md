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

## 待办

> `ROADMAP.md` 是上游 Fumika 模板自带的清单（与上游 `main` 逐字节相同），不是本站计划；本站要做的事记在本节。

### 建议做（低风险）

- [ ] **修本地开发权限**：`dist/`、`node_modules/` 属主为 root（历史遗留），`pnpm dev` 写不进 vite 缓存（`node_modules/.vite` 实测不可写）。修法：`cd ~/Documents/jianlongliu.github.io && sudo chown -R jianlongliu:staff node_modules dist`。需手动执行——ssh 非交互无 tty，sudo 跑不了。
- [ ] **压 `og:image`**：现指向 `public/media/images/banner.png`（3.2 MB，未压缩）→ 压成 1200×630 / <1 MB，否则分享到 IM、社交平台拉不出来。

### 想开了再说

- [ ] 评论：`commentConfig = {}`（当前关闭）。要用 Giscus 需先去 giscus.app 授权，拿 `repoId` / `categoryId` 填进 `src/config.ts`。
- [ ] 统计：`analyticsConfig.enabled = false`（partytown 已装好）。填 GA4 id 即可开。
- [ ] 封面：20 篇用外站热链（Nexus Mods、Apple、Wikimedia、Lenovo CDN、GitHub raw、gstatic 等），外站图失效封面就是空的。核实法：`grep -rn "^image:" src/content/posts`。
- [ ] 6 篇缺 `description`：`machine-and-her`、`grub2-themes`、`xwayland-bullry`、`fallout4`、`frp`、`reader3`。
- [ ] 清理未路由的模板演示内容：`src/content/spec/{markdown,video,expressive-code,draft}.md` 与 `guide/`、`ja/`、`zh-CN/`（线上实测 404）；本地分支 `migrate/fumika`；6 个远端 dependabot 分支。

### 大屏响应式（上游也没做）

`PAGE_WIDTH = 75`（`src/constants/constants.ts:22`）是全站唯一的宽度上限，无媒体查询；`PostCard` 为 `w-full`（首页单列卡片流）；TOC 仅 ≥1536px（`2xl`）出现，宽度吃满右边距 `(100vw - 1200px)/2 - 1rem`；字号只 `text-[14px] md:text-[16px]` 两档；banner 高度用 `65vh`（首页）/ `35vh`（文章页）。逻辑宽 2400px 的屏（X329U 3840 ÷ 1.6）两侧各空 600px。上游 `main` 同一常量，无相关提交或 issue。

- [ ] 按断点放宽 `PAGE_WIDTH`（1200 → 1440/1600）：改一处全站生效；TOC 出场阈值 `2xl` 不变，放宽后可能被挤出屏幕。
- [ ] 首页卡片大屏改两列。
- [ ] 字号加一档 `2xl:text-[18px]`。
- [ ] banner 高度改用 `clamp()`。

### 已定 / 已核实

- 界面语言保持 `en`（已定，不改，`supportedLangs: []`）。
- 评论与统计关闭是当前有意状态。
- 已核实正常：pagefind 搜索、RSS、sitemap、404、about、friends 均在线；`::github{}` 卡片等扩展语法已在 `astro.config.mjs` 接线；Fumika 版已部署到 jianl.dev。
- 本仓库无 upstream remote（只有 origin 指向自己），与上游对账需手动加。
