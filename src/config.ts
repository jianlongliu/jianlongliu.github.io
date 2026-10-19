import type {
	AnalyticsConfig,
	CommentConfig,
	DeployConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "bonjour, jianlong liu",
	subtitle: "We're going deep, and we're going hard... ",
	lang: "en",
	// 留空数组 = 关闭多语言切换
	supportedLangs: [],
	theme: {
		// 41 = 橘色系;采样自 banner 那位橘发少女的发色(oklch 色相 41.5°,
		// 46546 个发丝像素的中位数)。Material Design 取色盘里同色相的是
		// Orange 900 (#E65100, 40.25°),符合 tonal spot 保留源色色相的做法。
		hue: 41, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		mode: "light",
	},
	banner: {
		enable: true,
		src: "assets/images/banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "top", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "2025 Jianlong Liu. All rights reserved.", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 3, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		{ src: "/favicon/favicon-light-32.png", theme: "light", sizes: "32x32" },
		{ src: "/favicon/favicon-light-128.png", theme: "light", sizes: "128x128" },
		{ src: "/favicon/favicon-light-180.png", theme: "light", sizes: "180x180" },
		{ src: "/favicon/favicon-light-192.png", theme: "light", sizes: "192x192" },
		{ src: "/favicon/favicon-dark-32.png", theme: "dark", sizes: "32x32" },
		{ src: "/favicon/favicon-dark-128.png", theme: "dark", sizes: "128x128" },
		{ src: "/favicon/favicon-dark-180.png", theme: "dark", sizes: "180x180" },
		{ src: "/favicon/favicon-dark-192.png", theme: "dark", sizes: "192x192" },
	],
	ogImage: {
		useDefault: true, // 用默认分享图(站点没有给每篇单独设置 ogImage 时)
		defaultSrc: "/media/images/banner.png",
	},
};

export const navBarConfig: NavBarConfig = {
	links: [
		{
			// Group triggers keep the top row short; the submenu holds the rest.
			name: "Home",
			url: "/",
			children: [LinkPreset.Archive, LinkPreset.About],
		},
		{
			name: "Photos",
			url: "https://photo.jianl.dev",
			external: true,
		},
		{
			name: "Memos",
			url: "https://memos.jianl.dev",
			external: true,
		},
		{
			name: "More",
			// No url: rendered as a disclosure button rather than a link.
			children: [
				{
					name: "Cells",
					url: "https://cells.jianl.dev",
					external: true,
				},
				{
					name: "Beszel",
					url: "https://dash.jianl.dev",
					external: true,
				},
				{
					// Promoted into the top row from lg up; below that it stays here.
					// Six triggers do not fit at the md breakpoint (measured), so these
					// two only leave the dropdown once there is room for them.
					name: "Git",
					url: "https://git.jianl.dev",
					external: true,
					showFrom: "lg",
				},
				{
					name: "Status",
					url: "https://status.jianl.dev",
					external: true,
					showFrom: "lg",
				},
			],
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Jianlong Liu",
	bio: "游戏玩家，拜仁和曼城球迷，一个牛逼的人! ",
	links: [
		{
			name: "X",
			icon: "fa6-brands:x-twitter", // Visit https://icones.js.org/ for icon codes
			url: "https://x.com/jianlongliu",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://steamcommunity.com/id/jianlongliu/",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/jianlongliu",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

// 本站没启用评论:giscus 的 repoId / categoryId 需要先去 giscus.app 授权拿到,留空即不渲染评论区
export const commentConfig: CommentConfig = {};

// Site analytics config, only support GA4 for now
export const analyticsConfig: AnalyticsConfig = {
	enabled: false,
	// Example if using Google Analytics, don't forget to make `enabled` true
	// google: {
	//	 id: "G-xxx",
	// },
};

// Deploy configuration (Netlify, GitHub Pages, Cloudflare, etc)
export const deployConfig: DeployConfig = {
	siteUrl: "https://jianl.dev",
	baseUrl: "/",
};
