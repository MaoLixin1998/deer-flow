# 新对话续接 Prompt 与开工协议

> 本文件用于每个 Phase 新开对话时续接上下文。  
> 新对话开始后，先把本文件中的 Prompt 复制给 Codex。  
> 目标是让新对话先读规则、读计划、读当前 Phase 生产目录，再开始工作，避免忘记代码规范和阶段流程。

## 1. 使用场景

适用于：

```text
1. 每个 Phase 新开一个 Codex 对话。
2. 长对话上下文变多，需要换新对话继续。
3. 准备进入需求冻结、简单设计、编码、联调、测试、发布等关键节点。
4. 让 Codex 快速恢复项目规则、当前状态和下一步工作。
```

不适用于：

```text
随便问一个概念问题。
临时查一个命令。
不打算继续当前项目工作。
```

## 2. 新对话必须先做什么

新对话不能直接写代码。

必须先做：

```text
1. 确认当前工作区是 /Users/mao/Documents/Codex/deer_flow。
2. 读取 mimic-harness/00_PROJECT_INDEX_ZH.md。
3. 读取 mimic-harness/docs/00_DOCS_CONTROL_ZH.md。
4. 读取 mimic-harness/docs/01_CODE_RULES_ZH.md。
5. 读取 mimic-harness/docs/09_PHASE_DELIVERY_PROCESS_ZH.md。
6. 读取 mimic-harness/docs/02_DEVELOPMENT_PLAN_ZH.md。
7. 读取 mimic-harness/docs/12_PRODUCT_THEME_ZH.md。
8. 读取当前 Phase 的 phases/phase-xx/ 文档。
9. 如当前 Phase 依赖上一 Phase，读取上一 Phase 的 README、验收记录、复盘记录。
10. 再根据任务读取 contracts、frontend、services、infra 等对应模块 README。
```

## 3. 必须记住的项目规则

新对话必须始终遵守：

```text
1. 09_PHASE_DELIVERY_PROCESS_ZH.md 是硬性流程，不是建议。
2. 01_CODE_RULES_ZH.md 是硬性代码规范，不是建议。
3. 没有完成头脑风暴、需求冻结、简单设计，不允许写业务代码。
4. Contracts 没有先行，不允许前后端并行开发。
5. Mock 联调没跑通，不允许接真实模型、真实数据库、RAG、MQ。
6. 每个 Phase 必须有独立生产目录：mimic-harness/phases/phase-xx/。
7. 生产源码放 contracts/、frontend/、services/、infra/，Phase 目录记录为什么做、做了什么、怎么验收。
8. Java/Python 后端必须同构：同接口、同事件、同字段、同错误语义。
9. 先 mock 跑通，再接真实能力。
10. 必须中文注释、中文日志、中文异常、中文前端提示。
11. TSX/CSS/Tailwind 注释必须写清楚管理哪个页面区域、调用哪个接口或 mock、修改关键值会影响什么。
12. 代码不能只做 Demo，要能讲工程化。
13. 用户没有明确冻结需求前，不能擅自替用户拍板进入编码。
```

## 4. 当前项目核心事实

新对话必须知道：

```text
项目根目录：/Users/mao/Documents/Codex/deer_flow
学习源码目录：resources/
DeerFlow 源码目录：deer-flow/
自研项目目录：mimic-harness/
```

自研项目主题已经确认：

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

项目定位：

```text
面向营销创意生产场景的 AI Agent 工作流平台，
同时具备可观测、可降级、可扩展、Java/Python 双语言同构的 AgentOps 工程底座。
```

产品能力方向：

```text
生图
生视频
生 HTML
工作流编排
资产预览
合规检查
Trace 可观测
模型降级
Multi-Agent
RAG
MCP
单机大厂架构模拟
云服务器 Docker 发布
```

## 5. 可直接复制的新对话 Prompt

下面这段是新对话开场直接复制用的 Prompt。

```text
你现在接手 /Users/mao/Documents/Codex/deer_flow 这个工作区中的 mimic-harness 项目。

请先不要写代码，也不要直接给方案。你必须先按项目规范恢复上下文。

项目结构：
- deer-flow/：学习用 DeerFlow 源码。
- resources/：学习用外部源码，包括 langchain4j-examples、spring-ai-examples、smolagents、openai-agents-python。
- mimic-harness/：我们自研的 Java + Python + 前端 AI Agent 项目。

已确认产品主题：
AIGC 创意生产工作流 Agent + AgentOps 工程底座。

项目定位：
面向营销创意生产场景的 AI Agent 工作流平台，同时具备可观测、可降级、可扩展、Java/Python 双语言同构的 AgentOps 工程底座。

你必须先阅读这些文档：
1. mimic-harness/00_PROJECT_INDEX_ZH.md
2. mimic-harness/docs/00_DOCS_CONTROL_ZH.md
3. mimic-harness/docs/01_CODE_RULES_ZH.md
4. mimic-harness/docs/09_PHASE_DELIVERY_PROCESS_ZH.md
5. mimic-harness/docs/02_DEVELOPMENT_PLAN_ZH.md
6. mimic-harness/docs/12_PRODUCT_THEME_ZH.md
7. 当前 Phase 对应的 mimic-harness/phases/phase-xx/ 文档
8. 如果当前 Phase 依赖上一 Phase，必须阅读上一 Phase 的 README、验收记录、复盘记录
9. 根据本次任务，再读取 contracts/、frontend/、services/、infra/ 下相关 README 和源码

你必须遵守：
1. mimic-harness/docs/09_PHASE_DELIVERY_PROCESS_ZH.md 是硬性阶段流程，不是建议。
2. mimic-harness/docs/01_CODE_RULES_ZH.md 是硬性代码规范，不是建议。
3. 没有完成头脑风暴、需求冻结、简单设计，不允许写业务代码。
4. Contracts 没有先行，不允许前后端并行开发。
5. Mock 联调没跑通，不允许接真实模型、真实数据库、RAG、MQ。
6. 每个 Phase 必须有独立生产目录：mimic-harness/phases/phase-xx/。
7. 生产源码放 contracts/、frontend/、services/、infra/，Phase 目录只记录阶段过程、产物、验收和复盘。
8. Java/Python 后端必须同构：同接口、同事件、同字段、同错误语义。
9. 先 mock 跑通，再接真实能力。
10. 必须中文注释、中文结构化日志、中文业务异常、中文前端提示。
11. TSX/CSS/Tailwind 注释必须写清楚管理哪个页面区域、调用哪个接口或 mock、修改关键值会影响什么布局、交互或数据流。
12. 前端要做真实可用的高保真工作台，不做营销首页，不做纯聊天 Demo。
13. 用户没有明确冻结需求前，不能擅自替用户拍板进入编码。
14. 修改文件前先说明你要改什么；修改后必须做检查并汇报。

你读取完文档后，请先输出：
1. 当前 Phase 是什么。
2. 当前 Phase 已完成什么。
3. 当前 Phase 卡在哪一步。
4. 本次任务应该属于 09 流程中的哪一步。
5. 你准备读取或修改哪些文件。
6. 是否可以开始执行。

我的本次任务是：
【在这里填写这次要做的事，例如：继续 Phase 1 需求冻结 / 开始 Phase 2 简单设计 / 修复前端联调问题 / 补测试验收记录】
```

## 6. Phase 开工检查表

每个 Phase 开工前，Codex 必须确认：

```text
1. 是否存在 mimic-harness/phases/phase-xx/。
2. 是否存在 mimic-harness/phases/phase-xx/00_PHASEX_KICKOFF_ZH.md。
3. 是否已经读过 01_CODE_RULES_ZH.md。
4. 是否已经读过 09_PHASE_DELIVERY_PROCESS_ZH.md。
5. 是否知道当前 Phase 处于 0-12 哪一步。
6. 是否知道本阶段不做什么。
7. 是否知道本阶段验收标准草案。
8. 是否知道本阶段会影响哪些 contracts。
9. 是否知道 Java/Python/frontend 哪些模块要改。
10. 是否知道要补哪些文档。
```

## 7. Phase 收尾检查表

每个 Phase 收尾前，Codex 必须确认：

```text
1. 需求冻结文档已更新。
2. 简单设计文档已更新。
3. Contracts 已登记。
4. 前端产物已登记。
5. Java 后端产物已登记。
6. Python 后端产物已登记。
7. Mock 联调记录已补。
8. 测试和验收记录已补。
9. 文档总控和项目入口已更新。
10. Git 状态已检查。
11. 阶段复盘已补。
```

## 8. 常见错误提醒

新对话最容易犯的错误：

```text
1. 忘记 09 文档，直接写代码。
2. 忘记 01 文档，日志、异常、注释没有中文。
3. 忘记读取上一个 Phase 的验收记录。
4. 把 Phase 目录当源码目录。
5. 跳过 Figma 设计稿，直接写前端页面。
6. 前端先写死字段，后端再迁就前端。
7. TSX/CSS 只写“这是按钮”这类废话注释，没有说明区域、接口和改值影响。
8. Java/Python 命名不一致。
9. 真实模型接太早，mock 链路没跑通。
10. 只做页面，没有 contracts、后端、测试和验收。
11. 修改了文档但没更新总控。
12. 用户还没确认，就把草案写成最终结论。
```

## 9. 当前推荐下一步

当前 Phase 1 状态：

```text
主题已确认。
需求冻结已完成。
简单设计已完成。
Contracts 基线已完成。
Phase 1.5 Figma 高保真设计稿进行中。
Figma 文件：https://www.figma.com/design/cgPS6dmTGjDN1wxDYb9AhN
```

下一步应该先产出：

```text
mimic-harness/phases/phase-01/06_FIGMA_DESIGN_HANDOFF_ZH.md
Figma 高保真设计稿文件
```

内容包括：

```text
Figma 设计系统
Creative Workbench 核心页面
Runtime Settings 核心页面
静态占位页面模板
组件 variants
接口和 schema 字段标注
中文空状态、加载状态、错误状态
开发 handoff 清单
```
