import express, { Request, Response } from "express";
import CommentController from "./controllers/comment.controller";
import commentRoutes from "./routes/comment.route";
import { SSEService } from "./services/sse.service";

const app = express();
const port = 8888;
const connections: Record<string, Response[]> = {};

app.get("/subscribe/:video_id", (req: Request, res: Response) => {
    const { video_id } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    res.flushHeaders();

    SSEService.addConnection(video_id, res);
});
app.use(express.json());

app.use("/", commentRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
