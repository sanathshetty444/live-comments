import express from "express";
import commentRoutes from "./routes/comment.route";
import { KAFKA_TOPICS } from "./kafka/constants";
import KafkaConsumerPersistence from "./kafka/subscribers/comments-persistence.subscriber";
import KafkaConsumerSSE from "./kafka/subscribers/comments-sse.subscriber";

const app = express();
const port = process.argv?.[2] || 8888;
app.use(express.json());

app.use("/", commentRoutes);

app.listen(port, () => {
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
