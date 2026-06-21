# Python Agent Service

Python 版本建议使用：

```text
Python 3.12+
FastAPI
Pydantic
sse-starlette
uv
```

第一阶段同样手写 `AgentRunner`，和 Java 保持同构。

后续再升级：

- LangGraph
- LiteLLM
- Qwen / DashScope
- 豆包 / 火山方舟
- 智谱 GLM
- MockModel

核心入口：

```text
POST /api/threads/{threadId}/runs/stream
```

