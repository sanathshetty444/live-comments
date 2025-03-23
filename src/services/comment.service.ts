import CommentDAO from "../dao/comment.dao";
import { getVideoIdRange } from "../utils/hash";

class CommentService {
    async addComment(videoId: string, user: string, comment: string) {
        if (!user || !comment) {
            throw new Error("User and comment are required");
        }

        const videoIdRange = getVideoIdRange(videoId);
        return await CommentDAO.addComment(
            videoIdRange,
            videoId,
            user,
            comment
        );
    }
}

export default new CommentService();
