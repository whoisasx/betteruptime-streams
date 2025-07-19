import { createClient } from "redis";

async function main() {
	const client = await createClient()
		.on("error", (err) => {
			console.log("error: ", err);
		})
		.connect();

	for (let i = 0; i < 5; i++) {
		let url = Math.random().toString();
		const res = await client.xAdd("betteruptime:website", "*", {
			url,
			id: i.toString(),
		});
		console.log(res);
	}
	const len = await client.xLen("betteruptime:website");
	console.log(len);

	client.destroy();
}

main();
