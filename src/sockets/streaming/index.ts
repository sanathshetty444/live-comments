import SocketHandler from "../";
import { Socket } from "socket.io";

import RedisConfig from "../../config/redis";

export default class StreamingSocketHandler extends SocketHandler {
    private redis = RedisConfig.getInstance();

    constructor() {
        super("/streaming");
    }

    initialize(): void {
        this.namespace.on("connection", (socket: Socket) => {
            console.log("User connected to streaming namespace");

            // Join Room
            socket.on("joinRoom", async (data) => {
                const { roomId, userId } = data;
                console.log(`User ${socket.id} joined room ${roomId}`);
                await this.redis.sadd(`room:${roomId}`, socket.id);
                socket.join(roomId);
                socket.to(roomId).emit("joinRoom", { userId });
            });

            // Forward Offer
            socket.on("offer", (data) => {
                socket.to(data.roomId).emit("offer", data);
            });

            // Forward Answer
            socket.on("answer", (data) => {
                socket.to(data.roomId).emit("answer", data);
            });

            // Forward ICE Candidate
            socket.on("iceCandidate", (data) => {
                socket.to(data.roomId).emit("iceCandidate", data);
            });

            // Disconnect
            socket.on("disconnect", async () => {
                console.log(`User ${socket.id} disconnected`);
                const roomKeys = await this.redis.keys("room:*");
                for (const roomKey of roomKeys) {
                    const isMember = await this.redis.sismember(
                        roomKey,
                        socket.id
                    );
                    if (isMember) {
                        await this.redis.srem(roomKey, socket.id);
                        console.log(`Removed ${socket.id} from ${roomKey}`);
                    }
                }
            });
        });
    }
}
