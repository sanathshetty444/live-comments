import { Response } from "express";
import VideoMappingDAO from "../cacheDao/video.cacheDao";
import { v4 as uuid } from "uuid";
class SSEService {
    private static connections: Record<string, Response> = {};

    static async addConnection(videoId: string, res: Response) {
        const connectionId = uuid();
        await VideoMappingDAO.addConnection(videoId, connectionId);

        this.connections[connectionId] = res;

        // Clean up on client disconnect
        res.on("close", () => {
            this.removeConnection(videoId, connectionId);
        });
    }

    static async removeConnection(videoId: string, connectionId: string) {
        await VideoMappingDAO.removeConnection(videoId, connectionId);
        delete this.connections[connectionId];
    }

    static async broadcast(videoId: string, comment: any) {
        const clients = await await VideoMappingDAO.getConnections(videoId);
        if (!clients) return;

        const data = JSON.stringify(comment);
        clients.forEach((client) => {
            this.connections?.[client]?.write(`data: ${data}\n\n`);
        });
    }
}

export { SSEService };
