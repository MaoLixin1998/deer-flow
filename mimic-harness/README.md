# Mimic Harness

`mimic-harness` 是一个面向学习和面试讲解的 AI Agent Harness 工程项目。

它不是纯聊天 Demo，也不是简单复刻 DeerFlow。当前产品主题是：

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

产品展示名：

```text
Ninic Creative Agent Studio
```

目标是用一个能跑通的中型项目，逐步实现：

```text
前端工作台
统一 Contracts
Java Agent Runtime
Python Agent Runtime
Mock SSE 流式链路
工具调用
Trace 可观测性
模型降级
Multi-Agent
RAG / 记忆 / 上下文
Docker 单机部署
面试可讲的集群架构方案
```

## 1. 当前阶段

当前处于 Phase 1：

```text
主题化 Contracts + Mock SSE
```

Phase 1 目标：

```text
1. 确认产品主题和需求边界。
2. 先定义前后端共同协议。
3. 做出高保真前端代码原型。
4. 后续接 Java / Python 双 Runtime 的 Mock SSE。
```

当前已完成：

```text
头脑风暴
需求冻结
简单设计
Contracts 先行
Figma / SVG 设计基线
前端高保真代码原型进行中
```

当前前端原型已经包含：

```text
左侧可拖拽会话列表
中间 Agent 对话工作区
输入框内置上传、智能规划、语音、发送按钮
输入框上方规划帽子
规划帽子可展开为待办列表
右侧可拖拽产品能力面板
右侧素材 / 工作流 / 网页 / 导出能力
画板展开态
画板内悬浮工具组
画板和对话区联动推拉
```

## 2. 快速启动前端

进入前端目录：

```bash
cd mimic-harness/frontend/apps/web
```

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
如果先执行 npm run build，再启动 npm run dev，建议删除 .next 后再启动。
Next.js 的 build/dev 缓存混用时，可能出现本地运行时异常。
```

## 3. 顶层目录

```text
mimic-harness/
  00_PROJECT_INDEX_ZH.md    # 项目总入口，第一次看项目先读这里
  README.md                 # 当前文件

  contracts/                # 前端、Java、Python 共同遵守的协议
  docs/                     # 项目规则、规划、架构、流程和学习文档
  frontend/                 # 前端工程
  infra/                    # Docker、Nginx、可观测性、部署脚本
  packages/                 # 共享 prompt、fixtures、eval cases
  phases/                   # 每个 Phase 的独立生产目录和交付记录
  services/                 # Java / Python 双后端
```

## 4. 关键入口文件

项目总控：

```text
00_PROJECT_INDEX_ZH.md
```

代码规则：

```text
docs/01_CODE_RULES_ZH.md
```

阶段交付流程：

```text
docs/09_PHASE_DELIVERY_PROCESS_ZH.md
```

Phase 1 生产目录：

```text
phases/phase-01/README.md
```

Contracts：

```text
contracts/README.md
contracts/openapi/agent-api.yaml
contracts/events/sse-events.md
contracts/events/sse-events.schema.json
contracts/schemas/
```

前端入口：

```text
frontend/apps/web/README.md
frontend/apps/web/src/app/page.tsx
frontend/apps/web/src/features/workbench/components/CreativeWorkbenchPage.tsx
```

双后端入口：

```text
services/java-agent/README.md
services/python-agent/README.md
```

## 5. 工程分层

前端分层：

```text
frontend/apps/web/src/
  app/          # Next.js 路由入口
  features/     # 业务功能，例如 workbench、settings
  entities/     # 领域实体类型
  shared/       # 共享 UI、工具函数、配置
```

Java / Python 后端必须保持同构分层：

```text
interfaces       # Controller / Router / DTO / SSE
application      # UseCase，负责任务编排
domain           # Agent / Message / Tool / Memory / Trace 核心模型
ports            # LLM、Repository、EventPublisher 等抽象接口
infrastructure   # 数据库、模型 SDK、工具、向量库等具体实现
bootstrap        # 启动类和依赖装配
common           # 错误、日志、ID、时间、JSON 工具
```

核心约束：

```text
interfaces 只能调用 application。
application 只能调用 domain + ports。
domain 不允许依赖 Spring、FastAPI、数据库、模型 SDK。
infrastructure 实现 ports。
bootstrap 负责组装依赖。
```

## 6. 代码规范

本项目是面向小白学习和面试复盘的工程项目，所以代码必须可读。

必须遵守：

```text
1. 关键类、接口、字段、复杂分支必须写中文注释。
2. 前端用户可见文案必须中文。
3. 后端日志必须是中文结构化日志。
4. 业务异常必须使用中文消息。
5. Java 和 Python 尽量保持同构命名。
6. 先写 contracts，再写实现。
7. 先跑通 mock 闭环，再接真实模型。
8. 不在代码里保存真实 API Key。
9. 不做和当前 Phase 无关的大重构。
10. Git 提交要能说明本次改了什么、为什么改。
```

详细规范见：

```text
docs/01_CODE_RULES_ZH.md
```

## 7. 当前不做什么

Phase 1 暂不做：

```text
真实模型调用
真实登录鉴权
真实数据库持久化
真实 RAG
真实 MQ
真实对象存储
真实云服务器发布
```

这些能力会在后续 Phase 逐步接入。

## 8. 推荐阅读顺序

第一次接手项目，按这个顺序读：

```text
1. 00_PROJECT_INDEX_ZH.md
2. docs/01_CODE_RULES_ZH.md
3. docs/09_PHASE_DELIVERY_PROCESS_ZH.md
4. docs/12_PRODUCT_THEME_ZH.md
5. phases/phase-01/README.md
6. phases/phase-01/03_PHASE_SCOPE_ZH.md
7. phases/phase-01/04_SIMPLE_DESIGN_ZH.md
8. phases/phase-01/05_CONTRACTS_BASELINE_ZH.md
9. frontend/apps/web/README.md
```

如果是新对话续接，先读：

```text
docs/13_NEW_THREAD_HANDOFF_PROMPT_ZH.md
```

## 9. 面试讲解主线

这个项目后续可以按下面方式讲：

```text
我从一个 AIGC 创意生产 Agent 场景切入，
先做产品主题和需求冻结，
再定义统一 Contracts，
然后用 Next.js 做高保真工作台，
后端用 Java 和 Python 各实现一套同构 Runtime，
通过 SSE 把 Agent Loop 的规划、工具调用、观察、复盘过程推给前端，
并用 Trace、日志、降级、Multi-Agent、RAG 和 Docker 部署逐步补齐工程化能力。
```

核心亮点：

```text
1. 不是单点 Demo，而是按阶段演进的工程项目。
2. 前后端先协议后实现。
3. Java / Python 双 Runtime 同构。
4. 前端能展示 Agent 的过程和产物，而不是只展示聊天文本。
5. 单机 2 核 4G 可运行，同时能讲清楚集群演进方案。
```
