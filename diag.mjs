import { chromium } from "playwright";

for (const args of [
	["--no-proxy-server"],
	["--proxy-bypass-list=<-loopback>"],
]) {
	const b = await chromium.launch({ args });
	const p = await b.newPage();
	for (const u of ["http://127.0.0.1:4321/", "http://localhost:4321/"]) {
		try {
			const r = await p.goto(u, { timeout: 15000 });
			console.log(args[0], u, "->", r.status(), (await p.title()).slice(0, 40));
		} catch (e) {
			console.log(args[0], u, "FAIL", e.message.split("\n")[0].slice(0, 60));
		}
	}
	await b.close();
}
