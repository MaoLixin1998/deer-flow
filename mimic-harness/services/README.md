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

