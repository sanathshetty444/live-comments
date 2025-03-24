-   Cassandra

    docker-compose up -d
    docker exec -it cassandra-node1 cqlsh

-   Create tables

    CREATE KEYSPACE comments_keyspace
    WITH replication = {
    'class': 'NetworkTopologyStrategy',
    'datacenter1': 2
    };

    CREATE TABLE comments_keyspace.comments (
    video_id_range INT,
    video_id UUID,
    comment_id UUID,
    user_name TEXT,
    comment_text TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY ((video_id_range, video_id), created_at, comment_id)
    ) WITH CLUSTERING ORDER BY (created_at DESC, comment_id DESC);

-   Check status
    docker exec -it cassandra-node1 nodetool status

-   Redis
    docker-compose -f redis.yml up -d

-   Kafka & Zookeeper
    docker run --name kafka -p 9092:9092 \
     -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2181 \
     -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
     -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
     confluentinc/cp-kafka

    docker run --name zookeeper -p 2181:2181 zookeeper

-   Kafdrop
    docker run -d -p 9000:9000 \ -e KAFKA_BROKERCONNECT=172.17.0.3:9092 \  
     obsidiandynamics/kafdrop

//todo

1. Request Coalescing
2. Cache warming

//High Priority

-   Actor
-   Moving mappings to redis
-   Sharing file discriptors

1. Dispatcher -> Listening to both clei
1. Pub/Sub
1. Dispatchers and Gateway servers -> mimicing distributed systems
1. Istio with Envoy
1. Observability
