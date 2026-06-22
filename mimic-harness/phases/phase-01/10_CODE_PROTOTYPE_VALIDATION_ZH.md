# 10. Phase 1.6 高保真代码原型验证记录

> 本文件记录 Phase 1.6 第一轮前端代码原型的验证结果。  
> 当前验证对象是 `frontend/apps/web/`。

## 1. 验证日期

```text
2026-06-21
```

## 2. 验证范围

```text
页面：/
页面：/settings
能力：默认工作台、左侧会话抽屉、右侧产品能力、画板展开态、Runtime 设置页
数据：本地 mock 数据
接口：暂不连接真实接口
```

## 3. 命令验证

构建命令：

```bash
npm run build
```

结果：

```text
通过。
Next.js 成功生成 / 和 /settings 两个静态页面。
```

开发服务器：

```bash
npm run dev
```

访问地址：

```text
http://localhost:3026
```

## 4. 浏览器验证

Playwright 已完成默认态和画板态截图：

```text
phases/phase-01/output/playwright/phase1-web-default.png
phases/phase-01/output/playwright/phase1-web-canvas.png
phases/phase-01/output/playwright/phase1-web-settings.png
phases/phase-01/output/playwright/phase1-web-mobile.png
```

默认态检查：

```text
1. 页面像真实浏览器中的网页应用。
2. 左侧会话列表为抽屉结构。
3. 中间对话区贴底输入。
4. 右侧产品能力为画板、素材、工作流、HTML、导出。
5. 发送、语音、画板等动作使用 lucide-react 图标。
```

画板态检查：

```text
1. 对话区缩到左侧约 1/3。
2. 画板占据右侧主要空间。
3. 左侧画板工具栏可作为后续抽屉扩展入口。
4. 完成按钮位于画板右上角。
5. 指令输入只保留底部语音按钮。
```

Runtime 设置页检查：

```text
1. Java Runtime 和 Python Runtime 状态可见。
2. Python Runtime 模拟 degraded，体现降级能力。
3. mockMode 明确展示为 true，避免误解为已接真实模型。
4. Mock 工具调用登记能展示工具名、耗时和输出 assetId。
```

控制台检查：

```text
1. 清理 .next 后重新启动 dev server。
2. 默认页和设置页无资源 404。
3. 控制台只有 React DevTools 提示和前端原型中文日志。
```

移动端检查：

```text
1. 使用 390 x 844 视口截图。
2. 左侧抽屉宽度限制为 86vw。
3. 右侧产品能力在移动端变为底部 Sheet。
4. document.documentElement.scrollWidth > document.documentElement.clientWidth 的结果为 false。
5. 当前只完成第一层响应式验证，后续仍需按 V6 iOS 设计继续打磨横屏画板细节。
```

开发服务器注意：

```text
Next.js dev server 运行期间不要同时执行 next build。
本轮验证中曾出现 build/dev 混跑导致的 .next 静态资源和 DevTools manifest 404。
处理方式是停止 dev server，清理 .next，再重新启动 dev server。
这不是业务代码错误，但后续验收必须避免混跑。
```

## 5. 注释规范检查

本轮已补充中文注释：

```text
1. 主工作台组件说明。
2. 右侧产品能力枚举说明。
3. 左侧抽屉、右侧面板、画板布局原因说明。
4. mock 数据与 contracts 映射说明。
5. Runtime Switch 占位说明。
6. 图标按钮强制中文 aria-label 说明。
```

后续继续编码时必须保持：

```text
关键组件有中文说明。
关键状态变量解释业务含义。
关键交互函数说明后续要接哪个接口。
mock 数据说明对应 contracts 文件。
不写重复代码字面意思的废话注释。
```

## 6. 遗留事项

```text
1. 移动端横屏画板还需要按 V6 继续精修。
2. 右侧工作流面板后续要接真实 SSE 事件解析。
3. 画板工具栏后续要实现展开/收起动效。
4. Figma 同步仍需补齐。
```
