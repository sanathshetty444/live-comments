import KafkaClient from "../../config/kafka";
import { v4 as uuidv4 } from "uuid";
import CommentService from "../../services/comment.service";
import { TCommentData } from "../publishers/types";
import { SSEService } from "../../services/sse.service";

class KafkaConsumerSSE {
    private consumer;
    private topic: string;

    constructor(topic: string) {
        const uniqueGroupId = `video-comments-sse-${uuidv4()}`; // Unique groupId for each consumer
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
                        SSEService.broadcast(data.videoId, {
                            video_id: data.videoId,
                            user: data.user,
                            comment: data.comment,
                        });
                    }
                },
            });
        } catch (error) {
            console.error("Error in Kafka Consumer:", error);
        }
    }
}

export default KafkaConsumerSSE;
