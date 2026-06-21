# 02. Phase 1 主题确认记录

> 本文件记录 Phase 1 的产品主题选择结果。  
> 主题已经确认，完整需求范围已在 `03_PHASE_SCOPE_ZH.md` 冻结。

## 1. 确认时间

```text
2026-06-20
```

## 2. 已确认主题

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

## 3. 主题含义

产品外壳：

```text
生图
生视频
生 HTML
营销创意工作流
资产预览
合规检查
```

工程底座：

```text
Java/Python 双 Runtime
Multi-Agent
Tool Calling
Workflow
SSE
Trace
Fallback
RAG
MCP
上下文管理
单机大厂架构模拟
```

一句话定位：

```text
面向营销创意生产场景的 AI Agent 工作流平台，同时具备可观测、可降级、可扩展、Java/Python 双语言同构的 AgentOps 工程底座。
```

## 4. 为什么选择这个主题

```text
1. 贴合简历里的超级编辑器、AI 设计中台、鹿班、字体合规平台。
2. 能自然覆盖生图、生视频、生 HTML、工作流这些业务能力。
3. 能自然容纳 Multi-Agent、Tool Calling、SSE、Trace、Fallback、RAG、MCP。
4. 前端有足够可视化空间，不会变成纯聊天 Demo。
5. 后端有足够工程深度，适合 Java 开发面试表达。
6. 单机可以先 mock 跑通，后续再逐步接真实模型和中间件。
```

## 5. 仍未冻结的内容

以下内容已在 `03_PHASE_SCOPE_ZH.md` 中冻结：

```text
1. 产品展示名使用 Ninic Creative Agent Studio。
2. Phase 1 默认 Demo 使用“夏季气泡咖啡营销素材生成”。
3. Phase 1 资产卡片包含图片、视频分镜、HTML 预览、合规检查结果。
4. Java/Python Runtime 的 mock 流程必须同构。
5. 保留当前 contracts 主接口，但第 4 步按 AIGC 工作流调整字段。
6. Phase 1 的页面范围、接口范围、数据范围、异常范围和验收标准见 03_PHASE_SCOPE_ZH.md。
```

## 6. 下一步

按照 `docs/09_PHASE_DELIVERY_PROCESS_ZH.md`，下一步进入：

```text
3. 简单设计
```
