import CassandraClient from "../config/database";
import { v4 as uuidv4 } from "uuid";
import { getVideoIdRange } from "../utils/hash";

class CommentDAO {
    private client = CassandraClient.getInstance();

    async getCommentsByVideoId(video_id: string) {
        const video_id_range = getVideoIdRange(video_id); // Based on partitioning
        const query = `SELECT * FROM comments_keyspace.comments WHERE video_id_range = ? AND video_id = ?`;
        const result = await this.client.execute(
            query,
            [video_id_range, video_id],
            {
                prepare: true,
            }
        );
        return result.rows;
    }
    async addComment(
        videoIdRange: number,
        videoId: string,
        user: string,
        comment: string
    ) {
        const commentId = uuidv4();
        const createdAt = new Date();

        const query = `
      INSERT INTO comments (video_id_range, video_id, comment_id, user_name, comment_text, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        const params = [
            videoIdRange,
            videoId,
            commentId,
            user,
            comment,
            createdAt,
        ];

        console.log(params);

        await this.client.execute(query, params, { prepare: true });

        return { commentId, createdAt };
    }
}

export default new CommentDAO();
