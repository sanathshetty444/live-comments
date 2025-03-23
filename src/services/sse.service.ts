import { Response } from "express";

class SSEService {
    private static connections: Map<string, Response[]> = new Map();

    static addConnection(videoId: string, res: Response) {
        if (!this.connections.has(videoId)) {
            this.connections.set(videoId, []);
        }
        this.connections.get(videoId)?.push(res);

        // Clean up on client disconnect
        res.on("close", () => {
            this.removeConnection(videoId, res);
        });
    }

    static removeConnection(videoId: string, res: Response) {
        const clients = this.connections.get(videoId);
        if (!clients) return;

        this.connections.set(
            videoId,
            clients.filter((client) => client !== res)
        );
        if (this.connections.get(videoId)?.length === 0) {
            this.connections.delete(videoId);
        }
    }

    static broadcast(videoId: string, comment: any) {
        const clients = this.connections.get(videoId);
        if (!clients) return;

        const data = JSON.stringify(comment);
        clients.forEach((client) => {
            client.write(`data: ${data}\n\n`);
        });
    }
}

export { SSEService };
