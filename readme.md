# Live Commenting Backend with Cassandra, Redis, Kafka, and Kafdrop

This project implements a **Live Commenting Module** using Node.js, Cassandra, Redis, Kafka, and other tools to simulate a distributed environment. It focuses on real-time comment management, scaling strategies, and observability.

## 🛠️ **Tech Stack**

-   **Node.js** for the backend API.
-   **Cassandra** for comment storage.
-   **Redis** for caching and efficient reads.
-   **Kafka** for event streaming using a pub/sub model.
-   **Zookeeper** for Kafka coordination.
-   **Kafdrop** for Kafka UI visualization.
-   **Docker** for containerization.
-   **Istio with Envoy** for service mesh management.
-   **OpenTelemetry, Jaeger, Grafana, Prometheus** for observability.
-   **ELK Stack** for log management.

---

## 🚀 **Getting Started**

### 1. **Cassandra Setup**

-   Start Cassandra using Docker:

```bash
docker-compose up -d
```

-   Access Cassandra shell using `cqlsh`:

```bash
docker exec -it cassandra-node1 cqlsh
```

### 2. **Create Keyspace and Table**

```sql
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
```

-   Check Cassandra cluster status:

```bash
docker exec -it cassandra-node1 nodetool status
```

---

### 3. **Redis Setup**

-   Start Redis using Docker:

```bash
docker-compose -f redis.yml up -d
```

-   Connect to Redis CLI:

```bash
docker exec -it redis redis-cli
```

---

### 4. **Kafka & Zookeeper Setup**

-   Start Zookeeper:

```bash
docker run --name zookeeper -p 2181:2181 zookeeper
```

-   Start Kafka:

```bash
docker run --name kafka -p 9092:9092 \
    -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2181 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
    -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
    confluentinc/cp-kafka
```

---

### 5. **Kafdrop Setup**

-   Start Kafdrop for Kafka visualization:

```bash
docker run -d -p 9000:9000 \
    -e KAFKA_BROKERCONNECT=host.docker.internal:9092 \
    obsidiandynamics/kafdrop
```

-   Access Kafdrop UI at [http://localhost:9000](http://localhost:9000)

---

## 📌 **To-Do List**

### ✅ **Completed**

-   Moving video mappings to Redis
-   Implementing dispatcher
-   Kafka Pub/Sub implementation
-   Distributed system simulation with multiple application clusters (Docker-based)
-   WebRTC based video calling SFU based

### 🔎 **High Priority**

-   Implement Actors for managing state
-   Efficient File Descriptor Management
-   Test distributed setup across multiple Docker containers
-   Integrate Istio with Envoy for service mesh
-   Implement observability using:
    -   OpenTelemetry
    -   Jaeger
    -   Grafana
    -   Prometheus
    -   ELK Stack
-   App for live video streaming and commenting
-   WebRTC based video calling, screen share and remote access MFU based

### 📦 **Future Enhancements**

-   **Request Coalescing:** Merge similar requests to reduce load.
-   **Cache Warming:** Pre-load frequently accessed data into Redis.

---

## 📄 **Project Overview**

This project focuses on creating a scalable, fault-tolerant backend for live comments. It simulates a distributed environment, provides real-time updates using SSE, and uses Kafka for durability and replayability. Redis is leveraged for caching to improve read throughput.

> The codebase is organized using the CQS (Command Query Separation) pattern for clean separation of concerns. Cassandra serves as the primary database, and Kafka ensures reliable message delivery.

For further information, explore the code and detailed documentation within respective folders.

---

**Contributors:**

-   Sanath Shetty

**License:** MIT License.
