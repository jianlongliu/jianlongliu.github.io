import { chromium } from "playwright";

const shots = [
	["http://127.0.0.1:4321/", "/tmp/s-home.jpg"],
	["http://127.0.0.1:4321/posts/oh-my-desktop/", "/tmp/s-post.jpg"],
	["http://127.0.0.1:4321/archive/", "/tmp/s-archive.jpg"],
	["http://127.0.0.1:4321/about/", "/tmp/s-about.jpg"],
];
const b = await chromium.launch({ args: ["--no-proxy-server"] });
const p = await b.newPage({
	viewport: { width: 1280, height: 820 },
	deviceScaleFactor: 1,
});
for (const [url, path] of shots) {
	const r = await p.goto(url, { waitUntil: "load", timeout: 20000 });
	await p.waitForTimeout(1200);
	await p.screenshot({ path, type: "jpeg", quality: 62 });
	console.log(r?.status(), url);
}
await b.close();
