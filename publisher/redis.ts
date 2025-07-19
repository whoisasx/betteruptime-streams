import { createClient } from "redis";

const globalRedis = globalThis as unknown as {
	redis: ReturnType<typeof createClient> | undefined;
};

async function getRedisClient() {
	const client = createClient();
	client.on("error", (error) => {
		console.log("redis client error", error);
	});
	await client.connect();

	if (process.env.NODE_ENV !== "production") globalRedis.redis = client;

	return client;
}

export const redis = globalRedis.redis ?? (await getRedisClient());

// export const redis = createClient().on("error", (error) => {
// 	console.log("redis client error: ", error);
// });

// await redis.connect();
// console.log("client connected");
