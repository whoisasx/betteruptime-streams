import { createClient } from "redis";
import { prisma } from "./prisma";

async function publisher() {
	const client = await createClient()
		.on("error", (err) => {
			console.log("redis client error: ", err);
		})
		.connect();

	try {
		const websites = await prisma.website.findMany({
			distinct: ["url"],
			select: {
				url: true,
			},
		});
		// console.log(websites);

		websites.forEach(async (w) => {
			await client.xAdd("betteruptime:website", "*", {
				url: w.url,
			});
		});

		const len = await client.XLEN("betteruptime:website");
		// console.log(len);
	} catch (err) {
		const message = err instanceof Error ? err.message : "unknown error";
		console.log(message);
	}

	client.destroy();
}

async function main() {
	// const intervalId = setInterval(publisher, 3000);
	publisher();
}

main();
