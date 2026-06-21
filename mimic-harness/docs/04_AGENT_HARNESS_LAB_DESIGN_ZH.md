# Agent Harness Lab 工程化设计文档

> 目标：从零实现一个“前端 + Java 后端 + Python 后端”的双版本 AI Agent Harness 学习项目。  
> 核心诉求：代码足够工程化、链路足够清晰、适合 Java 开发者理解 AI Agent 底层原理，并能对照 DeerFlow 这种生产级项目继续深入。

## 1. 项目定位

这个项目不是普通聊天 Demo，而是一个用于学习和沉淀 AI Agent 工程能力的实验底座。

它要回答几个问题：

1. 一个完整 AI Agent 产品，前端到后端的链路怎么设计？
2. Java 和 Python 如何用同一套接口协议实现同一个 Agent Harness？
3. 模型、工具、记忆、RAG、Trace、降级、多 Agent 如何工程化分层？
4. 如何让初学者能一步步看懂，而不是被大项目复杂度淹没？

最终效果：

```text
一个前端
  -> 可以切换 Java 后端
  -> 可以切换 Python 后端
  -> 可以切换 Qwen / 豆包 / 智谱 / Mock 模型
  -> 可以看到模型调用、工具调用、降级、多 Agent 编排全过程
```

## 2. 技术栈

### 2.1 前端

前端使用：

```text
TypeScript
React
Next.js
Tailwind CSS
shadcn/ui
```

选择原因：

1. TypeScript 有类型约束，适合做 contracts-first 的工程化项目。
2. React/Next.js 适合聊天 UI、SSE 流式消息、Trace 面板和文件上传。
3. Tailwind + shadcn/ui 可以快速做出清晰、现代、可维护的界面。
4. DeerFlow 也是类似技术栈，后续对照学习成本低。

### 2.2 Java 后端

Java 使用：

```text
Java 21
Spring Boot
Spring WebFlux / SSE
Jackson
LangChain4j 或 OpenAI Java SDK
PostgreSQL / H2
Maven
```

第一阶段建议少依赖框架，先手写核心 `AgentRunner`，理解 agent loop。后续再接 LangChain4j。

### 2.3 Python 后端

Python 使用：

```text
Python 3.12+
FastAPI
Pydantic
sse-starlette
OpenAI SDK / LiteLLM
SQLite / PostgreSQL
uv
```

第一阶段同样先手写 agent loop。等理解清楚后，再把 Python 版升级到 LangGraph。

### 2.4 模型 Provider

优先支持国产便宜模型：

```text
Qwen / 阿里百炼 DashScope
豆包 / 火山方舟 Ark
智谱 GLM / BigModel
Kimi / Moonshot
MockModel
```

推荐默认：

```text
文本默认：qwen-plus 或 doubao-lite
视觉默认：qwen-vl-plus 或 doubao-vision
本地视觉：Qwen2.5-VL-7B
备用：GLM-V / Kimi-VL
```

## 3. Monorepo 结构

```text
agent-harness-lab/
  README.md
  Makefile
  docker-compose.yml

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
      run.schema.json

  frontend/
    apps/
      web/
    packages/
      api-client/
      ui/
      shared-types/

  services/
    java-agent/
    python-agent/

  packages/
    prompt-kits/
    eval-cases/
    test-fixtures/

  infra/
    docker/
    nginx/
    observability/
      otel-collector.yaml
      prometheus/
      grafana/

  docs/
    architecture/
      overview.md
      frontend.md
      java-backend.md
      python-backend.md
      fallback-and-degradation.md
      multi-agent-orchestration.md
      sse-streaming.md
      trace-design.md
    runbooks/
      local-dev.md
      model-config.md
      troubleshooting.md
    learning-notes/
      agent-loop.md
      tool-calling.md
      memory.md
      rag.md
```

## 4. 后端分层原则

两套后端必须保持同构。

核心规则：

```text
interfaces 只能调用 application
application 只能调用 domain + ports
domain 不能依赖 Spring / FastAPI / OpenAI SDK / 数据库
infrastructure 实现 ports
bootstrap 负责组装依赖
```

调用方向：

```text
Controller / Router
  -> UseCase
    -> Domain Service / AgentRunner
      -> Port Interface
        -> Infrastructure Adapter
```

### 4.1 Java 后端分层

```text
services/java-agent/
  src/main/java/com/example/agent/
    bootstrap/
      AgentApplication.java
      AppConfig.java
      BeanConfiguration.java

    interfaces/
      rest/
        ChatController.java
        ThreadController.java
        ToolController.java
        ModelController.java
      sse/
        SseEventMapper.java
        SseEmitterFactory.java
      dto/
        ChatRequest.java
        ChatResponse.java

    application/
      chat/
        StreamChatUseCase.java
        RunAgentUseCase.java
      thread/
        CreateThreadUseCase.java
        LoadThreadHistoryUseCase.java
      tool/
        ExecuteToolUseCase.java
      model/
        ListModelsUseCase.java

    domain/
      agent/
        Agent.java
        AgentRunner.java
        AgentState.java
        AgentStep.java
        AgentResult.java
      orchestrator/
        AgentOrchestrator.java
        SupervisorAgent.java
        AgentHandoff.java
      message/
        Message.java
        MessageRole.java
      tool/
        Tool.java
        ToolCall.java
        ToolResult.java
        ToolRegistry.java
      memory/
        ThreadMemory.java
      trace/
        RunTrace.java
        TraceEvent.java
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
      tool/
        ToolExecutor.java
      event/
        EventPublisher.java
      trace/
        TraceRepository.java

    infrastructure/
      llm/
        OpenAiCompatibleLlmClient.java
        QwenLlmClient.java
        DoubaoLlmClient.java
        ZhipuLlmClient.java
        MockLlmClient.java
      persistence/
        JdbcThreadRepository.java
        JdbcMemoryRepository.java
      tools/
        CalculatorTool.java
        WebSearchTool.java
        RagSearchTool.java
      vector/
        PgVectorRetriever.java
      observability/
        OtelTraceReporter.java

    common/
      error/
      id/
      json/
      logging/
      time/
```

### 4.2 Python 后端分层

```text
services/python-agent/
  app/
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
      sse/
        event_mapper.py
      dto/
        chat_dto.py

    application/
      chat/
        stream_chat_use_case.py
        run_agent_use_case.py
      thread/
      tool/
      model/

    domain/
      agent/
        agent.py
        runner.py
        state.py
        step.py
        result.py
      orchestrator/
        orchestrator.py
        supervisor_agent.py
        handoff.py
      message/
      tool/
      memory/
      trace/
      fallback/

    ports/
      llm.py
      model_router.py
      memory_repository.py
      thread_repository.py
      event_publisher.py
      trace_repository.py

    infrastructure/
      llm/
        openai_compatible_client.py
        qwen_client.py
        doubao_client.py
        zhipu_client.py
        mock_client.py
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

## 5. 前端分层

```text
frontend/apps/web/src/
  app/
    page.tsx
    threads/
    tools/
    settings/

  features/
    chat/
      components/
        ChatPanel.tsx
        ChatInput.tsx
        MessageList.tsx
      hooks/
        useChatStream.ts
      api/
        chatApi.ts
      model/
        chatTypes.ts

    trace/
      components/
        TracePanel.tsx
        TraceTimeline.tsx
      model/
        traceTypes.ts

    tools/
      components/
        ToolList.tsx
        ToolInvokePanel.tsx

    settings/
      components/
        BackendSwitcher.tsx
        ModelSelector.tsx

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
      backendRuntime.ts
    ui/
    types/
    lib/
```

前端调用方向：

```text
page.tsx
  -> features/chat
    -> shared/api/sseClient
      -> contracts generated types
        -> Java 后端或 Python 后端
```

前端第一版页面：

| 页面 | 功能 |
| --- | --- |
| `/` | 聊天主界面 |
| `/threads` | 会话列表 |
| `/tools` | 工具列表和工具测试 |
| `/settings` | 后端切换、模型配置、API Key 状态 |

## 6. 统一接口协议

REST 接口先行，Java 和 Python 都必须实现。

```text
GET  /api/health
GET  /api/models
POST /api/threads
GET  /api/threads
GET  /api/threads/{threadId}
GET  /api/threads/{threadId}/messages
POST /api/threads/{threadId}/runs/stream
GET  /api/tools
POST /api/tools/{toolName}/invoke
GET  /api/runs/{runId}/trace
```

### 6.1 流式聊天接口

```http
POST /api/threads/{threadId}/runs/stream
Content-Type: application/json
Accept: text/event-stream
```

请求体：

```json
{
  "message": {
    "content": "帮我分析这张图",
    "attachments": [
      {
        "type": "image",
        "url": "http://localhost:3000/files/demo.png"
      }
    ]
  },
  "runtime": {
    "provider": "qwen",
    "model": "qwen-vl-plus",
    "mode": "multi_agent",
    "enableFallback": true
  }
}
```

## 7. SSE 事件协议

统一事件：

```text
run_started
agent_selected
agent_handoff
message_delta
tool_call_started
tool_call_finished
degradation
memory_updated
trace_event
run_finished
run_failed
```

示例：

```text
event: run_started
data: {"runId":"run_001","threadId":"thread_001"}

event: agent_selected
data: {"agent":"SupervisorAgent","reason":"需要先判断任务类型"}

event: agent_handoff
data: {"from":"SupervisorAgent","to":"VisionAgent","reason":"用户上传了图片"}

event: tool_call_started
data: {"toolCallId":"tool_001","name":"image_ocr","args":{"fileId":"file_001"}}

event: tool_call_finished
data: {"toolCallId":"tool_001","result":"识别到一张系统架构图"}

event: degradation
data: {"from":"qwen-vl-plus","to":"doubao-vision-lite","reason":"VISION_MODEL_TIMEOUT"}

event: message_delta
data: {"content":"这张图主要描述了..."}

event: run_finished
data: {"runId":"run_001","status":"success"}
```

## 8. Agent Runner 设计

最小 agent loop：

```text
用户输入
  -> 组装上下文
  -> 调用模型
  -> 判断是否需要工具
  -> 执行工具
  -> 工具结果写回上下文
  -> 再次调用模型
  -> 输出最终回答
```

Java 核心接口：

```java
public interface AgentRunner {
    Flux<AgentEvent> run(AgentRunCommand command);
}
```

Python 核心接口：

```python
class AgentRunner(Protocol):
    async def run(self, command: AgentRunCommand) -> AsyncIterator[AgentEvent]:
        ...
```

## 9. 降级设计

降级不是单纯换模型，而是分层策略。

### 9.1 降级层级

```text
1. Provider 降级
   Qwen -> Doubao -> Zhipu -> MockModel

2. Model 降级
   qwen-plus -> qwen-turbo
   qwen-vl-plus -> qwen-vl-lite

3. Capability 降级
   vision 不可用 -> 文本模式
   tool calling 不可用 -> JSON plan 模式
   streaming 不可用 -> blocking response

4. Tool 降级
   web_search 挂了 -> local_knowledge_search
   vector_db 挂了 -> keyword_search

5. Agent 策略降级
   multi-agent 超时 -> single-agent
   planner 挂了 -> direct answer
   critic 挂了 -> skip review
```

### 9.2 降级核心接口

Java：

```java
public interface ModelRouter {
    LlmClient select(ModelRequest request);
}

public interface FallbackPolicy {
    FallbackDecision onFailure(AgentFailure failure, RunContext context);
}
```

Python：

```python
class ModelRouter(Protocol):
    async def select(self, request: ModelRequest) -> LlmClient:
        ...

class FallbackPolicy(Protocol):
    async def on_failure(self, failure: AgentFailure, context: RunContext) -> FallbackDecision:
        ...
```

### 9.3 降级日志规范

日志必须中文可读：

```text
[模型调用失败] provider=qwen, model=qwen-vl-plus, reason=timeout, runId=run_001
[触发模型降级] from=qwen-vl-plus, to=doubao-vision-lite, reason=视觉模型超时
[能力降级] vision=true -> vision=false, reason=所有视觉模型不可用
```

前端必须展示降级事件：

```text
已自动从 qwen-vl-plus 切换到 doubao-vision-lite
原因：视觉模型调用超时
```

## 10. Multi-Agent 设计

第一版不要做复杂群聊，先实现 Supervisor + Specialist。

```text
SupervisorAgent
  -> ChatAgent
  -> ToolAgent
  -> VisionAgent
  -> CriticAgent
  -> SummaryAgent
```

### 10.1 第一阶段 Agent

| Agent | 职责 |
| --- | --- |
| `SupervisorAgent` | 判断任务类型，决定派给谁 |
| `ChatAgent` | 普通问答 |
| `ToolAgent` | 需要工具调用的任务 |
| `CriticAgent` | 检查最终答案是否明显错误 |

### 10.2 第二阶段 Agent

| Agent | 职责 |
| --- | --- |
| `PlannerAgent` | 拆任务步骤 |
| `ResearchAgent` | 搜索/RAG |
| `VisionAgent` | 图片理解 |
| `CodingAgent` | 代码生成 |
| `MemoryAgent` | 整理记忆 |
| `SummaryAgent` | 汇总多个 Agent 结果 |

### 10.3 编排模式

第一阶段：Router 模式。

```text
用户问题
  -> Supervisor 判断类型
    -> 普通问答：ChatAgent
    -> 图片问题：VisionAgent
    -> 需要工具：ToolAgent
    -> 需要审查：CriticAgent
```

第二阶段：Plan-Execute 模式。

```text
用户问题
  -> PlannerAgent 生成 steps
  -> Supervisor 逐步派发 Specialist
  -> CriticAgent 检查
  -> SummaryAgent 汇总
```

第三阶段：并行模式。

```text
用户问题
  -> ResearchAgent
  -> VisionAgent
  -> ToolAgent
  并行执行
  -> SummaryAgent 汇总
  -> CriticAgent 审查
```

### 10.4 Multi-Agent 核心接口

Java：

```java
public interface Agent {
    AgentName name();
    AgentCapability capability();
    Flux<AgentEvent> run(AgentTask task, AgentContext context);
}

public interface AgentOrchestrator {
    Flux<AgentEvent> run(RunRequest request);
}
```

Python：

```python
class Agent(Protocol):
    name: str
    capability: AgentCapability

    async def run(self, task: AgentTask, context: AgentContext) -> AsyncIterator[AgentEvent]:
        ...

class AgentOrchestrator(Protocol):
    async def run(self, request: RunRequest) -> AsyncIterator[AgentEvent]:
        ...
```

## 11. Trace 设计

每次 run 必须有完整 Trace。

Trace 至少包含：

```text
run_started
model_selected
agent_selected
agent_handoff
llm_request_started
llm_request_finished
tool_call_started
tool_call_finished
fallback_triggered
memory_loaded
memory_saved
run_finished
run_failed
```

前端 Trace Panel 展示：

```text
Run Trace
  1. 创建运行 run_001
  2. 选择 SupervisorAgent
  3. 判断任务包含图片，转交 VisionAgent
  4. 调用 qwen-vl-plus
  5. qwen-vl-plus 超时
  6. 降级到 doubao-vision-lite
  7. 调用 image_ocr 工具
  8. 汇总结果
  9. CriticAgent 审查通过
  10. 输出最终回答
```

## 12. 中文代码规范

这个项目是学习型工程，代码必须让初学者能看懂。

### 12.1 注释要求

必须写中文注释的位置：

1. 每个核心类。
2. 每个 UseCase。
3. 每个 Port 接口。
4. 每个降级策略。
5. 每个 Agent 的职责。
6. 每个复杂 if/else 分支。
7. 每个 SSE 事件转换。

示例：

```java
/**
 * AgentRunner 是单次智能体运行的核心入口。
 *
 * 它不关心 HTTP、数据库、具体模型厂商，只负责按照 agent loop 编排：
 * 1. 加载上下文
 * 2. 调用模型
 * 3. 判断工具调用
 * 4. 执行工具
 * 5. 推送 SSE 事件
 */
public class DefaultAgentRunner implements AgentRunner {
}
```

### 12.2 日志要求

日志必须中文、结构化、可排查。

```java
log.info("[开始智能体运行] runId={}, threadId={}, mode={}", runId, threadId, mode);
log.warn("[触发模型降级] from={}, to={}, reason={}", fromModel, toModel, reason);
log.error("[智能体运行失败] runId={}, reason={}", runId, reason, exception);
```

### 12.3 异常要求

业务异常使用中文消息：

```java
throw new AgentRunException("模型调用超时，已尝试降级但仍失败");
```

Python：

```python
raise AgentRunError("模型调用超时，已尝试降级但仍失败")
```

### 12.4 前端提示要求

前端不展示生硬英文异常。

```text
模型服务暂时不可用，已自动切换到备用模型。
当前图片模型不可用，本次将以文本模式继续。
工具调用失败，请在 Trace 面板查看详细原因。
```

## 13. 开发阶段规划

### Phase 1：最小闭环

目标：前端可以切 Java/Python 后端，完成假流式聊天。

任务：

1. 建 monorepo。
2. 写 contracts。
3. 前端聊天页面。
4. Java `/runs/stream` 返回 mock SSE。
5. Python `/runs/stream` 返回 mock SSE。
6. 前端支持 runtime switch。

### Phase 2：真实模型

目标：Java/Python 都能接真实国产模型。

任务：

1. 实现 `LlmClient` port。
2. 实现 Qwen provider。
3. 实现 Doubao provider。
4. 实现 Mock provider。
5. 前端支持选择 provider/model。

### Phase 3：工具调用

目标：实现最小 ReAct loop。

任务：

1. ToolRegistry。
2. CalculatorTool。
3. Tool call 事件。
4. Tool result 事件。
5. 前端展示工具调用过程。

### Phase 4：记忆和会话

目标：支持多轮对话。

任务：

1. ThreadRepository。
2. MemoryRepository。
3. 会话列表。
4. 历史消息加载。
5. 简单摘要记忆。

### Phase 5：降级体系

目标：模型失败时自动降级。

任务：

1. ModelRouter。
2. FallbackPolicy。
3. provider fallback。
4. model fallback。
5. capability fallback。
6. 前端 Trace 展示降级事件。

### Phase 6：Multi-Agent

目标：支持 Supervisor + Specialist。

任务：

1. Agent 接口。
2. SupervisorAgent。
3. ChatAgent。
4. ToolAgent。
5. CriticAgent。
6. agent_handoff SSE 事件。

### Phase 7：RAG 和文件

目标：支持上传文件、检索、图片理解。

任务：

1. 文件上传。
2. 文档切片。
3. Embedding。
4. VectorStore。
5. RagSearchTool。
6. VisionAgent。

### Phase 8：工程化完善

目标：接近生产项目形态。

任务：

1. Docker Compose。
2. OpenTelemetry。
3. Prometheus/Grafana。
4. 集成测试。
5. Java/Python 行为一致性测试。
6. Runbook。

## 14. 最终架构图

```text
Frontend Next.js
  -> SSE Client
  -> Backend Runtime Switch
    -> Java Agent Service
    -> Python Agent Service
      -> ChatController / ChatRouter
        -> StreamChatUseCase
          -> AgentOrchestrator
            -> SupervisorAgent
              -> Specialist Agents
                -> AgentRunner
                  -> ModelRouter
                    -> FallbackPolicy
                    -> Qwen / Doubao / Zhipu / Kimi / Mock
                  -> ToolRegistry
                  -> MemoryStore
                  -> TraceRecorder
                  -> EventPublisher
                    -> SSE
                      -> Frontend Trace Panel
```

## 15. 和 DeerFlow 的对照关系

| 本项目 | DeerFlow 类似位置 |
| --- | --- |
| `frontend/features/chat` | `frontend/src/app/workspace/chats` |
| `sseClient.ts` | LangGraph SDK `useStream` |
| `ChatController` | `backend/app/gateway/routers/thread_runs.py` |
| `StreamChatUseCase` | `backend/app/gateway/services.py` |
| `AgentRunner` | `runtime/runs/worker.py` |
| `AgentOrchestrator` | LangGraph graph / lead agent |
| `ModelRouter` | `models/factory.py` + config models |
| `ToolRegistry` | `deerflow.tools.get_available_tools` |
| `TraceRecorder` | RunJournal / tracing callbacks |
| `FallbackPolicy` | DeerFlow 暂无独立简化对应，可作为增强点 |

## 16. 一句话总结

这个项目要做成一个“可学习、可对照、可扩展”的 AI Agent 工程化底座：  
前端一套，Java/Python 后端两套，同一协议，同一事件，同一测试集，逐步实现聊天、工具、记忆、RAG、降级、多 Agent 和 Trace。
