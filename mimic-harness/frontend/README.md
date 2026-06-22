# Frontend

前端使用：

```text
TypeScript
React
Next.js
Tailwind CSS
shadcn/ui
```

设计和素材方案先看：

```text
../docs/06_FRONTEND_DESIGN_ASSET_PIPELINE_ZH.md
```

第一版页面：

```text
/           AIGC 创意生产 Agent 工作台
/settings   Java / Python Runtime 切换、降级状态、Mock 工具调用登记
```

前端分层：

```text
apps/web/src/
  app/          # Next.js 路由
  features/     # 业务功能：chat、trace、tools、settings
  entities/     # 领域实体：message、thread、agent、tool、trace
  shared/       # 共享 api、ui、config、types、lib
```

必须实现一个后端切换能力：

```text
Java Runtime   -> http://localhost:8080
Python Runtime -> http://localhost:8000
```

当前 Phase 1.6 代码入口：

```text
apps/web/src/app/page.tsx
apps/web/src/features/workbench/components/CreativeWorkbenchPage.tsx
```
