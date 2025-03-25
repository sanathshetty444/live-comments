import express, { NextFunction, Request, Response } from "express";
import http from "http";

import commentRoutes from "./routes/comment.route";
import { KAFKA_TOPICS } from "./kafka/constants";
import KafkaConsumerPersistence from "./kafka/subscribers/comments-persistence.subscriber";
import KafkaConsumerSSE from "./kafka/subscribers/comments-sse.subscriber";
import SocketConfig from "./config/socket";
import StreamingSocketHandler from "./sockets/streaming";
import corsMiddleware from "./middlewares/cors.middleware";

const app = express();
const port = process.argv?.[2] || 8888;

const server = http.createServer(app);

// Initialize Socket.IO using Singleton
SocketConfig.getInstance().initialize(server);

// Initialize Handlers
const socketHandlers = [new StreamingSocketHandler()];
socketHandlers.forEach((handler) => handler.initialize());

// Initialize subscribers
const kafkaSubscribers = [
    new KafkaConsumerPersistence(KAFKA_TOPICS.VIDEO_COMMENTS),
    new KafkaConsumerSSE(KAFKA_TOPICS.VIDEO_COMMENTS),
];
kafkaSubscribers.forEach((subscriber) => subscriber.run());

app.use(express.json());

app.use(corsMiddleware);

app.use("/", commentRoutes);

server.listen(port, () => {
    console.log("Trying to connect to port", process.argv?.[2]);

    // new KafkaTopicCreator("video-comments").run();
    const persistence = new KafkaConsumerPersistence(
        KAFKA_TOPICS.VIDEO_COMMENTS
    );
    persistence.run();
    const sse = new KafkaConsumerSSE(KAFKA_TOPICS.VIDEO_COMMENTS);
    sse.run();
    console.log(`Server running on http://localhost:${port}`);
});
