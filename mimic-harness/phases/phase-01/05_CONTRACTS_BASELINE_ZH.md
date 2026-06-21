# 05. Phase 1 Contracts 基线

> 本文件记录 Phase 1 的 Contracts 先行结果。  
> 从本文件创建后，前端、Java Runtime、Python Runtime 都必须按 `contracts/` 中的协议开发。  
> 如果后续要改接口、字段、事件、错误码，必须先更新本文件和 `contracts/`。

## 1. 当前阶段

```text
Phase：Phase 1
步骤：4. Contracts 先行
上一产物：04_SIMPLE_DESIGN_ZH.md
下一步骤：5. Figma 高保真设计稿
```

## 2. Contracts 基线文件

正式基线包含：

```text
contracts/openapi/agent-api.yaml
contracts/events/sse-events.md
contracts/events/sse-events.schema.json
contracts/schemas/runtime.schema.json
contracts/schemas/model.schema.json
contracts/schemas/campaign.schema.json
contracts/schemas/message.schema.json
contracts/schemas/run.schema.json
contracts/schemas/trace.schema.json
contracts/schemas/tool.schema.json
contracts/schemas/asset.schema.json
contracts/schemas/html-preview.schema.json
contracts/schemas/compliance.schema.json
contracts/schemas/error.schema.json
```

## 3. OpenAPI 基线

Phase 1 正式 OpenAPI 只包含 M 类接口，不包含全部 131 个候选接口。

正式接口：

```text
GET  /api/health
GET  /api/runtimes
GET  /api/runtimes/{runtime}
GET  /api/models
GET  /api/threads
POST /api/threads
GET  /api/threads/{threadId}
GET  /api/threads/{threadId}/messages
POST /api/threads/{threadId}/runs/stream
GET  /api/runs
GET  /api/runs/{runId}
GET  /api/runs/{runId}/trace
GET  /api/assets
GET  /api/assets/{assetId}
POST /api/html/previews
GET  /api/html/previews/{previewId}
POST /api/compliance/reviews
GET  /api/compliance/reviews/{reviewId}
```

OpenAPI tags：

```text
Runtime
Models
Threads
Runs
Assets
HtmlPreview
Compliance
```

## 4. SSE 基线

事件名：

```text
run_started
message_delta
trace_event
run_finished
run_failed
```

`trace_event.type`：

```text
planner_started
planner_finished
model_selected
tool_call_started
tool_call_finished
asset_created
review_started
review_finished
fallback_placeholder
```

最小事件顺序见：

```text
contracts/events/sse-events.md
```

## 5. 核心数据基线

Phase 1 必须同构的数据对象：

```text
RuntimeInfo
ModelInfo
Campaign
Message
Run
TraceEvent
ToolCall
CreativeAsset
HtmlPreview
ComplianceReview
ErrorResponse
```

Schema 编写规则：

```text
1. 每个 JSON Schema 顶层必须有中文 description，说明这个对象在链路里负责什么。
2. 每个业务字段必须有中文 description，说明字段含义、使用方和注意事项。
3. 枚举字段必须说明每个枚举值的业务含义，至少要在 description 里写清楚使用场景。
4. 错误提示、状态提示、Trace 标题、Trace 详情必须支持中文展示。
5. JSON Schema 不能写 // 注释，统一用 description 或 $comment 做中文提示。
```

关键枚举：

```text
RuntimeType: java / python
RunScenario: summer_bubble_coffee_campaign
CreativeAssetType: image / video_storyboard / html / compliance_report
TraceEventStatus: pending / running / succeeded / failed
RunStatus: created / running / succeeded / failed / cancelled
```

## 6. 错误码基线

```text
RUNTIME_UNAVAILABLE
SSE_CONNECT_FAILED
SSE_STREAM_INTERRUPTED
RUN_FAILED
INVALID_REQUEST
INVALID_RUNTIME
UNKNOWN_EVENT_TYPE
INVALID_ASSET_PAYLOAD
EMPTY_HTML_PREVIEW
NOT_FOUND
```

要求：

```text
后端返回中文 message。
前端展示中文提示。
Java/Python 错误码必须一致。
SSE 运行时错误必须发 run_failed。
```

## 7. 三方执行规则

前端：

```text
1. 只能按 OpenAPI、SSE、JSON Schema 字段消费数据。
2. 不能私自增加后端字段依赖。
3. SSE reducer 必须识别本基线的 5 个事件名。
4. 未知事件必须进入 UNKNOWN_EVENT_TYPE 错误处理。
```

Java Runtime：

```text
1. 必须实现 OpenAPI 中的 18 个 M 接口。
2. 必须输出同构 SSE JSON。
3. 必须使用本基线错误码。
4. 必须用中文结构化日志记录 runId、threadId、runtime。
```

Python Runtime：

```text
1. 必须实现 OpenAPI 中的 18 个 M 接口。
2. 必须输出同构 SSE JSON。
3. 必须使用本基线错误码。
4. 必须用中文结构化日志记录 run_id、thread_id、runtime。
```

## 8. 后续变更规则

如果后续要调整接口或字段：

```text
1. 先更新 03_PHASE_SCOPE_ZH.md 的变更记录。
2. 再更新 04_SIMPLE_DESIGN_ZH.md 的设计影响。
3. 再更新 contracts/。
4. 最后更新本文件。
```

不能出现：

```text
前端先用新字段，contracts 没改。
Java 返回新事件，Python 不支持。
Python 返回 snake_case，Java 返回 camelCase。
错误码不在本文件中。
```

## 9. 变更记录

```text
2026-06-20：创建 Phase 1 Contracts 正式基线。
```
