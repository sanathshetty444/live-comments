import KafkaClient from "../../config/kafka";
import { v4 as uuidv4 } from "uuid";
import CommentService from "../../services/comment.service";
import { TCommentData } from "../publishers/types";
import { getVideoIdRange } from "../../utils/hash";
import commentDao from "../../dao/comment.dao";
import CacheDAO from "../../cacheDao/comment.cacheDao";

class KafkaConsumerPersistence {
    private consumer;
    private topic: string;

    constructor(topic: string) {
        const uniqueGroupId = `video-comments-persistence-group`; // Unique groupId for each consumer
        this.topic = topic;
        this.consumer = KafkaClient.getInstance().consumer({
            groupId: uniqueGroupId,
        });
    }

    async run() {
        try {
            await this.consumer.connect();
            console.log(
                "Connected to Kafka Consumer with groupId:",
                this.consumer
            );

            await this.consumer.subscribe({
                topic: this.topic,
                fromBeginning: false,
            });

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const data: TCommentData = message.value
                        ? JSON.parse(message.value.toString())
                        : null;
                    console.log(
                        `Received message from partition ${partition}:`,
                        data
                    );

                    if (data) {
                        const videoIdRange = getVideoIdRange(data.videoId);
                        const res = await commentDao.addComment(
                            videoIdRange,
                            data.videoId,
                            data.user,
                            data.comment
                        );

                        await CacheDAO.invalidateCommentsCache(data.videoId);

                        console.log(res);
                    }
                },
            });
        } catch (error) {
            console.error("Error in Kafka Consumer:", error);
        }
    }
}

export default KafkaConsumerPersistence;
