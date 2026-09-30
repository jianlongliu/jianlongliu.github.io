import { chromium } from "playwright";

const shots = [
	["http://127.0.0.1:4321/", "/tmp/shot-local-home.png"],
	["http://127.0.0.1:4321/posts/oh-my-desktop/", "/tmp/shot-local-post.png"],
	["http://127.0.0.1:4321/archive/", "/tmp/shot-local-archive.png"],
	["http://127.0.0.1:4321/about/", "/tmp/shot-local-about.png"],
];

const b = await chromium.launch({ args: ["--no-proxy-server"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
for (const [url, path] of shots) {
	try {
		const resp = await p.goto(url, { waitUntil: "load", timeout: 20000 });
		await p.waitForTimeout(1500);
		await p.screenshot({ path });
		console.log(`${resp?.status()} ${url} -> ${path}`);
	} catch (e) {
		console.log(`FAIL ${url}: ${e.message.split("\n")[0]}`);
	}
}
await b.close();
