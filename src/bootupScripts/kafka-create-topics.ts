import KafkaClient from "../config/kafka";
import { IBootUpScript } from "./interfaces";

class KafkaTopicCreator implements IBootUpScript {
    private admin = KafkaClient.getInstance().admin();
    private topicName: string;
    private partitions: number;
    private replicationFactor: number;

    constructor(topicName: string, partitions = 3, replicationFactor = 1) {
        this.topicName = topicName;
        this.partitions = partitions;
        this.replicationFactor = replicationFactor;
    }

    async run(): Promise<void> {
        try {
            await this.admin.connect();
            console.log("Connected to Kafka");

            const topics = await this.admin.listTopics();
            if (topics.includes(this.topicName)) {
                console.log(`Topic '${this.topicName}' already exists`);
            } else {
                await this.admin.createTopics({
                    topics: [
                        {
                            topic: this.topicName,
                            numPartitions: this.partitions,
                            replicationFactor: this.replicationFactor,
                        },
                    ],
                });
                console.log(`Topic '${this.topicName}' created successfully`);
            }
        } catch (error) {
            console.error("Error creating topic:", error);
        } finally {
            await this.admin.disconnect();
        }
    }
}

export default KafkaTopicCreator;
