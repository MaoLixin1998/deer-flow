# 06. Phase 1 Figma 高保真设计交付清单

> 本文件是 Phase 1 第 5 步的开工文档。  
> 目标不是先写前端代码，而是先产出能指导开发的 Figma 高保真设计稿。  
> Figma 文件已创建，本文件用于约束后续 Figma 设计内容、页面范围、组件状态和开发交付标准。

## 1. 当前阶段

```text
Phase：Phase 1
步骤：5. Figma 高保真设计稿
上一产物：05_CONTRACTS_BASELINE_ZH.md
下一步骤：6. 高保真代码原型
```

## 2. 设计目标

```text
把 Ninic Creative Agent Studio 的第一阶段核心体验设计清楚。
让用户一眼看懂：这是一个 AIGC 创意生产工作流 Agent，不是普通聊天 Demo。
让前端开发一眼看懂：页面怎么拆、组件怎么复用、状态怎么展示。
让面试讲解一眼看懂：产品、Agent 链路、Trace、Runtime Switch、Mock SSE 都有工程闭环。
```

## 3. Figma 文件结构

Figma 文件：

```text
名称：Ninic Creative Agent Studio - Phase 1.5
链接：https://www.figma.com/design/cgPS6dmTGjDN1wxDYb9AhN
文件 key：cgPS6dmTGjDN1wxDYb9AhN
```

原计划页面：

```text
00 Cover
01 Product Map
02 Design Tokens
03 Components
04 Desktop Frames
05 Mobile Frames
06 Interaction Prototype
07 Dev Handoff
08 Assets
```

实际执行：

```text
由于当前 Figma Starter 免费计划最多 3 个页面，Phase 1.5 先采用 3 页压缩结构。

00 Overview    封面、产品定位、设计系统 token、主路径、桌面/移动端 V0 草稿
01 Screens     后续承载核心高保真页面
02 Handoff     后续承载接口字段标注、组件说明、开发交付清单
```

每个页面必须写中文说明。后续如果升级 Figma 计划，再拆成原计划的 9 页结构。

## 4. Phase 1 必做页面

核心高保真页面：

```text
1. Creative Workbench / 空状态
2. Creative Workbench / 输入创意 brief
3. Creative Workbench / SSE 流式生成中
4. Creative Workbench / Trace 展开
5. Creative Workbench / 工具调用展开
6. Creative Workbench / 生成成功，展示图片、视频分镜、HTML、合规报告
7. Creative Workbench / 后端不可用错误
8. Runtime Settings / Java Runtime 可用
9. Runtime Settings / Python Runtime 可用
10. Runtime Settings / 降级状态
```

Agent 产品感页面要求：

```text
必须至少有一版 Agentic Workbench。
页面必须让用户一眼看到 Agent Team、Agent Loop、Tool Bus、Trace Replay、Memory / Context、Fallback / Guardrail。
不能只像普通 SaaS 工作台或普通聊天页面。
```

Codex-like 面板要求：

```text
最终主方案必须至少有一版 Codex-like Clean Agent Panel。
默认界面只保留中间对话框，不常驻三栏。
左侧会话列表必须设计为从左侧滑入的覆盖式抽屉。
右侧必须设计为 Codex-like 产品功能抽屉，第一层是画板、素材、工作流、HTML、导出等选项。
点击右侧一级功能后，具体功能面板覆盖或贴合展开，例如画板、素材列表、工作流步骤。
Agent Team、Trace、Tool Bus、Memory、Fallback 可以收进工作流、素材、画板或导出功能层。
必须标注左右抽拉动效参数。
```

产品功能纠偏：

```text
类 Codex 只借鉴面板形态和交互，不照抄 Codex 的审查、终端、浏览器功能。
右侧功能必须围绕 AIGC 创意生产：
1. 画板：编辑对话生成的图片。
2. 素材：管理图片、视频分镜、HTML、合规报告。
3. 工作流：查看创意生产步骤。
4. HTML：预览和微调落地页。
5. 导出：打包素材和生成交付说明。
```

画板要求：

```text
画板展开后，对话区域推到左侧 1/3 屏。
对话区域必须可拖拽缩放。
画板占据主要空间。
画板必须支持编辑对话生成的图片，例如裁剪、局部重绘、生成变体、加文案、导出。
```

连续分区布局要求：

```text
最终主方案必须采用连续 Pane 工作台布局。
桌面端必须先像真实浏览器中的网页应用。
桌面端画面必须包含浏览器栏、地址栏或明确浏览器视口感。
浏览器内容区必须顶满，不允许画成漂浮分镜小卡片。
左侧、中间、右侧不是三张卡片。
区域之间不能有卡片式间隔。
区域之间只用 1px 分割线或可拖拽分割线。
每个区域都必须上下顶满。
普通状态可以左中排布，也可以左中右排布。
画板展开状态必须左侧对话约 1/3，右侧画板约 2/3 或更大。
抽屉可以滑入覆盖，但视觉上必须仍然像一个完整工作面。
```

SVG 先行要求：

```text
以后所有 Figma 高保真修改前，先出本地 SVG 方案图。
SVG 方案图确认后，再同步 Figma。
用户对方向不满意时，优先改 SVG，不直接消耗 Figma 调用额度。
SVG 文件统一放在 phases/phase-01/assets/。
```

iOS 手机版要求：

```text
整体视觉延续白、灰、黑，不引入大面积彩色主题。
移动端不能简单缩放桌面三栏。
默认状态必须是极简对话 + 底部输入。
默认状态只能有一个真实输入区，不能在中间再放一个像输入框的示例 brief。
左侧会话列表必须是从左侧滑入的覆盖式 Drawer。
产品能力必须通过底部 Sheet 或边缘工具入口展开。
底部 Sheet 中的能力仍然是画板、素材、工作流、HTML、导出。
画板编辑必须优先横屏全屏展示。
移动端画板取消顶部 head，让画布尽量顶天立地。
移动端画板完成按钮必须保留，并悬浮放在画板右上角。
移动端画板左侧工具栏必须可收拉。
移动端画板的聊天指令只保留一个语音按钮，不展示对话内容。
移动端画板区域不能白套灰套白，必须是一整块沉浸式画布。
所有面板必须贴合 iOS 安全区和屏幕边缘，不能画成漂浮卡片堆叠。
```

多状态帧要求：

```text
最终主方案不能只交付一张图。
必须至少包含普通状态、左侧展开状态、右侧一级展开状态、右侧具体功能打开状态。
右侧具体功能必须结合本项目能力，至少覆盖：
1. 画板 / 编辑对话生成的图片。
2. 素材 / 管理图片、视频分镜、HTML、合规报告。
3. 工作流 / 查看创意生产步骤。
4. HTML / 预览和微调落地页。
5. 导出 / 打包素材和生成交付说明。
每张状态图必须标注分区职责和关键交互。
```

静态占位页面模板：

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

说明：

```text
Phase 1 只要求 / 和 /settings 可交互。
其他页面可以是高保真占位，但必须风格统一，不能像临时凑出来的页面。
```

## 5. 设计系统

必须定义：

```text
颜色 token
字体层级
间距 token
圆角 token
阴影 token
状态色
Trace 事件色
图标规则
按钮规则
表单规则
卡片规则
```

约束：

```text
整体风格要像工程工作台，克制、清晰、可扫描。
不要做大面积渐变背景。
不要做纯聊天软件风格。
不要做只有蓝紫色的一套皮肤。
卡片圆角不超过 8px。
图标优先按 lucide-react 映射，方便后续前端实现。
```

## 6. 组件清单

Figma 必须设计这些组件：

```text
AppShell
Sidebar
Topbar
RuntimeSwitch
ModelSelector
BriefComposer
ChatMessage
StreamingCursor
TraceTimeline
TraceEventItem
ToolCallCard
AssetCard
HtmlPreviewCard
ComplianceReviewCard
FallbackBanner
ConnectionStatus
EmptyState
LoadingState
ErrorState
```

每个组件至少覆盖：

```text
默认状态
hover 状态
禁用状态
加载状态
错误状态
移动端状态
中文提示文案
```

## 7. 数据和接口标注

Figma Dev Handoff 必须标注数据来源：

```text
RuntimeSwitch -> GET /api/runtimes
ModelSelector -> GET /api/models
会话消息 -> GET /api/threads/{threadId}/messages
运行流 -> POST /api/threads/{threadId}/runs/stream
Trace 面板 -> GET /api/runs/{runId}/trace
素材卡片 -> GET /api/assets
HTML 预览 -> POST /api/html/previews
合规检查 -> POST /api/compliance/reviews
```

标注原则：

```text
页面上的字段名必须能映射到 contracts/schemas/*.schema.json。
如果 Figma 里出现新字段，必须先回到 contracts 更新。
不能让前端凭感觉造字段。
```

## 8. 交互原型

Figma prototype 至少串起来这条路径：

```text
打开 Creative Workbench
输入夏季气泡咖啡营销 brief
选择 Java Runtime
点击生成
进入流式生成中
展开 Trace
查看工具调用
生成素材完成
切换到 Python Runtime
查看 Runtime Settings
```

异常路径至少覆盖：

```text
Runtime 不可用
SSE 连接失败
生成失败
HTML 预览为空
```

## 9. 素材清单

Figma 阶段只需要少量素材：

```text
产品 Logo 初版
空状态插图
图片素材 mock 缩略图
视频分镜 mock 缩略图
HTML 预览 mock 截图
合规检查状态图标
```

素材规则：

```text
能用 lucide-react 的不要自绘图标。
需要生成图片时，必须记录生成提示词。
素材进入前端前，必须登记到 ASSETS_MANIFEST_ZH.md。
```

图标规则：

```text
正式前端实现优先使用 lucide-react。
设计 SVG 中也必须使用同风格线性图标占位。
发送使用 ArrowUp，语音使用 Mic，画板使用 PencilRuler/Image，素材使用 Images，工作流使用 Workflow，HTML 使用 Code2，导出使用 PackageCheck/Download。
brief 输入发送键必须是上箭头图标。
画板语音指令必须是 Mic 图标。
画板左侧工具栏默认收起，展开时必须像左侧会话抽屉。
iOS 风格可以参考 SF Symbols 的视觉比例，但代码里不直接依赖 SF Symbols。
Lucide 缺少合适图标时，才从 Iconify 检索同风格开源图标，并检查 license。
不允许用纯文字或黑块代替图标按钮。
图标按钮必须在开发交付中标注中文 tooltip 或 aria-label。
```

## 10. 验收标准

Figma 阶段完成必须满足：

```text
1. 有 Figma 文件链接或文件 ID。
2. 有 10 个核心高保真页面。
3. 有 12 个静态占位页面模板。
4. 有设计系统 token。
5. 有核心组件 variants。
6. 有桌面端和移动端 frame。
7. 有空、加载、错误、禁用状态。
8. 有接口和 schema 字段标注。
9. 有交互 prototype。
10. 有开发 handoff 清单。
11. 有 Agent 产品感验收：Agent Team、Agent Loop、Tool Bus、Trace、Memory、Fallback 必须可见。
12. 有 Codex-like 面板验收：默认极简中间对话、左侧会话抽屉、右侧工具抽屉、详情覆盖层必须可见。
13. 有多状态帧验收：普通、左侧展开、右侧一级、右侧画板、右侧素材、右侧工作流、右侧 HTML、右侧导出必须分别成图或登记为后续补图项。
14. 有 V4 产品功能纠偏验收：右侧一级功能必须是画板、素材、工作流、HTML、导出。
15. 有画板验收：画板展开后对话左侧 1/3、对话可缩放、全屏画板、可编辑生成图片必须分别表达。
16. 有 V5 连续分区验收：左中右或左右区域必须顶满连续排布，只用分割线，不允许三张卡片式分区。
17. 有 SVG 先行验收：进入 Figma 前必须先有本地 SVG 方案图，并记录到 Phase 1.5 文档。
18. 有 V6 iOS 手机版验收：默认对话、左侧会话抽屉、产品工具 Sheet、横屏全屏画板编辑必须分别成图。
19. 有白灰风格验收：桌面和移动端都必须延续白、灰、黑主视觉，不允许突然切换彩色主题。
20. 有移动端输入验收：默认页只允许底部一个真实输入区，中间不能再出现第二个像输入框的控件。
21. 有桌面浏览器验收：V5 必须像真实浏览器网页应用，有浏览器栏和顶满内容区，不能像分镜卡片。
22. 有移动端画板验收：V6 横屏画板必须取消 head、顶天立地、左侧可收拉、右上完成、只保留一个语音按钮。
23. 有图标验收：发送、语音、画板、素材、工作流、HTML、导出、会话、搜索等核心动作必须使用图标，不允许文字或黑块代替。
24. 有 V5 多状态验收：V5 必须保留 6 张浏览器状态图，不能缩减成 2 张。
25. 有输入位置验收：桌面端对话发送框必须贴近内容区底部，不能悬在中间偏高位置。
```

未满足以上标准，不允许进入：

```text
第 6 步：高保真代码原型。
```
