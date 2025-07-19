import { createClient } from "redis";

async function main() {
	let client = createClient().on("error", (error) => {
		console.log("redis client error: ", error);
	});
	await client.connect();

	// const india_group = await client.xGroupCreate(
	// 	"betteruptime:website",
	// 	"india",
	// 	"0"
	// );
	// console.log(india_group);

	const res = await client.xReadGroup(
		"india",
		"india-1",
		{
			key: "betteruptime:website",
			id: ">",
		},
		{
			COUNT: 2,
		}
	);
	console.log(res);
	client.destroy();
}

main();
