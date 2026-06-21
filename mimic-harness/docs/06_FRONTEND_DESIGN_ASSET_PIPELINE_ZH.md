# 前端设计、高保真原型与素材生产方案

> 本文件解决一个现实问题：  
> 你不是设计师，也不会画原型，如何稳定产出一个能看、能用、能开发、能上线的 AI Agent 前端。

## 1. 总体结论

本项目必须把 Figma 高保真设计稿作为前端开发前的正式门禁，但不能停留在“漂亮但不可运行”的原型。

推荐路线：

```text
设计 brief
  -> 页面清单
  -> Figma 信息架构
  -> Figma 设计系统
  -> Figma 核心页面高保真稿
  -> Figma 交互流和开发标注
  -> 静态高保真 React 原型
  -> Mock 数据和 Mock SSE
  -> 接真实 Java/Python 后端
  -> 截图验收和交互验收
```

核心思路：

```text
用 Figma 先定产品视觉、页面结构、组件状态和交互路径。
用前端代码再验证真实动态、SSE、响应式和工程可维护性。
用 shadcn/ui + Tailwind 做设计系统底座。
用 lucide-react 解决绝大多数图标。
用生成式图片补少量视觉素材。
用真实业务页面代替营销首页。
```

第一阶段不建议做：

```text
不建议一开始做复杂品牌视觉。
不建议购买大量素材包。
不建议用一堆随机插画撑页面。
不建议做 landing page 代替真实工作台。
不建议在 Figma 里模拟复杂 SSE 动态细节。
```

## 2. 产品视觉定位

`mimic-harness` 的前端不是营销官网，而是 AI Agent 工作台。

关键词：

```text
清晰
克制
专业
可扫描
可调试
适合长时间使用
像工程工具，不像海报
```

视觉参考方向：

```text
ChatGPT / Claude 的聊天效率
LangSmith / Langfuse 的 Trace 可观测性
DeerFlow 的 Agent 工作流
现代 SaaS 后台的信息密度
```

不要做成：

```text
大面积渐变背景
夸张 hero 首屏
堆满装饰卡片
纯紫蓝科技风
只有聊天框没有工程调试能力
```

## 3. 高保真原型怎么做

高保真原型分两层。

### 3.1 必做：Figma 型高保真设计稿

Figma 先做。

目标：

```text
让页面长什么样、组件怎么用、状态怎么展示、前端该按什么标注开发，在写代码前先确定。
```

Figma 必须包含：

```text
产品封面
设计系统 token
核心组件 variants
Creative Workbench 关键状态
Runtime Settings 关键状态
静态占位页面模板
桌面端 frame
移动端 frame
错误 / 空 / 加载 / 禁用状态
开发标注
素材清单
```

Figma 不负责：

```text
真实 SSE 流式输出
复杂 Trace 展开折叠逻辑
真实接口联调
复杂状态机验证
```

这些必须回到代码原型里验证。

### 3.2 必做：代码型高保真原型

直接用 Next.js 做。

优点：

1. 原型就是未来代码，不浪费。
2. 能真实验证 SSE、滚动、响应式、空状态、错误状态。
3. 你作为 Java 开发更容易理解组件和数据流。
4. 后续我可以直接帮你迭代页面。

第一版只接 mock 数据：

```text
Mock threads
Mock messages
Mock trace events
Mock tools
Mock models
Mock SSE stream
```

验收标准：

```text
页面看起来接近最终产品。
所有按钮、切换器、tab、弹窗都有状态。
所有空状态、加载状态、错误状态都有中文文案。
桌面和移动端不重叠、不溢出。
前端可以一键切 Java / Python runtime。
```

门禁：

```text
Figma 关键页面未确认，不进入代码型高保真原型。
代码型高保真原型未跑通，不进入真实前后端联调。
```

## 4. 第一版页面清单

不要先做首页。第一屏就是工作台。

```text
/                      Agent 工作台
/threads               会话列表
/threads/[threadId]    指定会话
/tools                 工具调试台
/knowledge             RAG 知识库
/evals                 评测结果
/settings              模型、Runtime、Key 状态
/observability         Trace、日志、运行指标
/deploy                云服务器 Docker 发布状态
```

第一阶段只做：

```text
/                      Agent 工作台
/settings              Runtime 和模型配置
```

后续阶段再补：

```text
/tools
/knowledge
/evals
/observability
/deploy
```

## 5. 工作台布局

核心布局：

```text
左侧：会话列表
中间：聊天和输入区
右侧：Trace / Runtime / Tool Calls
顶部：模型、Runtime、降级状态
底部：流式状态、token、耗时
```

桌面端：

```text
三栏布局
左侧 260px
中间自适应
右侧 360px
```

移动端：

```text
默认显示聊天
会话列表进入抽屉
Trace 进入底部面板或独立 Tab
```

必须覆盖的状态：

```text
空会话
正在流式输出
用户取消运行
模型超时
触发降级
工具调用中
工具调用失败
RAG 无结果
后端不可用
API Key 未配置
```

## 6. 设计系统

### 6.1 技术选型

```text
Tailwind CSS
shadcn/ui
lucide-react
class-variance-authority
radix-ui
```

原则：

1. 先用成熟组件，不自己造基础组件。
2. 图标优先用 `lucide-react`。
3. 卡片圆角不超过 8px。
4. 工具按钮优先用图标加 tooltip。
5. 业务文案必须中文。

### 6.2 Token

必须定义：

```text
颜色 token
字体 token
间距 token
圆角 token
阴影 token
状态 token
z-index token
```

建议颜色：

```text
背景：中性浅灰 / 近白
文字：深灰黑
主色：克制蓝或青
成功：绿
警告：琥珀
失败：红
Trace：按事件类型分色
```

避免：

```text
全站大面积紫色
全站深蓝黑
全站米色
过多渐变
弱对比文字
```

## 7. 组件清单

第一批组件：

```text
RuntimeSwitch
ModelSelector
ChatMessage
ChatComposer
StreamingCursor
TraceTimeline
TraceEventItem
ToolCallCard
FallbackBanner
ConnectionStatus
ApiKeyStatus
EmptyState
ErrorState
LoadingState
```

第二批组件：

```text
KnowledgeFileUploader
DocumentChunkViewer
RagCitationList
EvalCaseTable
EvalRunSummary
DeployStatusPanel
LogViewer
MetricCard
```

每个组件必须有：

```text
默认状态
加载状态
错误状态
禁用状态
移动端状态
中文空状态文案
```

## 8. 图标方案

图标不要自己乱画。

默认：

```text
lucide-react
```

常用映射：

```text
发送：Send
停止：Square
设置：Settings
模型：Bot
工具：Wrench
Trace：Activity
文件：FileText
上传：Upload
下载：Download
运行：Play
失败：CircleAlert
成功：CircleCheck
降级：ArrowDownWideNarrow
数据库：Database
缓存：BadgeInfo / Bolt
云部署：Cloud
```

需要自定义图标的情况：

```text
项目 Logo
Java Runtime 标识
Python Runtime 标识
Qwen / 豆包 / 智谱 / Kimi provider 标识
Agent 类型标识
```

自定义图标规则：

1. 优先简单 SVG。
2. 单色或双色。
3. 24x24 网格。
4. 不能只有颜色区分含义。
5. 必须有 tooltip 或文本标签。

## 9. 图片素材方案

这个产品不需要大量装饰图片。

真正需要的图片：

```text
空状态插图
上传文件示例预览
RAG 文档示例封面
视觉模型测试样例
部署状态示意图
README 截图
```

来源优先级：

```text
1. 项目真实 UI 截图
2. 自己生成的示意图
3. 开源可商用素材
4. 手工绘制简单 SVG
```

不要使用：

```text
无意义科技背景图
和功能无关的人物插画
版权不清晰的网络图片
过度压暗或模糊的 stock 图
```

图片保存位置：

```text
frontend/apps/web/public/assets/images/
```

命名规则：

```text
empty-chat-light.png
empty-knowledge-light.png
demo-trace-timeline.png
sample-vision-receipt.jpg
```

## 10. 视频素材方案

第一阶段不需要视频。

后续需要视频时，只做三类：

```text
产品演示短视频
README 功能预览 GIF / MP4
部署教程录屏
```

规则：

1. 不自动播放有声视频。
2. 视频必须有封面。
3. README 里优先用短 GIF 或压缩 MP4。
4. 教程视频不要放仓库，放对象存储或发布页。

保存位置：

```text
frontend/apps/web/public/assets/videos/
```

## 11. 音频素材方案

第一阶段不需要音频。

可以后续加：

```text
运行完成提示音
错误提示音
长任务完成通知
```

规则：

1. 默认静音。
2. 用户必须可以关闭。
3. 每个音频小于 100KB。
4. 不要使用版权不清晰音效。

保存位置：

```text
frontend/apps/web/public/assets/audio/
```

## 12. 素材资产清单

所有素材都要登记。

建议文件：

```text
frontend/apps/web/public/assets/ASSETS_MANIFEST_ZH.md
```

字段：

```text
文件名
类型
用途
来源
版权
生成提示词
是否可商用
是否可删除
```

示例：

```text
empty-chat-light.png
类型：图片
用途：聊天空状态
来源：AI 生成
版权：项目自用
生成提示词：简洁的 AI 工作台空状态插图，浅色背景，线性风格
是否可商用：是
是否可删除：否
```

## 13. 原型验收标准

一版高保真原型完成时，必须检查：

```text
桌面端 1440px 正常
笔记本 1280px 正常
平板 768px 正常
手机 390px 正常
长中文不溢出
按钮文字不挤压
Trace 不遮挡聊天
SSE 流式状态清楚
后端断开时用户知道发生了什么
API Key 未配置时有中文引导
```

交互验收：

```text
可以输入消息
可以发送
可以停止生成
可以切 Java / Python
可以切模型
可以打开 Trace
可以看到工具调用
可以看到降级提示
可以进入设置页
```

## 14. 前端目录建议

```text
frontend/apps/web/
  public/
    assets/
      ASSETS_MANIFEST_ZH.md
      icons/
      images/
      videos/
      audio/

  src/
    app/
    features/
      chat/
      trace/
      tools/
      knowledge/
      settings/
      deploy/
    entities/
      message/
      thread/
      run/
      trace/
      tool/
      model/
    shared/
      api/
      config/
      hooks/
      lib/
      styles/
      ui/
```

## 15. 推荐工作流

每做一个页面，都按这个顺序：

```text
1. 写页面目标
2. 写用户操作路径
3. 列接口和数据结构
4. 列组件
5. 列状态
6. 列素材
7. 画 Figma 高保真稿
8. 补 Figma 开发标注
9. 写静态高保真代码原型
10. 接 mock 数据
11. 接真实接口
12. 截图验收
```

不要跳过第 3、4、5 步。

这三步能帮你把“设计问题”变成“工程问题”。

## 16. 我们后续怎么落地

第一步先做：

```text
Agent 工作台 Figma 高保真设计稿
```

包含：

```text
三栏布局
RuntimeSwitch
ModelSelector
ChatMessage
ChatComposer
TraceTimeline
ToolCallCard
FallbackBanner
设置页
错误 / 空 / 加载状态
移动端 frame
开发标注
素材清单
```

第二步再做：

```text
Agent 工作台高保真代码原型
```

包含：

```text
按 Figma 还原核心页面
Mock SSE
基础素材目录
资产登记文件
```

第三步再接：

```text
Java mock SSE
Python mock SSE
```

第四步再补：

```text
README 产品截图
部署演示视频
```

这样你不用先会设计，也能得到一套可展示的 Figma 设计稿，以及一个可运行、能继续开发的前端。
