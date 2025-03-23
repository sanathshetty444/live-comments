import express, { Request, Response } from "express";

const app = express();
const port = 8888;
const connections: Record<string, Response[]> = {};

app.get("/subscribe/:video_id", (req: Request, res: Response) => {
    const { video_id } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    if (!connections[video_id]) {
        connections[video_id] = [];
    }
    connections[video_id].push(res);

    req.on("close", () => {
        connections[video_id] = connections[video_id].filter(
            (conn) => conn !== res
        );
    });

    console.log(`User subscribed to video: ${video_id}`);
});

app.post(
    "/comment/:video_id",
    express.json(),
    (req: Request, res: Response) => {
        const { video_id } = req.params;
        const { user, comment } = req.body;

        if (connections[video_id]) {
            connections[video_id].forEach((conn) => {
                conn.write(`data: ${JSON.stringify({ user, comment })}\n\n`);
            });
        }

        res.status(200).json({ message: "Comment sent" });
    }
);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
