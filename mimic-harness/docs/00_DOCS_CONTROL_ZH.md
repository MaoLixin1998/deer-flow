# 文档总控

> 这个文件是 `mimic-harness` 的文档目录总控。  
> 它记录每个文档的职责边界，避免文档越写越乱。

## 1. 文档分层

```text
00_PROJECT_INDEX_ZH.md              # 项目总入口，放在 mimic-harness 根目录
docs/
  00_DOCS_CONTROL_ZH.md             # 文档总控
  01_CODE_RULES_ZH.md               # 代码规则
  02_DEVELOPMENT_PLAN_ZH.md         # 独立开发计划
  03_GLOBAL_AGENT_ARCH_RESEARCH_ZH.md # 全球方案调研
  04_AGENT_HARNESS_LAB_DESIGN_ZH.md # 总体工程设计
  05_DATA_FLOW_STORAGE_LOOP_ZH.md   # 数据流转、存储、缓存、MQ、RAG、上下文、Loop
  06_FRONTEND_DESIGN_ASSET_PIPELINE_ZH.md # 前端设计、高保真原型、素材生产
  07_DEER_FLOW_FULL_CHAIN_ZH.md     # DeerFlow 全链路阅读
  08_LEARNING_SOURCE_REPOS_ZH.md    # resources 学习源码清单
  09_PHASE_DELIVERY_PROCESS_ZH.md   # 阶段交付规范，项目级硬性流程
  10_SINGLE_NODE_ENTERPRISE_ARCH_ZH.md # 单机大厂架构模拟方案
  11_INTERVIEW_CLUSTER_DESIGN_ZH.md # 面试版集群架构设计方案
  12_PRODUCT_THEME_ZH.md            # 产品主题和差异化定位
  13_NEW_THREAD_HANDOFF_PROMPT_ZH.md # 新对话续接 Prompt 与开工协议
phases/
  README.md                         # 阶段生产目录说明
  phase-01/README.md                # Phase 1 生产目录
  phase-01/00_PHASE1_KICKOFF_ZH.md  # Phase 1 启动和范围冻结
```

## 2. 各文档职责

| 文档 | 职责 | 不应该写什么 |
| --- | --- | --- |
| `00_PROJECT_INDEX_ZH.md` | 项目总入口，告诉读者从哪里开始 | 不展开详细架构细节 |
| `00_DOCS_CONTROL_ZH.md` | 管理文档分工和维护规则 | 不写业务设计正文 |
| `01_CODE_RULES_ZH.md` | 分层、编码、日志、注释、异常、Git 规则 | 不写阶段计划 |
| `02_DEVELOPMENT_PLAN_ZH.md` | 开发阶段、任务拆分、验收标准 | 不写长篇技术调研 |
| `03_GLOBAL_AGENT_ARCH_RESEARCH_ZH.md` | 调研全球 Java/Python 先进方案 | 不写每日开发任务 |
| `04_AGENT_HARNESS_LAB_DESIGN_ZH.md` | Mimic Harness 总体架构设计 | 不写具体排期 |
| `05_DATA_FLOW_STORAGE_LOOP_ZH.md` | 数据流、主库、缓存、MQ、RAG、上下文和 Loop 方案 | 不写具体代码实现 |
| `06_FRONTEND_DESIGN_ASSET_PIPELINE_ZH.md` | 前端设计、高保真原型、图标、图片、视频、音频素材生产方案 | 不写后端业务实现 |
| `07_DEER_FLOW_FULL_CHAIN_ZH.md` | 解释 DeerFlow 前后端链路 | 不写 Mimic Harness 代码规则 |
| `08_LEARNING_SOURCE_REPOS_ZH.md` | 记录 `resources/` 学习源码 | 不写 Mimic Harness 详细架构 |
| `09_PHASE_DELIVERY_PROCESS_ZH.md` | 阶段交付规范：每个 Phase 从脑暴到验收、提交、复盘的硬性流程 | 不写具体阶段业务方案 |
| `10_SINGLE_NODE_ENTERPRISE_ARCH_ZH.md` | 单机服务器上如何模拟大厂架构和中间件分层 | 不写具体业务代码 |
| `11_INTERVIEW_CLUSTER_DESIGN_ZH.md` | 2核4G 运行版如何在面试中讲成可演进的集群架构 | 不要求本机真实跑集群 |
| `12_PRODUCT_THEME_ZH.md` | 产品主题、命名体系、和 DeerFlow 的差异化 | 不写阶段排期 |
| `13_NEW_THREAD_HANDOFF_PROMPT_ZH.md` | 每个新对话如何续接上下文、必须读取哪些文档、必须遵守哪些流程 | 不写具体业务设计 |
| `phases/phase-01/README.md` | Phase 1 按 09 流程生产了什么、当前进度、产物登记 | 不放长期通用架构说明 |
| `phases/phase-01/00_PHASE1_KICKOFF_ZH.md` | Phase 1 的阶段启动、范围、不做清单和验收标准 | 不写后续 Phase 细节 |

## 3. 推荐阅读路径

### 3.1 新人阅读路径

```text
00_PROJECT_INDEX_ZH.md
  -> docs/00_DOCS_CONTROL_ZH.md
  -> docs/01_CODE_RULES_ZH.md
  -> docs/02_DEVELOPMENT_PLAN_ZH.md
  -> docs/04_AGENT_HARNESS_LAB_DESIGN_ZH.md
  -> docs/05_DATA_FLOW_STORAGE_LOOP_ZH.md
  -> docs/06_FRONTEND_DESIGN_ASSET_PIPELINE_ZH.md
  -> docs/09_PHASE_DELIVERY_PROCESS_ZH.md
  -> docs/10_SINGLE_NODE_ENTERPRISE_ARCH_ZH.md
  -> docs/11_INTERVIEW_CLUSTER_DESIGN_ZH.md
  -> docs/12_PRODUCT_THEME_ZH.md
  -> docs/13_NEW_THREAD_HANDOFF_PROMPT_ZH.md
  -> phases/phase-01/00_PHASE1_KICKOFF_ZH.md
```

### 3.2 开发前阅读路径

```text
docs/01_CODE_RULES_ZH.md
  -> docs/02_DEVELOPMENT_PLAN_ZH.md
  -> contracts/README.md
  -> 当前要开发模块的 README
```

### 3.3 学习 DeerFlow 阅读路径

```text
docs/07_DEER_FLOW_FULL_CHAIN_ZH.md
  -> deer-flow/frontend/src/core/threads/hooks.ts
  -> deer-flow/backend/app/gateway/services.py
  -> deer-flow/backend/packages/harness/deerflow/runtime/runs/worker.py
  -> deer-flow/backend/packages/harness/deerflow/agents/lead_agent/agent.py
```

### 3.4 学习外部源码阅读路径

```text
docs/08_LEARNING_SOURCE_REPOS_ZH.md
  -> resources/langchain4j-examples
  -> resources/spring-ai-examples
  -> resources/smolagents
  -> resources/openai-agents-python
```

## 4. 文档维护规则

1. 新增文档必须先在本文件登记。
2. 长期文档必须带两位编号，例如 `01_CODE_RULES_ZH.md`。
3. 长期文档放 `docs/`，项目入口放根目录。
4. 代码模块内的说明放对应模块 README。
5. 不要把同一类内容写到多个文件里。
6. 调研内容和开发计划必须分开。
7. 规则类文档必须短句明确，不能写成散文。
8. 文档中引用本地文件必须使用相对路径。
9. 每次大结构调整后，必须同步更新：

```text
00_PROJECT_INDEX_ZH.md
docs/00_DOCS_CONTROL_ZH.md
docs/README.md
```

## 5. 编号规则

```text
00 入口、总控、必须先读的文件
01 代码规则
02 开发计划
03 调研材料
04 架构设计
05 数据流转、存储与 Loop
06 前端设计与素材生产
07 源码学习链路
08 外部学习资源
09 阶段交付规范
10 单机大厂架构模拟
11 面试集群架构表达
12 产品主题
13 新对话续接 Prompt
phase-xx 阶段执行文档
```

## 6. 后续建议拆分

当文档继续变大时，再拆这些文件：

```text
docs/architecture/OVERVIEW_ZH.md
docs/architecture/FALLBACK_ZH.md
docs/architecture/MULTI_AGENT_ZH.md
docs/architecture/TRACE_ZH.md
docs/runbooks/LOCAL_DEV_ZH.md
docs/runbooks/TROUBLESHOOTING_ZH.md
docs/learning/AGENT_LOOP_ZH.md
docs/learning/RAG_ZH.md
```

当前阶段不急着拆，先保证总控清晰。
