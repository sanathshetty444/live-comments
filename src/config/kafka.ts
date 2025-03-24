import { Kafka, Producer, Consumer, Admin } from "kafkajs";

class KafkaClient {
    private static instance: Kafka;
    private static producerInstance: Producer;
    private static consumerInstance: Consumer;
    private static adminInstance: Admin;

    private constructor() {}

    // Kafka Client
    static getInstance(): Kafka {
        if (!this.instance) {
            this.instance = new Kafka({
                clientId: "video-comments",
                brokers: ["localhost:9092"],
            });
        }
        return this.instance;
    }

    // Producer
    static getProducer(): Producer {
        if (!this.producerInstance) {
            this.producerInstance = this.getInstance().producer();
        }
        return this.producerInstance;
    }

    // Consumer
    static getConsumer(groupId: string): Consumer {
        if (!this.consumerInstance) {
            this.consumerInstance = this.getInstance().consumer({ groupId });
        }
        return this.consumerInstance;
    }

    // Admin
    static getAdmin(): Admin {
        if (!this.adminInstance) {
            this.adminInstance = this.getInstance().admin();
        }
        return this.adminInstance;
    }
}

export default KafkaClient;
