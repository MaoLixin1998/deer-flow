# Mimic Harness

这是一个用于从零模仿 DeerFlow 的学习型 AI Agent Harness 项目骨架。

## 入口

从这里开始读：

[00_PROJECT_INDEX_ZH.md](./00_PROJECT_INDEX_ZH.md)

文档总控：

[docs/00_DOCS_CONTROL_ZH.md](./docs/00_DOCS_CONTROL_ZH.md)

代码规则：

[docs/01_CODE_RULES_ZH.md](./docs/01_CODE_RULES_ZH.md)

开发计划：

[docs/02_DEVELOPMENT_PLAN_ZH.md](./docs/02_DEVELOPMENT_PLAN_ZH.md)

数据流转、存储、缓存、MQ、RAG、上下文和 Loop：

[docs/05_DATA_FLOW_STORAGE_LOOP_ZH.md](./docs/05_DATA_FLOW_STORAGE_LOOP_ZH.md)

前端设计、高保真原型、图标和素材生产：

[docs/06_FRONTEND_DESIGN_ASSET_PIPELINE_ZH.md](./docs/06_FRONTEND_DESIGN_ASSET_PIPELINE_ZH.md)

每个阶段必须遵守的开发、联调、测试、验收规范：

[docs/09_PHASE_DELIVERY_PROCESS_ZH.md](./docs/09_PHASE_DELIVERY_PROCESS_ZH.md)

单机服务器如何模拟大厂架构：

[docs/10_SINGLE_NODE_ENTERPRISE_ARCH_ZH.md](./docs/10_SINGLE_NODE_ENTERPRISE_ARCH_ZH.md)

2核4G 运行版如何在面试里讲集群设计：

[docs/11_INTERVIEW_CLUSTER_DESIGN_ZH.md](./docs/11_INTERVIEW_CLUSTER_DESIGN_ZH.md)

产品主题：

[docs/12_PRODUCT_THEME_ZH.md](./docs/12_PRODUCT_THEME_ZH.md)

Phase 1 启动：

[phases/phase-01/00_PHASE1_KICKOFF_ZH.md](./phases/phase-01/00_PHASE1_KICKOFF_ZH.md)

目标不是一开始就复制 DeerFlow 的全部能力，而是按阶段实现：

1. 前端聊天 UI + SSE 流式输出。
2. Java 后端实现最小 AgentRunner。
3. Python 后端实现同构 AgentRunner。
4. 接入国产模型 Provider：Qwen、豆包、智谱、Kimi、Mock。
5. 实现工具调用、记忆、RAG、Trace、降级和 Multi-Agent。
6. 发布到云服务器 Docker，形成可访问的完整产品。

## 目录说明

```text
mimic-harness/
  00_PROJECT_INDEX_ZH.md
  contracts/          # 前后端共用协议：OpenAPI、SSE 事件、JSON Schema
  frontend/           # TypeScript + React + Next.js 前端
  services/
    java-agent/       # Spring Boot 版本
    python-agent/     # FastAPI 版本
  packages/           # 共享测试数据、prompt、eval cases
  infra/              # Docker、Nginx、可观测性
  phases/             # 每个阶段的独立生产目录
  docs/               # 架构文档、运行手册、学习笔记
```

## 中文工程规范

后续所有实现必须遵守：

- 关键类、接口、复杂分支必须写中文注释。
- 后端日志必须是中文结构化日志，方便排查链路。
- 业务异常必须使用中文消息。
- 前端错误提示必须面向用户，而不是直接展示英文异常。
- Java 和 Python 尽量保持同构命名和同构分层，方便对照学习。
