# Java Agent Service

Java 版本建议使用：

```text
Java 21
Spring Boot
Spring WebFlux / SSE
Jackson
Maven
```

第一阶段先手写 `AgentRunner`，不要一上来完全依赖 LangChain4j。

后续再接入：

- LangChain4j
- Qwen / DashScope
- 豆包 / 火山方舟
- 智谱 GLM
- MockModel

核心入口：

```text
POST /api/threads/{threadId}/runs/stream
```

