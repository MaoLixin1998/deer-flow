# Phases

这里是每个阶段的独立生产目录。

每个阶段必须有自己的目录：

```text
phases/
  phase-01/
  phase-02/
  phase-03/
```

阶段目录负责保存：

```text
阶段启动
头脑风暴
需求冻结
简单设计
Contracts 产物登记
前端原型产物登记
后端产物登记
联调记录
测试记录
验收记录
复盘记录
```

注意：

```text
生产源码仍然放在 contracts/、frontend/、services/、infra/。
phases/phase-xx/ 负责记录这个阶段生产了什么、为什么这么做、怎么验收。
```
