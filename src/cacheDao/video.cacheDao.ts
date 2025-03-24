import RedisClient from "../config/redis";

class VideoMappingDAO {
    private static redisClient = RedisClient.getInstance();

    // Add connection to video mapping
    static async addConnection(
        videoId: string,
        connectionId: string
    ): Promise<void> {
        const key = `video_subscribers:${videoId}`;
        await this.redisClient.sadd(key, connectionId);
    }

    // Remove connection from video mapping
    static async removeConnection(
        videoId: string,
        connectionId: string
    ): Promise<void> {
        const key = `video_subscribers:${videoId}`;
        await this.redisClient.srem(key, connectionId);
    }

    // Get all connections for a video
    static async getConnections(videoId: string): Promise<string[]> {
        const key = `video_subscribers:${videoId}`;
        return await this.redisClient.smembers(key);
    }

    // Cleanup if no connections remain
    static async deleteVideoMapping(videoId: string): Promise<void> {
        const key = `video_subscribers:${videoId}`;
        await this.redisClient.del(key);
    }
}

export default VideoMappingDAO;
