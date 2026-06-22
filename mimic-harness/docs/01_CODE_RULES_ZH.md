# 代码规则

> 本文件是 `mimic-harness` 的硬性工程规则。  
> 后续写 Java、Python、前端、脚本、测试，都必须遵守。

## 1. 总原则

1. 代码为学习和工程化服务，不追求炫技。
2. 关键逻辑必须能被 Java 开发者读懂。
3. 业务核心不依赖具体框架。
4. Java 和 Python 尽量同构。
5. 前后端先对齐协议，再写实现。
6. 所有关键链路必须有日志和 Trace。
7. 异常必须能定位问题，不允许吞异常。
8. 所有开发必须先遵守 `09_PHASE_DELIVERY_PROCESS_ZH.md` 的阶段交付规范。

## 1.1 阶段规范门禁

写任何阶段代码前，必须确认：

```text
phases/phase-xx/README.md 已创建。
阶段启动已完成。
头脑风暴已记录。
需求冻结已记录。
简单设计已记录。
Contracts 影响已确认。
```

禁止：

```text
没有阶段目录就写代码。
需求没冻结就加功能。
Contracts 没对齐就写前后端。
Mock 没跑通就接真实模型或中间件。
测试和验收没记录就说 Phase 完成。
```

## 2. 分层模块规则

后端统一按层级模块组织，不只是普通目录。

层级模块：

```text
interfaces
application
domain
ports
infrastructure
bootstrap
common
```

模块含义：

```text
interfaces       对外入口模块：HTTP、SSE、DTO、Controller、Router、Mapper。
application      应用用例模块：编排业务流程、控制一次 Run 的生命周期。
domain           领域核心模块：领域模型、领域服务、业务规则。
ports            端口抽象模块：模型、工具、存储、事件、对象存储等外部能力接口。
infrastructure   基础设施模块：Mock、DB、Redis、SSE、模型 SDK、工具 SDK 等适配器。
bootstrap        启动装配模块：启动类、配置、依赖注入、路由注册。
common           通用基础模块：异常、日志、时间、ID、Result、常量。
```

依赖方向：

```text
interfaces -> application
application -> domain + ports
infrastructure -> ports + external SDK
bootstrap -> all
domain -> common only
ports -> domain + common
common -> 无业务依赖
```

模块规则：

```text
1. 每一层必须能作为独立工程模块理解，有自己的职责边界。
2. Java 侧优先按 Maven multi-module 落地。
3. Python 侧按 package module 落地，每个层级模块必须有独立 __init__.py。
4. 业务能力 runtime、run、asset、compliance 等放在层级模块内部作为子包。
5. 不能把业务能力作为顶层模块覆盖层级模块。
```

禁止事项：

```text
domain 不能依赖 Spring / FastAPI / OpenAI SDK / LangGraph / LangChain4j
application 不能直接写 SQL
Controller / Router 不能直接调用模型
DTO 不能穿透到 domain 内部长期流动
infrastructure 不能反向调用 interfaces
```

## 3. Java 编码规则

### 3.1 包结构

```text
com.mimic.agent
  bootstrap
  interfaces
  application
  domain
  ports
  infrastructure
  common
```

Java 多模块建议：

```text
services/java-agent/
  pom.xml                         # 聚合工程
  creative-agent-common/
  creative-agent-domain/
  creative-agent-ports/
  creative-agent-application/
  creative-agent-infrastructure/
  creative-agent-interfaces/
  creative-agent-bootstrap/
```

依赖方向：

```text
creative-agent-common -> 无业务依赖
creative-agent-domain -> common
creative-agent-ports -> domain + common
creative-agent-application -> domain + ports + common
creative-agent-infrastructure -> ports + domain + common + external SDK
creative-agent-interfaces -> application + domain + common
creative-agent-bootstrap -> interfaces + application + infrastructure + common
```

### 3.2 命名规则

```text
Controller        HTTP 入口
UseCase           应用用例
Service           领域服务或基础设施服务，不能乱用
Repository        数据访问抽象或实现
Client            外部服务调用
Mapper            DTO / Domain 转换
Policy            策略
Router            模型或 Agent 选择
Registry          注册表
```

### 3.3 Java 注释规则

必须写中文注释：

- 每个 `UseCase`
- 每个 `Port`
- 每个 `Agent`
- 每个 `FallbackPolicy`
- 每个复杂分支
- 每个非显而易见的事件转换

示例：

```java
/**
 * StreamChatUseCase 是聊天流式运行的应用入口。
 *
 * 它只负责编排一次请求，不直接调用具体模型厂商。
 * 具体模型选择由 ModelRouter 完成，模型调用由 LlmClient 完成。
 */
public class StreamChatUseCase {
}
```

### 3.4 Java 日志规则

日志必须中文、结构化、带上下文。

```java
log.info("[开始智能体运行] runId={}, threadId={}, runtime={}", runId, threadId, runtime);
log.warn("[触发模型降级] from={}, to={}, reason={}, runId={}", from, to, reason, runId);
log.error("[智能体运行失败] runId={}, threadId={}, reason={}", runId, threadId, reason, ex);
```

禁止：

```text
log.info("start")
log.error("error")
System.out.println
吞异常不记录
```

### 3.5 Java 异常规则

业务异常必须中文。

```java
throw new AgentRunException("模型调用超时，已尝试降级但仍失败");
```

异常类型建议：

```text
AgentRunException
ModelCallException
ToolExecutionException
FallbackExhaustedException
InvalidContractException
PermissionDeniedException
```

## 4. Python 编码规则

### 4.1 包结构

```text
app/
  bootstrap
  interfaces
  application
  domain
  ports
  infrastructure
  common
```

Python 模块建议：

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

依赖方向和 Java 保持同构：

```text
common -> 无业务依赖
domain -> common
ports -> domain + common
application -> domain + ports + common
infrastructure -> ports + domain + common + external SDK
interfaces -> application + domain + common
bootstrap -> interfaces + application + infrastructure + common
```

### 4.2 类型规则

1. DTO 使用 Pydantic。
2. Port 使用 `Protocol`。
3. Domain model 优先使用 dataclass 或 Pydantic，按复杂度决定。
4. 公共函数必须写类型标注。
5. 不允许在核心链路里大量使用 `dict[str, Any]` 逃避建模。

### 4.3 Python 注释规则

关键类和关键函数必须有中文 docstring。

```python
class DefaultAgentRunner:
    """单次智能体运行的默认实现。

    这里负责执行最小 agent loop：
    1. 调模型
    2. 解析工具调用
    3. 执行工具
    4. 汇总最终回答
    """
```

### 4.4 Python 日志规则

```python
logger.info("[开始智能体运行] run_id=%s thread_id=%s", run_id, thread_id)
logger.warning("[触发模型降级] from=%s to=%s reason=%s", from_model, to_model, reason)
logger.exception("[智能体运行失败] run_id=%s reason=%s", run_id, reason)
```

### 4.5 Python 异常规则

```python
raise AgentRunError("模型调用超时，已尝试降级但仍失败")
```

禁止裸 `except Exception: pass`。

## 5. 前端编码规则

### 5.1 技术栈

```text
TypeScript
React
Next.js
Tailwind CSS
shadcn/ui
```

### 5.2 目录规则

```text
app/          # 路由
features/     # 业务功能
entities/     # 业务实体
shared/       # API、UI、配置、工具
```

### 5.3 TypeScript 规则

1. 禁止核心类型使用 `any`。
2. SSE event 必须有明确 union type。
3. API 响应类型来自 contracts 或 shared-types。
4. UI 组件不直接拼后端 URL。
5. React hook 只放前端状态和副作用，不写业务策略。

### 5.4 前端注释规则

必须注释：

- SSE 事件解析
- runtime switch
- trace timeline 合并逻辑
- optimistic message
- 文件上传状态流转

Phase 1 学习阶段额外要求：

```text
这是面向小白学习的源码，不按普通生产项目的低注释密度执行。
TypeScript 类型里的每个字段都必须写中文注释。
mock 数据里的每个对象字段都必须写中文注释。
组件 props 的每个字段都必须写中文注释。
重要 state 变量必须逐个写中文注释。
复杂 JSX 分区必须写中文注释说明这一块页面负责什么。
注释要解释字段用途、数据来源、页面如何使用，不允许只重复字段名。
```

### 5.4.1 TSX / CSS 详细注释门禁

前端 TSX、CSS、Tailwind `className`、样式变量、交互状态必须写详细中文注释。

注释必须回答三件事：

```text
1. 这段代码管理哪个页面、哪个区域、哪个组件。
2. 这里调用哪个接口、读取哪个 mock、未来替换成哪个真实接口。
3. 修改关键值会影响什么布局、动画、交互、数据流或接口联调。
```

必须注释的位置：

```text
页面或组件文件顶部：
  说明当前文件管理的页面区域、核心交互、关联接口和 mock 数据来源。

TypeScript 类型字段：
  每个字段都要说明业务含义、数据来源、前端展示位置、是否来自 contracts。

props 字段：
  每个字段都要说明由哪个父组件传入、控制子组件哪块 UI、改字段会影响什么。

state / ref / memo 字段：
  说明该状态控制哪个区域、默认值为什么这么设、改默认值会影响什么交互。

接口调用点：
  说明接口路径、请求目的、成功后更新哪些状态、失败后展示什么中文提示。

mock 数据：
  说明 mock 对应的未来接口、哪些字段必须和 OpenAPI / Schema 对齐。

JSX 分区：
  说明这一段页面管理左侧列表、中间对话、右侧能力面板、画板、输入框等哪个区域。

className / Tailwind 分组：
  在布局、宽度、高度、间距、圆角、阴影、层级、响应式、动画旁说明改值影响。

CSS 变量和数字常量：
  说明单位、允许范围和改动影响，例如拖拽阈值、动画时长、缩放比例、面板宽度。

事件处理函数：
  说明来自哪个按钮或拖拽区域，会改变哪些状态，是否会触发接口、SSE、缓存或后续后端联调。
```

TSX 示例：

```tsx
// 画板右侧工具面板：管理 AI 图片滤镜、局部重绘、图片编辑等能力入口。
// Phase 1.7 使用本地 mock；后续真实接口预期为 GET /api/canvas/tools。
// 修改默认 activeTool 会影响首次进入画板时右侧展示哪个工具面板。
const [activeTool, setActiveTool] = useState<CanvasToolId>("filter");

// 画布缩放比例：控制 10240x10240 超大画布的视觉缩放，范围必须保持 20%-200%。
// 改小 minZoom 会让用户更容易迷失；改大 maxZoom 会增加选区和图片拖拽计算压力。
const zoomRange = { min: 20, max: 200 };

// 点击滤镜卡片后只更新前端预览状态；后续接入 POST /api/assets/{assetId}/filters 生成真实滤镜图。
function handleApplyFilter(filterId: string) {
  setPreviewFilterId(filterId);
}
```

CSS / Tailwind 示例：

```tsx
// 外层画布视口：负责占满可编辑区域，并隐藏 10240x10240 画布拖动时超出的部分。
// 改 overflow 会影响拖动画布时是否露出浏览器滚动条。
<section className="relative h-full overflow-hidden bg-[#f7f7f4]">
  {/* 1024x1024 默认空白图：作为画布中的第一张素材，可拖动、缩放和被选择工具选中。 */}
  <div className="absolute h-[1024px] w-[1024px] rounded-[28px] bg-white" />
</section>
```

```css
/* 右侧能力面板宽度：控制工具面板展开后的占屏比例。
   改大后画布可视区域会变小；改小后滤镜列表和编辑项可能换行。 */
.capabilityPanel {
  width: 320px;
}

/* 画板展开动画：必须和面板宽度变化匹配，避免看起来像突然跳出来。 */
.canvasPanel {
  transition: width 420ms cubic-bezier(0.22, 1, 0.36, 1);
}
```

### 5.5 前端提示规则

用户可见文案必须中文。

示例：

```text
模型服务暂时不可用，已自动切换到备用模型。
工具调用失败，请在 Trace 面板查看详细原因。
当前视觉模型不可用，本次将以文本模式继续。
```

禁止直接展示：

```text
Internal Server Error
undefined is not a function
Request failed
```

## 6. 日志与 Trace 规则

每次 run 必须有：

```text
runId
threadId
runtime: java / python
provider
model
agent
durationMs
status
```

必须发 Trace 事件：

```text
run_started
model_selected
agent_selected
agent_handoff
tool_call_started
tool_call_finished
degradation
memory_loaded
memory_updated
run_finished
run_failed
```

日志用于后端排查，Trace 用于前端展示和回放。

## 7. 注释密度规则

这是学习型项目，允许注释多一些。

必须避免两种极端：

```text
没有注释，看不懂为什么这么设计
废话注释，只重复代码做了什么
```

好注释回答：

```text
为什么需要这层抽象
为什么这里要降级
为什么这里不能直接调用模型
为什么 Java/Python 要同构
```

## 8. Contracts 规则

1. 先改 contracts，再改实现。
2. REST 接口写入 `contracts/openapi/agent-api.yaml`。
3. SSE 事件写入 `contracts/events/sse-events.schema.json`。
4. Java/Python/前端字段名必须一致。
5. 破坏性协议变更必须写迁移说明。

## 9. 测试规则

必须覆盖：

```text
contracts test
SSE event test
AgentRunner test
ToolRegistry test
FallbackPolicy test
ModelRouter test
Java/Python 行为一致性 test
```

Mock 模型响应必须稳定，不能让测试依赖真实 LLM。

## 10. Git 提交规则

### 10.1 分支命名

```text
feature/contracts-phase1
feature/java-mock-runtime
feature/python-mock-runtime
feature/frontend-chat-ui
docs/architecture-cleanup
fix/sse-event-schema
```

### 10.2 Commit Message

格式：

```text
type(scope): 中文说明
```

类型：

```text
feat      新功能
fix       修复
docs      文档
refactor  重构
test      测试
chore     工程杂项
```

示例：

```text
docs(plan): 新增 Mimic Harness 独立开发计划
feat(java): 实现 Java Mock SSE 聊天接口
feat(python): 实现 Python Mock AgentRunner
fix(frontend): 修复 SSE 断线重连状态
```

### 10.3 提交边界

一次提交只做一类事：

```text
不要把文档、前端、Java、Python、格式化混在一个提交
不要提交本地密钥
不要提交大模型输出日志
不要提交 node_modules、target、.venv
```

## 11. 配置与密钥规则

1. API Key 只放 `.env.local` 或本地环境变量。
2. 示例配置只能放假 key。
3. 文档中不能出现真实 key。
4. 日志不能打印完整 key。
5. 前端不能接触模型 provider 的真实 secret。

## 12. 代码审查规则

Review 重点：

```text
分层是否被破坏
domain 是否依赖外部框架
日志是否足够定位问题
异常是否中文且有业务含义
Java/Python 是否同构
SSE 事件是否符合 contracts
是否有测试
是否泄漏密钥
```
