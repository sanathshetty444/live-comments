import CacheDAO from "../cacheDao/comment.cacheDao";
import RedisClient from "../config/redis";
import CommentDAO from "../dao/comment.dao";
import { getVideoIdRange } from "../utils/hash";

class CommentService {
    static async addComment(videoId: string, user: string, comment: string) {
        if (!user || !comment) {
            throw new Error("User and comment are required");
        }

        const videoIdRange = getVideoIdRange(videoId);
        const res = await CommentDAO.addComment(
            videoIdRange,
            videoId,
            user,
            comment
        );

        await CacheDAO.invalidateCommentsCache(videoId);

        return res;
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
