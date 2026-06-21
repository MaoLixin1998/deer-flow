# 03. Phase 1 需求冻结

> 本文件是 Phase 1 的需求冻结记录。  
> 这一版不只冻结一个最小 Demo，而是先冻结产品级功能蓝图，再冻结 Phase 1 的实施切片。  
> 后续简单设计、Contracts、前端、Java 后端、Python 后端、测试验收，都必须以本文件为准。

## 1. 冻结方法

需求冻结分两层：

```text
第一层：产品级需求蓝图
  说明这个中型项目初始规划有哪些能力域、主要页面、主要接口、核心数据对象。
  这是产品蓝图基线，不是永远不许调整的最终清单。

第二层：Phase 1 实施切片
  说明第一阶段从蓝图里先实现哪些、静态占位哪些、只做 contracts 预留哪些。
```

这样做的原因：

```text
如果只冻结 2 个页面和 8 个接口，项目会像小 Demo。
如果第一阶段强行实现 100 多个接口，2 核 4G 和学习节奏会被压垮。
正确做法是：第一阶段把产品形态、信息架构、接口边界、数据模型先立起来，再用 mock 跑通主链路。
```

## 2. 产品级冻结结论

产品主题：

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

产品展示名：

```text
Ninic Creative Agent Studio
```

一句话定位：

```text
面向营销创意生产场景的 AI Agent 工作流平台，同时具备可观测、可降级、可扩展、Java/Python 双语言同构的 AgentOps 工程底座。
```

默认 Demo：

```text
夏季气泡咖啡营销素材生成
```

默认用户输入：

```text
帮我为一款夏季气泡咖啡生成一套推广素材：
3 张主视觉图、15 秒短视频分镜、一个 HTML 落地页，并给出完整工作流 Trace。
```

目标使用者：

```text
Java 后端开发者
AI Agent 学习者
面试官
需要创意素材生产的业务用户
```

## 3. 产品能力域

产品级能力域暂定为 16 个。

说明：

```text
这 16 个能力域是当前产品蓝图基线。
后续可以根据开发进度、服务器资源、学习收益、面试价值进行增删合并。
任何变更都要记录在本文件“变更记录”或对应 Phase 文档里。
```

```text
01. Creative Workbench        创意工作台
02. Campaign Management       营销活动管理
03. Workflow Studio           工作流编排
04. Agent Runtime             智能体运行时
05. Multi-Agent Center        多智能体中心
06. Tool Lab                  工具实验室
07. Model Provider Center     模型供应商中心
08. Asset Center              资产中心
09. HTML Preview & Publish    HTML 预览与发布
10. Compliance Review         合规检查
11. Knowledge Base / RAG      知识库与 RAG
12. Prompt Template Center    Prompt 模板中心
13. Trace Observability       Trace 可观测性
14. Evaluation Center         评测中心
15. Runtime Settings          运行配置
16. Deploy Console            部署控制台
```

Phase 1 必须让这些能力在前端信息架构里“看得见”。

Phase 1 不要求所有能力都真实可用。

## 4. 产品页面蓝图

产品级主要页面暂定为 18 个。

| 序号 | 路由 | 页面 | Phase 1 状态 |
| --- | --- | --- | --- |
| 1 | `/` | Creative Workbench 创意工作台 | 可运行 |
| 2 | `/campaigns` | Campaign 列表 | 静态占位 |
| 3 | `/campaigns/[campaignId]` | Campaign 详情 | 静态占位 |
| 4 | `/runs` | Run 历史 | 静态占位 |
| 5 | `/runs/[runId]` | Run 详情和 Trace 回放 | 静态占位 |
| 6 | `/assets` | 资产中心 | 静态占位 |
| 7 | `/assets/[assetId]` | 资产详情 | 静态占位 |
| 8 | `/workflows` | 工作流模板列表 | 静态占位 |
| 9 | `/workflows/[workflowId]` | 工作流详情 | 静态占位 |
| 10 | `/agents` | Agent 配置中心 | 静态占位 |
| 11 | `/tools` | Tool Lab 工具实验室 | 静态占位 |
| 12 | `/models` | 模型供应商中心 | 静态占位 |
| 13 | `/knowledge` | RAG 知识库 | 静态占位 |
| 14 | `/prompts` | Prompt 模板中心 | 静态占位 |
| 15 | `/observability` | Trace、日志、指标 | 静态占位 |
| 16 | `/evals` | 评测中心 | 静态占位 |
| 17 | `/settings` | Runtime Settings | 可运行 / mock |
| 18 | `/deploy` | Docker 部署控制台 | 静态占位 |

Phase 1 页面要求：

```text
1. `/` 和 `/settings` 必须能交互。
2. 其他页面可以是高保真静态占位，但必须有清晰导航、空状态、中文说明和后续能力入口。
3. 不能做成营销首页。
4. 第一屏必须是可操作工作台。
```

## 5. 产品接口蓝图

产品级接口蓝图暂定为 131 个接口。

这些接口不是 Phase 1 全部实现清单。

说明：

```text
131 个接口是中型项目的接口候选池。
后续会根据真实开发进度取舍、合并、拆分或删除。
Phase 1 只要求 M 类接口可 mock 跑通；S / C 类接口只作为页面和 contracts 设计参考。
```

状态含义：

```text
M：Phase 1 必须 mock 实现
S：Phase 1 前端静态占位，可使用 mock data
C：Phase 1 只做 contracts 预留，不实现
F：后续 Phase 实现
```

### 5.1 Health / Runtime

```text
M GET  /api/health
M GET  /api/runtimes
M GET  /api/runtimes/{runtime}
S GET  /api/runtimes/{runtime}/health
C PUT  /api/runtimes/{runtime}/config
C POST /api/runtimes/{runtime}/restart
```

### 5.2 Models / Providers

```text
M GET  /api/models
S GET  /api/model-providers
S GET  /api/model-providers/{provider}
C POST /api/model-providers
C PUT  /api/model-providers/{provider}
C POST /api/model-providers/{provider}/test
C GET  /api/model-providers/{provider}/usage
C GET  /api/model-providers/{provider}/costs
```

### 5.3 Threads / Messages

```text
M GET  /api/threads
M POST /api/threads
M GET  /api/threads/{threadId}
M GET  /api/threads/{threadId}/messages
S POST /api/threads/{threadId}/messages
C PATCH /api/threads/{threadId}
C DELETE /api/threads/{threadId}
C POST /api/threads/{threadId}/archive
```

### 5.4 Runs / SSE

```text
M POST /api/threads/{threadId}/runs/stream
M GET  /api/runs
M GET  /api/runs/{runId}
M GET  /api/runs/{runId}/trace
S POST /api/runs/{runId}/cancel
S POST /api/runs/{runId}/retry
C GET  /api/runs/{runId}/events
C GET  /api/runs/{runId}/artifacts
C GET  /api/runs/{runId}/cost
C GET  /api/runs/{runId}/logs
```

### 5.5 Campaigns

```text
S GET  /api/campaigns
S POST /api/campaigns
S GET  /api/campaigns/{campaignId}
S PATCH /api/campaigns/{campaignId}
S DELETE /api/campaigns/{campaignId}
S GET  /api/campaigns/{campaignId}/runs
S GET  /api/campaigns/{campaignId}/assets
C POST /api/campaigns/{campaignId}/duplicate
```

### 5.6 Workflows

```text
S GET  /api/workflows
S POST /api/workflows
S GET  /api/workflows/{workflowId}
S PATCH /api/workflows/{workflowId}
S DELETE /api/workflows/{workflowId}
S POST /api/workflows/{workflowId}/validate
S POST /api/workflows/{workflowId}/run
C GET  /api/workflows/{workflowId}/versions
C POST /api/workflows/{workflowId}/versions
C POST /api/workflows/{workflowId}/publish
```

### 5.7 Agents

```text
S GET  /api/agents
S POST /api/agents
S GET  /api/agents/{agentId}
S PATCH /api/agents/{agentId}
S DELETE /api/agents/{agentId}
S GET  /api/agents/{agentId}/tools
S PUT  /api/agents/{agentId}/tools
C POST /api/agents/{agentId}/test
C GET  /api/agents/{agentId}/runs
```

### 5.8 Tools

```text
S GET  /api/tools
S POST /api/tools
S GET  /api/tools/{toolId}
S PATCH /api/tools/{toolId}
S DELETE /api/tools/{toolId}
S POST /api/tools/{toolId}/invoke
S POST /api/tools/{toolId}/test
C GET  /api/tools/{toolId}/schema
C PUT  /api/tools/{toolId}/schema
```

### 5.9 Assets

```text
M GET  /api/assets
M GET  /api/assets/{assetId}
S POST /api/assets
S PATCH /api/assets/{assetId}
S DELETE /api/assets/{assetId}
S GET  /api/assets/{assetId}/preview
C POST /api/assets/{assetId}/publish
C POST /api/assets/{assetId}/download-url
C GET  /api/assets/{assetId}/versions
C POST /api/assets/{assetId}/versions
```

### 5.10 HTML Preview

```text
M POST /api/html/previews
M GET  /api/html/previews/{previewId}
S POST /api/html/previews/{previewId}/refresh
C POST /api/html/previews/{previewId}/screenshot
C POST /api/html/previews/{previewId}/publish
C GET  /api/html/previews/{previewId}/audit
```

### 5.11 Compliance

```text
M POST /api/compliance/reviews
M GET  /api/compliance/reviews/{reviewId}
S GET  /api/compliance/rules
S POST /api/compliance/rules
S PATCH /api/compliance/rules/{ruleId}
C DELETE /api/compliance/rules/{ruleId}
C POST /api/compliance/reviews/{reviewId}/approve
C POST /api/compliance/reviews/{reviewId}/reject
```

### 5.12 Knowledge / RAG

```text
S GET  /api/knowledge/bases
S POST /api/knowledge/bases
S GET  /api/knowledge/bases/{baseId}
S PATCH /api/knowledge/bases/{baseId}
C DELETE /api/knowledge/bases/{baseId}
C POST /api/knowledge/bases/{baseId}/documents
C GET  /api/knowledge/bases/{baseId}/documents
C POST /api/knowledge/bases/{baseId}/search
C POST /api/knowledge/bases/{baseId}/reindex
```

### 5.13 Prompt Templates

```text
S GET  /api/prompts
S POST /api/prompts
S GET  /api/prompts/{promptId}
S PATCH /api/prompts/{promptId}
C DELETE /api/prompts/{promptId}
C POST /api/prompts/{promptId}/render
C GET  /api/prompts/{promptId}/versions
```

### 5.14 Observability

```text
S GET  /api/observability/summary
S GET  /api/observability/traces
S GET  /api/observability/traces/{traceId}
S GET  /api/observability/logs
C GET  /api/observability/metrics
C GET  /api/observability/errors
C GET  /api/observability/fallbacks
C GET  /api/observability/tool-calls
```

### 5.15 Evaluations

```text
S GET  /api/evals
S POST /api/evals
S GET  /api/evals/{evalId}
C POST /api/evals/{evalId}/run
C GET  /api/evals/{evalId}/results
C GET  /api/evals/{evalId}/cases
C POST /api/evals/{evalId}/cases
```

### 5.16 Deploy / Config

```text
S GET  /api/deploy/status
S GET  /api/deploy/profiles
C POST /api/deploy/compose/render
C POST /api/deploy/compose/validate
C GET  /api/config
C PATCH /api/config
C GET  /api/config/export
C POST /api/config/import
```

Phase 1 实现规则：

```text
M 接口必须由 Java/Python mock runtime 或前端 mock adapter 跑通。
S 接口可以先不落后端，但前端页面要按照这些资源组织 mock data。
C 接口必须在需求冻结中登记，Contracts 阶段可选择只写草案分组。
F 接口不在 Phase 1 contracts 里展开。
```

## 6. 产品数据模型蓝图

产品级核心数据对象冻结为 32 个。

```text
User
Workspace
RuntimeInfo
ModelProvider
ModelInfo
ModelUsage
Campaign
CampaignBrief
Thread
Message
Run
RunStep
TraceEvent
Tool
ToolCall
ToolResult
Workflow
WorkflowNode
WorkflowEdge
AgentProfile
CreativeAsset
HtmlPreview
ComplianceRule
ComplianceReview
KnowledgeBase
Document
DocumentChunk
PromptTemplate
EvalSuite
EvalCase
DeployProfile
ErrorResponse
```

Phase 1 必须落到 contracts 或 mock data 的数据对象：

```text
RuntimeInfo
ModelInfo
Campaign
CampaignBrief
Thread
Message
Run
TraceEvent
ToolCall
CreativeAsset
HtmlPreview
ComplianceReview
ErrorResponse
```

## 7. 前端工程化分层冻结

前端不是按页面随便堆组件，而是按“路由层 + 业务特性层 + 业务实体层 + 共享层”组织。

冻结目录方向：

```text
frontend/apps/web/
  app/                         # Next.js 路由，只做页面装配
  features/                    # 面向用例的业务功能
  entities/                    # 业务实体模型、展示片段、状态
  shared/                      # 通用 API、UI、hooks、工具、配置、mock
```

### 7.1 app 路由层

`app/` 只负责路由、布局、页面组合。

冻结页面模块：

```text
app/(workspace)/page.tsx
app/(workspace)/campaigns/page.tsx
app/(workspace)/campaigns/[campaignId]/page.tsx
app/(workspace)/runs/page.tsx
app/(workspace)/runs/[runId]/page.tsx
app/(workspace)/assets/page.tsx
app/(workspace)/assets/[assetId]/page.tsx
app/(workspace)/workflows/page.tsx
app/(workspace)/workflows/[workflowId]/page.tsx
app/(workspace)/agents/page.tsx
app/(workspace)/tools/page.tsx
app/(workspace)/models/page.tsx
app/(workspace)/knowledge/page.tsx
app/(workspace)/prompts/page.tsx
app/(workspace)/observability/page.tsx
app/(workspace)/evals/page.tsx
app/(workspace)/settings/page.tsx
app/(workspace)/deploy/page.tsx
```

禁止：

```text
页面文件里直接写复杂业务逻辑。
页面文件里直接解析 SSE。
页面文件里直接拼接口 URL。
页面文件里堆大量 mock data。
```

### 7.2 features 业务功能层

`features/` 按业务能力拆分。

冻结模块：

```text
features/creative-workbench
features/campaign-management
features/workflow-studio
features/agent-runtime
features/multi-agent-center
features/tool-lab
features/model-provider-center
features/asset-center
features/html-preview
features/compliance-review
features/knowledge-base
features/prompt-template-center
features/trace-observability
features/evaluation-center
features/runtime-settings
features/deploy-console
```

Phase 1 必须重点实现：

```text
creative-workbench
agent-runtime
asset-center
html-preview
compliance-review
trace-observability
runtime-settings
```

其他 features 可以先放静态占位组件，但目录和入口必须有。

### 7.3 entities 业务实体层

`entities/` 只放业务实体相关模型、类型、展示小组件和轻量状态。

冻结实体：

```text
entities/runtime
entities/model
entities/campaign
entities/brief
entities/thread
entities/message
entities/run
entities/trace-event
entities/tool-call
entities/workflow
entities/agent
entities/creative-asset
entities/html-preview
entities/compliance-review
entities/knowledge-base
entities/prompt-template
entities/eval
entities/deploy
entities/error
```

### 7.4 shared 共享层

`shared/` 放跨业务复用能力。

冻结模块：

```text
shared/api
shared/contracts
shared/ui
shared/hooks
shared/lib
shared/config
shared/mock
shared/sse
shared/telemetry
shared/styles
```

依赖方向：

```text
app -> features
features -> entities + shared
entities -> shared
shared -> 不依赖业务层
```

禁止：

```text
shared 反向依赖 features。
entities 直接调用后端接口。
features 直接操作浏览器底层 SSE，必须经过 shared/sse。
跨 feature 互相 import 内部实现。
```

## 8. Java / Python 后端工程化模块冻结

Java 和 Python 后端必须做成同构的层级模块，而不是两个随意实现，也不是普通文件夹分组。

统一层级模块：

```text
interfaces       # HTTP/SSE 入口、DTO、Controller/Router
application      # 用例编排、事务边界、Run 生命周期
domain           # 领域模型、领域服务、规则
ports            # 外部能力抽象
infrastructure   # Mock/DB/Model/Tool/Storage/SSE adapter
bootstrap        # 启动、配置、依赖装配
common           # 通用异常、日志、时间、ID、结果类型
```

模块组织原则：

```text
1. interfaces / application / domain / ports / infrastructure / bootstrap / common 是顶层工程模块。
2. runtime、model、thread、run、asset、html、compliance 等是每个层级模块内部的业务子包。
3. Java 侧按 Maven multi-module 设计。
4. Python 侧按 package module 设计。
5. Phase 1 即使某些模块只放占位 README / package marker，也必须先把模块边界立起来。
```

统一业务模块：

```text
runtime
model
thread
message
run
campaign
workflow
agent
tool
asset
html
compliance
knowledge
prompt
observability
eval
deploy
config
```

Phase 1 必须实现的后端模块：

```text
runtime
model
thread
message
run
asset
html
compliance
observability
common
bootstrap
```

Phase 1 只占位的后端模块：

```text
campaign
workflow
agent
tool
knowledge
prompt
eval
deploy
config
```

### 8.1 Java Maven modules 冻结

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

Java module 依赖冻结：

```text
creative-agent-common
  -> 无业务依赖

creative-agent-domain
  -> creative-agent-common

creative-agent-ports
  -> creative-agent-domain
  -> creative-agent-common

creative-agent-application
  -> creative-agent-domain
  -> creative-agent-ports
  -> creative-agent-common

creative-agent-infrastructure
  -> creative-agent-ports
  -> creative-agent-domain
  -> creative-agent-common
  -> 外部 SDK / Mock / 内存存储

creative-agent-interfaces
  -> creative-agent-application
  -> creative-agent-domain
  -> creative-agent-common

creative-agent-bootstrap
  -> creative-agent-interfaces
  -> creative-agent-application
  -> creative-agent-infrastructure
  -> creative-agent-common
```

Java module 内部业务子包示例：

```text
creative-agent-application/
  src/main/java/com/ninic/creativeagent/application/
    runtime/
    model/
    thread/
    run/
    asset/
    html/
    compliance/
    observability/

creative-agent-domain/
  src/main/java/com/ninic/creativeagent/domain/
    runtime/
    model/
    thread/
    run/
    asset/
    html/
    compliance/
    trace/
```

### 8.2 Python package modules 冻结

```text
services/python-agent/
  app/
    common/
    domain/
    ports/
    application/
    infrastructure/
    interfaces/
    bootstrap/
```

Python package 依赖冻结：

```text
common
  -> 无业务依赖

domain
  -> common

ports
  -> domain
  -> common

application
  -> domain
  -> ports
  -> common

infrastructure
  -> ports
  -> domain
  -> common
  -> 外部 SDK / Mock / 内存存储

interfaces
  -> application
  -> domain
  -> common

bootstrap
  -> interfaces
  -> application
  -> infrastructure
  -> common
```

Python package 内部业务子包示例：

```text
app/application/
  runtime/
  model/
  thread/
  run/
  asset/
  html/
  compliance/
  observability/

app/domain/
  runtime/
  model/
  thread/
  run/
  asset/
  html/
  compliance/
  trace/
```

同构要求：

```text
Java Maven module 和 Python package module 语义一致。
Java UseCase 名称和 Python use_case 文件语义一致。
Java Domain 名称和 Python domain model 语义一致。
Java Port 和 Python Protocol 一一对应。
Java/Python SSE event mapper 输出同一份字段。
Java/Python 错误码完全一致。
Java/Python 日志必须能用 runId、threadId、runtime 串起来。
```

禁止：

```text
Controller / Router 直接生成 mock 资产。
Controller / Router 直接拼 SSE JSON。
application 直接依赖具体模型 SDK。
domain 依赖 Spring / FastAPI / Pydantic Router / 外部 SDK。
Java 和 Python 字段命名各玩各的。
```

## 9. Contracts 与共享模块冻结

Contracts 必须按产品能力域组织，不再只有聊天接口视角。

冻结结构：

```text
contracts/
  README.md
  openapi/
    agent-api.yaml
  events/
    sse-events.md
    sse-events.schema.json
  schemas/
    runtime.schema.json
    model.schema.json
    campaign.schema.json
    message.schema.json
    run.schema.json
    trace.schema.json
    tool.schema.json
    asset.schema.json
    html-preview.schema.json
    compliance.schema.json
    error.schema.json
```

OpenAPI tag 必须对齐能力域：

```text
Runtime
Models
Threads
Runs
Campaigns
Workflows
Agents
Tools
Assets
HtmlPreview
Compliance
Knowledge
Prompts
Observability
Evals
Deploy
Config
```

Phase 1 Contracts 原则：

```text
M 接口进入正式 OpenAPI。
S 接口可以进入 OpenAPI 但标记 mock / static。
C 接口优先登记在需求冻结文档，是否进入 OpenAPI 在第 4 步决定。
所有 schemas 必须服务 Java/Python/前端三方，不允许前端私有字段偷偷扩展。
```

## 10. Phase 1 实施切片

Phase 1 的实施目标不是做完整平台，而是做出中型平台的骨架和第一条可运行主链路。

主链路：

```text
用户输入营销创意 Brief
  -> 选择 Java 或 Python Runtime
  -> 发起 Campaign Run
  -> 后端通过 SSE 返回 mock 事件
  -> 前端流式展示助手说明
  -> 前端展示工作流 Trace
  -> 前端展示图片、视频分镜、HTML、合规检查四类 mock 资产
```

Phase 1 必须可运行：

```text
1. `/` Creative Workbench。
2. `/settings` Runtime Settings。
3. Runtime Switch：Java / Python。
4. Mock Model Selector。
5. Chat Composer / Brief Composer。
6. Streaming Message 区域。
7. Workflow Trace Timeline。
8. Tool Calls 面板。
9. Asset Preview 区域。
10. Java mock SSE Runtime。
11. Python mock SSE Runtime。
12. 同一套 OpenAPI / SSE / JSON Schema contracts。
```

Phase 1 必须静态占位：

```text
Campaigns
Runs
Assets
Workflows
Agents
Tools
Models
Knowledge
Prompts
Observability
Evals
Deploy
```

## 11. Phase 1 Mock 资产范围

Phase 1 必须展示 4 类 mock 资产。

### 8.1 图片资产

```text
type: image
数量：3 张主视觉图卡片
内容：夏季气泡咖啡主视觉、社媒方图、横幅图
实现：Phase 1 使用本地 mock 图片或渐进式占位图
```

### 8.2 视频分镜资产

```text
type: video_storyboard
数量：1 个 15 秒视频分镜
内容：5 个镜头，每个镜头 3 秒
实现：Phase 1 使用文字分镜 + mock timeline
```

### 8.3 HTML 资产

```text
type: html
数量：1 个落地页预览
内容：产品标题、卖点、图片位、CTA、免责声明
实现：Phase 1 使用安全的 mock htmlSnippet
```

### 8.4 合规检查资产

```text
type: compliance_report
数量：1 个合规检查结果
内容：字体、品牌词、敏感词、尺寸、缺失信息
实现：Phase 1 使用 mock review result
```

## 12. Phase 1 SSE 范围

Phase 1 必须支持 5 个基础 SSE 事件。

```text
run_started
message_delta
trace_event
run_finished
run_failed
```

资产、工具、模型、fallback 不新增独立 SSE 事件名，统一通过 `trace_event.type` 表达。

冻结的 `trace_event.type`：

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

Phase 1 mock run 的最少事件顺序：

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

## 13. Phase 1 错误范围

Phase 1 必须处理这些错误状态：

```text
1. Java Runtime 未启动。
2. Python Runtime 未启动。
3. SSE 连接失败。
4. SSE 连接中断。
5. 后端返回 run_failed。
6. 请求字段缺失。
7. runtime 参数非法。
8. 前端收到未知事件类型。
9. mock asset 字段缺失。
10. HTML 预览内容为空。
```

冻结错误码：

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
```

前端必须显示中文错误提示。

后端必须返回中文错误消息。

## 14. Phase 1 Out of Scope

Phase 1 明确不做：

```text
真实大模型调用
真实生图
真实生视频
真实 HTML 代码智能生成
真实 Playwright 截图
真实登录鉴权
真实用户体系
真实数据库持久化
真实 Redis
真实 MQ
真实 RAG
真实 MCP
真实对象存储
真实云服务器 Docker 发布
多租户
权限系统
计费系统
文件上传
图片上传
视频上传
音频生成
在线编辑器
复杂工作流编排器
```

## 15. Phase 1 Acceptance Criteria

Phase 1 完成时，必须满足：

```text
1. 前端有 18 个主要页面入口，其中 `/` 和 `/settings` 可交互，其余为高保真静态占位。
2. 打开 `/` 能看到 Ninic Creative Agent Studio 工作台。
3. 用户能看到默认 Demo Brief：夏季气泡咖啡营销素材生成。
4. 用户能切换 Java / Python Runtime。
5. 选择 Java Runtime 后，可以收到 Java mock SSE。
6. 选择 Python Runtime 后，可以收到 Python mock SSE。
7. 中间区域能展示流式 message_delta。
8. 右侧 Trace Timeline 能展示 planner、image、video、html、review 的执行过程。
9. Tool Calls 面板能展示 mock 工具调用。
10. Asset Preview 能展示图片、视频分镜、HTML、合规检查四类 mock 卡片。
11. `/settings` 能展示 runtime 和 mock model 信息。
12. 后端关闭时，前端显示中文错误状态。
13. Java / Python 返回的事件字段保持一致。
14. Contracts 文件更新为 Phase 1 正式基线。
15. 需求冻结中列出的 M 接口全部可 mock 跑通。
16. 前端目录按 app / features / entities / shared 分层落地。
17. Java 后端按 interfaces / application / domain / ports / infrastructure / bootstrap / common 对应的 Maven modules 落地。
18. Python 后端按 interfaces / application / domain / ports / infrastructure / bootstrap / common 对应的 package modules 落地。
19. Java/Python 模块命名和 contracts 字段保持同构。
20. Mock 联调记录补齐。
21. 测试与验收记录补齐。
```

## 16. Contracts 调整要求

第 4 步 Contracts 先行必须做：

```text
1. OpenAPI 标题改为 Ninic Creative Agent Studio Agent API。
2. OpenAPI 按能力域拆 tag。
3. 保留 Phase 1 M 接口为正式 contracts。
4. S / C 接口先在文档中登记，不要求全部进入 OpenAPI。
5. RunRequest 增加 scenario、mockMode、modelProvider、model。
6. TraceEvent 增加 status、toolName、assetId、parentEventId、durationMs。
7. 新增 CreativeAsset schema。
8. 新增 HtmlPreview schema。
9. 新增 ComplianceReview schema。
10. SSE 文档补充 trace_event.type 枚举。
11. JSON Schema 增加 asset 相关定义。
12. 所有描述从 AgentOps 泛称调整为 AIGC Creative Workflow。
```

## 17. 冻结后的变更规则

从本文件创建后，Phase 1 需求变更必须满足：

```text
1. 先写入本文件的“变更记录”。
2. 说明为什么必须变。
3. 说明影响哪些 contracts、前端、Java、Python、测试。
4. 用户确认后才能进入实现。
```

## 18. 变更记录

```text
2026-06-20：首次冻结 Phase 1 需求范围。
2026-06-20：升级为产品级需求蓝图 + Phase 1 实施切片，补充 18 个页面和 131 个接口蓝图。
2026-06-20：补充前端、Java 后端、Python 后端、Contracts 的工程化分层和模块边界。
2026-06-20：明确 16 个能力域和 131 个接口是产品蓝图基线，后续可按开发进度取舍增删。
```
