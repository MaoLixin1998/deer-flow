# Services

这里放两套同构后端：

```text
services/
  java-agent/
  python-agent/
```

两套后端必须遵守同一套分层思想：

```text
interfaces      # Controller / Router / DTO / SSE
application     # UseCase，编排业务动作
domain          # Agent、Message、Tool、Memory、Trace 等核心模型
ports           # 抽象接口：LLM、Repository、EventPublisher
infrastructure  # 具体实现：OpenAI/Qwen/DB/工具/向量库
bootstrap       # 启动类和依赖装配
common          # 错误、日志、ID、时间、JSON 工具
```

核心约束：

```text
interfaces 只能调用 application
application 只能调用 domain + ports
domain 不能依赖 Spring / FastAPI / OpenAI SDK / 数据库
infrastructure 实现 ports
bootstrap 负责组装依赖
```

当前阶段：

```text
Phase 1.8 已完成开工规划。
先按 phases/phase-01/15_PHASE1_8_BACKEND_MOCK_SSE_PLAN_ZH.md 落地 Java/Python Mock SSE。
Swagger 和可复制接口 JSON 按 phases/phase-01/16_PHASE1_8_API_MOCK_EXAMPLES_ZH.md 落地。
本阶段不接真实模型、数据库、Redis、MQ、RAG、对象存储。
```
