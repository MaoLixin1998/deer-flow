# 15. Phase 1.8 后端双语言 Mock SSE 开工规划

> 本文件是 Phase 1.8 的开工规划文档。  
> 本阶段只做 Java Runtime 和 Python Runtime 的同构 Mock SSE 后端。  
> 不接真实模型、不接数据库、不接 Redis、不接 MQ、不接 RAG、不接对象存储。

## 1. 阶段信息

```text
阶段：Phase 1.8
名称：后端双语言并行开发
目标：Java / Python 两套 Runtime 按同一套 contracts 跑通 Mock SSE 主链路
上一阶段：Phase 1.7 前端静态工程化封版
下一阶段：Phase 1.9 Mock 联调
当前状态：规划完成，待开始编码
```

一句话目标：

```text
让前端可以选择 Java 或 Python Runtime，并通过同一个 POST /api/threads/{threadId}/runs/stream 收到同构 SSE 事件。
```

## 2. 阶段边界

本阶段必须做：

```text
1. 搭建 Java 后端七层模块骨架。
2. 搭建 Python 后端七层模块骨架。
3. 实现同构 DTO / Domain / UseCase / Port / Mock Infrastructure。
4. 实现第一批 Mock 接口。
5. 实现 Mock SSE 事件流。
6. 输出中文日志、中文异常、中文错误 message。
7. 与前端 shared/sse/runStream.ts + runReducer.ts 形成联调入口。
8. Java / Python 后端都必须提供 Swagger / OpenAPI 页面。
9. 每个接口都必须提供可直接复制的 Mock 请求 JSON 和响应 JSON。
```

本阶段禁止做：

```text
1. 禁止接真实模型供应商。
2. 禁止接真实数据库。
3. 禁止接 Redis、MQ、RAG、对象存储。
4. 禁止引入复杂 Agent 框架替代手写主链路。
5. 禁止 Java 和 Python 各写一套不同协议。
6. 禁止 Controller / Router 直接写业务编排。
7. 禁止 domain 依赖 Spring、FastAPI、SDK 或数据库。
```

允许做：

```text
1. 内存存储。
2. Mock 模型目录。
3. Mock 工具调用。
4. Mock 素材生成。
5. Mock 合规报告。
6. SSE 延迟推送，用于模拟真实流式体验。
```

## 3. 输入基线

必须读取：

```text
docs/01_CODE_RULES_ZH.md
docs/09_PHASE_DELIVERY_PROCESS_ZH.md
phases/phase-01/04_SIMPLE_DESIGN_ZH.md
phases/phase-01/14_PHASE1_7_CLOSURE_ACCEPTANCE_ZH.md
contracts/openapi/agent-api.yaml
contracts/events/sse-events.md
contracts/events/sse-events.schema.json
contracts/schemas/*.schema.json
frontend/apps/web/src/shared/sse/runStream.ts
frontend/apps/web/src/features/workbench/model/runReducer.ts
```

关键 contracts：

```text
RuntimeType：java / python
RunScenario：summer_bubble_coffee_campaign
SSE 事件：run_started / message_delta / trace_event / run_finished / run_failed
错误码：RUNTIME_UNAVAILABLE / SSE_CONNECT_FAILED / RUN_FAILED / INVALID_REQUEST / INVALID_RUNTIME / NOT_FOUND
```

## 4. 后端端口

```text
Java Runtime   http://localhost:8080
Python Runtime http://localhost:8000
Frontend       http://localhost:3026
```

端口规则：

```text
1. Java 默认 8080。
2. Python 默认 8000。
3. 前端运行时配置不得在组件里手写，必须走 frontend/apps/web/src/shared/config/runtime.ts。
4. 如果端口冲突，只允许改配置文件和 README，不允许散落硬编码。
```

## 5. 总体模块边界

两套后端都必须使用同一套层级：

```text
interfaces
application
domain
ports
infrastructure
bootstrap
common
```

依赖方向：

```text
interfaces -> application
application -> domain + ports + common
domain -> common
ports -> domain + common
infrastructure -> ports + domain + common
bootstrap -> interfaces + application + infrastructure + common
common -> 无业务依赖
```

禁止依赖：

```text
domain 不能依赖 Spring。
domain 不能依赖 FastAPI。
domain 不能依赖数据库。
domain 不能依赖模型 SDK。
application 不能直接写 HTTP Response。
interfaces 不能直接调用 mock 工具。
infrastructure 不能反向调用 interfaces。
```

## 6. Java 模块规划

目录：

```text
services/java-agent/
  pom.xml
  creative-agent-common/
  creative-agent-domain/
  creative-agent-ports/
  creative-agent-application/
  creative-agent-infrastructure/
  creative-agent-interfaces/
  creative-agent-bootstrap/
```

包名：

```text
com.mimic.agent.common
com.mimic.agent.domain
com.mimic.agent.ports
com.mimic.agent.application
com.mimic.agent.infrastructure
com.mimic.agent.interfaces
com.mimic.agent.bootstrap
```

模块职责：

```text
creative-agent-common
  中文异常、Result、时间工具、ID 生成、常量、日志上下文。

creative-agent-domain
  RuntimeKind、Run、RunStatus、Message、TraceEvent、CreativeAsset、ModelInfo、CampaignScenario。

creative-agent-ports
  RuntimeStorePort、ThreadStorePort、RunStorePort、TraceStorePort、AssetStorePort、ModelCatalogPort、CreativeToolPort、SseEventPublisherPort。

creative-agent-application
  GetHealthUseCase、ListRuntimesUseCase、ListModelsUseCase、ListThreadsUseCase、ListMessagesUseCase、StreamCampaignRunUseCase、GetRunTraceUseCase、ListAssetsUseCase。

creative-agent-infrastructure
  InMemoryRuntimeStore、InMemoryThreadStore、InMemoryRunStore、InMemoryTraceStore、InMemoryAssetStore、MockModelCatalog、MockCreativeTool、MockSseEventFactory。

creative-agent-interfaces
  RuntimeController、ModelController、ThreadController、RunController、AssetController、DTO、Mapper、SSE Response 适配。

creative-agent-bootstrap
  Spring Boot 启动类、Bean 装配、跨域配置、端口配置。
```

Java 技术选型：

```text
Java 21
Spring Boot
Spring WebFlux 或 Spring MVC + SseEmitter
Jackson
Maven multi-module
JUnit
springdoc-openapi
```

Java 第一版建议：

```text
优先用 Spring MVC + SseEmitter，学习成本低，便于 Java 开发者理解。
等 Mock SSE 稳定后，再评估是否切到 WebFlux。
```

## 7. Python 模块规划

目录：

```text
services/python-agent/
  pyproject.toml
  app/
    common/
    domain/
    ports/
    application/
    infrastructure/
    interfaces/
    bootstrap/
  tests/
```

包职责：

```text
common
  中文异常、Result、时间工具、ID 生成、常量、日志上下文。

domain
  RuntimeKind、Run、RunStatus、Message、TraceEvent、CreativeAsset、ModelInfo、CampaignScenario。

ports
  RuntimeStorePort、ThreadStorePort、RunStorePort、TraceStorePort、AssetStorePort、ModelCatalogPort、CreativeToolPort、SseEventPublisherPort。

application
  get_health_use_case、list_runtimes_use_case、list_models_use_case、list_threads_use_case、list_messages_use_case、stream_campaign_run_use_case、get_run_trace_use_case、list_assets_use_case。

infrastructure
  in_memory_runtime_store、in_memory_thread_store、in_memory_run_store、in_memory_trace_store、in_memory_asset_store、mock_model_catalog、mock_creative_tool、mock_sse_event_factory。

interfaces
  runtime_router、model_router、thread_router、run_router、asset_router、dto、mapper、SSE StreamingResponse 适配。

bootstrap
  FastAPI app 创建、路由注册、跨域配置、端口配置。
```

Python 技术选型：

```text
Python 3.12+
FastAPI
Pydantic
uvicorn
sse-starlette 或 StreamingResponse
pytest
FastAPI OpenAPI / Swagger UI
```

Python 第一版建议：

```text
优先用 FastAPI StreamingResponse 手写 SSE 文本。
等协议稳定后，再决定是否引入 sse-starlette。
```

## 7.1 Swagger 要求

Java Swagger：

```text
依赖：springdoc-openapi-starter-webmvc-ui
Swagger UI：http://localhost:8080/swagger-ui.html
OpenAPI JSON：http://localhost:8080/v3/api-docs
```

Python Swagger：

```text
FastAPI 默认 Swagger UI：http://localhost:8000/docs
OpenAPI JSON：http://localhost:8000/openapi.json
```

统一要求：

```text
1. 每个接口必须有中文 summary。
2. 每个接口必须有中文 description。
3. 每个 requestBody 必须有 example。
4. 每个 response 必须有 example。
5. SSE 接口必须在 Swagger 中展示 requestBody 示例，真实流式效果用 curl -N 验收。
6. Swagger 中的示例必须和 16_PHASE1_8_API_MOCK_EXAMPLES_ZH.md 保持一致。
```

## 8. 第一批接口顺序

接口必须按下面顺序实现，不要跳着写：

接口 Mock 示例：

```text
所有接口的可复制 JSON 统一登记在：
16_PHASE1_8_API_MOCK_EXAMPLES_ZH.md
```

### 8.1 第 1 个接口：健康检查

```text
GET /api/health
```

目的：

```text
确认服务能启动。
确认 runtime 返回 java 或 python。
确认中文日志、中文异常基础可用。
```

返回字段：

```text
status
runtime
serviceName
version
createdAt
```

### 8.2 第 2 个接口：Runtime 列表

```text
GET /api/runtimes
```

目的：

```text
让前端设置页能展示 Java/Python Runtime 状态。
```

返回字段：

```text
runtimes[]
  runtime
  serviceName
  status
  baseUrl
  mockMode
  message
```

### 8.3 第 3 个接口：模型列表

```text
GET /api/models
```

目的：

```text
给后续模型降级和多模态能力展示提供 mock 数据。
```

第一版模型：

```text
provider: mock
model: mock-creative-agent-v1
capabilities: text / image / video / html / compliance
mock: true
```

### 8.4 第 4 个接口：会话列表

```text
GET /api/threads
```

目的：

```text
给左侧会话列表提供真实接口形态。
```

第一版固定会话：

```text
threadId: thread-summer-coffee
title: 夏季气泡咖啡上市
```

### 8.5 第 5 个接口：会话消息

```text
GET /api/threads/{threadId}/messages
```

目的：

```text
给中间 Agent 对话区提供历史消息。
```

第一版消息：

```text
用户 brief 一条。
助手说明一条。
```

### 8.6 第 6 个接口：Mock SSE 主链路

```text
POST /api/threads/{threadId}/runs/stream
```

目的：

```text
跑通 AIGC Campaign Run 主链路。
这是 Phase 1.8 的核心接口。
```

请求体必须对齐 RunRequest：

```json
{
  "prompt": "帮我为夏季气泡咖啡生成一套小红书首发素材",
  "runtime": "java",
  "scenario": "summer_bubble_coffee_campaign",
  "modelProvider": "mock",
  "model": "mock-creative-agent-v1",
  "mockMode": true
}
```

注意：

```text
当前前端 runStream.ts 的 RunStreamRequest 如果缺 runtime、modelProvider、model，Phase 1.8 接线前必须补齐。
以 contracts/openapi/agent-api.yaml 为准。
```

### 8.7 第 7 个接口：Run Trace

```text
GET /api/runs/{runId}/trace
```

目的：

```text
让前端刷新或回放时能恢复工作流轨迹。
```

### 8.8 第 8 个接口：素材列表

```text
GET /api/assets
```

目的：

```text
让右侧素材面板能从后端读取本次 mock 资产。
```

## 9. Mock SSE 事件顺序

必须严格按以下顺序推送：

```text
1. run_started
2. trace_event: planner_started
3. message_delta: 正在理解营销需求
4. trace_event: planner_finished
5. trace_event: model_selected
6. trace_event: tool_call_started image_mock_generator
7. trace_event: asset_created image
8. trace_event: tool_call_finished image_mock_generator
9. trace_event: tool_call_started video_storyboard_mock_generator
10. trace_event: asset_created video_storyboard
11. trace_event: tool_call_finished video_storyboard_mock_generator
12. trace_event: tool_call_started html_mock_generator
13. trace_event: asset_created html
14. trace_event: tool_call_finished html_mock_generator
15. trace_event: review_started
16. trace_event: asset_created compliance_report
17. trace_event: review_finished
18. message_delta: 已完成本次创意工作流
19. run_finished
```

事件间隔建议：

```text
本地开发每条事件间隔 150ms 到 350ms。
不要太快，否则前端看不出流式效果。
不要太慢，否则调试效率低。
```

SSE 原始格式：

```text
event: trace_event
data: {"event":"trace_event","runId":"run_001","threadId":"thread-summer-coffee","runtime":"java","eventId":"evt_001","type":"planner_started","title":"开始拆解创意需求","status":"running","createdAt":"2026-06-22T10:00:00+08:00"}

```

规则：

```text
1. event 行必须等于 data.event。
2. data 必须是 JSON。
3. runtime 必须是 java 或 python。
4. 所有 title/detail/message 必须中文。
5. 所有事件必须携带 runId、threadId、runtime、createdAt。
```

## 10. Mock 数据固定值

```text
threadId: thread-summer-coffee
runId: run-summer-coffee-001
scenario: summer_bubble_coffee_campaign
modelProvider: mock
model: mock-creative-agent-v1
```

素材：

```text
asset-hero-image        image              夏季气泡咖啡主视觉
asset-video-board       video_storyboard   15 秒短视频分镜
asset-html              html               移动端活动页
asset-compliance        compliance_report  合规检查报告
```

工具：

```text
planner
image_mock_generator
video_storyboard_mock_generator
html_mock_generator
compliance_checker
```

## 11. 日志要求

Java 示例：

```text
[启动 Java Runtime] serviceName=java-agent, port=8080, mockMode=true
[收到 Campaign Run 请求] runId=..., threadId=..., runtime=java, scenario=summer_bubble_coffee_campaign
[推送 SSE 事件] event=trace_event, runId=..., eventId=..., type=planner_started
[Campaign Run 完成] runId=..., assetCount=4
```

Python 示例：

```text
[启动 Python Runtime] serviceName=python-agent, port=8000, mockMode=true
[收到 Campaign Run 请求] run_id=..., thread_id=..., runtime=python, scenario=summer_bubble_coffee_campaign
[推送 SSE 事件] event=trace_event, run_id=..., event_id=..., type=planner_started
[Campaign Run 完成] run_id=..., asset_count=4
```

要求：

```text
1. 日志必须中文。
2. 日志必须带 runId、threadId。
3. 错误日志必须带 code 和中文 message。
4. 禁止 System.out.println 和 print 裸输出核心日志。
```

## 12. 异常要求

统一错误响应：

```json
{
  "code": "INVALID_REQUEST",
  "message": "请求参数不合法，请检查 runtime、scenario 和 mockMode。",
  "detail": "runtime 必须是 java 或 python"
}
```

第一批异常：

```text
InvalidContractException      contracts 字段不合法
RuntimeUnavailableException   Runtime 不可用
RunFailedException            Run 执行失败
SseStreamException            SSE 推送失败
NotFoundException             thread/run/asset 不存在
```

规则：

```text
1. 业务异常 message 必须中文。
2. 接口层负责把异常转为 contracts/schemas/error.schema.json。
3. application 层不能吞异常。
4. infrastructure 层 mock 失败也要抛中文异常。
```

## 13. 测试与验收顺序

### 13.1 Java 验收

```bash
cd services/java-agent
mvn test
mvn spring-boot:run
curl http://localhost:8080/api/health
curl http://localhost:8080/api/runtimes
```

SSE 验收：

```bash
curl -N \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -X POST http://localhost:8080/api/threads/thread-summer-coffee/runs/stream \
  -d '{"prompt":"帮我生成夏季气泡咖啡小红书首发素材","runtime":"java","scenario":"summer_bubble_coffee_campaign","modelProvider":"mock","model":"mock-creative-agent-v1","mockMode":true}'
```

### 13.2 Python 验收

```bash
cd services/python-agent
pytest
uvicorn app.bootstrap.main:app --port 8000 --reload
curl http://localhost:8000/api/health
curl http://localhost:8000/api/runtimes
```

SSE 验收：

```bash
curl -N \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -X POST http://localhost:8000/api/threads/thread-summer-coffee/runs/stream \
  -d '{"prompt":"帮我生成夏季气泡咖啡小红书首发素材","runtime":"python","scenario":"summer_bubble_coffee_campaign","modelProvider":"mock","model":"mock-creative-agent-v1","mockMode":true}'
```

### 13.3 前端联调验收

```bash
cd frontend/apps/web
npm run dev
```

验收点：

```text
1. 选择 Java Runtime，发送 brief，前端收到 SSE。
2. 选择 Python Runtime，发送 brief，前端收到 SSE。
3. message_delta 能进入中间对话区。
4. trace_event 能进入工作流面板。
5. run_finished 能结束 loading。
6. run_failed 能展示中文错误。
```

## 14. 开发切片

### 14.1 第一刀：Phase 1.8 启动文档和目录骨架

```text
目标：创建 Java/Python 七层目录和 README。
产物：services/java-agent/、services/python-agent/ 基础骨架。
验收：目录结构符合 docs/01_CODE_RULES_ZH.md。
```

### 14.2 第二刀：common + domain

```text
目标：实现两端基础类型、中文异常、ID/时间工具。
验收：Java/Python domain 类型字段对齐 contracts。
```

### 14.3 第三刀：ports + infrastructure 内存实现

```text
目标：实现内存存储、Mock 模型目录、Mock 创意工具。
验收：不用 HTTP 也能在测试中生成 Run、Trace、Asset。
```

### 14.4 第四刀：application use cases

```text
目标：实现健康检查、Runtime、模型、会话、消息、Run 编排。
验收：UseCase 不依赖接口层框架。
```

### 14.5 第五刀：interfaces HTTP 接口

```text
目标：暴露 GET /api/health、GET /api/runtimes、GET /api/models、GET /api/threads、GET /api/threads/{threadId}/messages。
验收：curl 能拿到 JSON。
```

### 14.6 第六刀：Mock SSE 主链路

```text
目标：暴露 POST /api/threads/{threadId}/runs/stream。
验收：curl -N 能按 19 步顺序收到 SSE。
```

### 14.7 第七刀：前端最小接线

```text
目标：submitCreativeBrief 调用 streamCampaignRun，事件进入 runReducer。
验收：页面能看到 Java/Python Mock SSE 的流式变化。
```

## 15. 开工门禁

开始写代码前必须确认：

```text
1. 本文件已读。
2. docs/01_CODE_RULES_ZH.md 已读。
3. contracts/openapi/agent-api.yaml 已读。
4. contracts/events/sse-events.md 已读。
5. Phase 1.7 已封版，不继续改前端静态功能。
6. 本阶段只做 Mock SSE，不接真实模型。
```

## 16. 阶段完成标准

Phase 1.8 完成必须满足：

```text
1. Java Runtime 可启动。
2. Python Runtime 可启动。
3. 两端 /api/health 返回正确 runtime。
4. 两端 /api/runtimes 返回 mockMode=true。
5. 两端 /api/models 返回 mock-creative-agent-v1。
6. 两端 /api/threads 和 /messages 返回固定会话与消息。
7. 两端 /runs/stream 按 19 步输出同构 SSE。
8. 两端日志、异常、message 全中文。
9. 两端 Swagger 可以打开，并展示中文接口说明和可复制 Mock JSON。
10. 前端能任选 Java/Python 跑通 Mock SSE。
11. 文档记录接口、日志、验收命令和遗留项。
```
