import CacheDAO from "../cacheDao/comment.cacheDao";
import RedisClient from "../config/redis";
import { v4 as uuid } from "uuid";
import CommentDAO from "../dao/comment.dao";
import KafkaPublisher from "../kafka/publishers/comments.publisher";
import { getVideoIdRange } from "../utils/hash";
import { KAFKA_TOPICS } from "../kafka/constants";

class CommentService {
    static async addComment(videoId: string, user: string, comment: string) {
        if (!user || !comment) {
            throw new Error("User and comment are required");
        }

        const publisher = new KafkaPublisher(KAFKA_TOPICS.VIDEO_COMMENTS);

        const data = {
            id: uuid(),
            videoId,
            user,
            comment,
            timestamp: new Date().toISOString(),
        };

        // Publish the comment
        await publisher.publishMessage(data);

        return data;
    }
    static async getCommentsByVideoId(video_id: string) {
        const cachedData = await CacheDAO.getCommentsFromCache(video_id);
        if (cachedData) {
            console.log("Cache Hit");
            return cachedData;
        }

        console.log("Cache Miss, Fetching from Cassandra");
        const comments = await CommentDAO.getCommentsByVideoId(video_id);
        await CacheDAO.setCommentsToCache(video_id, comments);
        return comments;
    }
}

export default CommentService;
