# Mimic Harness 项目总入口

> 这是 `mimic-harness` 的第一入口文件。  
> 看项目、写代码、补文档、做计划，都先从这里开始。

## 1. 项目目标

`mimic-harness` 是一个从零实现 AI Agent Harness 的学习型工程项目。

它不是简单聊天 Demo，而是要完整覆盖：

```text
前端 Chat UI
Figma 高保真设计稿
高保真代码原型
Java Agent Service
Python Agent Service
统一 Contracts
SSE 流式事件
工具调用
记忆
RAG
模型降级
Multi-Agent
Trace 可观测性
评测与测试
云服务器 Docker 发布
单机大厂架构模拟
面试集群架构表达
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

最终要形成：

```text
一个前端
两套同构后端
同一套接口协议
同一套事件协议
同一批测试用例
一套云服务器 Docker 发布方案
一套单机可运行的大厂架构模拟方案
一套可用于面试讲解的集群演进方案
一个有自己主题的 AIGC 创意生产工作流 Agent 平台
```

## 2. 顶层目录分工

```text
mimic-harness/
  00_PROJECT_INDEX_ZH.md    # 项目总入口
  README.md                 # 简短项目介绍

  contracts/                # 前后端共同协议
  frontend/                 # Next.js 前端
  services/                 # Java / Python 双后端
  packages/                 # 共享 prompt、eval、fixtures
  infra/                    # Docker、Nginx、Observability
  phases/                   # 每个阶段的独立生产目录
  docs/                     # 架构、计划、规则、调研、运行手册
```

## 3. 必读文档顺序

第一次进入项目，按这个顺序读：

0. [项目总入口](./00_PROJECT_INDEX_ZH.md)
1. [文档总控](./docs/00_DOCS_CONTROL_ZH.md)
2. [代码规则](./docs/01_CODE_RULES_ZH.md)
3. [开发计划](./docs/02_DEVELOPMENT_PLAN_ZH.md)
4. [全球方案调研](./docs/03_GLOBAL_AGENT_ARCH_RESEARCH_ZH.md)
5. [总体设计](./docs/04_AGENT_HARNESS_LAB_DESIGN_ZH.md)
6. [数据流转、存储与 Agent Loop 方案](./docs/05_DATA_FLOW_STORAGE_LOOP_ZH.md)
7. [前端设计、高保真原型与素材生产方案](./docs/06_FRONTEND_DESIGN_ASSET_PIPELINE_ZH.md)
8. [DeerFlow 全链路阅读指南](./docs/07_DEER_FLOW_FULL_CHAIN_ZH.md)
9. [学习源码清单](./docs/08_LEARNING_SOURCE_REPOS_ZH.md)
10. [阶段交付规范](./docs/09_PHASE_DELIVERY_PROCESS_ZH.md)
11. [单机大厂架构模拟方案](./docs/10_SINGLE_NODE_ENTERPRISE_ARCH_ZH.md)
12. [面试版集群架构设计方案](./docs/11_INTERVIEW_CLUSTER_DESIGN_ZH.md)
13. [产品主题：AIGC 创意生产工作流 Agent + AgentOps 工程底座](./docs/12_PRODUCT_THEME_ZH.md)
14. [新对话续接 Prompt 与开工协议](./docs/13_NEW_THREAD_HANDOFF_PROMPT_ZH.md)
15. [Phase 1 启动文档](./phases/phase-01/00_PHASE1_KICKOFF_ZH.md)

## 4. 代码入口规划

后续代码落地后，入口应该固定为：

```text
frontend/apps/web/README.md
services/java-agent/README.md
services/python-agent/README.md
contracts/README.md
```

每个子项目 README 必须说明：

```text
这个模块负责什么
从哪个文件启动
请求从哪里进来
核心类在哪里
本模块不能做什么
常用命令是什么
```

## 5. 当前阶段

当前进入 Phase 1：主题化 Contracts + Mock SSE。

注意：

```text
Phase 1 主题已确认。
需求冻结、简单设计、Contracts 先行已完成。
Phase 1.5 Figma 高保真设计稿进行中，Figma 文件已创建。
```

已完成：

- 顶层目录拆分：`deer-flow/`、`mimic-harness/`、`resources/`
- 学习源码放入 `resources/`
- Mimic Harness 初始骨架
- DeerFlow 链路文档
- 全球方案调研文档
- 工程化设计文档
- 代码规则文档
- 开发计划文档
- 产品主题确认记录
- 新对话续接 Prompt 与开工协议
- Phase 1 启动文档和生产目录

下一步：

```text
Phase 1.5：继续 Figma 高保真设计稿，完善 Creative Workbench 高保真页面、组件状态和开发标注
Figma：https://www.figma.com/design/cgPS6dmTGjDN1wxDYb9AhN
```

## 6. 协作约定

所有后续代码必须遵守：

- 中文注释优先。
- 中文结构化日志。
- 中文业务异常。
- 前端用户提示中文。
- 严格遵守阶段交付规范。
- Java/Python 同构命名。
- 先 contracts，后实现。
- 先 mock 闭环，后真实模型。
- 核心 domain 不依赖任何框架 SDK。

详细规则见：

[代码规则](./docs/01_CODE_RULES_ZH.md)

阶段流程和门禁见：

[阶段交付规范](./docs/09_PHASE_DELIVERY_PROCESS_ZH.md)
