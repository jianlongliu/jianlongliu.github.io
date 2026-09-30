---
title: '攒了几个拿得出手的折腾:把桌面塞进 Git'
published: 2026-09-30
description: '把 Omarchy 真移植到 niri、用 Hyprland 复刻 niri 的手感、还有一堆状态栏小插件——最近几个开源项目的来龙去脉'
image: ''
tags: [Linux, niri, Omarchy, Arch, Rust, QML]
category: 'Linux'
draft: false
lang: ''

---
# onarchi:把 Omarchy 真移植到 niri

::github{repo="jianlongliu/onarchi"}

[Omarchy](https://github.com/basecamp/omarchy) 是 basecamp 那套「Arch + Hyprland 开箱即用」的桌面方案,好看是真好看,但它跟 Hyprland 绑得很死。而我自己日常用的合成器是 [niri](https://github.com/YaLTeR/niri)——纵向滚动、工作区有方向感,用习惯之后回不去了。于是冒出个念头:**能不能把 Omarchy 整个搬到 niri 上?**

`onarchi` 就是这个答案。它不是「照着样式自己抄一遍」,而是真的把 Omarchy 的源码拿过来打补丁、跑在 niri 上:

- QML 壳层(状态栏、工作区、背景)按 niri 的口径重写 + 打补丁;
- `port-bin/` 里一堆 PATH 优先级更高的垫片,把跟 Hyprland 耦合的地方翻译成 niri ——最关键的是 `hyprctl` 垫片,因为 Omarchy 的 `bin/` 里到处都在调它;还有 `uwsm-app`,那是 uwsm 会话才有的东西,niri 会话下没有,不打垫片会有一堆调用点直接死;
- `niri.patch` + `Niri.qml` 组成幂等覆盖层,跑完 `omarchy update` 还能重新贴上;
- 开机动画、锁屏、磨砂玻璃这些细节也一起搬了过来。

> 锁屏上的指纹与面部解锁:[《为 Arch Linux 实现指纹识别和面部解锁》](https://jianl.dev/posts/howdy-fprintd/)

代价是它**不是一个安装器**:假设你已经有一个能登录的 Arch + niri 会话,并且愿意照着 `docs/INSTALL.md` 手动来。仓库里那几卷文档(移植主线 / 视觉 / 行为 / 插件 / 垫片 / 上游跟进 / 迁移 / 本机改动 / 锁屏登录)基本把踩过的坑都记下来了,想复刻的话建议从文档读起。

顺带一提:这个仓原名 `omarchy-on-niri`,2026-09-28 改的名。GitHub 上还有个 `Nirism` 是另一条路子,两仓不是同一份代码,别混。

> 这套桌面跑在 ThinkPad X1 Carbon Gen 9 上,硬件与装机过程写在[《ThinkPad X1 Carbon Gen 9 个人使用指南》](https://jianl.dev/posts/panther/)里。

## Nirism:不换合成器,只偷 niri 的手感

::github{repo="jianlongliu/Nirism"}

`onarchi` 是把合成器换掉;但有些时候你不想动合成器,只想让 Hyprland 用起来像 niri。`Nirism` 干的就是这个:

- `SUPER + TAB` 打开**滚动总览**:工作区卡片网格 + 背景模糊,滚轮带动画切换工作区;
- 平铺状态下 `SUPER + 滚轮` **纵向滑动**切工作区,滚到空工作区就停住,不会无限往下新建;
- `SUPER + CTRL + ↑/↓` 把当前窗口往上/下工作区扔,碰到空工作区同样停住;
- `ALT + TAB` 换成 Fathom 深度式切换器:窗口按「多久没用过」排 z 轴,最近用的在最前面。

效果本体分别来自 [`yayuuu/hyprland-scroll-overview`](https://github.com/yayuuu/hyprland-scroll-overview) 和 [`mtolhuys/fathom`](https://github.com/mtolhuys/fathom) 两个第三方插件,这个仓负责把它们接进 Omarchy 的绑定体系里(比如滚动总览必须走 Lua API 调用,写成 dispatcher 字符串会**静默空操作**——这种坑不踩一遍是不知道的)。

名字里的「niri 风格」只指操作习惯,不是窗口管理器本身。README 里写了三遍这件事,因为真的会有人搞混。

## vantage:一个 TUI 工具集,以及它为什么退休

::github{repo="jianlongliu/vantage"}

用 [ratatui](https://github.com/ratatui/ratatui) 写的 TUI 小工具集,四个功能:切分辨率、改电池充电阈值、开关 paru 的执行权限、切默认 AI agent。

现在**已归档**。原因不是不好用,而是这四件事后来都搬进图形界面了:分辨率归状态栏的 Monitor 面板、充电阈值归电池面板的 CHARGE LIMIT、paru 权限和默认 agent 归菜单。TUI 干不过一个点一下就行的面板——那就把仓库当存档,功能搬走,写清楚每个功能现在住哪儿。

Rust 单文件二进制,release 里留了 x86_64 的构建,想考古的可以直接下载。

## 顺手写的一堆状态栏插件

Omarchy 的状态栏支持第三方插件,写起来挺方便,于是顺手攒了几个:

::github{repo="jianlongliu/omarchy-workspace-pill"}

GNOME 45 风格的工作区指示器:每个工作区一个小实心点,当前那个横着展开成胶囊。纯视觉——没有数字、没有边框、没有重底色,颜色取自状态栏自己的前景色(未选中约 34% alpha、当前约 85%),切换时有 220ms 的宽度和颜色过渡。

::github{repo="jianlongliu/omarchy-wallpaper-aio"}

把自定义壁纸库接到 Omarchy 的主题背景选择器上:做法是往 `~/.config/omarchy/backgrounds/<主题>` 建一条软链,指出去统一指向自己的壁纸库。不含壁纸、不含取色,只解决「换壁纸只能翻主题自带那几张」这一件事。

::github{repo="jianlongliu/omarchy-system-menu"}

一个按钮,点一下直接开 System 菜单(锁屏 / 挂起 / 注销 / 重启 / 关机),省掉从根菜单进去的两步。

## colamd-claude-theme

::github{repo="jianlongliu/colamd-claude-theme"}

给 ColaMD 做的浅色主题:暖米色纸面 + 陶土橙强调色,配色照着 Claude 的界面风格来。顺手记了 ColaMD 的一个坑——它用**文件名**当主题标识(`localStorage` 里存的就是 `custom:Claude.css`),所以重命名文件等于换了个主题,旧的选择记录会直接失效,页面退回无样式。

## ante-opentui:让两个不认识的东西假装认识

::github{repo="jianlongliu/ante-opentui"}

还有一个比较疯的:把 [opencode](https://github.com/sst/opencode) v2 自带的 TUI 接到 Ante 后端上跑。做法是**照着 opencode 要求的 server API 实现一个垫片**,让 `opencode --server <url>` 分辨不出真假——界面、主题、键位一行不改,数据换成 Ante 的。理念和 `onarchi` 是同一套:**改接口,不改消费者**。

代价也写得很诚实:**Ante 没有的概念**(LSP、MCP、formatter、diff、VCS)只能打桩显示为空,仓库 README 里明确标了「不假装」,还附了每条「为什么做不到」的查证过程。

另外还有两个仓:`myarch` 是一份自用的 Arch 桌面装机清单(从分区到状态栏,照着敲能装出一套能用的);`snapper-rollback` 我加多配置支持,让它能通过 `/etc/fstab` 自动识别 root / home / data 等多个子卷,而不只是一个。

## 收尾

上面这些的共同点是:**都不是为了开源而开源**。都是先在自己机器上把某个不顺眼的地方磨平,磨完之后发现「这玩意好像别人也能用」,才整理出来的。

所以文档都写得比较细——怎么装、怎么验、怎么回退、踩过什么坑。写的时候就在想一件很现实的事:半年后自己忘了怎么配,得能照着文档捡回来。
