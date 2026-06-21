# AI Agent 学习源码清单

这份清单记录为了学习 AI Agent Harness 已经 fork 到你 GitHub 的源码仓库。

## 已 fork 仓库

| 用途 | 上游仓库 | 你的 Fork |
| --- | --- | --- |
| Java agent / LangChain4j 示例 | `langchain4j/langchain4j-examples` | `https://github.com/MaoLixin1998/langchain4j-examples` |
| Spring AI 示例 | `spring-projects/spring-ai-examples` | `https://github.com/MaoLixin1998/spring-ai-examples` |
| Python 最小 agent loop | `huggingface/smolagents` | `https://github.com/MaoLixin1998/smolagents` |
| 完整 Python agent harness 参考 | `openai/openai-agents-python` | `https://github.com/MaoLixin1998/openai-agents-python` |

## 建议阅读顺序

1. `langchain4j-examples`
   - 先看 Java 里如何封装 LLM、Tool、Memory、RAG。
   - 对 Java 开发者最友好。

2. `spring-ai-examples`
   - 看 Spring Boot 项目如何把 AI 能力接成 Controller / Service。
   - 重点关注 agentic patterns、MCP、RAG 示例。

3. `smolagents`
   - 看最小 agent loop：模型思考、工具调用、代码执行、最终回答。
   - 适合理解 agent 的核心循环。

4. `openai-agents-python`
   - 看完整 harness 能力：agents、tools、handoffs、guardrails、sessions、tracing、sandbox。
   - 对照我们自己的 mimic-harness 做工程拆解。

## 本地源码组织建议

不要把这些大型仓库直接复制进 DeerFlow 当前 Git 仓库。

建议后续新建一个总目录：

```text
agent-learning-workspace/
  deer-flow/
  mimic-harness/
  resources/
    langchain4j-examples/
    spring-ai-examples/
    smolagents/
    openai-agents-python/
```

这样 DeerFlow、模仿项目、学习源码三者边界清楚，不会互相污染提交历史。
