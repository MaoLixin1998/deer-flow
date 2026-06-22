# 08. Phase 1.5 设计基线验收记录

> 本文件记录 Phase 1.5 从设计阶段进入 Phase 1.6 高保真代码原型的门禁结论。  
> 由于当前 Figma Starter 计划和调用额度限制，本阶段以本地 SVG 高保真基线作为代码原型的直接输入，Figma 同步作为后续补齐项。

## 1. 验收结论

```text
结论：通过。
允许进入：Phase 1.6 高保真代码原型。
限制：代码原型只能按本文件登记的 SVG 设计基线实现，不允许临时改产品方向。
```

说明：

```text
本项目已经确立“SVG 先行，再同步 Figma”的规则。
因此在 Figma 受限时，可以先把确认后的 SVG 作为阶段设计基线。
该例外只影响设计工具交付顺序，不取消 Figma 最终同步要求。
```

## 2. 本次设计基线

桌面端基线：

```text
phases/phase-01/assets/codex-like-product-panel-v5-contiguous-layout.svg
```

移动端基线：

```text
phases/phase-01/assets/codex-like-product-panel-v6-ios-mobile.svg
```

早期参考：

```text
phases/phase-01/assets/frontend-workbench-rough-wireframe.svg
phases/phase-01/assets/codex-like-product-panel-v4-storyboard.svg
```

## 3. 必须进入代码原型的设计规则

桌面端：

```text
1. 页面必须像真实浏览器中的网页应用。
2. 主体区域必须顶满浏览器内容区。
3. 左侧、中间、右侧不是三张漂浮卡片，只能用分割线区分。
4. 默认状态保持干净，只突出中间创意对话和生成入口。
5. 左侧会话列表是丝滑抽屉，默认可收起。
6. 右侧不是 Codex 的审查/终端/浏览器，而是本项目的产品能力入口。
7. 右侧一级能力固定为画板、素材、工作流、HTML、导出。
8. 打开画板后，对话区缩到左侧约 1/3，画板占主要空间。
9. 对话发送按钮必须使用上箭头图标，不能用文字或黑块替代。
10. 对话输入框必须贴近内容区底部，不能悬在中间偏高位置。
```

移动端：

```text
1. 整体延续白、灰、黑。
2. 默认状态是极简对话 + 底部输入。
3. 左侧会话抽屉从左侧滑入。
4. 产品能力通过底部 Sheet 或边缘工具入口展开。
5. 画板编辑优先横屏全屏展示。
6. 画板取消顶部 head，尽量展示更多内容。
7. 完成按钮固定在画板右上角。
8. 左侧工具栏默认收起，并像抽屉一样展开。
9. 画板指令只保留一个语音按钮，不展示对话内容。
10. 画板不能白套灰套白，要是一整块沉浸式画布。
```

图标规则：

```text
Web 代码优先使用 lucide-react。
发送使用 ArrowUp。
语音使用 Mic。
画板使用 PencilRuler 或 Image。
素材使用 Images。
工作流使用 Workflow。
HTML 使用 Code2。
导出使用 PackageCheck 或 Download。
所有图标按钮必须有中文 aria-label 或 title。
```

## 4. 与 contracts 的映射

```text
Runtime 状态      -> GET /api/runtimes -> runtime.schema.json
模型选择          -> GET /api/models -> model.schema.json
会话列表          -> GET /api/threads -> message.schema.json
运行创建和 SSE    -> POST /api/threads/{threadId}/runs/stream -> run.schema.json + sse-events.schema.json
Trace 时间线      -> GET /api/runs/{runId}/trace -> trace.schema.json
素材列表          -> GET /api/assets -> asset.schema.json
HTML 预览         -> POST /api/html/previews -> html-preview.schema.json
合规检查          -> POST /api/compliance/reviews -> compliance.schema.json
错误提示          -> error.schema.json
```

## 5. 本阶段仍然不做

```text
不接真实模型。
不接真实数据库。
不接真实 RAG。
不接真实 MQ。
不接对象存储。
不做登录鉴权。
不做云服务器部署。
```

## 6. 进入 Phase 1.6 的开发要求

```text
1. 先实现可运行的高保真代码原型。
2. 使用 Next.js + React + TypeScript + Tailwind CSS。
3. 页面文案、错误提示、注释、日志优先中文。
4. 目录按 app / features / entities / shared 分层。
5. Mock 数据必须贴合 contracts 字段，不允许随手造不可追溯字段。
6. 所有交互先在前端本地模拟。
7. 代码原型完成后必须截图或浏览器验收。
```

## 7. 后续补齐项

```text
1. 将 SVG 基线同步回 Figma 文件。
2. 在 Figma 中补齐 Dev Handoff 标注。
3. 后续如果 Figma 页面额度允许，再拆成 00 Cover / Design Tokens / Components / Screens / Handoff 等页面。
```
