import KafkaClient from "../../config/kafka";
import { TCommentData } from "./types";

class KafkaPublisher {
    private producer = KafkaClient.getInstance().producer();
    private topic: string;

    constructor(topic: string) {
        this.topic = topic;
    }

    // Consistent hashing using commentId to determine partition
    private getPartition(commentId: string, totalPartitions: number): number {
        const hash = this.hashCode(commentId);
        return Math.abs(hash % totalPartitions);
    }

    private hashCode(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32-bit integer
        }
        return hash;
    }

    async publishMessage(data: TCommentData) {
        try {
            await this.producer.connect();

            // Get partitions count
            const admin = KafkaClient.getInstance().admin();
            await admin.connect();
            const metadata = await admin.fetchTopicMetadata({
                topics: [this.topic],
            });
            const totalPartitions = metadata.topics[0].partitions.length;
            await admin.disconnect();

            // Get the partition using consistent hashing
            const partition = this.getPartition(data.id, totalPartitions);

            await this.producer.send({
                topic: this.topic,
                messages: [
                    {
                        key: data.id,
                        value: JSON.stringify(data),
                        partition,
                    },
                ],
            });

            console.log(
                `Message published to partition ${partition} for video: ${
                    data.videoId
                }, with payload ${JSON.stringify(data)}`
            );
        } catch (error) {
            console.error("Error publishing message:", error);
        } finally {
            await this.producer.disconnect();
        }
    }
}

export default KafkaPublisher;
