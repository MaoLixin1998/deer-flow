# 独立开发计划

> 本文件只记录 `mimic-harness` 的开发阶段、任务拆分、产物和验收标准。  
> 技术调研看 `03_GLOBAL_AGENT_ARCH_RESEARCH_ZH.md`。  
> 代码规则看 `01_CODE_RULES_ZH.md`。  
> 数据流转、缓存、MQ、RAG、上下文和 Loop 看 `05_DATA_FLOW_STORAGE_LOOP_ZH.md`。  
> 前端设计、高保真原型、图标和素材看 `06_FRONTEND_DESIGN_ASSET_PIPELINE_ZH.md`。  
> 每个 Phase 的标准开发流程看 `09_PHASE_DELIVERY_PROCESS_ZH.md`。  
> 单机大厂架构模拟看 `10_SINGLE_NODE_ENTERPRISE_ARCH_ZH.md`。  
> 面试集群架构表达看 `11_INTERVIEW_CLUSTER_DESIGN_ZH.md`。  
> 产品主题看 `12_PRODUCT_THEME_ZH.md`。  
> Phase 1 启动看 `phases/phase-01/00_PHASE1_KICKOFF_ZH.md`。

## 1. 总体路线

开发策略：

```text
先协议
再 mock
再真实模型
再工具
再记忆
再 Trace
再降级
再 Multi-Agent
再 RAG
最后接入成熟框架 adapter
最终发布到云服务器 Docker
单机模拟大厂中间件架构
```

核心原则：

```text
每个阶段都必须形成可运行闭环。
Java 和 Python 必须保持同构。
前端必须能同时切换两个 runtime。
运行环境只承诺 2 核 4G core profile。
每个阶段都必须按 09_PHASE_DELIVERY_PROCESS_ZH.md 走完需求、设计、原型、开发、联调、测试、文档和复盘。
```

## 2. 里程碑总览

| 阶段 | 名称 | 目标 | 状态 |
| --- | --- | --- | --- |
| Phase 0 | 工作区整理 | 三大目录并排，文档入口清楚 | 已完成 |
| Phase 1 | 主题化 Contracts + Mock SSE | 已完成 Contracts 基线，Phase 1.5 Figma 高保真设计稿进行中 | Figma 设计稿进行中 |
| Phase 2 | 最小 Agent Loop | Java/Python 手写 AgentRunner | 待开始 |
| Phase 3 | 国产模型接入 | Qwen、豆包、智谱、Mock | 待开始 |
| Phase 4 | Tool Calling | calculator、datetime、mock search | 待开始 |
| Phase 5 | Thread + Memory | 会话、多轮记忆、持久化 | 待开始 |
| Phase 6 | Trace + Observability | Trace 面板、后端结构化日志 | 待开始 |
| Phase 7 | Fallback | 模型/能力/工具降级 | 待开始 |
| Phase 8 | Multi-Agent | Supervisor + Specialist | 待开始 |
| Phase 9 | RAG + 文件 + 图片 | 文档检索、图片理解 | 待开始 |
| Phase 10 | Framework Adapter | 接 Spring AI / LangChain4j / LangGraph / OpenAI Agents | 待开始 |
| Phase 11 | 测试与评测 | Java/Python 行为一致性 | 待开始 |
| Phase 12 | 云服务器 Docker 发布 | 前端、Java、Python、数据库、网关一键部署 | 待开始 |
| Phase 13 | 单机大厂架构增强 | 按 profile 启用 MinIO、RabbitMQ、观测、pgvector | 待开始 |
| Phase 14 | 面试集群方案沉淀 | 把单机 core 讲成可演进集群架构 | 待开始 |

## 3. Phase 0：工作区整理

目标：

```text
deer-flow/
mimic-harness/
resources/
```

已完成事项：

- DeerFlow 源码放入 `deer-flow/`
- 自研项目骨架放入 `mimic-harness/`
- 学习源码放入 `resources/`
- 文档移入 `mimic-harness/docs/`
- 新增项目总入口
- 新增文档总控
- 新增代码规则
- 新增独立开发计划

验收标准：

```text
顶层只保留 .git、deer-flow、mimic-harness、resources
mimic-harness/00_PROJECT_INDEX_ZH.md 是项目入口
```

## 4. Phase 1：主题化 Contracts + Mock SSE

目标：

```text
先完成产品主题头脑风暴和需求冻结，再实现前端切 Java/Python 后端并消费 mock SSE。
```

阶段启动文档：

```text
phases/phase-01/README.md
phases/phase-01/00_PHASE1_KICKOFF_ZH.md
```

当前状态：

```text
产品主题已确认。
完整需求范围已冻结。
简单设计已完成。
contracts 已调整为正式基线。
Phase 1.5 Figma 高保真设计稿进行中。
```

### 4.1 Contracts 任务

新增：

```text
mimic-harness/contracts/openapi/agent-api.yaml
mimic-harness/contracts/events/sse-events.md
mimic-harness/contracts/events/sse-events.schema.json
mimic-harness/contracts/schemas/message.schema.json
mimic-harness/contracts/schemas/run.schema.json
mimic-harness/contracts/schemas/trace.schema.json
```

必须定义接口：

```text
GET  /api/health
GET  /api/models
POST /api/threads
GET  /api/threads
GET  /api/threads/{threadId}
GET  /api/threads/{threadId}/messages
POST /api/threads/{threadId}/runs/stream
GET  /api/runs/{runId}/trace
```

必须定义 SSE 事件：

```text
run_started
message_delta
trace_event
run_finished
run_failed
```

### 4.2 Java 任务

创建 Spring Boot 项目：

```text
mimic-harness/services/java-agent/
```

实现：

```text
GET /api/health
GET /api/models
POST /api/threads/{threadId}/runs/stream
```

Mock SSE 输出：

```text
run_started
message_delta: "你好"
message_delta: "，我是 Java Runtime"
run_finished
```

### 4.3 Python 任务

创建 FastAPI 项目：

```text
mimic-harness/services/python-agent/
```

实现同样接口。

Mock SSE 输出：

```text
run_started
message_delta: "你好"
message_delta: "，我是 Python Runtime"
run_finished
```

### 4.4 前端任务

创建：

```text
mimic-harness/frontend/apps/web/
```

实现：

- 聊天输入框
- 消息列表
- Runtime Switch：Java / Python
- SSE Client
- 基础 Trace Panel
- 高保真工作台布局
- 基础设计 token
- 图标和素材目录
- 资产登记文件

### 4.5 验收标准

```text
前端高保真原型在桌面和移动端都不重叠。
启动 Java 后端，前端能看到 Java mock 流式回复。
启动 Python 后端，前端能看到 Python mock 流式回复。
切换 runtime 不需要改代码。
SSE 事件符合 contracts。
```

## 5. Phase 2：最小 Agent Loop

目标：

```text
Java/Python 都手写最小 AgentRunner。
```

任务：

1. 定义 domain 模型：

```text
Message
Run
AgentTask
AgentResult
ToolCall
ToolResult
TraceEvent
```

2. 定义 ports：

```text
LlmClient
ToolExecutor
EventPublisher
TraceRepository
```

3. 实现 MockLlmClient。
4. 实现 DefaultAgentRunner。
5. 实现最小工具调用判断。
6. 增加 AgentRunner 单元测试。

验收问题：

```text
用户输入：计算 1+2
模型返回：需要调用 calculator
AgentRunner 执行 calculator
最终回答：1+2=3
```

## 6. Phase 3：国产模型接入

目标：

```text
支持 Qwen、豆包、智谱、Mock。
```

任务：

1. 统一 OpenAI-compatible client。
2. Java 实现：

```text
QwenLlmClient
DoubaoLlmClient
ZhipuLlmClient
MockLlmClient
```

3. Python 实现同构 client。
4. 前端模型选择器。
5. 配置文件不泄漏 key。

验收标准：

```text
Java 可以调用真实 Qwen。
Python 可以调用真实 Qwen。
前端可以选择 provider/model。
失败时错误中文可读。
```

## 7. Phase 4：Tool Calling

目标：

```text
让模型可以调用工具。
```

第一批工具：

```text
calculator
datetime
mock_web_search
```

任务：

1. ToolRegistry。
2. Tool schema。
3. Tool 执行器。
4. tool_call_started SSE。
5. tool_call_finished SSE。
6. 前端工具调用展示。

验收标准：

```text
用户问需要实时信息的问题时，Agent 能触发 mock_web_search。
前端 Trace 能看到工具入参和结果。
```

## 8. Phase 5：Thread + Memory

目标：

```text
支持多轮对话和会话持久化。
```

任务：

1. ThreadRepository。
2. MemoryRepository。
3. PostgreSQL 主库。
4. Redis 最近消息缓存和 run cancel signal。
5. 会话列表接口。
6. 历史消息接口。
7. 前端会话列表页。
8. 简单短期记忆拼接。
9. 长对话摘要记忆。

验收标准：

```text
刷新页面后会话还在。
第二轮问题可以引用第一轮内容。
```

## 9. Phase 6：Trace + Observability

目标：

```text
每次运行可观测、可回放。
```

任务：

1. TraceEvent 标准化。
2. TraceRepository。
3. trace_event SSE。
4. 前端 TraceTimeline。
5. Java 中文结构化日志。
6. Python 中文结构化日志。
7. OTel 预留接口。

验收标准：

```text
前端能看到：
run_started
model_selected
tool_call_started
tool_call_finished
run_finished
耗时
```

## 10. Phase 7：Fallback / Degradation

目标：

```text
失败时自动降级，而不是直接报错。
```

降级层级：

```text
Provider 降级：Qwen -> Doubao -> Zhipu -> Mock
Model 降级：pro -> lite
Capability 降级：vision -> text-only
Tool 降级：web_search -> local_search
Agent 策略降级：multi-agent -> single-agent
```

任务：

1. ModelRouter。
2. FallbackPolicy。
3. FallbackDecision。
4. degradation SSE。
5. 前端降级提示。
6. 降级单元测试。

验收标准：

```text
模拟 Qwen 超时后，自动切豆包。
Trace 显示降级原因。
最终用户能收到可用回答。
```

## 11. Phase 8：Multi-Agent

目标：

```text
实现 Supervisor + Specialist 编排。
```

第一批 Agent：

```text
SupervisorAgent
ChatAgent
ToolAgent
CriticAgent
```

任务：

1. Agent 接口。
2. AgentCapability。
3. AgentOrchestrator。
4. agent_selected SSE。
5. agent_handoff SSE。
6. 前端 Multi-Agent Timeline。

验收标准：

```text
普通问题 -> ChatAgent
工具问题 -> ToolAgent
最终答案 -> CriticAgent 审查
Trace 展示 handoff
```

## 12. Phase 9：RAG + 文件 + 图片

目标：

```text
支持上传文档、检索问答、图片理解。
```

任务：

1. 文件上传接口。
2. 文档解析。
3. chunking。
4. embedding。
5. PostgreSQL 保存文件和 chunk 元数据。
6. pgvector 学习版向量检索。
7. Milvus adapter 预留。
8. Redis / RabbitMQ 异步文档处理。
9. VectorRetriever。
10. RagSearchTool。
11. VisionAgent。
12. 图片模型 provider。

验收标准：

```text
上传文档后可以基于文档问答。
上传图片后可以让 VisionAgent 描述图片。
```

## 13. Phase 10：Framework Adapter

目标：

```text
在不污染 domain 的前提下接入成熟框架。
```

Java adapter：

```text
SpringAiLlmClient
LangChain4jLlmClient
LangChain4jToolAdapter
SpringAiVectorStoreAdapter
```

Python adapter：

```text
OpenAIAgentsRunnerAdapter
LangGraphRunnerAdapter
PydanticAiAgentAdapter
```

验收标准：

```text
同一 contracts 下，可以切 native runner / framework runner。
```

## 14. Phase 11：测试与评测

目标：

```text
Java/Python 行为一致。
```

任务：

1. shared eval cases。
2. deterministic mock model。
3. contract tests。
4. SSE tests。
5. fallback tests。
6. multi-agent tests。
7. RAG tests。
8. e2e tests。

验收标准：

```text
同一批测试输入，Java/Python 输出同构事件。
```

## 15. Phase 12：云服务器 Docker 发布

目标：

```text
把 mimic-harness 作为一个完整 AI Agent 产品部署到云服务器。
用户可以通过公网域名访问前端，并在前端切换 Java/Python runtime。
```

部署形态：

```text
Nginx / Caddy
  -> frontend-web
  -> java-agent
  -> python-agent
  -> postgres
  -> redis
  -> otel-collector
  -> prometheus / grafana
```

单机部署必须使用 profile 分层，不允许一口气强制启动所有中间件。详细方案见：

```text
10_SINGLE_NODE_ENTERPRISE_ARCH_ZH.md
```

必须新增：

```text
mimic-harness/infra/docker/docker-compose.prod.yml
mimic-harness/infra/docker/docker-compose.dev.yml
mimic-harness/infra/nginx/default.conf
mimic-harness/infra/env/.env.example
mimic-harness/docs/runbooks/CLOUD_DOCKER_DEPLOY_ZH.md
mimic-harness/docs/runbooks/ROLLBACK_ZH.md
```

### 15.1 镜像任务

每个服务必须能独立构建镜像：

```text
frontend-web
java-agent
python-agent
```

镜像要求：

1. 使用多阶段构建。
2. 不把 `.env`、模型 API Key、数据库密码打进镜像。
3. 镜像启动时打印中文启动日志。
4. 每个服务都提供 `/api/health` 或等价健康检查。
5. 镜像 tag 至少包含 `latest` 和 git commit short sha。

### 15.2 配置任务

生产配置必须区分：

```text
前端公网 API Base URL
Java 后端内网 URL
Python 后端内网 URL
Postgres 连接
Redis 连接
模型 Provider Key
日志级别
Trace 开关
```

配置规则：

1. 所有敏感信息只允许通过环境变量注入。
2. 仓库只提交 `.env.example`，不提交真实 `.env`。
3. 缺少必要环境变量时，服务必须用中文错误说明启动失败原因。

### 15.3 网关任务

Nginx / Caddy 必须负责：

```text
/                -> frontend-web
/api/java/*      -> java-agent
/api/python/*    -> python-agent
/grafana/*       -> grafana
/health          -> 网关健康检查
```

要求：

1. SSE 接口不能被缓冲。
2. 请求超时时间要适合长连接。
3. 上传文件大小要明确限制。
4. 生产环境必须支持 HTTPS。

### 15.4 发布脚本任务

新增运维脚本：

```text
mimic-harness/infra/scripts/build-images.sh
mimic-harness/infra/scripts/deploy-prod.sh
mimic-harness/infra/scripts/check-prod.sh
mimic-harness/infra/scripts/rollback.sh
```

脚本要求：

1. 输出中文日志。
2. 失败时立即停止。
3. 检查 Docker、Docker Compose、磁盘空间、端口占用。
4. 发布后自动检查前端、Java、Python、数据库健康状态。

### 15.5 云服务器最低配置

学习版最低建议：

```text
2 核 CPU
4 GB RAM
40 GB SSD
Ubuntu 22.04 / 24.04
Docker + Docker Compose Plugin
```

更舒服的配置：

```text
4 核 CPU
8 GB RAM
80 GB SSD
```

单机 profile 建议：

```text
2 核 4G：只启 core。
4 核 8G：启 core + storage + mq + observability。
4 核 16G 以上：再考虑 Milvus / Loki 等增强组件。
```

### 15.6 验收标准

```text
云服务器执行一条 deploy 命令后，所有容器正常启动。
公网域名可以打开前端。
前端可以切换 Java runtime 并完成一次流式回复。
前端可以切换 Python runtime 并完成一次流式回复。
Trace 面板可以看到一次完整 run。
停止 Qwen 配置后可以触发模型降级。
check-prod.sh 返回全部健康。
rollback.sh 可以回滚到上一版镜像。
低配服务器只启 core profile 时也能跑通主链路。
```

### 15.7 不允许

```text
不允许把 API Key 写进代码。
不允许只部署前端不部署后端。
不允许只部署 Java 不部署 Python。
不允许公网直接暴露数据库端口。
不允许没有健康检查就算发布完成。
不允许手动 SSH 改配置但不沉淀到 runbook。
```

## 16. Phase 13：单机大厂架构增强

目标：

```text
在单台服务器上，用 Docker Compose profiles 模拟大厂中间件分层。
主链路必须稳定，增强组件按资源逐步打开。
```

核心原则：

```text
能单机跑通，不追求真集群。
能体现架构边界，不强行堆重型组件。
能装就装，装不动就用轻量替代。
形态必须存在，轻量替代必须跑通。
```

必须新增：

```text
mimic-harness/infra/docker/profiles/core.yml
mimic-harness/infra/docker/profiles/storage.yml
mimic-harness/infra/docker/profiles/mq.yml
mimic-harness/infra/docker/profiles/observability.yml
mimic-harness/infra/docker/profiles/full.yml
mimic-harness/docs/runbooks/SINGLE_NODE_PROFILE_ZH.md
```

### 16.1 core profile

必须包含：

```text
gateway
frontend-web
java-agent
python-agent
postgres + pgvector
redis
```

验收标准：

```text
2 核 4G 服务器可以启动。
前端可以访问。
Java/Python mock SSE 可以跑通。
PostgreSQL 可以保存 thread/message/run。
Redis 可以保存 run state 和 cancel signal。
```

### 16.2 storage profile

新增：

```text
MinIO
```

验收标准：

```text
文件上传后原件进入 MinIO。
数据库只保存文件元数据。
MinIO 管理端不直接暴露公网。
```

### 16.3 mq profile

新增：

```text
RabbitMQ
```

如果服务器资源不足：

```text
先用 Redis Streams。
RabbitMQ adapter 保留但不启用。
```

验收标准：

```text
文档解析任务可以进入队列。
消费者失败可以重试。
消息不会静默丢失。
```

### 16.4 observability profile

新增：

```text
OTel Collector
Prometheus
Grafana
```

验收标准：

```text
Grafana 可以看到服务健康状态。
Prometheus 可以采集 Java/Python 基础指标。
Agent run 耗时可以被观测。
资源不足时可以关闭 observability profile，主链路不受影响。
```

### 16.5 optional heavy profile

只在资源足够时考虑：

```text
Milvus standalone
Loki
Kafka
```

默认不启用。

要求：

```text
必须先有 pgvector / Redis Streams / 中文日志的轻量替代。
不允许为了启用重型组件导致 core profile 不稳定。
```

### 16.6 替代闭环任务

必须跑通这些轻量替代：

```text
Kafka 形态：
EventBusPort + Redis Streams，能投递和消费 document.parse.requested。

Milvus 形态：
VectorStorePort + pgvector，能写入 chunk embedding 并 topK 检索。

ELK 形态：
LogQueryPort + 中文结构化日志 + trace_events，能按 runId 查一次完整运行。

Kubernetes 形态：
DeploymentPort + Docker Compose profiles，能一条命令启动 core 多服务。

S3 形态：
ObjectStoragePort + 本地目录 / MinIO，能上传、读取、删除文件。
```

### 16.7 验收标准

```text
core profile 可以独立启动并跑通主链路。
storage profile 可以独立启停。
mq profile 可以独立启停。
observability profile 可以独立启停。
关闭增强 profile 后，核心聊天链路仍然可用。
Kafka/Milvus/ELK/K8s/S3 形态都有轻量替代闭环。
所有中间件都有中文 runbook。
公网只暴露 gateway，不直接暴露数据库、Redis、MQ、MinIO 管理端。
```

## 17. Phase 14：面试集群方案沉淀

目标：

```text
在不增加 2 核 4G 运行压力的前提下，沉淀一套面试可讲的集群架构方案。
```

必须产出：

```text
11_INTERVIEW_CLUSTER_DESIGN_ZH.md
集群总体架构图
请求链路说明
服务拆分说明
数据层扩容说明
高可用说明
限流/降级/熔断说明
一致性说明
可观测性说明
面试问答模板
```

验收标准：

```text
能清楚说明 2 核 4G 运行版跑什么。
能清楚说明集群版怎么扩。
能讲清楚为什么主链路不依赖 MQ。
能讲清楚 Redis Streams 到 Kafka 的演进。
能讲清楚 pgvector 到 Milvus 的演进。
能讲清楚 Docker Compose 到 Kubernetes 的演进。
能讲清楚 Java/Python 双后端如何通过 contracts 保持一致。
```

不允许：

```text
不允许把面试集群方案说成当前已经部署。
不允许为了面试效果在 2 核 4G 上硬装 Kafka、Milvus、K8s。
不允许只有架构图，没有单机可运行替代闭环。
```

## 18. 每阶段交付要求

每个 Phase 完成时必须有：

```text
可运行代码
README 更新
中文日志
中文异常
关键注释
测试
验收说明
```

每个 Phase 不允许：

```text
只写代码不更新文档
只跑 Java 不跑 Python
只实现后端不接前端
只写 happy path 不写异常
```
