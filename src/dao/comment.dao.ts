import CassandraClient from "../config/database";
import { v4 as uuidv4 } from "uuid";

class CommentDAO {
    private client = CassandraClient.getInstance();

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
