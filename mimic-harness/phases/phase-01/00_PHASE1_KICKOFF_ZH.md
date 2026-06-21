# Phase 1 启动草案：主题化 Contracts + Mock SSE

> Phase 1 从现在开始。  
> 当前产品主题已经确认，完整需求范围已冻结。  
> 本阶段目标不是复刻 DeerFlow 页面，而是做出一个有自己主题的第一条可运行闭环。

## 1. 阶段目标

```text
做出一个有主题的高保真原型，
并通过同一套 contracts 对接 Java/Python 两个 mock SSE runtime。
```

## 2. 本阶段主题候选

已确认主题：

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

历史候选：

```text
候选 A：Agent Run 调试工作台
候选 B：智能运维排障助手
候选 C：技术学习与面试教练
候选 D：企业知识库 Agent 平台
候选 E：AIGC 创意生产工作流 Agent
```

候选 A 用户视角：

```text
我可以输入一个工程问题，
选择 Java 或 Python Runtime，
看到 mock Agent 流式回答，
并在右侧看到一次 Run 的 Trace Timeline。
```

候选 E 用户视角：

```text
我输入一个创意生产需求，
Agent 自动拆成生图、生视频、生 HTML 三个任务，
我能看到每个任务的 mock 产物和工作流 Trace。
```

补充脑暴材料：

```text
01_BRAINSTORM_RESUME_RESOURCES_ZH.md
```

当前基于简历项目和 resources 源码确认的方向：

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

注意：

```text
主题已经确认。
完整需求范围见 03_PHASE_SCOPE_ZH.md。
```

## 3. 本阶段可能做什么

### 3.1 产品和前端

```text
产品品牌露出，名称待确认
三栏工作台布局
Runtime Switch
Model Selector
Chat Message List
Chat Composer
Trace Timeline
Tool Call 占位卡片
Fallback Banner 占位
资产预览卡片
HTML 预览区域
Settings 页面
中文空状态、加载状态、错误状态
```

### 3.2 Contracts

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

SSE 事件：

```text
run_started
message_delta
trace_event
run_finished
run_failed
```

### 3.3 Java Runtime

```text
Spring Boot mock service
返回 Java Runtime mock SSE
中文日志
中文异常
固定 mock trace events
```

### 3.4 Python Runtime

```text
FastAPI mock service
返回 Python Runtime mock SSE
中文日志
中文异常
固定 mock trace events
```

## 4. 本阶段不做什么草案

```text
不接真实模型
不做登录
不做真实数据库持久化
不做真实工具调用
不做真实 RAG
不做真实 MQ
不做 Docker 云部署
```

但这些形态要预留：

```text
ModelProvider
ToolCall
TraceEvent
Runtime
Thread
Run
```

## 5. Mock 场景候选

候选输入：

```text
请帮我分析这段服务异常日志，并给出排查步骤。
```

Java Runtime mock 回复：

```text
我正在使用 Java Runtime 分析异常日志。
第一步，我会识别异常类型。
第二步，我会检查线程、数据库连接和下游服务。
第三步，我会给出建议的排查顺序。
```

Python Runtime mock 回复：

```text
我正在使用 Python Runtime 分析异常日志。
我会先整理异常摘要，再生成排查计划，并把关键步骤写入 Trace。
```

候选 E 输入：

```text
帮我为一款夏季气泡咖啡生成一套推广素材：主视觉图、15 秒视频分镜、HTML 落地页。
```

候选 E mock 回复：

```text
我会先拆解创意目标，然后生成图片任务、视频任务和 HTML 页面任务。
当前阶段使用 mock 工具返回资产卡片，并通过 Trace 展示工作流进度。
```

## 6. 验收标准草案

```text
前端能打开主题化工作台。
前端能切换 Java / Python Runtime。
选择 Java 时，能看到 Java mock SSE 流式输出。
选择 Python 时，能看到 Python mock SSE 流式输出。
右侧 Trace Timeline 能显示 run_started、trace_event、run_finished。
后端关闭时，前端能显示中文错误状态。
Contracts 文件已经落地并经过确认。
Java/Python 接口字段保持一致。
```

## 7. 第一阶段交付顺序

```text
1. 产品主题冻结
2. Contracts 文件落地
3. 前端高保真静态原型
4. Java mock SSE
5. Python mock SSE
6. 前后端联调
7. 测试和验收记录
```
