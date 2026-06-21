# SSE 事件协议

> Phase 1 的 Java Runtime、Python Runtime、前端必须使用同一套 SSE 事件。  
> 本文件是 Phase 1 正式 Contracts 基线的一部分。

## 1. 通用格式

SSE 原始格式：

```text
event: trace_event
data: {"event":"trace_event","runId":"run_001","threadId":"thread_001","runtime":"java","eventId":"evt_001","type":"planner_started","title":"开始拆解创意需求","status":"running","createdAt":"2026-06-20T10:00:00Z"}
```

规则：

```text
1. event 行必须是本文件定义的事件名。
2. data 必须是 JSON。
3. data.event 必须和 event 行一致。
4. Java / Python 字段必须完全同构。
5. 所有面向用户的 message 必须是中文。
```

通用字段：

```text
event       SSE 事件名
runId       一次 Campaign Run 的唯一标识
threadId    会话标识
runtime     java / python
createdAt   ISO-8601 时间
```

## 2. 事件列表

| 事件名 | 用途 | 是否必须 |
| --- | --- | --- |
| `run_started` | Run 开始 | 是 |
| `message_delta` | 助手消息流式片段 | 是 |
| `trace_event` | 工作流轨迹事件 | 是 |
| `run_finished` | Run 正常结束 | 是 |
| `run_failed` | Run 失败 | 是 |

## 3. trace_event.type

Phase 1 只允许这些 `trace_event.type`：

| type | 用途 |
| --- | --- |
| `planner_started` | 开始拆解营销创意需求 |
| `planner_finished` | 完成工作流计划 |
| `model_selected` | 选择 Mock 模型 |
| `tool_call_started` | 开始 Mock 工具调用 |
| `tool_call_finished` | 完成 Mock 工具调用 |
| `asset_created` | 生成 Mock 资产 |
| `review_started` | 开始合规检查 |
| `review_finished` | 完成合规检查 |
| `fallback_placeholder` | 降级占位事件 |

## 4. 最小事件顺序

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

## 5. run_started

```json
{
  "event": "run_started",
  "runId": "run_001",
  "threadId": "thread_001",
  "runtime": "java",
  "scenario": "summer_bubble_coffee_campaign",
  "title": "开始夏季气泡咖啡营销素材生成",
  "createdAt": "2026-06-20T10:00:00Z"
}
```

## 6. message_delta

```json
{
  "event": "message_delta",
  "runId": "run_001",
  "threadId": "thread_001",
  "runtime": "java",
  "delta": "正在理解营销需求，并拆解为图片、视频分镜、HTML 和合规检查任务。",
  "createdAt": "2026-06-20T10:00:01Z"
}
```

## 7. trace_event

普通 Trace：

```json
{
  "event": "trace_event",
  "runId": "run_001",
  "threadId": "thread_001",
  "runtime": "java",
  "eventId": "evt_001",
  "type": "model_selected",
  "title": "选择 Mock 创意模型",
  "detail": "当前阶段使用 mock-creative-agent-v1。",
  "status": "succeeded",
  "durationMs": 12,
  "createdAt": "2026-06-20T10:00:01Z"
}
```

资产 Trace：

```json
{
  "event": "trace_event",
  "runId": "run_001",
  "threadId": "thread_001",
  "runtime": "java",
  "eventId": "evt_006",
  "type": "asset_created",
  "title": "生成主视觉图资产",
  "detail": "生成 3 张夏季气泡咖啡主视觉 mock 图片。",
  "status": "succeeded",
  "toolName": "image_mock_generator",
  "assetId": "asset_img_001",
  "durationMs": 120,
  "payload": {
    "assetType": "image",
    "assetTitle": "夏季气泡咖啡主视觉"
  },
  "createdAt": "2026-06-20T10:00:02Z"
}
```

## 8. run_finished

```json
{
  "event": "run_finished",
  "runId": "run_001",
  "threadId": "thread_001",
  "runtime": "java",
  "messageId": "msg_002",
  "assetIds": ["asset_img_001", "asset_video_001", "asset_html_001", "asset_review_001"],
  "createdAt": "2026-06-20T10:00:05Z"
}
```

## 9. run_failed

```json
{
  "event": "run_failed",
  "runId": "run_001",
  "threadId": "thread_001",
  "runtime": "java",
  "code": "RUN_FAILED",
  "message": "创意工作流运行失败，请稍后重试。",
  "createdAt": "2026-06-20T10:00:05Z"
}
```

## 10. 错误码

Phase 1 允许这些错误码：

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
