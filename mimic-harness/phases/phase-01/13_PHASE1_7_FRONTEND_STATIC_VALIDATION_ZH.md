# 13. Phase 1.7 前端静态开发验证记录

> 本文件记录 Phase 1.7 前端静态工程化拆分过程。  
> Phase 1.7 的视觉和交互基线以当前运行中的前端页面为准，Figma 只作为参考记录。

## 1. 验证日期

```text
2026-06-21 至 2026-06-22
```

## 2. 当前轮次

```text
轮次：Phase 1.7 第一刀
目标：先拆输入区局部组件，降低 CreativeWorkbenchPage.tsx 复杂度。
状态：已完成并通过构建。
```

## 3. 本轮改动

新增组件：

```text
frontend/apps/web/src/features/workbench/components/PlanningHat.tsx
frontend/apps/web/src/features/workbench/components/ComposerBox.tsx
```

修改组件：

```text
frontend/apps/web/src/features/workbench/components/CreativeWorkbenchPage.tsx
```

改动说明：

```text
1. 把输入框上方的规划帽子拆成 PlanningHat。
2. 把底部输入框拆成 ComposerBox。
3. ConversationPane 继续保留 planOpen 状态，因为它需要同步调整消息区底部 padding。
4. 规划帽子仍然保持竖排待办列表。
5. 输入框仍然保持按钮在框内、左侧加号、右侧语音和发送。
6. 当前页面视觉以运行中的前端页面为准，不按 Figma 像素反推。
```

## 4. 注释检查

本轮新增代码已补充中文注释：

```text
1. PlanStep 每个字段有中文说明。
2. PlanningHatProps 每个字段有中文说明。
3. PlanningHat 组件说明了收起态、展开态和滚动规则。
4. ComposerBoxProps 每个字段有中文说明。
5. ComposerBox 组件说明了输入框按钮规则。
```

后续继续要求：

```text
每个新增组件必须说明职责。
每个 props 字段必须说明业务含义。
每个重要交互必须说明为什么这么做。
```

## 5. 命令验证

构建命令：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

开发服务：

```bash
npm run dev -- --port 3026
```

访问验证：

```bash
curl --noproxy '*' -I http://localhost:3026
```

结果：

```text
HTTP/1.1 200 OK
```

## 6. 当前结论

```text
Phase 1.7 已正式开始。
第一刀拆分没有引入类型错误或构建错误。
第二刀已经完成左侧会话列表拆分。
第三刀已经完成右侧能力面板拆分。
下一刀建议拆 CanvasPane，或者先补 shared/api 与 shared/sse 壳子。
```

## 7. 第二刀：左侧会话列表拆分

轮次信息：

```text
轮次：Phase 1.7 第二刀
目标：拆出左侧会话列表组件，继续降低 CreativeWorkbenchPage.tsx 复杂度。
状态：已完成并通过构建。
```

新增组件：

```text
frontend/apps/web/src/features/workbench/components/ConversationListPanel.tsx
```

修改组件：

```text
frontend/apps/web/src/features/workbench/components/CreativeWorkbenchPage.tsx
```

改动说明：

```text
1. 把左侧会话列表从 CreativeWorkbenchPage.tsx 拆到 ConversationListPanel.tsx。
2. 保留左侧展开态、收起态、画板模式下聊天气泡合并到窄栏的交互。
3. 保留左侧宽度拖拽、低于阈值收起、过窄回弹的交互。
4. ConversationListPanel 通过 threads props 接收会话列表，后续可替换为真实接口数据。
5. CreativeWorkbenchPage.tsx 继续作为当前阶段总控文件，只负责保存状态和组合组件。
6. CreativeWorkbenchPage.tsx 从 2116 行降低到 1899 行。
```

注释检查：

```text
1. ConversationThreadItem 每个字段都有中文说明。
2. ConversationListPanelProps 每个字段都有中文说明。
3. ConversationListPanel 组件说明了职责边界。
4. 左侧拖拽宽度的每个关键变量都有中文说明。
5. 收起态聊天气泡为什么合并到左侧窄栏，已在代码注释中说明。
```

命令验证：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

第二刀结论：

```text
左侧会话列表已经具备独立组件边界。
当前拆分没有改变视觉基线，也没有引入类型错误。
后续可继续拆 RightCapabilityPanel / CanvasPane，或者先补前端 API / SSE 壳子。
```

## 8. 第三刀：右侧能力面板拆分

轮次信息：

```text
轮次：Phase 1.7 第三刀
目标：拆出普通右侧能力面板，让主页面继续向“总控文件”收敛。
状态：已完成并通过构建。
```

新增组件：

```text
frontend/apps/web/src/features/workbench/components/RightCapabilityPanel.tsx
```

修改组件：

```text
frontend/apps/web/src/features/workbench/components/CreativeWorkbenchPage.tsx
```

改动说明：

```text
1. 把普通右侧能力面板从 CreativeWorkbenchPage.tsx 拆到 RightCapabilityPanel.tsx。
2. RightCapabilityPanel 负责画板入口、素材、工作流、网页、导出五类普通能力。
3. CanvasPane 暂时继续留在 CreativeWorkbenchPage.tsx，因为它包含大量画布拖拽、缩放、注释和工具栏交互。
4. RightPanel 类型移动到 RightCapabilityPanel.tsx，并由主页面按 type import 使用。
5. CreativeWorkbenchPage.tsx 从 1899 行降低到 1617 行。
6. 本轮拆分不改变页面视觉，不改变右侧按钮文案，不接真实后端。
```

注释检查：

```text
1. RightPanel 枚举有中文说明。
2. rightTools 每个 key / label / icon 字段有中文说明。
3. RightCapabilityPanelProps 每个字段有中文说明。
4. RightCapabilityPanel 组件说明了职责边界。
5. assetTypeLabel / statusLabel 说明了为什么展示中文但接口保留英文枚举。
6. AssetsPanel / WorkflowPanel / HtmlPanel / ExportPanel / CanvasIntroPanel 都有中文职责注释。
```

命令验证：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

第三刀结论：

```text
右侧普通能力面板已经具备独立组件边界。
CreativeWorkbenchPage.tsx 更接近阶段总控文件。
下一步可以继续拆 CanvasPane，或者先建立 shared/api 与 shared/sse 壳子。
```

## 9. 第四刀：CanvasPane 画板拆分

轮次信息：

```text
轮次：Phase 1.7 第四刀
目标：把画板编辑态从 CreativeWorkbenchPage.tsx 拆成独立 CanvasPane。
状态：已完成并通过构建。
```

新增组件：

```text
frontend/apps/web/src/features/workbench/components/CanvasPane.tsx
```

修改组件：

```text
frontend/apps/web/src/features/workbench/components/CreativeWorkbenchPage.tsx
```

改动说明：

```text
1. 把画板工具模式、注释工具、选区拖拽、图片拖拽、画布缩放等逻辑整体迁移到 CanvasPane.tsx。
2. CreativeWorkbenchPage.tsx 不再直接维护画板内部工具状态，只负责整体布局、左右面板宽度和画板开关。
3. CanvasPane 继续保留 10240 x 10240 超大画布、1024 x 1024 默认空白图、20%-200% 缩放比例展示。
4. CanvasPane 继续保留 AI 图片滤镜、编辑图片工具、注释工具栏、钢笔/矩形选区、注释气泡等 Phase 1.7 mock 交互。
5. 本轮只做工程化拆分，不改变视觉基线，不新增真实后端接口。
6. CreativeWorkbenchPage.tsx 从 1615 行降低到 656 行。
```

注释检查：

```text
1. CanvasPane 文件顶部说明了画板职责边界。
2. CanvasTool / AnnotationTool / AnnotationResizeCorner 类型都有中文说明。
3. CanvasPane props 每个字段都有中文说明。
4. 画布缩放、画布拖拽、图片拖拽、图片缩放、注释选区拖拽和缩放都有中文注释。
5. 关键数值 10240、1024、20%-200%、256、4096、96 等都说明了用途和改值影响。
6. Console 日志继续使用中文，方便后续联调时定位画板交互。
```

命令验证：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

第四刀结论：

```text
CanvasPane 已经具备独立组件边界。
CreativeWorkbenchPage.tsx 已基本回到总控文件形态。
下一步建议补 shared/api 与 shared/sse 壳子，为 Phase 1.8 Java/Python mock SSE 联调做准备。
```

## 10. 第五刀：总控文件收敛

轮次信息：

```text
轮次：Phase 1.7 第五刀
目标：把 CreativeWorkbenchPage.tsx 收敛成真正的工作台总控文件。
状态：已完成并通过构建。
```

新增组件：

```text
frontend/apps/web/src/features/workbench/components/ConversationPane.tsx
frontend/apps/web/src/features/workbench/components/SideStagePane.tsx
```

修改组件：

```text
frontend/apps/web/src/features/workbench/components/CreativeWorkbenchPage.tsx
```

改动说明：

```text
1. 把中间 Agent 对话区、规划帽子、底部输入框组合逻辑迁移到 ConversationPane.tsx。
2. 把右侧普通能力面板、画板层切换、右侧拖拽、画板对话区拖拽迁移到 SideStagePane.tsx。
3. CreativeWorkbenchPage.tsx 只保留工作台总状态、整体 grid 列宽、右侧动画时长、提交入口和三大区域装配。
4. CreativeWorkbenchPage.tsx 从 656 行降低到 233 行。
5. 本轮只做总控文件收敛，不改变页面视觉，不新增真实接口。
```

注释检查：

```text
1. ConversationPane 文件顶部说明了管理区域、接口边界和改动影响。
2. SideStagePane 文件顶部说明了管理区域、接口边界和改动影响。
3. CreativeWorkbenchPage.tsx 中关键状态仍保留中文注释，说明每个状态控制哪个区域。
4. props 传递处继续保留中文注释，方便从总控文件追踪数据流。
```

命令验证：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

第五刀结论：

```text
CreativeWorkbenchPage.tsx 已经具备总控文件形态。
Phase 1.7 前端静态工程化拆分的组件边界已经基本完成。
下一步建议补 shared/api 与 shared/sse 壳子，为 Phase 1.8 Java/Python mock SSE 联调做准备。
```

## 11. 第六刀：实体类型与 mock 数据拆分

轮次信息：

```text
轮次：Phase 1.7 第六刀
目标：把集中式 mockData.ts 拆成实体类型和分领域 mock 文件。
状态：已完成并通过构建。
```

新增实体：

```text
frontend/apps/web/src/entities/conversation/types.ts
```

新增 mock 文件：

```text
frontend/apps/web/src/features/workbench/model/runtimeMock.ts
frontend/apps/web/src/features/workbench/model/conversationMock.ts
frontend/apps/web/src/features/workbench/model/traceMock.ts
frontend/apps/web/src/features/workbench/model/toolMock.ts
frontend/apps/web/src/features/workbench/model/assetMock.ts
```

修改文件：

```text
frontend/apps/web/src/features/workbench/model/mockData.ts
frontend/apps/web/src/features/workbench/components/ConversationListPanel.tsx
```

改动说明：

```text
1. 新增 CreativeThread 实体类型，承接左侧会话列表和未来 GET /api/threads。
2. mockData.ts 从大文件改成统一 re-export 出口。
3. Runtime、Conversation、Trace、Tool、Asset mock 数据分别拆到独立 model 文件。
4. ConversationListPanel 不再自己定义会话字段结构，而是引用 entities/conversation/types.ts。
5. 保留现有组件从 mockData.ts 读取数据的方式，避免本轮产生大面积 import 变更。
```

注释检查：

```text
1. 每个新 mock 文件顶部都说明了管理区域、接口边界和改动影响。
2. CreativeThread 每个字段都有中文注释。
3. mockData.ts 说明了统一出口存在的原因，以及后续 shared/api 与 shared/sse 替换路径。
```

命令验证：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

第六刀结论：

```text
工作台 mock 数据已经按实体和领域拆分。
Phase 1.7 的前端静态工程化基础更接近后续联调形态。
下一步建议补 shared/api 与 shared/sse 壳子，为 Phase 1.8 Java/Python mock SSE 联调做准备。
```

## 12. 第七刀：creative-run 聚合实体拆分

轮次信息：

```text
轮次：Phase 1.7 第七刀
目标：把 entities/creative-run/types.ts 拆成更细的实体目录。
状态：已完成并通过构建。
```

新增实体目录：

```text
frontend/apps/web/src/entities/message/types.ts
frontend/apps/web/src/entities/asset/types.ts
frontend/apps/web/src/entities/trace/types.ts
frontend/apps/web/src/entities/tool/types.ts
```

保留兼容出口：

```text
frontend/apps/web/src/entities/creative-run/types.ts
```

改动说明：

```text
1. Message 独立到 entities/message，用于中间 Agent 对话和后续 SSE message.delta。
2. CreativeAsset 独立到 entities/asset，用于素材面板、画板和 HTML 预览。
3. TraceEvent 独立到 entities/trace，用于工作流面板和后续 AgentOps 时间线。
4. ToolCall 独立到 entities/tool，用于工具调用审计和设置页样例。
5. entities/creative-run/types.ts 暂时保留为 re-export 兼容出口，避免旧路径立刻失效。
6. 分领域 mock 文件已经改为直接引用新实体目录。
```

注释检查：

```text
1. 每个新实体文件顶部都说明了管理区域、接口边界和改动影响。
2. 每个字段都有中文注释。
3. creative-run 兼容出口说明了后续删除条件和改动风险。
```

命令验证：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

第七刀结论：

```text
前端实体层已经从粗粒度 creative-run 聚合拆成 message / asset / trace / tool / conversation / runtime。
这一步完成后，Phase 1.7 的实体和 mock 分层基本到位。
下一步建议补 shared/api 与 shared/sse 壳子，为 Phase 1.8 Java/Python mock SSE 联调做准备。
```

## 13. 第八刀：工作台总控状态与行为抽取

轮次信息：

```text
轮次：Phase 1.7 第八刀
目标：把 CreativeWorkbenchPage 里的布局状态和页面行为抽到 model 层。
状态：已完成并通过构建。
```

新增文件：

```text
frontend/apps/web/src/features/workbench/model/workbenchState.ts
frontend/apps/web/src/features/workbench/model/workbenchActions.ts
```

修改文件：

```text
frontend/apps/web/src/features/workbench/components/CreativeWorkbenchPage.tsx
```

抽取内容：

```text
1. workbenchState.ts 管理工作台默认宽度、默认 brief、默认右侧面板。
2. workbenchState.ts 负责计算 gridTemplateColumns，避免布局公式散在 TSX 里。
3. workbenchState.ts 负责计算右侧面板和画板的动画时长。
4. workbenchActions.ts 管理右侧面板打开、画板模式进入、画板对话区恢复和收起。
5. workbenchActions.ts 管理提交创意需求的前端占位日志。
6. CreativeWorkbenchPage.tsx 只保留页面状态声明、布局组装和组件连线。
```

为什么要这样拆：

```text
CreativeWorkbenchPage 是总控文件，不应该越来越像“万能文件”。
总控应该表达页面由哪些区域组成，以及这些区域之间怎么连线。
宽度公式、动画计算、面板切换、对话恢复这类规则，放进 model 层后更容易测试和复用。
后续接真实接口时，submitCreativeBrief 可以平滑升级为 POST /api/threads/{threadId}/runs/stream。
```

注释检查：

```text
1. workbenchState.ts 已说明每个默认值的管理区域、接口边界和改值影响。
2. workbenchActions.ts 已说明每个行为来自哪个 UI 区域，以及后续对应哪个接口。
3. CreativeWorkbenchPage.tsx 保留关键分区注释，帮助新手知道左、中、右三块怎么串起来。
```

命令验证：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

第八刀结论：

```text
工作台总控进一步收敛为页面装配层。
前端静态工程化已经具备 components / model / entities / shared 的基本形态。
下一步建议补 shared/api 与 shared/sse 壳子，为 Phase 1.8 Java/Python mock SSE 联调做准备。
```

## 14. 第九刀：shared/api 与 shared/sse 联调壳

轮次信息：

```text
轮次：Phase 1.7 第九刀
目标：补齐前端真实联调前的 API 请求壳和 SSE 解析壳。
状态：已完成并通过构建。
```

新增文件：

```text
frontend/apps/web/src/shared/api/endpoints.ts
frontend/apps/web/src/shared/api/client.ts
frontend/apps/web/src/shared/api/index.ts
frontend/apps/web/src/shared/sse/events.ts
frontend/apps/web/src/shared/sse/parser.ts
frontend/apps/web/src/shared/sse/runStream.ts
frontend/apps/web/src/shared/sse/index.ts
```

api 分层说明：

```text
1. endpoints.ts 只管理 OpenAPI 路径，不拼 Runtime baseUrl。
2. client.ts 只管理普通 JSON 请求、Runtime URL 拼接和统一中文错误对象。
3. index.ts 是 shared/api 的统一出口，业务层后续只从这里导入。
```

sse 分层说明：

```text
1. events.ts 对齐 contracts/events/sse-events.schema.json，声明 run_started、message_delta、trace_event、run_finished、run_failed。
2. parser.ts 负责把 text/event-stream 文本切成原始事件，并校验 event/data/runtime/type/status/code。
3. runStream.ts 负责 POST /api/threads/{threadId}/runs/stream，并把解析后的 CampaignSseEvent 交给 handlers.onEvent。
4. index.ts 是 shared/sse 的统一出口，UI 组件不能直接处理 ReadableStream。
```

为什么现在要补：

```text
Phase 1.7 仍然只跑静态 mock，不连接真实 Java/Python 后端。
但 Phase 1.8 要开始双语言 Mock SSE 联调，如果没有 shared/api 和 shared/sse，接口逻辑会散进组件里。
现在先把壳建好，后续只需要把 workbenchActions.submitCreativeBrief 替换为 streamCampaignRun。
```

注释检查：

```text
1. 每个 API 路径函数都写清接口路径、管理区域和改动影响。
2. 每个 SSE 事件字段都写了中文注释，解释页面展示位置和后续 reducer 影响。
3. SSE parser 明确写了 Runtime、事件名、Trace 类型、状态、错误码白名单。
4. runStream.ts 写清 Java/Python Runtime 地址和 POST /api/threads/{threadId}/runs/stream 入口。
```

命令验证：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

第九刀结论：

```text
前端已经具备进入 Phase 1.8 Mock SSE 联调的 shared 层入口。
当前页面仍然不主动请求真实后端，符合 Phase 1.7 静态工程化边界。
下一步建议补 feature/workbench/model 的 run reducer 草稿，让 SSE 事件有明确落点。
```

## 15. 第十刀：Run reducer 状态落点草稿

轮次信息：

```text
轮次：Phase 1.7 第十刀
目标：补齐前端接收 SSE 后的状态落点，避免 Phase 1.8 把事件处理写散到组件里。
状态：已完成并通过构建。
```

新增文件：

```text
frontend/apps/web/src/features/workbench/model/runReducer.ts
```

管理状态：

```text
1. status：idle / running / succeeded / failed。
2. currentRunId：当前运行 ID。
3. currentThreadId：当前会话 ID。
4. streamingMessageId：流式助手消息的前端临时 ID。
5. messages：中间 Agent 对话消息。
6. traceEvents：右侧工作流轨迹。
7. assetIds：本次运行完成后返回的素材 ID。
8. error：中文错误对象。
```

SSE 事件落点：

```text
1. run_started：进入 running，创建一条空的 assistant 流式消息。
2. message_delta：追加到当前 assistant 消息。
3. trace_event：追加或覆盖右侧工作流 Trace。
4. run_finished：进入 succeeded，把临时 messageId 替换为后端最终 messageId。
5. run_failed：进入 failed，保存中文错误对象，后续可按 code 进入降级策略。
```

为什么现在只做草稿：

```text
Phase 1.7 仍然是前端静态工程化，不主动连接真实 Java/Python 后端。
但 Phase 1.8 一旦接入 streamCampaignRun，handlers.onEvent 就需要一个明确的 reducer 落点。
现在先把状态结构、事件映射、中文注释和边界写清楚，后续联调只做接线，不再临时设计状态。
```

注释检查：

```text
1. 每个 state 字段都有中文注释，说明展示区域、接口来源和改动影响。
2. 每个 action 都说明触发场景。
3. 每个 SSE 事件分支都说明页面影响。
4. message_delta 的兜底逻辑写明了 run_started 丢失或刷新后的处理方式。
5. trace_event 的 upsert 规则写明了 running -> succeeded 覆盖而不是重复追加。
```

命令验证：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

第十刀结论：

```text
Phase 1.7 前端已经具备 UI 原型、组件拆分、实体拆分、mock 拆分、API/SSE 壳、Run reducer 落点。
下一步建议进入 Phase 1.7 收尾验收，确认静态工程化边界后再开 Phase 1.8 后端 Mock SSE。
```
