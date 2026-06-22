# 16. Phase 1.8 接口 Mock 参数与可复制 JSON

> 本文件是 Phase 1.8 的接口示例文档。  
> 目标是让 Java / Python 后端、前端联调、Swagger 调试、curl 调试都能直接复制参数。  
> 本文件所有 JSON 都必须能直接粘到 Swagger 或 curl 里使用。

## 1. Swagger 地址

Java Runtime：

```text
Swagger UI:  http://localhost:8080/swagger-ui.html
OpenAPI JSON: http://localhost:8080/v3/api-docs
```

Python Runtime：

```text
Swagger UI:  http://localhost:8000/docs
OpenAPI JSON: http://localhost:8000/openapi.json
```

Swagger 要求：

```text
1. Java 必须接入 springdoc-openapi。
2. Python 必须使用 FastAPI 自带 OpenAPI / Swagger。
3. 每个接口 summary、description、字段说明必须中文。
4. Swagger 示例必须和本文件 JSON 保持一致。
5. SSE 接口在 Swagger 中至少展示 requestBody 示例；真实流式验收用 curl -N。
```

## 2. 固定 Mock 值

```text
threadId: thread-summer-coffee
runId: run-summer-coffee-001
messageId: msg-agent-final-001
runtime: java 或 python
scenario: summer_bubble_coffee_campaign
modelProvider: mock
model: mock-creative-agent-v1
mockMode: true
```

资产 ID：

```text
asset-hero-image
asset-video-board
asset-html
asset-compliance
```

HTML 预览 ID：

```text
preview-html-summer-coffee
```

合规报告 ID：

```text
review-summer-coffee-001
```

## 3. GET /api/health

用途：

```text
检查当前 Runtime 是否启动。
```

请求参数：

```text
无。
```

Java 响应 JSON：

```json
{
  "status": "ok",
  "runtime": "java",
  "serviceName": "java-agent",
  "version": "0.1.0",
  "createdAt": "2026-06-22T10:00:00+08:00"
}
```

Python 响应 JSON：

```json
{
  "status": "ok",
  "runtime": "python",
  "serviceName": "python-agent",
  "version": "0.1.0",
  "createdAt": "2026-06-22T10:00:00+08:00"
}
```

curl：

```bash
curl http://localhost:8080/api/health
curl http://localhost:8000/api/health
```

## 4. GET /api/runtimes

用途：

```text
返回当前可用 Runtime 列表，给设置页展示。
```

请求参数：

```text
无。
```

响应 JSON：

```json
{
  "runtimes": [
    {
      "runtime": "java",
      "serviceName": "java-agent",
      "status": "online",
      "baseUrl": "http://localhost:8080",
      "mockMode": true,
      "message": "Java Runtime 已启动，当前使用 Mock SSE。"
    },
    {
      "runtime": "python",
      "serviceName": "python-agent",
      "status": "online",
      "baseUrl": "http://localhost:8000",
      "mockMode": true,
      "message": "Python Runtime 已启动，当前使用 Mock SSE。"
    }
  ]
}
```

curl：

```bash
curl http://localhost:8080/api/runtimes
curl http://localhost:8000/api/runtimes
```

## 5. GET /api/runtimes/{runtime}

用途：

```text
查询单个 Runtime 详情。
```

路径参数：

```text
runtime: java 或 python
```

Java 响应 JSON：

```json
{
  "runtime": "java",
  "serviceName": "java-agent",
  "status": "online",
  "baseUrl": "http://localhost:8080",
  "mockMode": true,
  "message": "Java Runtime 已启动，当前使用 Mock SSE。"
}
```

Python 响应 JSON：

```json
{
  "runtime": "python",
  "serviceName": "python-agent",
  "status": "online",
  "baseUrl": "http://localhost:8000",
  "mockMode": true,
  "message": "Python Runtime 已启动，当前使用 Mock SSE。"
}
```

curl：

```bash
curl http://localhost:8080/api/runtimes/java
curl http://localhost:8000/api/runtimes/python
```

## 6. GET /api/models

用途：

```text
返回 Phase 1 Mock 模型列表。
```

请求参数：

```text
无。
```

响应 JSON：

```json
{
  "models": [
    {
      "provider": "mock",
      "model": "mock-creative-agent-v1",
      "displayName": "Mock 创意生产智能体",
      "capabilities": ["text", "image", "video", "html", "compliance"],
      "mock": true
    }
  ]
}
```

curl：

```bash
curl http://localhost:8080/api/models
curl http://localhost:8000/api/models
```

## 7. GET /api/threads

用途：

```text
返回左侧会话列表。
```

请求参数：

```text
无。
```

响应 JSON：

```json
{
  "threads": [
    {
      "threadId": "thread-summer-coffee",
      "campaignId": "campaign-summer-coffee",
      "title": "夏季气泡咖啡上市",
      "createdAt": "2026-06-22T10:00:00+08:00",
      "updatedAt": "2026-06-22T10:05:00+08:00"
    },
    {
      "threadId": "thread-html-campaign",
      "campaignId": "campaign-html-launch",
      "title": "新品落地页生成",
      "createdAt": "2026-06-22T09:00:00+08:00",
      "updatedAt": "2026-06-22T09:30:00+08:00"
    }
  ]
}
```

curl：

```bash
curl http://localhost:8080/api/threads
curl http://localhost:8000/api/threads
```

## 8. POST /api/threads

用途：

```text
创建新会话。
```

请求 JSON：

```json
{
  "title": "夏季气泡咖啡上市",
  "campaignId": "campaign-summer-coffee"
}
```

响应 JSON：

```json
{
  "threadId": "thread-summer-coffee",
  "campaignId": "campaign-summer-coffee",
  "title": "夏季气泡咖啡上市",
  "createdAt": "2026-06-22T10:00:00+08:00",
  "updatedAt": "2026-06-22T10:00:00+08:00"
}
```

curl：

```bash
curl -X POST http://localhost:8080/api/threads \
  -H "Content-Type: application/json" \
  -d '{"title":"夏季气泡咖啡上市","campaignId":"campaign-summer-coffee"}'
```

## 9. GET /api/threads/{threadId}

用途：

```text
查询会话详情。
```

路径参数：

```text
threadId: thread-summer-coffee
```

响应 JSON：

```json
{
  "threadId": "thread-summer-coffee",
  "campaignId": "campaign-summer-coffee",
  "title": "夏季气泡咖啡上市",
  "createdAt": "2026-06-22T10:00:00+08:00",
  "updatedAt": "2026-06-22T10:05:00+08:00"
}
```

curl：

```bash
curl http://localhost:8080/api/threads/thread-summer-coffee
curl http://localhost:8000/api/threads/thread-summer-coffee
```

## 10. GET /api/threads/{threadId}/messages

用途：

```text
查询会话消息。
```

路径参数：

```text
threadId: thread-summer-coffee
```

响应 JSON：

```json
{
  "messages": [
    {
      "messageId": "msg-user-001",
      "threadId": "thread-summer-coffee",
      "role": "user",
      "content": "帮我为夏季气泡咖啡生成一套小红书首发素材：主视觉、短视频分镜、活动页和合规检查。",
      "createdAt": "2026-06-22T10:00:00+08:00"
    },
    {
      "messageId": "msg-agent-001",
      "threadId": "thread-summer-coffee",
      "runId": "run-summer-coffee-001",
      "role": "assistant",
      "content": "我会先拆解目标人群和卖点，再调用生图、分镜、活动页和合规检查工具，最后把可交付素材放到右侧能力面板。",
      "createdAt": "2026-06-22T10:00:08+08:00"
    }
  ]
}
```

curl：

```bash
curl http://localhost:8080/api/threads/thread-summer-coffee/messages
curl http://localhost:8000/api/threads/thread-summer-coffee/messages
```

## 11. POST /api/threads/{threadId}/runs/stream

用途：

```text
创建 AIGC Campaign Run，并通过 SSE 返回流式事件。
```

路径参数：

```text
threadId: thread-summer-coffee
```

Java 请求 JSON：

```json
{
  "prompt": "帮我生成夏季气泡咖啡小红书首发素材",
  "runtime": "java",
  "scenario": "summer_bubble_coffee_campaign",
  "modelProvider": "mock",
  "model": "mock-creative-agent-v1",
  "mockMode": true
}
```

Python 请求 JSON：

```json
{
  "prompt": "帮我生成夏季气泡咖啡小红书首发素材",
  "runtime": "python",
  "scenario": "summer_bubble_coffee_campaign",
  "modelProvider": "mock",
  "model": "mock-creative-agent-v1",
  "mockMode": true
}
```

curl Java：

```bash
curl -N \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -X POST http://localhost:8080/api/threads/thread-summer-coffee/runs/stream \
  -d '{"prompt":"帮我生成夏季气泡咖啡小红书首发素材","runtime":"java","scenario":"summer_bubble_coffee_campaign","modelProvider":"mock","model":"mock-creative-agent-v1","mockMode":true}'
```

curl Python：

```bash
curl -N \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -X POST http://localhost:8000/api/threads/thread-summer-coffee/runs/stream \
  -d '{"prompt":"帮我生成夏季气泡咖啡小红书首发素材","runtime":"python","scenario":"summer_bubble_coffee_campaign","modelProvider":"mock","model":"mock-creative-agent-v1","mockMode":true}'
```

SSE 响应节选：

```text
event: run_started
data: {"event":"run_started","runId":"run-summer-coffee-001","threadId":"thread-summer-coffee","runtime":"java","scenario":"summer_bubble_coffee_campaign","title":"开始夏季气泡咖啡营销素材生成","createdAt":"2026-06-22T10:00:00+08:00"}

event: trace_event
data: {"event":"trace_event","runId":"run-summer-coffee-001","threadId":"thread-summer-coffee","runtime":"java","eventId":"evt-planner-started","type":"planner_started","title":"开始拆解创意需求","detail":"解析目标人群、卖点、素材类型和合规要求。","status":"running","createdAt":"2026-06-22T10:00:01+08:00"}

event: message_delta
data: {"event":"message_delta","runId":"run-summer-coffee-001","threadId":"thread-summer-coffee","runtime":"java","delta":"正在理解营销需求，并拆解为图片、视频分镜、HTML 和合规检查任务。","createdAt":"2026-06-22T10:00:02+08:00"}

event: run_finished
data: {"event":"run_finished","runId":"run-summer-coffee-001","threadId":"thread-summer-coffee","runtime":"java","messageId":"msg-agent-final-001","assetIds":["asset-hero-image","asset-video-board","asset-html","asset-compliance"],"createdAt":"2026-06-22T10:00:08+08:00"}

```

完整 19 步顺序以 `15_PHASE1_8_BACKEND_MOCK_SSE_PLAN_ZH.md` 为准。

## 12. GET /api/runs

用途：

```text
查询 Run 列表。
```

请求参数：

```text
无。
```

响应 JSON：

```json
{
  "runs": [
    {
      "runId": "run-summer-coffee-001",
      "threadId": "thread-summer-coffee",
      "runtime": "java",
      "scenario": "summer_bubble_coffee_campaign",
      "status": "succeeded",
      "modelProvider": "mock",
      "model": "mock-creative-agent-v1",
      "startedAt": "2026-06-22T10:00:00+08:00",
      "finishedAt": "2026-06-22T10:00:08+08:00",
      "createdAt": "2026-06-22T10:00:00+08:00"
    }
  ]
}
```

curl：

```bash
curl http://localhost:8080/api/runs
curl http://localhost:8000/api/runs
```

## 13. GET /api/runs/{runId}

用途：

```text
查询 Run 详情。
```

路径参数：

```text
runId: run-summer-coffee-001
```

响应 JSON：

```json
{
  "runId": "run-summer-coffee-001",
  "threadId": "thread-summer-coffee",
  "runtime": "java",
  "scenario": "summer_bubble_coffee_campaign",
  "status": "succeeded",
  "modelProvider": "mock",
  "model": "mock-creative-agent-v1",
  "startedAt": "2026-06-22T10:00:00+08:00",
  "finishedAt": "2026-06-22T10:00:08+08:00",
  "createdAt": "2026-06-22T10:00:00+08:00"
}
```

curl：

```bash
curl http://localhost:8080/api/runs/run-summer-coffee-001
curl http://localhost:8000/api/runs/run-summer-coffee-001
```

## 14. GET /api/runs/{runId}/trace

用途：

```text
查询 Run 的 Trace 时间线。
```

路径参数：

```text
runId: run-summer-coffee-001
```

响应 JSON：

```json
{
  "runId": "run-summer-coffee-001",
  "events": [
    {
      "eventId": "evt-planner-started",
      "runId": "run-summer-coffee-001",
      "threadId": "thread-summer-coffee",
      "runtime": "java",
      "type": "planner_started",
      "title": "开始拆解创意需求",
      "detail": "解析目标人群、卖点、素材类型和合规要求。",
      "status": "succeeded",
      "durationMs": 320,
      "createdAt": "2026-06-22T10:00:01+08:00"
    },
    {
      "eventId": "evt-image-created",
      "runId": "run-summer-coffee-001",
      "threadId": "thread-summer-coffee",
      "runtime": "java",
      "type": "asset_created",
      "title": "生成主视觉图片",
      "detail": "生成一张可进入画板继续编辑的夏季气泡咖啡主视觉。",
      "status": "succeeded",
      "toolName": "image_mock_generator",
      "assetId": "asset-hero-image",
      "durationMs": 1680,
      "createdAt": "2026-06-22T10:00:04+08:00"
    }
  ]
}
```

curl：

```bash
curl http://localhost:8080/api/runs/run-summer-coffee-001/trace
curl http://localhost:8000/api/runs/run-summer-coffee-001/trace
```

## 15. GET /api/assets

用途：

```text
查询 Mock 资产列表。
```

响应 JSON：

```json
{
  "assets": [
    {
      "assetId": "asset-hero-image",
      "runId": "run-summer-coffee-001",
      "type": "image",
      "title": "夏季气泡咖啡主视觉",
      "description": "可进入画板继续裁剪、局部重绘和加文案。",
      "status": "succeeded",
      "previewUrl": "mock://summer-coffee-hero",
      "createdAt": "2026-06-22T10:00:04+08:00"
    },
    {
      "assetId": "asset-video-board",
      "runId": "run-summer-coffee-001",
      "type": "video_storyboard",
      "title": "15 秒短视频分镜",
      "description": "开场冰块声、倒入气泡、杯壁水珠、结尾促销口播。",
      "status": "succeeded",
      "previewUrl": "mock://summer-coffee-video-board",
      "createdAt": "2026-06-22T10:00:05+08:00"
    },
    {
      "assetId": "asset-html",
      "runId": "run-summer-coffee-001",
      "type": "html",
      "title": "移动端活动页",
      "description": "包含首屏、卖点、门店券、购买按钮四段结构。",
      "status": "succeeded",
      "htmlSnippet": "<section><h1>夏日气泡咖啡</h1><p>清爽上市</p></section>",
      "createdAt": "2026-06-22T10:00:06+08:00"
    },
    {
      "assetId": "asset-compliance",
      "runId": "run-summer-coffee-001",
      "type": "compliance_report",
      "title": "合规检查报告",
      "description": "整体通过，建议替换一处营销夸张词。",
      "status": "succeeded",
      "createdAt": "2026-06-22T10:00:07+08:00"
    }
  ]
}
```

curl：

```bash
curl http://localhost:8080/api/assets
curl http://localhost:8000/api/assets
```

## 16. GET /api/assets/{assetId}

用途：

```text
查询单个 Mock 资产详情。
```

路径参数：

```text
assetId: asset-hero-image
```

响应 JSON：

```json
{
  "assetId": "asset-hero-image",
  "runId": "run-summer-coffee-001",
  "type": "image",
  "title": "夏季气泡咖啡主视觉",
  "description": "可进入画板继续裁剪、局部重绘和加文案。",
  "status": "succeeded",
  "previewUrl": "mock://summer-coffee-hero",
  "createdAt": "2026-06-22T10:00:04+08:00"
}
```

curl：

```bash
curl http://localhost:8080/api/assets/asset-hero-image
curl http://localhost:8000/api/assets/asset-hero-image
```

## 17. POST /api/html/previews

用途：

```text
创建 HTML 预览。
```

请求 JSON：

```json
{
  "assetId": "asset-html",
  "htmlSnippet": "<section><h1>夏日气泡咖啡</h1><p>清爽上市</p></section>"
}
```

响应 JSON：

```json
{
  "previewId": "preview-html-summer-coffee",
  "assetId": "asset-html",
  "htmlSnippet": "<section><h1>夏日气泡咖啡</h1><p>清爽上市</p></section>",
  "sandboxMode": true,
  "createdAt": "2026-06-22T10:00:06+08:00"
}
```

curl：

```bash
curl -X POST http://localhost:8080/api/html/previews \
  -H "Content-Type: application/json" \
  -d '{"assetId":"asset-html","htmlSnippet":"<section><h1>夏日气泡咖啡</h1><p>清爽上市</p></section>"}'
```

## 18. GET /api/html/previews/{previewId}

用途：

```text
查询 HTML 预览详情。
```

路径参数：

```text
previewId: preview-html-summer-coffee
```

响应 JSON：

```json
{
  "previewId": "preview-html-summer-coffee",
  "assetId": "asset-html",
  "htmlSnippet": "<section><h1>夏日气泡咖啡</h1><p>清爽上市</p></section>",
  "sandboxMode": true,
  "createdAt": "2026-06-22T10:00:06+08:00"
}
```

curl：

```bash
curl http://localhost:8080/api/html/previews/preview-html-summer-coffee
curl http://localhost:8000/api/html/previews/preview-html-summer-coffee
```

## 19. POST /api/compliance/reviews

用途：

```text
创建合规检查。
```

请求 JSON：

```json
{
  "assetId": "asset-hero-image",
  "content": "夏季气泡咖啡，清爽上市，爆款必备。"
}
```

响应 JSON：

```json
{
  "reviewId": "review-summer-coffee-001",
  "assetId": "asset-hero-image",
  "status": "passed_with_suggestion",
  "summary": "整体通过，建议替换一处营销夸张词。",
  "suggestions": [
    "建议把“爆款必备”改为“夏日推荐”。"
  ],
  "createdAt": "2026-06-22T10:00:07+08:00"
}
```

curl：

```bash
curl -X POST http://localhost:8080/api/compliance/reviews \
  -H "Content-Type: application/json" \
  -d '{"assetId":"asset-hero-image","content":"夏季气泡咖啡，清爽上市，爆款必备。"}'
```

## 20. GET /api/compliance/reviews/{reviewId}

用途：

```text
查询合规检查详情。
```

路径参数：

```text
reviewId: review-summer-coffee-001
```

响应 JSON：

```json
{
  "reviewId": "review-summer-coffee-001",
  "assetId": "asset-hero-image",
  "status": "passed_with_suggestion",
  "summary": "整体通过，建议替换一处营销夸张词。",
  "suggestions": [
    "建议把“爆款必备”改为“夏日推荐”。"
  ],
  "createdAt": "2026-06-22T10:00:07+08:00"
}
```

curl：

```bash
curl http://localhost:8080/api/compliance/reviews/review-summer-coffee-001
curl http://localhost:8000/api/compliance/reviews/review-summer-coffee-001
```

## 21. 错误响应示例

400：

```json
{
  "code": "INVALID_REQUEST",
  "message": "请求参数不合法，请检查 runtime、scenario 和 mockMode。",
  "detail": "runtime 必须是 java 或 python"
}
```

404：

```json
{
  "code": "NOT_FOUND",
  "message": "资源不存在，请检查 ID 是否正确。",
  "detail": "未找到 threadId=thread-unknown"
}
```

SSE 失败：

```json
{
  "code": "SSE_STREAM_INTERRUPTED",
  "message": "智能体流式输出中断，请稍后重试。",
  "detail": "客户端连接已断开"
}
```
