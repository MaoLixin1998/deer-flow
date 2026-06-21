# Docs

这里放 Mimic Harness 自己的架构文档。

当前已有文档：

```text
00_DOCS_CONTROL_ZH.md              # 文档总控，记录所有文档分工
01_CODE_RULES_ZH.md                # 代码规则：分层、编码、日志、注释、异常、Git
02_DEVELOPMENT_PLAN_ZH.md          # 独立开发计划
03_GLOBAL_AGENT_ARCH_RESEARCH_ZH.md # 全球先进 Java/Python Agent 方案调研与开发规划
04_AGENT_HARNESS_LAB_DESIGN_ZH.md  # Mimic Harness 总体工程化设计
05_DATA_FLOW_STORAGE_LOOP_ZH.md    # 数据流转、存储、缓存、MQ、RAG、上下文、Loop
06_FRONTEND_DESIGN_ASSET_PIPELINE_ZH.md # 前端设计、高保真原型、素材生产方案
07_DEER_FLOW_FULL_CHAIN_ZH.md      # DeerFlow 全链路阅读指南
08_LEARNING_SOURCE_REPOS_ZH.md     # resources 学习源码清单
09_PHASE_DELIVERY_PROCESS_ZH.md    # 阶段交付规范，项目级硬性流程
10_SINGLE_NODE_ENTERPRISE_ARCH_ZH.md # 单机大厂架构模拟方案
11_INTERVIEW_CLUSTER_DESIGN_ZH.md  # 面试版集群架构设计方案
12_PRODUCT_THEME_ZH.md             # 产品主题：AIGC 创意生产工作流 Agent + AgentOps 工程底座
13_NEW_THREAD_HANDOFF_PROMPT_ZH.md # 新对话续接 Prompt 与开工协议
../phases/phase-01/00_PHASE1_KICKOFF_ZH.md # Phase 1 启动和范围冻结
```

建议拆分：

```text
architecture/
  overview.md
  fallback-and-degradation.md
  multi-agent-orchestration.md
  trace-design.md
runbooks/
  local-dev.md
  model-config.md
  troubleshooting.md
learning-notes/
  agent-loop.md
  tool-calling.md
  memory.md
  rag.md
```
