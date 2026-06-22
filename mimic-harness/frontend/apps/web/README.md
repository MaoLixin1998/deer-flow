# Ninic Creative Agent Studio Web

这是 `mimic-harness` Phase 1 的前端高保真代码原型和静态工程化结果。

当前状态：

```text
Phase 1.7 已封版。
当前前端只使用 mock 数据，不主动连接真实 Java/Python 后端。
下一步由 Phase 1.8 接入 Java / Python Mock SSE。
```

当前目标不是接真实模型，而是先把 AIGC 创意生产 Agent 的核心工作台体验跑通：

```text
对话
规划
素材
工作流
网页预览
导出
画板编辑
左右面板推拉
```

## 1. 技术栈

```text
TypeScript
React
Next.js
Tailwind CSS
lucide-react
```

## 2. 快速启动

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

默认地址：

```text
http://localhost:3026
```

构建检查：

```bash
npm run build
```

注意：

```text
如果执行过 npm run build，再启动 npm run dev 前建议删除 .next。
这是为了避免 Next.js build/dev 缓存混用导致本地运行时异常。
```

## 3. 页面入口

```text
src/app/page.tsx
src/app/settings/page.tsx
```

当前页面：

```text
/           创意生产智能体工作台
/settings   Runtime、模型降级、Mock 工具登记设置页
```

核心组件：

```text
src/features/workbench/components/CreativeWorkbenchPage.tsx
```

当前 mock 数据：

```text
src/features/workbench/model/mockData.ts
```

共享 UI：

```text
src/shared/ui/IconButton.tsx
```

共享工具：

```text
src/shared/lib/cn.ts
```

## 4. 当前工作台交互

左侧：

```text
左侧会话列表可展开、收起、拖拽宽度。
拖到很窄后松手，会收成 48px 竖条。
画板模式下，对话区收起时，聊天气泡会合并到左侧窄栏。
```

中间：

```text
中间是 Agent 对话区。
输入框按钮全部在输入框内部。
左侧加号用于上传图片占位。
智能规划按钮用于展示当前 Agent 模式。
语音按钮用于后续语音输入。
发送按钮用于提交创意需求。
```

规划帽子：

```text
输入框上方有“01 规划”帽子。
默认只展示当前阶段。
点击后展开为竖向待办列表。
完成项显示勾，未完成项显示空框。
列表保留滚动能力，但隐藏滚动条。
```

右侧：

```text
右侧产品能力面板可展开、收起、拖拽宽度。
拖到很窄后松手，会收成 48px 工具竖条。
右侧能力包括：画板、素材、工作流、网页、导出。
右侧推拉动画时长会按展开宽度计算，避免画板突然跳出。
```

画板：

```text
画板从右侧展开。
展开时会把对话区推到左侧。
画板工具按钮悬浮在画板内部，不占独立竖列。
工具包括：菜单、局部重绘、生成变体。
对话区收起时，画板底部显示语音按钮。
```

## 5. 目录分层

```text
src/
  app/                     # Next.js 路由入口
  features/
    workbench/             # 创意生产工作台
    settings/              # 设置页
  shared/
    lib/                   # 通用工具
    ui/                    # 通用 UI 组件
```

Phase 1 前端重点文件：

```text
src/features/workbench/components/CreativeWorkbenchPage.tsx
src/features/workbench/components/ConversationPane.tsx
src/features/workbench/components/SideStagePane.tsx
src/features/workbench/components/CanvasPane.tsx
src/features/workbench/components/ConversationListPanel.tsx
src/features/workbench/components/RightCapabilityPanel.tsx
src/features/workbench/components/PlanningHat.tsx
src/features/workbench/components/ComposerBox.tsx
src/features/workbench/model/workbenchState.ts
src/features/workbench/model/workbenchActions.ts
src/features/workbench/model/runReducer.ts
src/features/workbench/model/mockData.ts
src/features/workbench/model/runtimeMock.ts
src/features/workbench/model/conversationMock.ts
src/features/workbench/model/assetMock.ts
src/features/workbench/model/traceMock.ts
src/features/workbench/model/toolMock.ts
src/entities/conversation/types.ts
src/entities/message/types.ts
src/entities/asset/types.ts
src/entities/trace/types.ts
src/entities/tool/types.ts
src/entities/creative-run/types.ts
src/shared/api/endpoints.ts
src/shared/api/client.ts
src/shared/sse/events.ts
src/shared/sse/parser.ts
src/shared/sse/runStream.ts
src/app/globals.css
```

## 6. 注释要求

本项目面向 Java 开发者学习前端，所以前端代码必须写中文注释。

必须注释：

```text
组件职责
重要状态变量
拖拽逻辑
动画时长计算
布局列宽计算
后续要接的接口
容易误改的交互规则
```

TSX / CSS 详细要求：

```text
页面或组件文件顶部：
  写清楚这个文件管理哪个页面、哪个区域、哪些交互、对应哪个 mock 或未来接口。

TypeScript 类型、props、state：
  每个字段都要写中文注释，说明字段用途、数据来源、展示位置、改值影响。

接口调用和 mock 数据：
  注释必须写清接口路径，例如 POST /api/threads/{threadId}/runs/stream。
  当前是 mock 的地方，要说明后续会替换成哪个真实接口。

JSX 分区：
  左侧会话列表、中间 Agent 对话、右侧能力面板、画板、输入框等区域都要有分区注释。

Tailwind className / CSS：
  布局、宽度、高度、间距、圆角、阴影、z-index、动画时长、拖拽阈值必须说明改值影响。

事件函数：
  说明来自哪个按钮或拖拽区域，会修改哪些状态，是否会影响接口、SSE 或后续联调。
```

注释示例：

```tsx
// 右侧能力面板宽度：控制素材、画板、工作流等工具面板展开后的占屏比例。
// 改大后中间 Agent 对话区会被压窄；改小后滤镜卡片和图片编辑工具可能换行。
const rightPanelWidth = 320;

// 提交创意需求：Phase 1 只写入本地 mock 消息；后续接 POST /api/threads/{threadId}/runs/stream。
// 接入真实接口后，这里会触发 SSE run.started/message.delta/tool.call.started 等事件。
function handleSubmitPrompt() {
  // ...
}
```

不要写无意义注释：

```text
不要写“设置变量”“返回组件”这类废话。
注释必须解释为什么这样做，或者这个节点以后接什么。
```

## 7. 当前不能做

Phase 1 前端暂不做：

```text
真实登录
真实模型调用
真实文件上传
真实图片编辑
真实数据库持久化
真实 RAG
真实 MQ
真实支付或权限系统
```

当前所有数据都是 mock。

## 8. 后续联调方向

后续会接入两套 Runtime：

```text
Java Runtime   -> http://localhost:8080
Python Runtime -> http://localhost:8000
```

前端提交创意需求后，预期调用：

```text
POST /api/threads/{threadId}/runs/stream
```

当前前端已经预留调用壳：

```text
src/shared/api/endpoints.ts       统一维护 OpenAPI 路径
src/shared/api/client.ts          普通 JSON 请求壳
src/shared/sse/events.ts          SSE 事件类型
src/shared/sse/parser.ts          SSE 文本解析和字段校验
src/shared/sse/runStream.ts       Campaign Run 流式连接入口
src/features/workbench/model/runReducer.ts  SSE 事件进入前端后的状态落点
```

后端通过 SSE 返回：

```text
run.started
message.delta
tool.call.started
tool.call.finished
asset.created
trace.appended
run.finished
run.failed
```

协议来源：

```text
../../../contracts/openapi/agent-api.yaml
../../../contracts/events/sse-events.md
../../../contracts/events/sse-events.schema.json
../../../contracts/schemas/
```
