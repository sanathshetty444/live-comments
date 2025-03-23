import RedisClient from "../config/redis";

class CacheDAO {
    private static redisClient = RedisClient.getInstance();

    // Read from Cache
    static async getCommentsFromCache(video_id: string): Promise<any | null> {
        const cacheKey = `comments:${video_id}`;
        const cachedData = await this.redisClient.get(cacheKey);
        return cachedData ? JSON.parse(cachedData) : null;
    }

    // Write to Cache
    static async setCommentsToCache(
        video_id: string,
        comments: any
    ): Promise<void> {
        const cacheKey = `comments:${video_id}`;
        await this.redisClient.set(
            cacheKey,
            JSON.stringify(comments),
            "EX",
            600
        ); // 10 min expiry
    }

    // Invalidate Cache
    static async invalidateCommentsCache(video_id: string): Promise<void> {
        const cacheKey = `comments:${video_id}`;
        await this.redisClient.del(cacheKey);
    }
}

export default CacheDAO;
