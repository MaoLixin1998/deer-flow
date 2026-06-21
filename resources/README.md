# Resources

这里放 AI Agent Harness 学习用的外部源码。

这些仓库都是从你的 GitHub fork 克隆下来的浅克隆副本，用于阅读、加注释、做对照学习，不直接和 `deer-flow/` 或 `mimic-harness/` 的业务代码混在一起。

## 源码清单

```text
resources/
  langchain4j-examples/      # Java / LangChain4j 学习源码
  spring-ai-examples/        # Spring AI 学习源码
  smolagents/                # Python 最小 agent loop 学习源码
  openai-agents-python/      # Python 完整 agent harness 参考
```

## 学习方式

建议不要一上来全读。

阅读顺序：

1. `langchain4j-examples`：先建立 Java 侧 LLM、Tool、Memory、RAG 的感觉。
2. `spring-ai-examples`：看 Spring Boot 应用如何组织 AI 能力。
3. `smolagents`：看最小 agent loop，理解模型如何调工具。
4. `openai-agents-python`：看完整 harness 的 agents、tools、handoffs、guardrails、sessions、tracing、sandbox。

## 注释规范

如果后续给这些学习源码加注释，要求：

- 不改核心逻辑。
- 只在关键入口、关键抽象、关键链路旁边加中文注释。
- 每个仓库单独提交，避免和 `mimic-harness` 的实现混在一起。

