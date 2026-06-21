# 07. Phase 1.5 Figma 高保真设计启动记录

> 本文件记录 Phase 1.5 的正式启动。  
> Phase 1.5 只做 Figma 高保真设计稿和设计交付，不写前端业务代码。  
> 下一步代码原型必须等 Figma 关键页面、组件状态、接口字段标注完成后才能开始。

## 1. 启动信息

```text
阶段：Phase 1.5
名称：Figma 高保真设计稿
启动日期：2026-06-20
当前状态：进行中
上一阶段：Phase 1.4 Contracts 先行
下一阶段：Phase 1.6 高保真代码原型
```

## 2. 本阶段硬规则

```text
1. 不写前端业务代码。
2. 不接真实后端。
3. 不引入真实模型、数据库、RAG、MQ。
4. Figma 画面必须基于简单设计中的前端粗线框图。
5. Figma 页面字段必须映射 contracts/schemas/*.schema.json。
6. 如果设计中出现新字段，必须先回到 contracts 变更。
7. 所有页面说明、状态文案、错误提示必须中文。
8. 设计必须覆盖桌面端和移动端。
9. 设计必须覆盖空、加载、错误、禁用、成功状态。
10. Figma 未通过验收，不允许进入高保真代码原型。
```

## 3. 输入材料

本阶段必须先读：

```text
00_PROJECT_INDEX_ZH.md
docs/01_CODE_RULES_ZH.md
docs/06_FRONTEND_DESIGN_ASSET_PIPELINE_ZH.md
docs/09_PHASE_DELIVERY_PROCESS_ZH.md
phases/phase-01/03_PHASE_SCOPE_ZH.md
phases/phase-01/04_SIMPLE_DESIGN_ZH.md
phases/phase-01/05_CONTRACTS_BASELINE_ZH.md
phases/phase-01/06_FIGMA_DESIGN_HANDOFF_ZH.md
```

关键输入：

```text
前端粗线框图：
phases/phase-01/assets/frontend-workbench-rough-wireframe.svg

Contracts：
contracts/openapi/agent-api.yaml
contracts/events/sse-events.schema.json
contracts/schemas/*.schema.json
```

## 4. 设计范围

Phase 1.5 必须产出：

```text
1. Figma 文件封面。
2. 产品地图。
3. 设计系统 token。
4. 核心组件 variants。
5. Creative Workbench 桌面端高保真稿。
6. Creative Workbench 移动端高保真稿。
7. Runtime Settings 桌面端高保真稿。
8. Runtime Settings 移动端高保真稿。
9. 12 个静态占位页面模板。
10. 交互 prototype 主路径。
11. 异常路径设计。
12. Dev Handoff 字段标注。
```

## 5. 页面优先级

第一优先级：

```text
Creative Workbench / 空状态
Creative Workbench / 输入 brief
Creative Workbench / SSE 流式生成中
Creative Workbench / Trace 展开
Creative Workbench / 生成成功
Creative Workbench / 后端不可用错误
Runtime Settings / Java Runtime 可用
Runtime Settings / Python Runtime 可用
```

第二优先级：

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

## 6. Figma 文件登记

当前状态：

```text
Figma 文件：已创建
Figma 文件链接：https://www.figma.com/design/cgPS6dmTGjDN1wxDYb9AhN
Figma 文件 key：cgPS6dmTGjDN1wxDYb9AhN
Figma 页面结构：00 Overview / 01 Screens / 02 Handoff
```

说明：

```text
当前账号是 Figma Starter 计划，最多 3 个页面。
所以 Phase 1.5 先采用 3 页压缩结构，不影响继续做高保真页面。
```

后续继续设计时必须回填：

```text
1. 本文件。
2. 06_FIGMA_DESIGN_HANDOFF_ZH.md。
3. README.md 阶段流程状态。
4. 00_PROJECT_INDEX_ZH.md 当前阶段。
```

## 7. 设计风格方向

关键词：

```text
工程化
清晰
克制
高信息密度
可扫描
适合面试展示
不像普通聊天 Demo
有 AIGC 创意生产感
有 AgentOps 调试感
```

页面气质：

```text
像一个给运营、设计、增长团队使用的 AI 创意生产工作台。
同时又能让面试官看到后端工程能力：Runtime、Trace、SSE、Fallback、ToolCall、Contracts。
```

避免：

```text
纯聊天界面
营销官网 Hero
大面积渐变
一屏只有卡片
只有蓝紫色
没有 Trace 和工具调用
没有错误状态
没有移动端
```

## 7.1 Agent 产品感修正规则

用户反馈：

```text
V0 看起来更像普通 SaaS 工作台，不像 Agent 产品。
```

修正规则：

```text
1. 页面第一视觉必须出现 Agent，而不是普通表单或普通卡片。
2. 必须展示 Agent Team，例如 Lead Agent、Planner、Visual Agent、HTML Agent、Review Agent。
3. 必须展示 Agent Loop，例如 Plan -> Act -> Observe -> Reflect。
4. 必须展示工具调用，而不是只展示最终素材。
5. 必须展示 Memory / Context，让用户知道 Agent 有上下文。
6. 必须展示 Trace Replay，让面试官看到可观测链路。
7. 必须展示 Fallback / Guardrail，让工程能力可见。
8. 素材卡片必须表达“由工具调用产生”，不能像静态资源列表。
9. 文案要强调 Agent 正在协调、规划、调用工具、复核结果。
10. 移动端也必须保留 Agent Loop 和 Trace 入口。
```

已在 Figma 中新增：

```text
01 Screens / Agentic Workbench / V1 / Desktop
01 Screens / Agentic Workbench / V1 / Mobile
```

V1 重点：

```text
Agent Team
Plan / Act / Observe / Reflect
Agent 推理摘要
Context / Memory
Tool Bus
AgentOps Trace
Fallback / Guardrail
Agent 输出物
```

## 7.2 Codex-like 极简面板修正规则

用户进一步反馈：

```text
类 Codex 面板。
面板干净，只留中间对话框。
左侧对话列表可抽拉，要从左边丝滑滑入。
右侧类似 Codex 的右侧面板，但功能必须服务本项目，而不是照抄 Codex。
点击一级选项后，具体功能覆盖上去，例如文件树。
左右抽拉都要丝滑。
```

修正规则：

```text
1. 默认状态不能是传统三栏后台。
2. 默认状态只保留中间对话框和极少量顶部控制。
3. 左侧会话列表是覆盖式 Drawer，从左侧滑入，不挤压主画布。
4. 右侧是 Codex-like Utility Drawer，默认显示一级功能入口。
5. 右侧一级功能必须围绕本项目能力，不允许照抄 Codex。
6. 点击右侧一级功能后，详情面板覆盖或贴合展开，例如文件树覆盖到右侧。
7. Agent Team、Trace、Tool Bus、Memory 不常驻占屏，收进工作流、素材或画板详情中。
8. 抽拉动效必须作为设计交付标注：240-280ms，cubic-bezier(0.22, 1, 0.36, 1)。
9. 主对话区域在左右 Drawer 打开时保持视觉稳定，不被强行挤压。
10. 前端实现时需要支持 Drawer open/close、右侧一级菜单切换、详情覆盖层返回。
```

已在 Figma 中新增：

```text
01 Screens / Codex-like Clean Agent Panel / V2 / Interaction Board
State A / Default Clean Chat
State B / Left Conversation Drawer Open
State C / Right Codex-like Utility Drawer
```

V2 结论：

```text
V2 只保留为交互方向草稿。
V2 中右侧功能曾受 Codex 截图影响，已被 V4 产品功能纠偏覆盖。
```

## 7.3 多状态帧修正规则

用户进一步反馈：

```text
一张图不能表达抽拉交互。
必须画很多张。
普通状态要表达中间对话框和对话列表。
左侧展开状态要表达会话列表抽拉。
右侧展开状态要表达一级功能。
右侧打开某功能状态要结合本项目自己的功能，不是照截图抄。
必须表达分区功能。
```

修正规则：

```text
1. Figma 不能只交付一张大图。
2. 抽拉式布局必须拆成多状态帧。
3. 普通状态必须展示中间对话框和轻量会话列表。
4. 左侧展开状态必须展示会话列表从左侧覆盖式滑入。
5. 右侧展开状态必须展示 Codex-like 一级功能入口。
6. 右侧功能打开状态必须结合本项目能力单独画，不允许只照截图写“文件”。
7. 至少要覆盖：画板、素材、工作流、HTML、导出。
8. 每个状态帧必须标注该状态的分区职责。
9. 动效说明必须落到状态帧旁边，方便前端实现。
10. 后续前端代码原型必须按这些状态拆组件和状态机。
```

已在 Figma 中新增：

```text
01 Screens / Codex-like Panel / V3 / Multi-state Storyboard

01 Normal / Chat + Conversation List
02 Left Expanded / Conversation Drawer
03 Right Expanded / Utility Menu
04 Right Feature / Files Overlay
05 Right Feature / Review AgentOps Overlay
06 Right Feature / Terminal Runtime Logs
07 Right Feature / Browser HTML Preview
```

V3 结论：

```text
V3 只保留为多状态表达方式参考。
V3 中右侧功能仍有照抄 Codex 的问题，已被 V4 覆盖。
V2 只保留为交互方向草稿。
V1 只保留为 Agent 能力信息参考。
```

## 7.4 V4 产品功能纠偏规则

用户进一步反馈：

```text
类 Codex 是面板形态，不是照抄 Codex 的审查、终端、浏览器功能。
我们的需求是 AIGC 创意生产：生图、生视频、生 HTML、工作流。
其他需求不变。
右侧新增画板功能。
画板展开后将对话推到左边 1/3 屏，并且对话区域可缩放。
画板要展示为主要工作区，可以编辑对话生成的图片。
```

纠偏规则：

```text
1. 右侧一级功能不能照抄 Codex 的审查、终端、浏览器。
2. 类 Codex 只借鉴布局、抽拉、覆盖层、动效和极简主界面。
3. 右侧一级功能必须绑定本项目能力：
   - 画板：编辑对话生成的图片、局部重绘、变体、拼版、加文案。
   - 素材：管理图片、视频分镜、HTML、合规报告等产物。
   - 工作流：查看 Plan / Act / Asset / Review 的创意生产步骤。
   - HTML：预览和微调 Agent 生成的落地页。
   - 导出：打包素材和生成交付说明。
4. 默认状态仍然是中间对话框 + 左侧轻量会话列表。
5. 左侧展开仍然是会话列表覆盖式抽屉。
6. 右侧展开先显示产品功能入口。
7. 画板展开时，对话区域推到左侧 1/3 屏。
8. 画板展开时，对话区域必须可拖拽缩放。
9. 画板是主要工作区，要支持编辑生成图片。
10. 前端实现时不要用 width 动画硬挤，优先用 transform、grid-template-columns 或 CSS variable 平滑过渡。
```

已新增本地设计稿：

```text
phases/phase-01/assets/codex-like-product-panel-v4-storyboard.svg
```

V4 状态帧：

```text
01 Normal / Chat + Conversation List
02 Left Expanded / Conversation Drawer
03 Right Expanded / Product Tool Menu
04 Canvas Expanded / Chat 1-3 + Full Canvas
05 Canvas Editing / Generated Image Editable
```

说明：

```text
Figma MCP 当前触发 Starter 计划调用次数限制，V4 暂时先落本地 SVG。
等 Figma 调用额度恢复后，再把 V4 同步进 Figma。
V4 是当前最新主方案。
```

## 7.5 V5 连续分区布局纠偏规则

用户进一步反馈：

```text
三个区域不是三个框。
不要画成框。
框之间不要有间隔。
只需要线隔开。
每个区域应该左中右排布，或左右排布。
每个区域上下都顶满。
以后都先 SVG 再 Figma。
```

纠偏规则：

```text
1. 主工作台不是三张卡片，也不是多个浮动容器。
2. 左侧、中间、右侧必须像一个完整应用窗口里的连续 Pane。
3. 区域之间不留 gutter，不用外边距制造“卡片感”。
4. 区域之间只允许使用 1px 分割线或可拖拽分割线。
5. 每个主要区域必须从顶部顶到底部，形成真实工作台分屏。
6. 普通状态可以是左 + 中，也可以是左 + 中 + 右。
7. 画板状态必须是左侧对话约 1/3，右侧画板约 2/3 或更大。
8. 抽屉滑入可以覆盖，但展开后的视觉仍要贴合连续工作面。
9. 前端实现时优先使用 CSS Grid、grid-template-columns、CSS variable 和 transform。
10. 禁止把左侧列表、中间对话、右侧工具画成彼此分离的卡片。
```

设计流程规则：

```text
1. 后续每次进入 Figma 前，必须先产出本地 SVG 方案图。
2. SVG 方案图确认后，再同步到 Figma 做高保真与交互标注。
3. SVG 文件必须放在 phases/phase-01/assets/。
4. SVG 文件名必须表达版本和用途，例如 codex-like-product-panel-v5-contiguous-layout.svg。
5. 如果用户对 SVG 方向不满意，先改 SVG，不直接改 Figma。
```

已新增本地设计稿：

```text
phases/phase-01/assets/codex-like-product-panel-v5-contiguous-layout.svg
```

V5 状态帧：

```text
01 默认浏览器态
02 左侧会话抽屉展开
03 右侧产品工具展开
04 画板展开：左 1/3 + 右画板
05 图片编辑态
06 素材 / 工作流 / 导出
```

说明：

```text
V5 是当前最新主方案。
V4 保留为产品功能纠偏参考。
V5 在 V4 基础上修正布局表达：去掉三框卡片感，改成连续分屏工作台。
V5 二次修正为浏览器工作台：必须先像真实浏览器里的网页应用，再表达左中右 Pane。
V5 三次修正恢复 6 张状态图：不能为了浏览器感删掉多状态表达。
Figma MCP 当前触发 Starter 计划调用次数限制，V5 暂时先落本地 SVG。
等 Figma 调用额度恢复后，再把 V5 同步进 Figma。
```

V5 浏览器画面规则：

```text
1. 桌面端必须画成浏览器窗口，不是设计分镜小卡片。
2. 画面顶部必须有浏览器栏、地址栏或浏览器视口感。
3. 浏览器内容区必须顶满，不允许内容漂浮在画布中间。
4. 左侧会话、中间对话、右侧工具必须在同一个浏览器内容区里连续排布。
5. 画板展开时也必须保留浏览器窗口上下文，不能像孤立的设计面板。
6. 桌面端设计顺序：先像浏览器，再像工作台，最后才是功能细节。
7. 多状态不能减少，至少保留默认、左抽屉、右工具、画板、编辑、素材/工作流/导出 6 张。
8. 对话发送框必须贴近浏览器内容区底部，不能悬在中间偏高位置。
```

图标来源规则：

```text
1. Web 前端正式实现优先使用 lucide-react。
2. SVG 方案图中的按钮、工具、发送、语音、素材、工作流等都必须先画成线性图标，不允许用文字或黑块代替。
3. iOS 风格可以参考 SF Symbols 的图标语义和比例，但 Web 代码仍优先落到 lucide-react。
4. 如果 Lucide 没有合适图标，再去 Iconify 检索同风格开源图标，并检查对应 icon set 的 license。
5. 同一页面只使用一套图标风格：线宽、圆角、端点、尺寸必须统一。
6. 图标按钮必须保留中文 tooltip 或 aria-label，方便后续开发无障碍和可维护性。
```

推荐图标映射：

```text
发送：ArrowUp
语音：Mic
画板：PencilRuler 或 Image
素材：Images
工作流：Workflow
HTML：Code2
导出：PackageCheck 或 Download
会话：MessagesSquare
搜索：Search
完成：Check
收起抽屉：PanelLeftClose
展开抽屉：PanelLeftOpen
```

## 7.6 V6 iOS 手机版白灰风格规则

用户进一步确认：

```text
整体颜色风格就是白和灰。
再做一版 iOS 的手机版。
```

设计规则：

```text
1. 主色只使用白、浅灰、中灰、深灰、黑。
2. 不做大面积彩色背景，不做蓝紫渐变。
3. 移动端不是把桌面三栏缩小，而是重新适配 iOS 使用方式。
4. 默认页只突出中间对话和底部输入。
5. 左侧会话列表使用 iOS 覆盖式 Drawer，从左侧滑入。
6. 产品工具使用底部 Sheet 或右侧边缘入口，不硬塞常驻右栏。
7. 工具能力仍然是画板、素材、工作流、HTML、导出。
8. 画板编辑态优先横屏全屏，聊天指令只保留一个语音按钮。
9. 所有区域贴合屏幕安全区，不画成多张浮动卡片。
10. 动效标注使用 240-280ms spring / cubic-bezier，前端实现优先 transform。
```

V6 修正规则：

```text
1. 默认页只允许有一个真实输入区，放在底部。
2. 中间区域不能再画成输入框或对话框，避免用户误解成两个对话框。
3. 中间区域只做欢迎语、能力提示或空状态说明。
4. 画板必须改成横屏编辑态，更适合图片精修、裁剪、局部重绘和图层操作。
5. 横屏画板中，左侧工具栏必须可收拉。
6. 横屏画板取消顶部 head，让画布尽量顶天立地展示更多内容。
7. 完成按钮保留，但直接悬浮放在画板右上角。
8. 对话指令不展示对话内容，只保留一个语音按钮。
9. 画板区域不能再白套灰套白，应该是一整块沉浸式画布。
10. 发送、语音、完成、抽屉、工具都必须使用图标，不允许写成“发”“声”“收”等文字。
11. brief 输入发送键使用上箭头图标。
12. 画板语音指令只使用 Mic 图标。
13. 画板左侧工具栏默认收起，展开形态必须像左侧会话抽屉。
```

已新增本地设计稿：

```text
phases/phase-01/assets/codex-like-product-panel-v6-ios-mobile.svg
```

V6 状态帧：

```text
01 默认：极简对话
02 左侧：会话抽屉
03 工具：产品能力面板
04 画板：横屏全屏编辑
```

说明：

```text
V6 是当前 iOS 手机版主方向。
V5 是当前桌面端连续分区主方向。
后续 Figma 同步时，桌面按 V5，移动端按 V6。
```

## 8. Figma 生成 Prompt 草案

后续创建 Figma 文件时，可以使用下面这段作为设计指令：

```text
创建一个名为 Ninic Creative Agent Studio - Phase 1.5 的 Figma 设计文件。
这是一个 AIGC 创意生产工作流 Agent + AgentOps 工程底座产品。
请基于 Phase 1 前端粗线框图设计高保真工作台：

左侧是产品导航。
中间是 Creative Workbench，包含 Runtime 控制条、模型选择、创意 brief 输入、SSE 流式消息、素材预览卡片。
右侧是 AgentOps 面板，包含 Trace Timeline、Tool Calls、错误和降级状态。
底部素材包括图片、视频分镜、HTML 预览、合规报告。

视觉风格要求：
清晰、克制、工程化、高信息密度、适合长时间使用。
不要做营销官网，不要做大面积渐变，不要做纯聊天界面。
组件圆角不超过 8px。
所有页面文案使用中文。
图标优先按 lucide-react 风格。

必须产出：
设计系统 token、核心组件 variants、桌面端高保真页面、移动端高保真页面、空状态、加载状态、错误状态、禁用状态、成功状态、接口字段标注和开发 handoff。
```

## 9. 验收清单

完成 Phase 1.5 前必须检查：

```text
1. Figma 文件链接已回填。
2. 10 个核心页面已完成。
3. 12 个占位页面模板已完成。
4. 设计系统 token 已完成。
5. 核心组件 variants 已完成。
6. 桌面端和移动端已完成。
7. 空、加载、错误、禁用、成功状态已完成。
8. 接口字段标注已完成。
9. 与前端粗线框图方向一致。
10. 与 contracts 字段一致。
```

## 10. 当前下一步

```text
继续在 Figma 文件中完善 01 Screens。
基于 V5 连续分区布局继续做高保真视觉细化。
移动端基于 V6 iOS 手机版白灰风格继续细化。
设计前先改本地 SVG，确认后再同步 Figma。
右侧功能改为画板、素材、工作流、HTML、导出。
桌面端重点完善画板展开后对话左侧 1/3、可缩放对话、全屏画板、图片编辑。
移动端重点完善画板横屏全屏编辑、左侧可收拉工具栏、右上角完成按钮、单个语音按钮、iOS 安全区和单手操作。
主工作台区域必须顶满连续排布，只用分割线，不做三张卡片。
补充组件状态和接口字段标注。
```
