import { Client } from "cassandra-driver";

class CassandraClient {
    private static instance: Client;

    private constructor() {}

    public static getInstance(): Client {
        if (!CassandraClient.instance) {
            CassandraClient.instance = new Client({
                contactPoints: ["localhost"],
                localDataCenter: "dc1",
                keyspace: "comments_keyspace",
            });
            console.log("Cassandra Client Connected");
        }
        return CassandraClient.instance;
    }
}

export default CassandraClient;
