# 单机大厂架构模拟方案

> 本文件定义 `mimic-harness` 在只有一台服务器的情况下，如何尽量模拟大厂工程架构。  
> 目标不是堆满中间件，而是在单机资源可承受的前提下，把网关、服务拆分、缓存、MQ、对象存储、向量检索、可观测性、部署和回滚这些“大厂味儿”做出来。
>
> 运行资源按 `2 核 4G` 保守设计。  
> 面试中的集群演进表达见 `11_INTERVIEW_CLUSTER_DESIGN_ZH.md`。

## 1. 总体原则

你只有单机，所以架构要这样取舍：

```text
逻辑上模仿大厂
物理上保持单机
中间件按需启用
接口和 adapter 先设计好
重型组件先不硬上
形态必须存在
替代方案必须能跑通
服务器能装就装，装不动就用轻量替代
```

一句话：

```text
单机部署，多服务拆分，轻量中间件优先，重型中间件预留 adapter。
```

更准确地说：

```text
不是没有 Kafka，而是先用 EventBusPort + Redis Streams / RabbitMQ 跑通 Kafka 形态。
不是没有 Milvus，而是先用 VectorStorePort + pgvector 跑通向量库形态。
不是没有 Kubernetes，而是先用 Docker Compose profiles 跑通多服务编排形态。
不是没有 ELK，而是先用中文结构化日志 + trace_events + Grafana 跑通观测形态。
```

## 2. 推荐单机分层

2 核 4G 默认只跑 core profile。

```text
gateway
frontend-web
java-agent
python-agent
postgres + pgvector
redis
```

其他组件先保留形态和轻量替代，不强制启动。

```text
公网
  -> Nginx / Caddy 网关
    -> frontend-web
    -> java-agent
    -> python-agent
    -> grafana

核心存储
  -> PostgreSQL + pgvector
  -> Redis

增强组件
  -> MinIO
  -> RabbitMQ
  -> OTel Collector
  -> Prometheus
  -> Grafana
```

不建议单机一开始安装：

```text
Kafka
Milvus
Elasticsearch
Kubernetes
完整 ELK
多节点 Redis Cluster
多节点数据库集群
```

这些不是不好，而是单机学习项目上来就装，排查成本会盖过 Agent 本身。

## 3. 大厂组件形态与可运行替代

每个大厂组件都必须满足三层设计：

```text
Port：业务依赖的抽象接口
Light Adapter：单机可运行替代实现
Heavy Adapter：资源足够时启用的真实大组件实现
```

| 大厂形态 | Port | 单机可运行替代 | 重型实现 | 第一阶段必须跑通什么 |
| --- | --- | --- | --- | --- |
| Kafka 事件总线 | `EventBusPort` | Redis Streams | Kafka | 文件解析/Embedding 任务能异步投递和消费 |
| 企业 MQ | `EventBusPort` | RabbitMQ | Kafka/Pulsar | 消息确认、重试、死信语义 |
| Milvus 向量库 | `VectorStorePort` | PostgreSQL + pgvector | Milvus | 文档 chunk 可以向量检索 |
| S3 对象存储 | `ObjectStoragePort` | 本地目录 / MinIO | OSS/S3/TOS/COS | 文件上传、读取、删除 |
| ELK 日志平台 | `LogQueryPort` | 文件日志 + PostgreSQL trace_events | Elasticsearch/Loki | 按 runId 查日志和 Trace |
| Jaeger/Tempo Trace | `TraceRepositoryPort` | PostgreSQL trace_events | Tempo/Jaeger | 一次 run 可回放 |
| Redis Cluster | `CachePort` | Redis 单实例 | Redis Cluster | run state、cancel signal、限流 |
| Kubernetes | `DeploymentPort` | Docker Compose profiles | K8s/GitOps | 一条命令启动多服务 |
| Service Mesh | `GatewayPort` | Nginx/Caddy + correlationId | Istio/Envoy | 路由、超时、SSE、请求 ID |
| 配置中心 | `ConfigPort` | `.env` + config files | Nacos/Apollo/Consul | 环境隔离和缺失配置校验 |

硬规则：

```text
Heavy Adapter 可以不启用。
Light Adapter 必须能跑通。
Port 必须先设计。
前端和业务层只能依赖 Port 语义，不能依赖具体中间件。
```

## 4. Docker Compose Profiles

用 `docker compose --profile` 分层启动。

```text
core          必装核心链路
storage       对象存储
mq            异步任务
observability 可观测性
rag           向量检索增强
full          全部打开
```

### 4.1 core

适合 2 核 4G。

```text
nginx / caddy
frontend-web
java-agent
python-agent
postgres + pgvector
redis
```

能力：

```text
前端访问
Java/Python runtime 切换
SSE 流式
会话保存
短期缓存
基础 RAG
基础 Trace 落库
```

### 4.2 storage

适合 4 核 8G。

```text
minio
```

能力：

```text
文件上传
图片保存
文档原件保存
导出报告保存
```

### 4.3 mq

适合 4 核 8G。

```text
rabbitmq
```

能力：

```text
文档解析异步化
Embedding 异步化
评测任务异步化
Trace 归档异步化
```

如果服务器小：

```text
先用 Redis Streams 模拟 MQ。
RabbitMQ adapter 先写接口，后面再启用。
```

无论 RabbitMQ 是否启用，`EventBusPort` 形态都必须存在。

最低可运行链路：

```text
发布 document.parse.requested
Redis Streams 保存消息
worker 消费消息
失败时记录重试次数
最终写入 task 状态
```

### 4.4 observability

适合 4 核 8G 或更高。

```text
otel-collector
prometheus
grafana
```

能力：

```text
指标采集
运行看板
服务健康状态
Agent Run 耗时观察
模型调用耗时观察
```

如果资源紧张：

```text
先只保留应用中文结构化日志 + trace_events 表。
Grafana 作为可选 profile。
```

无论 Grafana 是否启用，观测形态都必须存在。

最低可运行链路：

```text
每个请求生成 correlationId
每个 run 生成 runId
关键步骤写 trace_events
日志带 runId/threadId/model/provider
前端 Trace 面板可查看 run 事件
```

### 4.5 rag

单机默认：

```text
PostgreSQL + pgvector
```

不默认启用 Milvus。

原因：

```text
pgvector 已经能完整模拟 RAG 链路。
Milvus 更适合大规模向量检索。
单机同时跑 Java、Python、Postgres、Redis、MinIO、RabbitMQ、Grafana 时，再加 Milvus 压力较大。
```

Milvus 处理方式：

```text
保留 VectorStorePort。
先实现 PgVectorStoreAdapter。
后续再实现 MilvusVectorStoreAdapter。
```

无论 Milvus 是否启用，向量库形态都必须存在。

最低可运行链路：

```text
上传文档
切 chunk
生成 embedding
写入 pgvector
按 query vector topK 检索
返回引用 chunk
```

## 5. 单机资源档位

### 5.1 低配：2 核 4G

只跑 core。

```text
frontend-web
java-agent
python-agent
postgres + pgvector
redis
nginx / caddy
```

限制：

```text
不跑 Grafana。
不跑 RabbitMQ。
不跑 MinIO。
文件先用本地目录。
MQ 先用 Redis Streams。
Trace 先落 PostgreSQL。
```

### 5.2 标准：4 核 8G

推荐学习配置。

```text
core
storage
mq
observability
```

可以跑：

```text
MinIO
RabbitMQ
Prometheus
Grafana
OTel Collector
```

仍然不建议默认跑：

```text
Kafka
Milvus
Elasticsearch
```

### 5.3 舒服：4 核 16G / 8 核 16G

可以尝试：

```text
Milvus standalone
Loki
更完整的 dashboard
更多 worker
```

但仍然保持：

```text
PostgreSQL 是主库。
pgvector 是默认向量实现。
Milvus 是可选替代。
```

## 6. 大厂架构如何在单机模拟

| 大厂能力 | 单机模拟方式 | 真实规模化方式 |
| --- | --- | --- |
| API Gateway | Nginx / Caddy | 专用网关、Ingress、Service Mesh |
| 服务拆分 | frontend/java/python 多容器 | 多服务多实例 |
| 主库 | PostgreSQL | 云 RDS、主从、分库 |
| 缓存 | Redis 单实例 | Redis Cluster |
| MQ | Redis Streams / RabbitMQ | Kafka / Pulsar |
| 对象存储 | MinIO | S3 / OSS / TOS / COS |
| 向量库 | pgvector | Milvus / Zilliz / Pinecone |
| Trace | trace_events 表 + OTel | Tempo / Jaeger |
| Metrics | Prometheus 单机 | Prometheus 集群 / 云监控 |
| Dashboard | Grafana 单机 | 统一观测平台 |
| 部署 | Docker Compose | Kubernetes / GitOps |

重点：

```text
目录、接口、事件、adapter、日志、Trace 按大厂方式设计。
部署形态先用单机 Docker Compose。
```

## 7. 推荐最终单机 Compose 服务

```text
gateway:
  nginx / caddy

apps:
  frontend-web
  java-agent
  python-agent

data:
  postgres
  redis
  minio

async:
  rabbitmq
  document-worker
  embedding-worker

observability:
  otel-collector
  prometheus
  grafana
```

第一版不要把 worker 做得太复杂。

可以先：

```text
java-agent 内部消费异步任务
python-agent 内部消费异步任务
后续再拆 document-worker / embedding-worker
```

## 8. 中间件安装优先级

按这个顺序来：

```text
1. PostgreSQL + pgvector
2. Redis
3. Nginx / Caddy
4. MinIO
5. RabbitMQ
6. OTel Collector
7. Prometheus
8. Grafana
9. Milvus standalone
10. Kafka
```

不要反过来。

原因：

```text
PostgreSQL、Redis、网关直接影响主链路。
MinIO、RabbitMQ、观测是增强。
Milvus、Kafka 是规模化模拟，不是第一阶段刚需。
```

## 9. 应用内部仍然要大厂分层

即使单机部署，代码也不能写成单体糊在一起。

必须保留：

```text
Controller / Router
UseCase
Domain
Port
Infrastructure Adapter
```

比如 RAG：

```text
domain 定义 VectorRetriever
ports 定义 VectorStorePort
infrastructure 实现 PgVectorStoreAdapter
后续再实现 MilvusVectorStoreAdapter
```

比如 MQ：

```text
ports 定义 EventBusPort
infrastructure 实现 RedisStreamsEventBus
后续再实现 RabbitMqEventBus
```

这样就算现在跑在单机，架构也有迁移空间。

## 10. 最小可运行替代闭环

每个“暂不硬上”的组件，都必须有可运行替代闭环。

### 10.1 Kafka 替代闭环

```text
EventBusPort
  -> RedisStreamsEventBus
  -> RabbitMqEventBus
  -> KafkaEventBus
```

第一阶段跑通：

```text
file.uploaded
  -> Redis Streams
  -> DocumentWorker
  -> documents 表状态更新
```

### 10.2 Milvus 替代闭环

```text
VectorStorePort
  -> PgVectorStoreAdapter
  -> MilvusVectorStoreAdapter
```

第一阶段跑通：

```text
document_chunks
  -> embedding
  -> pgvector
  -> topK search
  -> RagSearchTool
```

### 10.3 ELK 替代闭环

```text
LogQueryPort
  -> LocalFileLogQueryAdapter
  -> PostgresTraceQueryAdapter
  -> LokiLogQueryAdapter
```

第一阶段跑通：

```text
runId
  -> trace_events
  -> 前端 TraceTimeline
  -> 中文结构化日志 grep 查询
```

### 10.4 Kubernetes 替代闭环

```text
DeploymentPort
  -> DockerComposeDeploymentAdapter
  -> KubernetesDeploymentAdapter
```

第一阶段跑通：

```text
docker compose --profile core up
  -> gateway
  -> frontend
  -> java-agent
  -> python-agent
  -> postgres
  -> redis
```

## 11. 单机部署不允许

```text
不允许把所有逻辑写在一个服务里。
不允许前端直接访问数据库。
不允许公网暴露 PostgreSQL、Redis、RabbitMQ、MinIO 管理端。
不允许把 API Key 写进镜像。
不允许因为单机就不要日志和 Trace。
不允许为了装中间件牺牲主链路稳定性。
不允许说“暂不上 Kafka/Milvus/ELK”就完全没有对应架构形态。
不允许没有轻量替代实现就进入下一阶段。
```

## 12. 最终建议

你这个项目最合适的最终形态是：

```text
单台云服务器
Docker Compose
多容器模拟大厂架构
PostgreSQL + pgvector 做主存储和向量存储
Redis 做缓存和轻量 MQ
MinIO 做对象存储
RabbitMQ 做异步任务
Nginx / Caddy 做网关
Prometheus + Grafana 做观测
Milvus / Kafka 保留 adapter 形态，默认由 pgvector / Redis Streams 跑通
```

这样既能学到大厂架构，又不会把服务器压死。
