# 产品主题确认记录

> 本文件记录 `mimic-harness` 的产品主题。  
> 主题已经确认，Phase 1 的完整需求范围已经冻结。

## 0. 当前状态

```text
状态：主题已确认
结论：AIGC 创意生产工作流 Agent + AgentOps 工程底座
下一步：进入 Phase 1 简单设计
```

## 0.1 已确认主题

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

一句话定位：

```text
面向营销创意生产场景的 AI Agent 工作流平台，同时具备可观测、可降级、可扩展、Java/Python 双语言同构的 AgentOps 工程底座。
```

产品展示名：

```text
Ninic Creative Agent Studio
```

## 1. 历史候选 A：Ninic AgentOps Studio

产品展示名：

```text
Ninic AgentOps Studio
```

代码仓库名：

```text
mimic-harness
```

一句话定位候选：

```text
一个面向 Java 开发者的 AI Agent 工程工作台，用来学习、调试、观测和部署 Java/Python 双 Runtime Agent。
```

## 2. 共同前提：不是 DeerFlow 复刻

DeerFlow 的价值：

```text
学习生产级 AI Agent 项目的链路、分层、运行时和前后端协作方式。
```

候选 A 的价值：

```text
用自己的主题，把 AI Agent 工程化能力从零做出来。
重点不是复刻页面，而是理解并实现 Agent Harness 的核心工程能力。
```

差异：

| 维度 | DeerFlow 学习对象 | 候选 A：Ninic AgentOps Studio |
| --- | --- | --- |
| 产品定位 | 通用 Agent / Research Flow | AgentOps 工程工作台 |
| 目标用户 | AI Agent 使用者 | Java 开发者、AI Agent 学习者、面试准备者 |
| 核心体验 | 让 Agent 完成任务 | 看懂 Agent 如何运行、调试和部署 |
| 前端重点 | 聊天和工作流 | 聊天 + Trace + Runtime + Tool + Deploy |
| 后端重点 | 生产级实现参考 | Java/Python 双版本同构实现 |

## 3. 候选 A 主题关键词

主题关键词：

```text
AgentOps
工程工作台
运行轨迹
模型路由
工具调用
双 Runtime
可观测性
单机大厂架构模拟
面试可讲
```

视觉气质：

```text
清晰
克制
专业
工程感
适合长时间使用
像开发者控制台，不像营销官网
```

不要做成：

```text
纯聊天页面
营销首页
炫酷大屏
全紫蓝科技风
只有 UI 没有工程链路
```

## 4. 候选 A 核心故事线

用户进入系统后，不只是“问 AI 一个问题”。

完整体验应该是：

```text
我发起一次 Agent Run
  -> 我选择 Java 或 Python Runtime
  -> 我选择模型 Provider
  -> 我看到 SSE 流式回复
  -> 我看到模型调用、工具调用、TraceEvent
  -> 我看到是否触发降级
  -> 我能查看会话、知识库、工具、部署状态
  -> 我能用这套项目讲清楚 AI Agent 工程化架构
```

## 5. 可选主题方向

### 5.1 方向 A：AgentOps 工程工作台

适合：

```text
学习 AI Agent 工程化
面试讲架构
展示 Java/Python 双 Runtime
突出 Trace、工具、RAG、降级、部署
```

缺点：

```text
业务场景偏工程化，普通用户感知不强。
```

### 5.2 方向 B：智能运维排障助手

适合：

```text
Java 开发者背景
日志分析
异常排查
服务健康检查
面试容易讲业务价值
```

缺点：

```text
主题更窄，后续 RAG、Multi-Agent 要围绕运维展开。
```

### 5.3 方向 C：技术学习与面试教练

适合：

```text
你当前学习目标
源码阅读
项目讲解
面试问答
学习计划
```

缺点：

```text
工程链路不如 AgentOps/运维场景自然。
```

### 5.4 方向 D：企业知识库 Agent 平台

适合：

```text
RAG
文件上传
权限
知识检索
多 Agent 协作
```

缺点：

```text
第一阶段容易变成普通知识库，工程调试特色弱。
```

### 5.5 方向 E：AIGC 创意生产工作流 Agent

适合：

```text
适配简历里的 AI Agent 项目。
覆盖生图、生视频、生 HTML。
可以设计成从需求到素材到页面的完整工作流。
更容易展示多 Agent、工具调用、异步任务、文件资产、预览和发布。
```

典型用户任务：

```text
帮我为一个咖啡新品生成一套推广素材：
1. 生成三张主视觉图。
2. 生成 15 秒短视频脚本和分镜。
3. 生成一个 HTML 落地页。
4. 输出完整工作流 Trace。
```

技术亮点：

```text
工作流编排
多 Agent 协作
Prompt 模板
生图工具适配
生视频工具适配
HTML 代码生成
资产管理
异步任务
SSE 进度推送
Trace 可观测
Java/Python 双 Runtime
```

缺点：

```text
真实生图和生视频依赖第三方模型能力。
Phase 1 需要先用 mock 工具跑通形态，不能一开始硬接所有真实模型。
```

推荐包装：

```text
Ninic Creative Agent Studio
一个 AIGC 创意生产工作流 Agent 平台。
```

第一阶段可以 mock：

```text
生成图片任务 -> 返回 mock 图片资产卡片
生成视频任务 -> 返回 mock 分镜和视频任务状态
生成 HTML 任务 -> 返回可预览的 HTML 片段
工作流 Trace -> 展示 planner、image、video、html 四个步骤
```

## 6. 基于简历与 Resources 的二次脑暴结论

> 本节原本是推荐方向，现在主题已经确认。  
> 详细过程记录在 `phases/phase-01/01_BRAINSTORM_RESUME_RESOURCES_ZH.md`。

看完你简历里的 4 个项目和 `resources/` 中的 Java/Python 参考项目后，已确认方向是：

```text
AIGC 创意生产工作流 Agent + AgentOps 工程底座
```

它的产品外壳是：

```text
生图
生视频
生 HTML
营销创意工作流
资产预览
合规检查
```

它的工程内核是：

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

为什么它比纯 AgentOps 更适合：

```text
1. 更贴合你的超级编辑器、AI 设计中台、鹿班、字体合规项目。
2. 更容易做出高保真前端，不会只是一个抽象调试台。
3. 更容易讲清楚业务价值：从 Brief 到素材到 HTML 到审核。
4. 又能保留后端技术深度：Loop、Trace、Fallback、RAG、MCP、双语言 runtime。
```

推荐候选名称：

```text
Ninic Creative Agent Studio
Ninic AIGC Workflow Studio
Ninic CreativeOps Agent
```

Phase 1 推荐 Demo：

```text
帮我为一款夏季气泡咖啡生成一套推广素材：3 张主视觉图、15 秒短视频分镜、一个 HTML 落地页，并给出完整工作流 Trace。
```

Phase 1 推荐 mock 输出：

```text
Planner 节点：拆解营销目标和输出计划
ImageAgent 节点：返回 mock 图片资产卡片
VideoAgent 节点：返回 mock 视频分镜卡片
HtmlAgent 节点：返回可预览 HTML 片段
ReviewAgent 节点：返回 mock 合规检查结果
Trace 面板：展示每个节点的状态、耗时、工具调用和错误占位
```

当前仍需在 Phase 1 需求冻结中确认：

```text
产品名、默认 Demo、资产卡片范围、接口范围、验收标准。
```

## 7. Phase 1 候选场景

Phase 1 先不做复杂业务。

候选场景：

```text
Agent Run 调试工作台
```

如果选择方向 E，候选场景：

```text
AIGC Campaign 工作流：
用户输入一个营销需求，
Agent 拆解为生图、生视频、生 HTML 三类任务，
通过 SSE 返回每一步进度，
右侧 Trace 展示工作流执行过程，
中间区域展示生成的资产卡片和 HTML 预览。
```

用户问题示例：

```text
请帮我分析这段服务异常日志，并给出排查步骤。
```

Mock Agent 回复风格：

```text
我会先识别异常类型，再给出可能原因，最后列出排查步骤。
当前由 Java Runtime / Python Runtime 生成 mock 流式响应。
```

这样比普通“你好，我是 AI”更有主题，也更贴近 Java 开发者。

## 8. 候选 A 第一版页面主题

第一屏就是工作台。

```text
Ninic AgentOps Studio
  左侧：会话 / Run 历史
  中间：Agent Chat / Run 控制区
  右侧：Trace Timeline / Runtime / Tool Calls
  顶部：Runtime Switch / Model Selector / Provider Health
```

第一阶段页面：

```text
/            AgentOps Workbench
/settings    Runtime 和模型配置
```

后续页面：

```text
/tools        Tool Lab
/knowledge    Knowledge Base
/evals        Eval Center
/deploy       Deploy Console
/observability Trace & Metrics
```

## 9. 候选 A 命名体系

前端显示命名：

```text
Workbench      工作台
Run            一次智能体运行
Runtime        Java / Python 后端运行时
Trace          运行轨迹
Tool Lab       工具实验室
Knowledge Base 知识库
Eval Center    评测中心
Deploy Console 部署控制台
```

代码命名：

```text
thread
message
run
runtime
traceEvent
toolCall
modelProvider
fallbackRecord
```

## 10. Phase 1 成功标准草案

Phase 1 完成时，用户应该能感受到：

```text
这不是 DeerFlow 的空壳。
这是一个有主题的 AgentOps 工程工作台。
虽然现在还是 mock，但前端、contracts、Java/Python runtime、SSE、Trace 形态都已经立起来了。
```

如果选择 AgentOps 方向，必须做到：

```text
有产品名
有工作台布局
有 Runtime Switch
有模型选择区
有 Trace Timeline
有 Java/Python mock SSE
有中文错误状态
有主题化 mock 场景
```

## 11. 面试表达草案

可以这样讲：

```text
我没有纯复刻 DeerFlow，而是把它作为学习参考，自己设计了 Ninic AgentOps Studio。
它的主题是 AI Agent 工程工作台，重点是从 Java 开发者角度理解 Agent Run、Runtime、模型路由、工具调用、Trace、RAG、降级和部署。
第一阶段先用 mock SSE 跑通 Java/Python 双 Runtime，后续逐步替换成真实模型、工具、RAG 和单机大厂架构模拟。
```
