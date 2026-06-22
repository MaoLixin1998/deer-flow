# 14. Phase 1.7 前端静态工程化封版验收

> 本文件是 Phase 1.7 的收尾验收文档。  
> 它不是新需求文档，也不是继续开发清单。  
> 它用于确认：前端静态工程化已经达到进入 Phase 1.8 双后端 Mock SSE 联调的最低门槛。

## 1. 阶段结论

```text
阶段：Phase 1.7
名称：前端静态开发
状态：已完成
验收日期：2026-06-22
下一阶段：Phase 1.8 后端双语言并行开发
```

验收结论：

```text
通过。
Phase 1.7 已完成前端静态工程化封版。
当前前端仍然只使用 mock 数据，不主动连接真实 Java/Python 后端。
当前代码已经具备进入 Phase 1.8 Mock SSE 联调的组件、实体、API 壳、SSE 壳和 reducer 落点。
```

一句话总结：

```text
页面样子已经定住，前端地基已经拆清楚，下一步可以开始接 Java/Python 双后端。
```

## 2. 本阶段输入

```text
docs/01_CODE_RULES_ZH.md
docs/09_PHASE_DELIVERY_PROCESS_ZH.md
contracts/openapi/agent-api.yaml
contracts/events/sse-events.md
contracts/events/sse-events.schema.json
contracts/schemas/*.schema.json
phases/phase-01/04_SIMPLE_DESIGN_ZH.md
phases/phase-01/08_DESIGN_BASELINE_ACCEPTANCE_ZH.md
phases/phase-01/09_CODE_PROTOTYPE_START_ZH.md
phases/phase-01/10_CODE_PROTOTYPE_VALIDATION_ZH.md
phases/phase-01/11_PHASE1_7_FRONTEND_STATIC_PLAN_ZH.md
phases/phase-01/12_PHASE1_7_FIGMA_PROTOTYPE_BASELINE_ZH.md
phases/phase-01/13_PHASE1_7_FRONTEND_STATIC_VALIDATION_ZH.md
frontend/apps/web/
```

## 3. 本阶段输出

核心前端目录：

```text
frontend/apps/web/src/app/
frontend/apps/web/src/entities/
frontend/apps/web/src/features/workbench/
frontend/apps/web/src/shared/api/
frontend/apps/web/src/shared/config/
frontend/apps/web/src/shared/lib/
frontend/apps/web/src/shared/sse/
frontend/apps/web/src/shared/ui/
```

阶段文档：

```text
11_PHASE1_7_FRONTEND_STATIC_PLAN_ZH.md
12_PHASE1_7_FIGMA_PROTOTYPE_BASELINE_ZH.md
13_PHASE1_7_FRONTEND_STATIC_VALIDATION_ZH.md
14_PHASE1_7_CLOSURE_ACCEPTANCE_ZH.md
```

## 4. 验收范围

本次验收覆盖：

```text
1. 前端页面是否能构建。
2. 前端目录是否完成 app / features / entities / shared 分层。
3. 工作台总控是否从单文件大杂烩收敛为装配层。
4. 核心 UI 是否拆成独立组件。
5. mock 数据是否按领域拆分。
6. 实体类型是否按 message / asset / trace / tool / runtime / conversation 拆分。
7. shared/api 是否具备联调前置壳。
8. shared/sse 是否具备事件类型、文本解析和流连接壳。
9. runReducer 是否给 SSE 事件提供状态落点。
10. 注释是否覆盖关键状态、字段、接口、mock 来源和改值影响。
```

本次验收不覆盖：

```text
1. 真实 Java 后端。
2. 真实 Python 后端。
3. 真实 SSE 联调。
4. 真实模型调用。
5. 真实图片编辑算法。
6. 真实文件上传。
7. 真实数据库、Redis、MQ、RAG、对象存储。
8. 登录鉴权。
9. 云服务器 Docker 发布。
```

## 5. 工程化拆分结果

### 5.1 页面入口

```text
src/app/page.tsx
src/app/settings/page.tsx
```

说明：

```text
app 目录只保留 Next.js 路由入口。
复杂业务逻辑下沉到 features。
```

### 5.2 工作台组件层

```text
src/features/workbench/components/CreativeWorkbenchPage.tsx
src/features/workbench/components/ConversationListPanel.tsx
src/features/workbench/components/ConversationPane.tsx
src/features/workbench/components/SideStagePane.tsx
src/features/workbench/components/CanvasPane.tsx
src/features/workbench/components/PlanningHat.tsx
src/features/workbench/components/ComposerBox.tsx
src/features/workbench/components/RightCapabilityPanel.tsx
src/features/workbench/components/RuntimeSettingsPage.tsx
```

验收结论：

```text
通过。
CreativeWorkbenchPage.tsx 已从高保真原型大文件收敛为页面总控。
左侧列表、中间对话、右侧能力、画板、输入框、规划帽子都已经拆出独立组件。
```

### 5.3 工作台 model 层

```text
src/features/workbench/model/workbenchState.ts
src/features/workbench/model/workbenchActions.ts
src/features/workbench/model/runReducer.ts
src/features/workbench/model/runtimeMock.ts
src/features/workbench/model/conversationMock.ts
src/features/workbench/model/assetMock.ts
src/features/workbench/model/traceMock.ts
src/features/workbench/model/toolMock.ts
src/features/workbench/model/mockData.ts
```

验收结论：

```text
通过。
布局默认值、布局公式、动画时长、面板行为、Run 状态落点和 mock 数据已经从组件中拆出。
Phase 1.8 接入 SSE 时，事件可以进入 runReducer，而不是散落在 TSX 组件里。
```

### 5.4 实体层

```text
src/entities/conversation/types.ts
src/entities/message/types.ts
src/entities/asset/types.ts
src/entities/trace/types.ts
src/entities/tool/types.ts
src/entities/runtime/types.ts
src/entities/creative-run/types.ts
```

验收结论：

```text
通过。
前端实体已经按会话、消息、素材、轨迹、工具、运行时拆分。
creative-run 暂时保留为兼容出口，后续可以在 Phase 2 删除旧引用后移除。
```

### 5.5 shared/api

```text
src/shared/api/endpoints.ts
src/shared/api/client.ts
src/shared/api/index.ts
```

验收结论：

```text
通过。
接口路径集中在 endpoints.ts。
Runtime URL 拼接集中在 client.ts。
组件层不需要手写 Java/Python baseUrl。
```

### 5.6 shared/sse

```text
src/shared/sse/events.ts
src/shared/sse/parser.ts
src/shared/sse/runStream.ts
src/shared/sse/index.ts
```

验收结论：

```text
通过。
SSE 事件类型已经对齐 contracts/events/sse-events.schema.json。
parser 已校验 event、data.event、runtime、trace type、trace status、error code。
runStream 已预留 POST /api/threads/{threadId}/runs/stream 连接入口。
```

## 6. 当前页面能力

已完成并允许保留：

```text
1. 白灰极简工作台风格。
2. 左侧会话列表展开、收起、拖拽。
3. 中间 Agent 对话区。
4. 输入框内按钮、规划帽子、竖向规划列表。
5. 右侧能力面板展开、收起、拖拽。
6. 画板模式从右侧展开，把对话推到左侧。
7. 超大画布视觉基线。
8. 画板工具悬浮入口。
9. AI 图片滤镜工具面板占位。
10. 全中文页面文本。
```

明确仍是占位：

```text
1. 画板真实图片编辑。
2. 局部重绘真实选区算法。
3. 注释工具完整交互。
4. 工具栏真实业务动作。
5. 真实素材生成。
6. 真实 SSE 数据接入。
```

## 7. 构建验收

验收命令：

```bash
cd frontend/apps/web
npm run build
```

验收结果：

```text
通过。
Next.js 成功生成 / 和 /settings。
```

关键输出：

```text
○ /            Static
○ /settings    Static
```

## 8. 注释验收

验收结论：

```text
通过当前阶段最低门槛。
```

已覆盖：

```text
1. 组件职责中文注释。
2. props 字段中文注释。
3. state 字段中文注释。
4. mock 数据字段中文注释。
5. API 路径中文注释。
6. SSE 事件字段中文注释。
7. reducer 行为中文注释。
8. 布局宽度、动画时长、拖拽阈值影响说明。
```

后续要求：

```text
Phase 1.8 新增 Java/Python 后端代码时，也必须保持字段级中文注释。
任何接口、日志、异常、降级策略都必须写中文说明。
```

## 9. Phase 1.8 进入条件

Phase 1.8 可以开始，前提是遵守以下边界：

```text
1. Java Runtime 和 Python Runtime 必须先做 Mock SSE。
2. 两套后端必须使用同一套 contracts。
3. 先跑通 /api/health。
4. 再跑通 /api/runtimes。
5. 再跑通 POST /api/threads/{threadId}/runs/stream。
6. 前端先只接 streamCampaignRun + runReducer。
7. 不接真实模型。
8. 不接真实数据库。
9. 不接 RAG、MQ、对象存储。
10. 所有日志、异常、响应 message 必须中文。
```

Phase 1.8 推荐第一批接口：

```text
GET  /api/health
GET  /api/runtimes
GET  /api/models
GET  /api/threads
GET  /api/threads/{threadId}/messages
POST /api/threads/{threadId}/runs/stream
GET  /api/runs/{runId}/trace
GET  /api/assets
```

## 10. 遗留项

遗留到 Phase 1.8：

```text
1. Java / Python 双后端同构模块落地。
2. Mock SSE 数据从后端推给前端。
3. 前端 submitCreativeBrief 替换为 streamCampaignRun。
4. runReducer 接入真实页面状态。
5. Runtime 设置页接真实 /api/runtimes。
```

遗留到 Phase 2 或后续：

```text
1. 真实模型供应商接入。
2. 真实图片生成和局部重绘。
3. 真实视频生成。
4. 真实 HTML 预览沙箱。
5. 数据库持久化。
6. Redis、MQ、RAG、对象存储。
7. 登录鉴权和权限系统。
8. 云服务器 Docker 发布。
```

## 11. 封版判断

```text
Phase 1.7 已封版。
除非发现阻断 Phase 1.8 的构建错误或 contracts 映射错误，否则不再继续扩展前端静态功能。
下一步进入 Phase 1.8：后端双语言并行开发。
```
