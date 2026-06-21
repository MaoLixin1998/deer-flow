# Contracts

这里放 Java 后端、Python 后端、前端共同遵守的协议。

当前状态：

```text
Phase 1 需求已冻结。
Contracts 已按 phases/phase-01/04_SIMPLE_DESIGN_ZH.md 调整为 Phase 1 正式基线。
前端、Java Runtime、Python Runtime 后续必须共同遵守。
```

当前结构：

```text
openapi/
  agent-api.yaml                 # Phase 1 OpenAPI
events/
  sse-events.md                  # SSE 事件说明
  sse-events.schema.json         # SSE 事件 JSON Schema
schemas/
  runtime.schema.json            # RuntimeInfo 协议
  model.schema.json              # ModelInfo 协议
  campaign.schema.json           # Campaign 协议
  message.schema.json            # 消息协议
  run.schema.json                # Run 协议
  trace.schema.json              # TraceEvent 协议
  tool.schema.json               # ToolCall 协议
  asset.schema.json              # CreativeAsset 协议
  html-preview.schema.json       # HtmlPreview 协议
  compliance.schema.json         # ComplianceReview 协议
  error.schema.json              # ErrorResponse 协议
```

核心原则：

1. 前后端先约定协议，再写实现。
2. Java 和 Python 必须实现同一份 OpenAPI。
3. SSE 事件名、字段名、错误码必须统一。

当前阶段：

```text
Phase 1：Ninic Creative Agent Studio Mock SSE 闭环正式基线。
```

阶段登记：

```text
../phases/phase-01/05_CONTRACTS_BASELINE_ZH.md
```
