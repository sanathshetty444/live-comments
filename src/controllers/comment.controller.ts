import { Request, Response } from "express";
import CommentService from "../services/comment.service";
import { SSEService } from "../services/sse.service";

class CommentController {
    static async addComment(req: Request, res: Response) {
        try {
            const { video_id } = req.params;
            const { user, comment } = req.body;
            const videoId = video_id;

            const result = await CommentService.addComment(
                videoId,
                user,
                comment
            );
            SSEService.broadcast(video_id, { video_id, user, comment });

            return res
                .status(201)
                .json({ message: "Comment added successfully", ...result });
        } catch (error: any) {
            console.error("Error:", error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    static subscribeToVideo(req: Request, res: Response): void {
        const { video_id } = req.params;

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        SSEService.addConnection(video_id, res);
    }
}

export default CommentController;
