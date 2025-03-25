import { Server } from "socket.io";
import http from "http";

class SocketConfig {
    private static instance: SocketConfig;
    private io: Server | null = null;

    private constructor() {}

    public static getInstance(): SocketConfig {
        if (!SocketConfig.instance) {
            SocketConfig.instance = new SocketConfig();
        }
        return SocketConfig.instance;
    }

    public initialize(server: http.Server) {
        if (!this.io) {
            this.io = new Server(server, {
                cors: {
                    origin: "*",
                },
            });
            console.log("Socket.IO initialized");
        }
    }

    public getIO(): Server {
        if (!this.io) {
            throw new Error(
                "Socket.IO not initialized. Call initialize() first."
            );
        }
        return this.io;
    }
}

export default SocketConfig;
