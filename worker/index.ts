import { createClient } from "redis";
import { prisma } from "./prisma";

async function ensureGroup(
	name: string,
	client: ReturnType<typeof createClient>
) {
	try {
		await client.xGroupCreate("betteruptime:website", name, "$", {
			MKSTREAM: true,
		});
	} catch (err) {
		const error: string =
			err instanceof Error ? err.message : "unknown error";
		if (error.includes("BUSYGROUP")) {
			console.log("group exists.");
		} else {
			console.error("Failed to create group:", error);
		}
	}
}

async function worker() {
	const client = await createClient()
		.on("error", (err) => {
			console.log("redis client error: ", err);
		})
		.connect();

	await ensureGroup("india", client);
	await ensureGroup("usa", client);
	await ensureGroup("uk", client);
	while (1) {
		let end = false;
		for (let i = 0; i < 4; i++) {
			const res = await client.xReadGroup(
				"india",
				`india-${i}`,
				{
					key: "betteruptime:website",
					id: ">",
				},
				{
					COUNT: 1,
				}
			);

			if (!res) break;

			//TODO: add the logic to check the website status and push it to the website tick
		}
		if (end) break;
	}
	client.destroy();
}

async function main() {
	await worker();
}

main();
