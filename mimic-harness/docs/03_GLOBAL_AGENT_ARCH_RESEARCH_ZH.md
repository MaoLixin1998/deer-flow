# 全球 AI Agent Harness 先进方案调研与开发规划

> 面向项目：`mimic-harness`  
> 目标：调研全球主流 Java / Python AI Agent 实现方案、项目架构、代码分层方式，并制定一套适合本项目的工程化开发路线。  
> 结论先行：本项目不应直接绑定某一个 Agent 框架，而应采用 **Contracts First + Clean Architecture / Hexagonal Architecture + 可插拔 Runtime Adapter**。Java 与 Python 两套后端保持同一业务语义、同一接口协议、同一事件协议、同一测试集。

## 1. 调研结论摘要

### 1.1 Java 侧结论

Java 生态适合做企业工程化底座，但 Agent 框架成熟度整体晚于 Python。推荐路线：

1. **核心工程底座用 Spring Boot / WebFlux 自己实现**。
2. **模型、工具、RAG 接入优先参考 Spring AI 与 LangChain4j**。
3. **Quarkus LangChain4j 作为云原生/低资源/Dev UI 借鉴**。
4. **Semantic Kernel Java 作为企业插件化、跨语言概念参考**。

本项目 Java 版不要一开始被 LangChain4j 或 Spring AI 牵着走。应该先手写 `AgentRunner`、`ToolRegistry`、`ModelRouter`、`FallbackPolicy`，再将 Spring AI / LangChain4j 作为 infrastructure adapter 接入。

### 1.2 Python 侧结论

Python 生态是 Agent 原生生态主战场，方案非常多。推荐路线：

1. **第一阶段手写最小 Agent Loop**：确保理解模型调用、工具调用、上下文、SSE。
2. **第二阶段吸收 OpenAI Agents SDK 的 primitives**：Agent、Runner、Tool、Handoff、Guardrail、Session、Tracing。
3. **第三阶段吸收 LangGraph 的 durable orchestration**：graph、checkpoint、streaming、human-in-loop、memory。
4. **Pydantic AI 适合作为类型安全、依赖注入、评测、可观测性的参考**。
5. **smolagents 适合作为最小可读 agent loop 和 CodeAgent 参考**。
6. **CrewAI / AutoGen / Google ADK 适合作为多 Agent 编排参考，不建议第一阶段作为核心依赖**。

### 1.3 前端侧结论

前端应该独立于 Java/Python 后端，统一消费同一份协议：

```text
contracts/openapi/agent-api.yaml
contracts/events/sse-events.schema.json
```

前端核心不是“漂亮聊天框”，而是展示 Agent Harness 的运行过程：

```text
消息流
工具调用
模型降级
Agent handoff
memory 读取/写入
trace 时间线
费用/耗时/token
```

### 1.4 最终推荐架构

```text
Frontend Next.js
  -> Contracts Generated Client
  -> SSE Event Renderer
  -> Java Runtime / Python Runtime
    -> interfaces
      -> application
        -> domain
          -> ports
            -> infrastructure adapters
```

核心原则：

```text
业务核心自己掌控，外部框架只作为 adapter。
```

## 2. 全球主流方案矩阵

### 2.1 Java 方案

| 方案 | 定位 | 优点 | 缺点 | 本项目吸收点 |
| --- | --- | --- | --- | --- |
| Spring AI | Spring 官方 AI 抽象 | Spring Boot 原生、ChatClient、Tool Calling、Memory、RAG、MCP、Observability | Agent 编排能力相对底层，复杂 multi-agent 需要自己组织 | 作为 Java provider/tool/RAG adapter 参考 |
| LangChain4j | Java 版 LLM 应用框架 | AI Services、Tools、Memory、RAG、Spring Boot/Quarkus 集成 | 框架抽象较多，学习时容易跳过底层 loop | 参考 Tool、Memory、RAG、AI Service 设计 |
| Quarkus LangChain4j | 云原生 Java AI | Dev UI、低资源、Fault Tolerance、RAG、Function Calling、WebSocket | Quarkus 栈对 Spring 开发者有学习成本 | 参考 fault tolerance、Dev UI、低资源部署 |
| Semantic Kernel Java | 微软跨语言 AI 中间件 | Plugin、OpenAPI、企业可观测、安全、C#/Python/Java 跨语言 | Java 生态相对非主场 | 参考 plugin 化和跨语言统一概念 |
| Koog / Kotlin Agent | JetBrains Kotlin 方向 | Kotlin DSL、现代 JVM 体验 | Java 主项目学习价值有限 | 暂不作为主线 |

#### Spring AI 重点

Spring AI 官方定位是简化 AI 应用开发，强调把企业 Data 和 APIs 连接到 AI Models。官方列出的能力包括：跨 provider 的 Chat / Embedding / Image / Audio / Moderation 抽象、Structured Output、Vector Store、Tool Calling、Observability、ETL、Evaluation、MCP、ChatClient、Advisors、Memory、RAG。见官方文档：[Spring AI Reference](https://docs.spring.io/spring-ai/reference/)。

本项目应吸收：

```text
ChatClient 风格 API
Advisors 思想：把通用模式做成可插拔链
Tool Calling 抽象
VectorStore 抽象
Observability 思路
MCP client/server 能力
```

不应照搬：

```text
所有业务逻辑直接写进 Spring AI Advisor
把 AgentRunner 完全交给框架黑盒
```

#### LangChain4j 重点

LangChain4j 官方强调：Java 应用可统一访问商业/开源 LLM 与 Vector Store，支持 Java 与 LLM 的双向调用，即 Java 调 LLM，也允许 LLM 调 Java 代码。并覆盖 prompt templating、chat memory、output parsing、Agents、RAG。见官方文档：[LangChain4j Docs](https://docs.langchain4j.dev/)。

本项目应吸收：

```text
AI Service 接口化思想
Tool Java 方法暴露
Chat Memory
RAG ingestion + query-time augmentation
Vector Store 集成方式
```

本地资源：

```text
resources/langchain4j-examples/agentic-tutorial
resources/langchain4j-examples/customer-support-agent-example
resources/langchain4j-examples/rag-examples
resources/langchain4j-examples/mcp-example
resources/langchain4j-examples/spring-boot-example
```

#### Quarkus LangChain4j 重点

Quarkus LangChain4j 文档覆盖 summarization、image extraction、RAG、function calling、fault tolerance、streamed responses、compressed chat history、AI Services、guardrails、agentic AI、MCP、observability、WebSockets。见官方文档：[Quarkus LangChain4j](https://docs.quarkiverse.io/quarkus-langchain4j/dev/index.html)。

本项目应吸收：

```text
Fault Tolerance 作为模型/工具降级的一部分
Dev UI / Trace UI 思路
WebSocket / SSE 流式输出实践
Guardrails 和隐私安全建议
```

### 2.2 Python 方案

| 方案 | 定位 | 优点 | 缺点 | 本项目吸收点 |
| --- | --- | --- | --- | --- |
| OpenAI Agents SDK | 轻量生产级 agent runtime | primitives 少，Agent/Runner/Tool/Handoff/Guardrail/Session/Tracing 清楚 | OpenAI 生态优先，非 OpenAI provider 需要 adapter | 第一优先参考 primitives 和 tracing |
| LangGraph | 低层 orchestration runtime | durable execution、checkpoint、streaming、memory、human-in-loop、subgraph | 初学者直接上手偏复杂 | 第二阶段引入图编排和持久化思想 |
| Pydantic AI | 类型安全 agent framework | DI、typed output、evals、Logfire/OTel、MCP/A2A/UI events、durable execution | 生态仍在高速演进 | 强类型、eval、fallback、UI events 参考 |
| smolagents | 极简 CodeAgent | 代码量小、好读、CodeAgent、工具和多模态简单 | 工程化能力需要自己补 | 第一阶段读源码理解 agent loop |
| CrewAI | 角色型多 Agent | 上手快，适合 Crew/Role/Task 概念 | 企业底座需补很多工程能力 | multi-agent 概念参考 |
| AutoGen | 微软多 Agent / event-driven | AgentChat、Core、distributed agents、Docker code executor、MCP | 抽象复杂 | 多 Agent 消息总线和分布式 runtime 参考 |
| Google ADK | Google 多 Agent 应用框架 | Multi-agent by design、workflow agents、evaluation、deployment | 更偏 Google/Gemini 生态 | 多 Agent 生命周期参考 |
| LlamaIndex | 数据/RAG 生态 | RAG、索引、query engine 强 | Agent harness 不是最清晰主线 | RAG 子系统参考 |
| Haystack | Pipeline/RAG | Pipeline 工程化强 | Agent 不是主要学习入口 | RAG pipeline 参考 |

#### OpenAI Agents SDK 重点

OpenAI Agents SDK 官方说明它是轻量、生产可用的 Agent SDK，核心 primitives 包括：Agents、Agents as tools / Handoffs、Guardrails，并内置 tracing。主要特性包括 agent loop、function tools、MCP tool calling、sessions、human-in-the-loop、sandbox agents、tracing、realtime agents。见官方文档：[OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)。

本项目应吸收：

```text
Agent
Runner
Tool
Handoff
Guardrail
Session
Trace
Sandbox Agent
```

本地资源：

```text
resources/openai-agents-python/src/agents
resources/openai-agents-python/examples/agent_patterns
resources/openai-agents-python/examples/handoffs
resources/openai-agents-python/examples/mcp
resources/openai-agents-python/examples/memory
resources/openai-agents-python/examples/sandbox
resources/openai-agents-python/tests
```

#### LangGraph 重点

LangGraph 官方定位是低层 agent orchestration framework/runtime，关注 long-running、stateful agents。官方强调它提供 durable execution、streaming、human-in-the-loop、persistence、memory、subgraphs，并把 LangGraph 定义为 orchestration runtime。见官方文档：[LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)。

本项目应吸收：

```text
StateGraph 思想
checkpoint / resume
streaming event
human-in-the-loop interrupt
短期 working memory + 长期 memory
subgraph
production application structure
```

不建议第一阶段直接上 LangGraph，因为它会把“agent loop 到底怎么跑”的细节藏起来。

#### Pydantic AI 重点

Pydantic AI 官方定位是 Python agent framework，用于构建 production grade GenAI applications and workflows。它强调 model-agnostic、OTel/Logfire observability、type-safe、evals、capabilities、MCP、A2A、UI event streams、human-in-loop approval、durable execution、streamed outputs、graph support。见官方文档：[Pydantic AI](https://pydantic.dev/docs/ai/overview/)。

本项目应吸收：

```text
Pydantic DTO / Domain Model
依赖注入式 tool context
Typed Output
Evaluator / Dataset
OTel trace
Fallback model wrapper
UI event stream
```

#### smolagents 重点

smolagents 官方强调 CodeAgent：agent 用代码表达动作，从而自然支持函数嵌套、循环、条件；并支持 sandbox 执行、model-agnostic、modality-agnostic、tool-agnostic、MCP tools。见官方文档：[smolagents](https://huggingface.co/docs/smolagents/index)。

本项目应吸收：

```text
极简 Agent Loop
CodeAgent 思想
工具调用的最小抽象
sandbox 安全执行
多模态输入
```

本地资源：

```text
resources/smolagents/src/smolagents
resources/smolagents/examples/async_agent
resources/smolagents/examples/open_deep_research
resources/smolagents/examples/plan_customization
resources/smolagents/tests
```

#### AutoGen 重点

AutoGen 官方把 AgentChat 定位为 conversational single and multi-agent applications，把 Core 定位为 event-driven framework for scalable multi-agent AI systems，支持 deterministic/dynamic workflows、research collaboration、distributed agents、MCP、Docker code executor、gRPC worker runtime。见官方文档：[AutoGen](https://microsoft.github.io/autogen/stable/)。

本项目应吸收：

```text
event-driven multi-agent runtime
AgentChat vs Core 分层
distributed agents
Docker code executor
MCP workbench
```

#### Semantic Kernel 重点

Semantic Kernel 官方定位为轻量开源 SDK，可在 C#、Python、Java 中构建 AI agents，并把模型与现有 API 结合。它强调 enterprise ready、flexible、modular、observable、telemetry、hooks、filters、plugin、OpenAPI。见官方文档：[Semantic Kernel overview](https://learn.microsoft.com/en-us/semantic-kernel/overview/)。

本项目应吸收：

```text
Plugin 体系
OpenAPI plugin 导入
hooks / filters
跨语言语义统一
企业可观测性
```

#### Google ADK 重点

Google ADK 官方强调 multi-agent by design、rich tool ecosystem、MCP tools、built-in streaming、flexible orchestration、workflow agents（Sequential / Parallel / Loop）、LLM-driven dynamic routing、local CLI/visual Web UI、evaluation、deployment。见官方博客：[Google ADK](https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/)。

本项目应吸收：

```text
Supervisor + Specialist 层级结构
Sequential / Parallel / Loop workflow agent
动态路由
可视化调试
逐步执行轨迹评测
```

## 3. 架构设计原则

### 3.1 不绑定框架，绑定协议与领域模型

本项目的核心资产应该是：

```text
Message
Thread
Run
Agent
Tool
ToolCall
ToolResult
TraceEvent
ModelRequest
ModelResponse
FallbackDecision
MemoryEntry
```

不是某个框架的 `Agent` 类。

外部框架只允许出现在：

```text
infrastructure/
```

例如：

```text
infrastructure/llm/langchain4j
infrastructure/llm/spring_ai
infrastructure/runtime/langgraph
infrastructure/runtime/openai_agents
```

### 3.2 分层架构

统一分层：

```text
interfaces
application
domain
ports
infrastructure
bootstrap
common
```

依赖规则：

```text
interfaces -> application
application -> domain + ports
domain -> common only
infrastructure -> ports + external SDK
bootstrap -> all wiring
```

禁止：

```text
domain 直接 import Spring / FastAPI
domain 直接 import OpenAI / DashScope / LangGraph
application 直接写数据库 SQL
Controller 直接调模型
```

### 3.3 Contracts First

所有前后端通信必须从 contracts 出发：

```text
contracts/openapi/agent-api.yaml
contracts/events/sse-events.schema.json
contracts/schemas/*.schema.json
```

Java、Python、前端都从这里生成或对齐 DTO。

### 3.4 Event First

Agent Harness 的关键不是一个最终 answer，而是运行过程。

SSE event 是一等公民：

```text
run_started
message_delta
tool_call_started
tool_call_finished
agent_selected
agent_handoff
model_selected
degradation
memory_loaded
memory_updated
trace_event
run_finished
run_failed
```

前端 Trace Panel、后端日志、评测系统都围绕这些事件工作。

### 3.5 双 Runtime 同构

Java 和 Python 必须同构：

```text
相同接口
相同事件
相同领域概念
相同测试用例
不同语言实现
```

## 4. 推荐项目结构

### 4.1 顶层结构

```text
agent-learning-workspace/
  deer-flow/          # 上游项目学习和注释
  mimic-harness/      # 自研学习型 harness
  resources/          # 全球先进源码参考
```

当前工作区已经按这个方向整理。

### 4.2 mimic-harness 结构

```text
mimic-harness/
  contracts/
    openapi/
      agent-api.yaml
    events/
      sse-events.md
      sse-events.schema.json
    schemas/
      message.schema.json
      tool.schema.json
      trace.schema.json

  frontend/
    apps/web/
    packages/api-client/
    packages/ui/
    packages/shared-types/

  services/
    java-agent/
    python-agent/

  packages/
    eval-cases/
    prompt-kits/
    test-fixtures/

  infra/
    docker/
    nginx/
    observability/

  docs/
```

### 4.3 Java 后端结构

```text
services/java-agent/src/main/java/com/mimic/agent/
  bootstrap/
    AgentApplication.java
    BeanConfiguration.java
    ProviderConfiguration.java

  interfaces/
    rest/
      ChatController.java
      ThreadController.java
      ToolController.java
      ModelController.java
      TraceController.java
    sse/
      SseEventMapper.java
      SseStreamWriter.java
    dto/

  application/
    chat/
      StreamChatUseCase.java
      RunAgentUseCase.java
    thread/
      CreateThreadUseCase.java
      LoadThreadHistoryUseCase.java
    tool/
      ExecuteToolUseCase.java
    trace/
      LoadRunTraceUseCase.java

  domain/
    agent/
      Agent.java
      AgentRunner.java
      AgentContext.java
      AgentTask.java
      AgentResult.java
    orchestrator/
      AgentOrchestrator.java
      SupervisorAgent.java
      AgentHandoff.java
    model/
      ModelRequest.java
      ModelResponse.java
      ModelCapability.java
    tool/
      Tool.java
      ToolCall.java
      ToolResult.java
      ToolRegistry.java
    memory/
      ThreadMemory.java
      MemoryEntry.java
    trace/
      TraceEvent.java
      RunTrace.java
    fallback/
      FallbackPolicy.java
      FallbackDecision.java
      AgentFailure.java

  ports/
    llm/
      LlmClient.java
      ModelRouter.java
    memory/
      MemoryRepository.java
    thread/
      ThreadRepository.java
    trace/
      TraceRepository.java
    event/
      EventPublisher.java
    vector/
      VectorRetriever.java

  infrastructure/
    llm/
      qwen/
      doubao/
      zhipu/
      mock/
      springai/
      langchain4j/
    persistence/
    tools/
    vector/
    observability/

  common/
    error/
    id/
    logging/
    time/
```

### 4.4 Python 后端结构

```text
services/python-agent/app/
  bootstrap/
    main.py
    settings.py
    container.py

  interfaces/
    rest/
      chat_router.py
      thread_router.py
      tool_router.py
      model_router.py
      trace_router.py
    sse/
      event_mapper.py
      stream_writer.py
    dto/

  application/
    chat/
      stream_chat_use_case.py
      run_agent_use_case.py
    thread/
    tool/
    trace/

  domain/
    agent/
      agent.py
      runner.py
      context.py
      task.py
      result.py
    orchestrator/
      orchestrator.py
      supervisor_agent.py
      handoff.py
    model/
    tool/
    memory/
    trace/
    fallback/

  ports/
    llm_client.py
    model_router.py
    memory_repository.py
    thread_repository.py
    trace_repository.py
    event_publisher.py
    vector_retriever.py

  infrastructure/
    llm/
      qwen_client.py
      doubao_client.py
      zhipu_client.py
      mock_client.py
      openai_agents_adapter.py
      langgraph_adapter.py
      pydantic_ai_adapter.py
    persistence/
    tools/
    vector/
    observability/

  common/
    errors.py
    ids.py
    logging.py
    time.py
```

### 4.5 前端结构

```text
frontend/apps/web/src/
  app/
    page.tsx
    threads/
    tools/
    settings/
    traces/

  features/
    chat/
      components/
      hooks/
      api/
      model/
    trace/
      components/
      hooks/
    runtime/
      components/
      model/
    tools/
    settings/

  entities/
    message/
    thread/
    agent/
    tool/
    trace/
    model/

  shared/
    api/
      httpClient.ts
      sseClient.ts
    config/
      runtimeConfig.ts
    ui/
    types/
    lib/
```

## 5. 核心模块设计

### 5.1 AgentRunner

职责：

```text
单次 Agent 运行的核心 loop。
```

流程：

```text
加载 thread memory
构造模型输入
选择模型
调用模型
解析 tool call
执行工具
把工具结果写回上下文
必要时继续调用模型
输出最终结果
写 trace
写 memory
```

第一阶段不要让框架代跑这个 loop。我们自己写，后面再对比 OpenAI Agents SDK / LangGraph。

### 5.2 ModelRouter

职责：

```text
根据任务、能力、成本、降级策略选择模型。
```

输入：

```text
是否需要视觉
是否需要工具调用
是否需要 JSON output
是否需要长上下文
是否允许降级
预算等级
```

输出：

```text
LlmClient + modelName + capability
```

### 5.3 FallbackPolicy

职责：

```text
在模型/工具/Agent 失败时决定下一步。
```

降级链：

```text
qwen-vl-plus -> doubao-vision-lite -> qwen-plus(text-only) -> mock
```

每次降级必须发事件：

```text
event: degradation
```

### 5.4 ToolRegistry

职责：

```text
统一注册和执行工具。
```

第一阶段工具：

```text
calculator
datetime
mock_web_search
```

第二阶段工具：

```text
rag_search
file_reader
image_ocr
mcp_tool_proxy
```

### 5.5 AgentOrchestrator

职责：

```text
管理多 Agent 编排。
```

第一阶段：

```text
SupervisorAgent -> ChatAgent / ToolAgent / CriticAgent
```

第二阶段：

```text
PlannerAgent -> Specialist Agents -> SummaryAgent -> CriticAgent
```

第三阶段：

```text
Parallel Research / Vision / Tool -> Aggregator -> Critic
```

### 5.6 TraceRecorder

职责：

```text
记录每一步可观测事件。
```

Trace 应同时支持：

```text
后端日志
数据库查询
前端 Trace Panel
OTel 导出
评测回放
```

## 6. 框架吸收策略

### 6.1 Java 吸收策略

| 阶段 | 自己实现 | 可接入框架 |
| --- | --- | --- |
| Phase 1 | SSE、Mock AgentRunner | 无 |
| Phase 2 | LlmClient、ModelRouter | Spring AI ChatClient / LangChain4j ChatModel |
| Phase 3 | ToolRegistry | Spring AI ToolCallback / LangChain4j Tool |
| Phase 4 | MemoryRepository | Spring AI Memory / LangChain4j ChatMemory |
| Phase 5 | RAG | Spring AI VectorStore / LangChain4j EmbeddingStore |
| Phase 6 | FallbackPolicy | Resilience4j / Spring Retry / Quarkus Fault Tolerance 思路 |
| Phase 7 | Observability | Micrometer / OTel |

### 6.2 Python 吸收策略

| 阶段 | 自己实现 | 可接入框架 |
| --- | --- | --- |
| Phase 1 | SSE、Mock AgentRunner | 无 |
| Phase 2 | LlmClient、ToolRegistry | OpenAI SDK / LiteLLM |
| Phase 3 | Agent primitives | OpenAI Agents SDK |
| Phase 4 | Type-safe DTO / eval | Pydantic AI |
| Phase 5 | durable graph | LangGraph |
| Phase 6 | multi-agent | AutoGen / CrewAI / Google ADK 思路 |
| Phase 7 | RAG | LlamaIndex / Haystack 思路 |

## 7. 开发规划

### Phase 0：工作区整理

目标：

```text
deer-flow/
mimic-harness/
resources/
```

状态：已完成。

产物：

```text
mimic-harness/docs/
resources/
```

### Phase 1：Contracts + Mock 闭环

目标：

```text
前端能切 Java/Python runtime，并消费 mock SSE。
```

任务：

1. 编写 `contracts/openapi/agent-api.yaml`。
2. 编写 `contracts/events/sse-events.schema.json`。
3. Java 实现 `/api/health`、`/api/models`、`/api/threads/{threadId}/runs/stream` mock。
4. Python 实现同样接口。
5. 前端实现 runtime switch。
6. 前端展示 `message_delta`、`run_started`、`run_finished`。

验收：

```text
同一个前端可以一键切换 Java/Python 后端。
```

### Phase 2：最小 Agent Loop

目标：

```text
Java/Python 都手写最小 AgentRunner。
```

任务：

1. 定义 domain 模型：Message、Run、ToolCall、ToolResult。
2. 实现 MockLlmClient。
3. 实现 AgentRunner loop。
4. 实现 calculator 工具。
5. 实现 tool_call_started / tool_call_finished 事件。

验收：

```text
用户问“1+2等于多少”，Agent 调 calculator，然后回答 3。
```

### Phase 3：国产模型接入

目标：

```text
接入 Qwen / 豆包 / 智谱 / Mock。
```

任务：

1. 定义 `LlmClient` port。
2. 实现 OpenAI-compatible client。
3. 接 Qwen DashScope。
4. 接豆包 Ark。
5. 接智谱 GLM。
6. 增加模型选择 UI。

验收：

```text
Java/Python 都能调用真实模型，并能在前端切换模型。
```

### Phase 4：Memory + Thread

目标：

```text
支持多轮对话和会话列表。
```

任务：

1. ThreadRepository。
2. MemoryRepository。
3. 会话列表页面。
4. 历史消息加载。
5. SQLite/Postgres 持久化。

验收：

```text
刷新页面后仍能看到历史会话，并继续上下文聊天。
```

### Phase 5：Trace + Observability

目标：

```text
前端 Trace Panel 能看到完整运行轨迹。
```

任务：

1. TraceEvent domain。
2. TraceRepository。
3. SSE trace_event。
4. 前端 TraceTimeline。
5. 后端中文结构化日志。
6. OTel 预留接口。

验收：

```text
每次 run 能看到模型选择、工具调用、耗时、token、错误。
```

### Phase 6：Fallback / Degradation

目标：

```text
模型、能力、工具、Agent 策略可降级。
```

任务：

1. ModelRouter。
2. FallbackPolicy。
3. provider fallback。
4. model fallback。
5. capability fallback：vision -> text-only。
6. degradation SSE 事件。
7. 前端降级提示。

验收：

```text
模拟 Qwen 超时后，自动切换到豆包，并在 Trace 中展示原因。
```

### Phase 7：Multi-Agent

目标：

```text
实现 Supervisor + Specialist。
```

任务：

1. Agent 接口。
2. AgentOrchestrator。
3. SupervisorAgent。
4. ChatAgent。
5. ToolAgent。
6. CriticAgent。
7. agent_selected / agent_handoff 事件。

验收：

```text
Supervisor 能根据任务类型选择不同 Agent，并在前端显示 handoff。
```

### Phase 8：RAG + 文件 + 图片

目标：

```text
支持文件上传、文档检索、图片理解。
```

任务：

1. 文件上传接口。
2. Document parser。
3. Chunking。
4. Embedding。
5. VectorRetriever。
6. RagSearchTool。
7. VisionAgent。

验收：

```text
上传一份文档或图片，Agent 能基于内容回答。
```

### Phase 9：Framework Adapter 对照

目标：

```text
在不破坏 domain 的前提下接入成熟框架。
```

任务：

1. Java 接 Spring AI adapter。
2. Java 接 LangChain4j adapter。
3. Python 接 OpenAI Agents SDK adapter。
4. Python 接 LangGraph adapter。
5. 对比自研 runner 与框架 runner。

验收：

```text
同一接口下，可以切换 native runner / framework runner。
```

### Phase 10：测试与评测

目标：

```text
Java/Python 行为一致性可测试。
```

任务：

1. shared eval cases。
2. mock model deterministic responses。
3. contract tests。
4. SSE event tests。
5. tool execution tests。
6. fallback tests。
7. multi-agent tests。

验收：

```text
同一批 eval cases，Java/Python 都通过。
```

## 8. 学习源码阅读计划

### 8.1 Java

```text
resources/langchain4j-examples/agentic-tutorial
resources/langchain4j-examples/customer-support-agent-example
resources/langchain4j-examples/rag-examples
resources/langchain4j-examples/mcp-example
resources/spring-ai-examples/agentic-patterns
resources/spring-ai-examples/model-context-protocol
resources/spring-ai-examples/agents/reflection
resources/spring-ai-examples/advisors
```

阅读目标：

```text
看接口怎么封装
看工具怎么暴露
看 memory 怎么插入
看 RAG 怎么拆 ingestion/query
看 agentic pattern 怎么组织
```

### 8.2 Python

```text
resources/smolagents/src/smolagents
resources/smolagents/examples
resources/openai-agents-python/src/agents
resources/openai-agents-python/examples/agent_patterns
resources/openai-agents-python/examples/handoffs
resources/openai-agents-python/examples/memory
resources/openai-agents-python/examples/mcp
resources/openai-agents-python/examples/sandbox
```

阅读目标：

```text
看 agent loop
看 tool schema
看 handoff
看 session/memory
看 tracing
看 sandbox
```

## 9. 我们自己的最终架构蓝图

```text
Browser
  -> Next.js Frontend
    -> Runtime Switch
      -> Java Agent Service
      -> Python Agent Service
        -> interfaces/rest
          -> application/usecase
            -> domain/orchestrator
              -> domain/agent-runner
                -> ports/model-router
                  -> infrastructure/qwen
                  -> infrastructure/doubao
                  -> infrastructure/zhipu
                  -> infrastructure/mock
                -> ports/tool-registry
                  -> infrastructure/tools
                -> ports/memory-repository
                  -> infrastructure/postgres
                -> ports/trace-repository
                  -> infrastructure/otel
                -> event-publisher
                  -> SSE
                    -> Trace Panel
```

## 10. 决策记录

### ADR-001：不直接采用单一框架作为核心

原因：

```text
学习目标是理解 harness，而不是学某个框架 API。
Java/Python 要同构，单一框架无法跨语言统一。
生产工程需要可插拔 provider、fallback、trace、eval。
```

决策：

```text
自研 domain/application 核心，框架作为 infrastructure adapter。
```

### ADR-002：Java 第一实现用 Spring Boot

原因：

```text
用户是 Java 开发。
Spring Boot 企业工程经验最通用。
Spring AI 与 LangChain4j 都能接入 Spring。
```

### ADR-003：Python 第一实现用 FastAPI + 手写 Runner

原因：

```text
FastAPI 与 Pydantic 组合清晰。
先手写 loop，后接 OpenAI Agents SDK / LangGraph adapter。
```

### ADR-004：前端使用 TypeScript + Next.js

原因：

```text
SSE、Trace Panel、多 runtime、多模型配置更适合 React/TypeScript。
TypeScript 能和 contracts 生成类型对齐。
```

### ADR-005：SSE 事件协议是一等公民

原因：

```text
Agent Harness 的学习价值在过程，不只是最终回答。
降级、多 Agent、工具调用、Trace 都需要事件流表达。
```

## 11. 参考来源

- [Spring AI Reference](https://docs.spring.io/spring-ai/reference/)
- [LangChain4j Docs](https://docs.langchain4j.dev/)
- [Quarkus LangChain4j Documentation](https://docs.quarkiverse.io/quarkus-langchain4j/dev/index.html)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)
- [LangGraph Overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [Pydantic AI](https://pydantic.dev/docs/ai/overview/)
- [Hugging Face smolagents](https://huggingface.co/docs/smolagents/index)
- [Microsoft AutoGen](https://microsoft.github.io/autogen/stable/)
- [Semantic Kernel Overview](https://learn.microsoft.com/en-us/semantic-kernel/overview/)
- [Google Agent Development Kit Blog](https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/)

