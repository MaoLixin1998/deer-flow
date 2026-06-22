# 09. Phase 1.6 高保真代码原型启动记录

> 本文件记录 Phase 1.6 的正式启动。  
> Phase 1.6 只做前端高保真代码原型和本地 mock 交互，不接真实后端。

## 1. 启动信息

```text
阶段：Phase 1.6
名称：高保真代码原型
启动日期：2026-06-21
上一阶段：Phase 1.5 设计基线验收
下一阶段：Phase 1.7 前端静态开发
```

## 2. 输入材料

```text
phases/phase-01/08_DESIGN_BASELINE_ACCEPTANCE_ZH.md
contracts/openapi/agent-api.yaml
contracts/events/sse-events.schema.json
contracts/schemas/*.schema.json
docs/01_CODE_RULES_ZH.md
docs/09_PHASE_DELIVERY_PROCESS_ZH.md
```

## 3. 本轮目标

```text
1. 初始化 frontend/apps/web。
2. 实现 Ninic Creative Agent Studio 主工作台静态原型。
3. 实现默认状态、左侧会话抽屉、右侧产品能力抽屉、画板展开状态。
4. 使用 mock 数据表达 Runtime、Trace、ToolCall、Assets、HTML、Compliance。
5. 保持代码分层清晰，给 Java 开发者也能看懂。
```

## 4. 验收标准

```text
1. 页面能本地启动。
2. 主界面不像普通聊天 Demo，能看出 AIGC 创意生产 Agent。
3. 左侧抽屉、右侧能力面板、画板模式可以交互切换。
4. 发送、语音、画板、素材、工作流、HTML、导出等动作使用图标。
5. 核心代码有中文注释。
6. mock 数据字段能映射到 contracts。
7. 不引入真实模型、数据库、RAG、MQ。
```
