# Phase 1 生产目录

阶段名称：

```text
主题化 Contracts + Mock SSE
```

产品主题：

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

产品展示名：

```text
Ninic Creative Agent Studio
```

本阶段必须严格按照项目级阶段交付规范：

```text
docs/09_PHASE_DELIVERY_PROCESS_ZH.md
```

本目录是 Phase 1 的规范执行记录，不是临时笔记。

## 1. 阶段流程状态

| 序号 | 步骤 | 状态 | 产物 |
| --- | --- | --- | --- |
| 0 | 阶段启动 | 已完成 | `00_PHASE1_KICKOFF_ZH.md` |
| 1 | 头脑风暴 | 已完成 | 本文件 `2. 头脑风暴候选`、`01_BRAINSTORM_RESUME_RESOURCES_ZH.md` |
| 2 | 需求冻结 | 已完成 | `03_PHASE_SCOPE_ZH.md`，产品级蓝图 + Phase 1 实施切片 + 工程模块边界 |
| 3 | 简单设计 | 已完成 | `04_SIMPLE_DESIGN_ZH.md` |
| 4 | Contracts 先行 | 已完成 | `05_CONTRACTS_BASELINE_ZH.md`、`contracts/` |
| 5 | Figma 高保真设计稿 | 已完成设计基线 | `06_FIGMA_DESIGN_HANDOFF_ZH.md`、`07_FIGMA_PHASE_START_ZH.md`、`08_DESIGN_BASELINE_ACCEPTANCE_ZH.md`、[Figma 文件](https://www.figma.com/design/cgPS6dmTGjDN1wxDYb9AhN) |
| 6 | 高保真代码原型 | 已完成 | `09_CODE_PROTOTYPE_START_ZH.md`、`10_CODE_PROTOTYPE_VALIDATION_ZH.md`、`frontend/apps/web/` |
| 7 | 前端静态开发 | 已完成 | `11_PHASE1_7_FRONTEND_STATIC_PLAN_ZH.md`、`12_PHASE1_7_FIGMA_PROTOTYPE_BASELINE_ZH.md`、`13_PHASE1_7_FRONTEND_STATIC_VALIDATION_ZH.md`、`14_PHASE1_7_CLOSURE_ACCEPTANCE_ZH.md`、`frontend/apps/web/` |
| 8 | 后端双语言并行开发 | 规划完成 | `15_PHASE1_8_BACKEND_MOCK_SSE_PLAN_ZH.md`、`16_PHASE1_8_API_MOCK_EXAMPLES_ZH.md`、`services/java-agent/`、`services/python-agent/` |
| 9 | Mock 联调 | 未开始 | 待补 |
| 10 | 真实能力接入 | 本阶段不做 | 不适用 |
| 11 | 测试与验收 | 未开始 | 待补 |
| 12 | 文档更新 | 进行中 | docs / phases |
| 13 | Git 提交与阶段复盘 | 未开始 | 待补 |

## 2. 头脑风暴候选

本阶段头脑风暴已经完成第一轮，产品主题已经确认。

当前只确认一个原则：

```text
不要做纯聊天 Demo。
不要纯复刻 DeerFlow。
要有自己的产品主题。
```

候选主题：

```text
A. AgentOps 工程工作台
B. 智能运维排障助手
C. 技术学习与面试教练
D. 企业知识库 Agent 平台
E. AIGC 创意生产工作流 Agent：生图、生视频、生 HTML、工作流
```

基于简历 4 个项目和 `resources/` 学习源码的二次脑暴，已确认主题：

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

说明：

```text
主题已确认。
完整需求范围已冻结，见 03_PHASE_SCOPE_ZH.md。
详细分析见：01_BRAINSTORM_RESUME_RESOURCES_ZH.md
主题确认见：02_THEME_DECISION_ZH.md
需求冻结见：03_PHASE_SCOPE_ZH.md
```

候选核心能力：

```text
Runtime Switch
Mock SSE
Trace Timeline
模型选择占位
工具调用占位
中文错误状态
生图任务卡片
生视频任务卡片
HTML 预览卡片
工作流步骤追踪
```

## 3. 需求冻结结论

已冻结：

```text
1. 产品展示名：Ninic Creative Agent Studio。
2. 默认 Demo：夏季气泡咖啡营销素材生成。
3. 产品级能力域：16 个。
4. 产品级主要页面：18 个。
5. 产品级接口蓝图：131 个。
6. Phase 1 可运行页面：`/`、`/settings`。
7. Phase 1 静态占位页面：Campaigns、Runs、Assets、Workflows、Agents、Tools、Models、Knowledge、Prompts、Observability、Evals、Deploy。
8. Phase 1 mock 生图、生视频分镜、生 HTML、合规检查四类资产。
9. Java/Python Runtime mock 流程必须同构。
10. 前端按 app / features / entities / shared 分层。
11. Java/Python 后端把 interfaces / application / domain / ports / infrastructure / bootstrap / common 做成层级 modules。
12. Contracts 按产品能力域组织 tag 和 schema。
```

## 4. 需求冻结

状态：

```text
已冻结。
```

冻结范围：

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
Ninic Creative Agent Studio
夏季气泡咖啡营销素材生成
16 个产品能力域
18 个主要页面
131 个产品接口蓝图
前端工程模块边界
Java/Python 后端同构层级 modules 边界
Contracts 能力域边界
OpenAPI
SSE 事件协议
Message / Run / Trace JSON Schema
前端高保真静态原型
Java mock SSE Runtime
Python mock SSE Runtime
前后端 mock 联调
```

本阶段不做：

```text
真实模型
登录鉴权
真实数据库持久化
真实工具调用
真实 RAG
真实 MQ
云服务器部署
```

## 5. 简单设计

状态：

```text
已完成。
```

设计产物：

```text
04_SIMPLE_DESIGN_ZH.md
```

设计已明确：

```text
前端 app / features / entities / shared 结构
前端工作台粗线框图
Java Maven modules
Python package modules
Phase 1 M 接口清单
SSE 主链路
数据流转
错误处理
Trace 和日志点
```

## 6. Contracts 基线登记

当前正式基线：

```text
contracts/openapi/agent-api.yaml
contracts/events/sse-events.md
contracts/events/sse-events.schema.json
contracts/schemas/runtime.schema.json
contracts/schemas/model.schema.json
contracts/schemas/campaign.schema.json
contracts/schemas/message.schema.json
contracts/schemas/run.schema.json
contracts/schemas/trace.schema.json
contracts/schemas/tool.schema.json
contracts/schemas/asset.schema.json
contracts/schemas/html-preview.schema.json
contracts/schemas/compliance.schema.json
contracts/schemas/error.schema.json
```

注意：

```text
这些 contracts 已经按 04_SIMPLE_DESIGN_ZH.md 调整为 Phase 1 正式基线。
前端、Java Runtime、Python Runtime 必须共同遵守。
```

设计基线：

```text
Phase 1.5 已完成 SVG 高保真设计基线验收。
由于 Figma Starter 页面和调用额度限制，本阶段允许先以 SVG 基线进入 Phase 1.6。
Figma 同步仍是后续补齐项，不能取消。
```

## 7. 当前下一步

```text
第 6 步：高保真代码原型已完成。
第 7 步：前端静态开发已完成，封版产物为 14_PHASE1_7_CLOSURE_ACCEPTANCE_ZH.md。
当前前端界面已固化到 Figma，记录产物为 12_PHASE1_7_FIGMA_PROTOTYPE_BASELINE_ZH.md。
第一轮静态工程化拆分已完成：`PlanningHat`、`ComposerBox`。
第二轮静态工程化拆分已完成：`ConversationListPanel`。
第三轮静态工程化拆分已完成：`RightCapabilityPanel`。
第四轮静态工程化拆分已完成：`CanvasPane`。
第五轮静态工程化拆分已完成：`ConversationPane`、`SideStagePane`，`CreativeWorkbenchPage` 已收敛为总控文件。
第六轮静态工程化拆分已完成：`mockData` 拆分为实体类型和分领域 mock 文件。
第七轮静态工程化拆分已完成：`creative-run` 聚合实体拆分为 `message`、`asset`、`trace`、`tool`。
第八轮静态工程化拆分已完成：工作台总控状态和行为抽到 `workbenchState.ts`、`workbenchActions.ts`。
第九轮静态工程化拆分已完成：补齐 `shared/api` 与 `shared/sse` 联调壳。
第十轮静态工程化拆分已完成：补齐 `runReducer.ts`，让 SSE 事件有明确的前端状态落点。
拆分记录统一登记在 `13_PHASE1_7_FRONTEND_STATIC_VALIDATION_ZH.md`。
Phase 1.7 封版验收登记在 `14_PHASE1_7_CLOSURE_ACCEPTANCE_ZH.md`。
```

下一步进入 Phase 1.8：后端双语言并行开发。
先做 Java Runtime 和 Python Runtime 的 Mock SSE，不接真实模型、数据库、RAG、MQ。
前端只接 `shared/sse/runStream.ts` 和 `features/workbench/model/runReducer.ts`，避免接口逻辑散进组件。
Phase 1.8 开工规划已登记在 `15_PHASE1_8_BACKEND_MOCK_SSE_PLAN_ZH.md`。
Phase 1.8 接口 Mock 参数与可复制 JSON 已登记在 `16_PHASE1_8_API_MOCK_EXAMPLES_ZH.md`。
