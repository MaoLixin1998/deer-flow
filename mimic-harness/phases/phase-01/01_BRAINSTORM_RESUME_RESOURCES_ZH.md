# 01. Phase 1 头脑风暴：简历项目与 Resources 对齐

> 本文件属于 Phase 1 生产目录。  
> 目标是先把“你简历里能讲的项目能力”和 `resources/` 中可学习的开源实现对齐，再继续决定产品主题。  
> 当前头脑风暴已经完成第一轮，主题已经确认。  
> 本文件仍保留为选型依据，不等于完整需求冻结。

## 1. 本次输入来源

已阅读的个人项目材料：

```text
/Users/mao/Documents/Codex/interview/my_info/毛利鑫-简历-AI-Agent-Java后端版.md
/Users/mao/Documents/Codex/interview/resources/ai-agent-saved/面试准备/00-简历-项目经历.md
```

已阅读的学习源码材料：

```text
resources/README.md
resources/langchain4j-examples/README.md
resources/openai-agents-python/README.md
resources/smolagents/README.md
resources/openai-agents-python/examples/agent_patterns/README.md
resources/smolagents/examples/server/README.md
resources/spring-ai-examples/agentic-patterns/
resources/langchain4j-examples/agentic-tutorial/
resources/langchain4j-examples/rag-examples/
resources/langchain4j-examples/customer-support-agent-example/
resources/langchain4j-examples/mcp-example/
```

## 2. 简历里的 4 个项目能力画像

### 2.1 超级编辑器 / AI Agent 海报设计与内容生成系统

可迁移能力：

```text
Supervisor 意图识别
子 Agent 任务拆分
素材、文案、HTML、海报生成工具
Playwright 截图预览
状态持久化和恢复
模型 fallback
Trace 日志
```

适合放进本项目的亮点：

```text
把“生成一套营销素材”拆成 planner、image、video、html、reviewer 多个节点。
前端展示每个节点的输入、输出、状态、耗时和失败原因。
后端用 Java/Python 两套 runtime 做同构实现。
```

### 2.2 AI 设计中台 / 多模型创意生成平台

可迁移能力：

```text
多模型适配
文本生图
图生图
生视频
模型路由
异步任务状态
回调处理
重试、超时、限流
资产结果管理
```

适合放进本项目的亮点：

```text
抽象 ModelProvider 和 CreativeToolAdapter。
把不同国产模型、国外模型、mock provider 统一成一个任务接口。
Phase 1 先用 mock asset，后续逐步接真实模型。
```

### 2.3 鹿班创意工具平台

可迁移能力：

```text
电商营销图生成
商品图编辑
OCR
登录鉴权
分布式锁
部署排障
```

适合放进本项目的亮点：

```text
把“电商商品营销素材生成”作为第一条业务样例。
前端可以展示商品信息、创意 Brief、生成资产、HTML 落地页。
后端可以模拟异步任务锁、任务状态机和部署健康检查。
```

### 2.4 字体监测平台 / 商品图字体合规检测与编辑系统

可迁移能力：

```text
图片检测任务
字体合规识别
图层拆分
字体替换
图片重组
异步任务流转
失败重试
状态追踪
```

适合放进本项目的亮点：

```text
作为后续 Reviewer Agent 或 Compliance Agent。
生成素材后由合规 Agent 检查字体、品牌、尺寸、敏感词。
这样不只是“生成”，还能讲“质量控制”和“业务闭环”。
```

## 3. 简历扩展项目里的强能力

`AI Agent 智能体平台` 这部分尤其适合做本项目的工程底座。

可迁移能力：

```text
ReAct Loop
流式 LLM 输出
工具调用
工具结果回填上下文
SSE
RAG 混合检索
上下文压缩
Claude prompt caching 思路
Redis 中间状态
OpenSearch / 向量检索
模型 fallback 和熔断
MCP 工具协议
Multi-Agent as tools
Trace 和运行日志
```

对本项目的意义：

```text
产品主题可以是 AIGC 创意生产，但工程底座必须是 AgentOps。
也就是说，面试时讲的不是“我做了一个生图页面”，而是“我做了一个可观测、可降级、可扩展、双语言同构的 AIGC Agent Harness”。
```

## 4. Resources 学习价值映射

### 4.1 langchain4j-examples

重点学习：

```text
Java Agent 抽象
Tool Calling
RAG
Redis / pgvector / Milvus / OpenSearch 等存储示例
MCP 示例
Customer Support Agent 的业务化组织方式
```

本项目吸收方式：

```text
Java Runtime 的第一优先参考。
Phase 2 手写 Loop，Phase 10 再做 LangChain4j Adapter。
RAG 和向量存储方案从这里选轻量实现。
```

### 4.2 spring-ai-examples

重点学习：

```text
Spring Boot 原生 AI 工程方式
agentic-patterns 中的 chain、routing、parallelization、orchestrator-workers、evaluator-optimizer
MCP client/server 示例
Streaming response 示例
```

本项目吸收方式：

```text
Java 服务分层、配置、日志、接口风格向 Spring Boot 靠齐。
多 Agent 编排可以参考 orchestrator-workers。
生图、生视频、生 HTML 可参考 routing + chain workflow。
```

### 4.3 openai-agents-python

重点学习：

```text
Agent
Tools
Handoffs
Agents as tools
Guardrails
Human in the loop
Sessions
Tracing
Memory
MCP
Sandbox
Streaming
```

本项目吸收方式：

```text
Python Runtime 的第一优先参考。
Phase 2 手写最小 Loop，Phase 10 再做 OpenAI Agents Adapter。
多 Agent、Trace、Session、Guardrails 都能作为后续阶段的高级能力。
```

### 4.4 smolagents

重点学习：

```text
极简 Agent Loop
CodeAgent 思路
ToolCallingAgent
MCP 工具集成
多模态输入
本地/远程模型切换
简单 server 示例
```

本项目吸收方式：

```text
用它理解 Agent Loop 的最小形态。
Python 版可以先写得像 smolagents 一样直观，再逐步加企业级分层。
```

## 5. 候选主题再脑暴

### 5.1 方向 A：纯 AgentOps 工程工作台

优势：

```text
技术工程味最强。
最容易讲 Trace、Runtime、Fallback、RAG、MCP、部署。
适合 Java 后端面试。
```

风险：

```text
业务故事偏抽象。
如果没有真实业务任务，容易像一个内部调试平台。
```

### 5.2 方向 B：AIGC 创意生产工作流 Agent

优势：

```text
最贴合你简历里的 AI Agent、设计中台、鹿班、字体合规项目。
天然包含生图、生视频、生 HTML、素材管理、异步任务、工作流。
前端更容易做出高保真效果。
用户一眼能懂业务价值。
```

风险：

```text
真实模型依赖第三方能力。
需要设计好 mock provider、降级 provider 和真实 provider 的切换。
```

### 5.3 方向 C：AIGC 创意生产 + AgentOps 底座

这是已经确认的主题方向。

一句话：

```text
一个面向营销创意生产的 AI Agent 工作流平台，支持生图、生视频、生 HTML，并提供完整 Trace、模型降级、工具调用和 Java/Python 双 Runtime。
```

它不是纯业务系统，也不是纯调试系统，而是：

```text
业务外壳：AIGC 创意生产工作流
工程内核：AgentOps / Harness / Trace / Fallback / Multi-Agent / RAG / MCP
```

推荐候选名称：

```text
Ninic Creative Agent Studio
Ninic AIGC Workflow Studio
Ninic CreativeOps Agent
```

## 6. 为什么方向 C 技术亮点最多

可以覆盖的面试亮点：

```text
1. Multi-Agent：Planner、ImageAgent、VideoAgent、HtmlAgent、ReviewAgent。
2. Tool Calling：生图工具、生视频工具、HTML 生成工具、截图工具、合规检查工具。
3. Workflow：串行、并行、失败重试、人工确认、结果聚合。
4. SSE：前端实时看到任务进度、模型输出、工具事件。
5. Trace：一次 run 下钻到每个 agent、tool、model call。
6. Fallback：主模型失败后切 mock provider、低价 provider 或文本降级。
7. Java/Python 双 Runtime：同 contracts、同事件、同数据结构。
8. 资产管理：图片、视频、HTML、缩略图、任务元数据。
9. 上下文管理：Brief、素材、历史 run、工具结果进入上下文。
10. RAG：后续接品牌规范、商品资料、历史优秀案例。
11. MCP：把外部工具服务作为标准工具接入。
12. 单机大厂架构模拟：PostgreSQL、Redis、MinIO、轻量 MQ、pgvector 按 profile 启用。
```

这条路线最适合你的简历，因为它能把 4 个项目串成一个完整故事：

```text
超级编辑器 -> Agent 编排和 HTML/海报生成
AI 设计中台 -> 多模型 AIGC 能力
鹿班平台 -> 电商营销素材业务
字体监测平台 -> 生成后合规检测和编辑闭环
AI Agent 平台 -> 工程底座、Loop、RAG、SSE、Fallback、MCP
```

## 7. Phase 1 建议 Demo 场景

推荐输入：

```text
帮我为一款夏季气泡咖啡生成一套推广素材：3 张主视觉图、15 秒短视频分镜、一个 HTML 落地页，并给出完整工作流 Trace。
```

Phase 1 只做 mock，但要做出真实形态：

```text
1. 前端显示一个创意工作台。
2. 用户选择 Java Runtime 或 Python Runtime。
3. 用户发起一次 Campaign Run。
4. 后端通过 SSE 推送 planner、image、video、html、review 四类 trace_event。
5. 中间区域展示 mock 图片资产卡片、mock 视频分镜卡片、HTML 预览卡片。
6. 右侧展示 Trace Timeline、Tool Calls、Runtime、Fallback 占位。
7. 后端关闭或事件异常时，前端显示中文错误。
```

Phase 1 不做：

```text
真实模型调用
真实生图
真实生视频
真实登录
真实数据库持久化
真实 RAG
真实 MQ
真实云部署
```

但 Phase 1 要预留字段：

```text
provider
model
runtime
toolName
assetType
assetUrl
traceId
parentTraceId
fallbackReason
durationMs
errorCode
```

## 8. 待用户确认的问题

进入需求冻结前，需要你确认：

```text
1. 产品名是否先用 Ninic Creative Agent Studio？
2. Phase 1 默认 Demo 是否使用“夏季气泡咖啡营销素材生成”？
3. Phase 1 资产卡片是否包含：图片、视频分镜、HTML 预览、合规检查结果？
4. Java/Python Runtime 的 mock 内容是否必须完全一致，只在 runtime 字段和日志上区分？
5. 是否保留当前 contracts 草案，还是按 AIGC 工作流重新调整？
```

## 9. 当前结论

当前主题已经确认：

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

原因：

```text
它最贴合你的简历。
它比纯 AgentOps 更有业务展示面。
它比纯 AIGC 页面更有后端工程深度。
它能自然容纳 Java/Python 双版本、前端高保真、Multi-Agent、Fallback、RAG、MCP、部署和面试集群设计。
```
