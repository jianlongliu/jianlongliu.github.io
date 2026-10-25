import type { LIGHT_DARK_MODE, SupportedLang } from "@/types/config";
import { siteConfig } from "../config";

export const PAGE_SIZE = 8;

export const LIGHT_MODE = "light";
export const DARK_MODE = "dark";
export const DEFAULT_MODE: LIGHT_DARK_MODE =
	siteConfig.theme.mode === "light" ? LIGHT_MODE : DARK_MODE;

export const DEFAULT_HUE = siteConfig.theme.hue;

// Banner height unit: vh
export const BANNER_HEIGHT = 35;
export const BANNER_HEIGHT_EXTEND = 30;
export const BANNER_HEIGHT_HOME: number = BANNER_HEIGHT + BANNER_HEIGHT_EXTEND;

// The height the main panel overlaps the banner, unit: rem
export const MAIN_PANEL_OVERLAPS_BANNER_HEIGHT = 3.5;

// Height of the gradient fade at the banner's bottom edge, unit: px. The banner
// wrapper's bottom edge is the visible bottom of the banner on both the home and
// post layouts, so the mask can be anchored to it for both.
export const BANNER_FADE_HEIGHT = 140;

// Horizontal focus of the banner crop, in percent (the X half of
// object-position). The banner is 1983x793, so a tall narrow viewport makes
// `cover` blow it up hard and keep only a slice of the width: 390x549 leaves
// ~28% of it visible. The subject's face sits at ~35% of the image width, so the
// 50% anchor cut it in half at the left edge. 32% keeps the face near the middle
// on phones while moving the desktop crop by only a few px.
export const BANNER_FOCUS_X = 32;

// Page width: rem
export const PAGE_WIDTH = 75;

export const ALL_LANGUAGES = [
	"en",
	"es",
	"fa",
	"fr",
	"id",
	"ja",
	"ko",
	"th",
	"tr",
	"vi",
	"zh-CN",
	"zh-TW",
] as const;

export const DEFAULT_LANG: SupportedLang = siteConfig.lang as SupportedLang;

const baseLangs =
	siteConfig.supportedLangs && siteConfig.supportedLangs.length > 0
		? siteConfig.supportedLangs.map(
				(lang) => lang.replace("_", "-") as SupportedLang,
			)
		: [];

const activeConfigLang = siteConfig.lang.replace("_", "-") as SupportedLang;

export const SUPPORTED_LANG: readonly SupportedLang[] = baseLangs.includes(
	activeConfigLang,
)
	? baseLangs
	: [activeConfigLang, ...baseLangs];
