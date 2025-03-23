import Redis from "ioredis";

class RedisClient {
    private static instance: Redis;

    static getInstance(): Redis {
        if (!this.instance) {
            this.instance = new Redis({
                host: "localhost",
                port: 6379,
            });
        }
        return this.instance;
    }
}

export default RedisClient;
