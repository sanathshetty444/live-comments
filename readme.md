docker-compose up -d
docker exec -it cassandra-node1 cqlsh

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
PRIMARY KEY ((video_id_range, video_id), comment_id)
);

docker exec -it cassandra-node1 nodetool status

docker-compose -f redis.yml up -d

//todo

1. Request Coalescing
2. Cache warming

//High Priority

1. Pub/Sub
2. Dispatchers and Gateway servers -> mimicing distributed systems
3. Istio with Envoy
4. Observability
