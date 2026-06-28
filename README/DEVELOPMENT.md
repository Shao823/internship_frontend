# 开发说明

## 开发流程

1. 进入项目根目录。

```bash
cd /home/kody304/实习
```

2. 首次运行安装依赖。

```bash
npm install
```

3. 启动开发服务。

```bash
npm run dev
```

浏览器打开：

```text
http://localhost:5173/
```

如果已经安装过依赖，日常本地打开只需要：

```bash
npm run dev
```

4. 开发完成后检查。

```bash
npm run lint
npm run typecheck
npm run build
```

5. 提交前格式化。

```bash
npm run format
```

## Mock 开发流程

Mock 数据集中在：

```text
src/mock/algorithm.ts
src/mock/projects.ts
```

页面不直接读取 Mock，而是走：

```text
Page -> service -> api -> mock
```

新增 Mock 字段时：

1. 修改 `src/types/index.ts`。
2. 修改 `src/mock/algorithm.ts`。
3. 修改 `src/features/algorithm/domainRegistry.tsx` 或 `src/features/charts/chartRegistry.ts`。
4. 运行 `npm run typecheck`。

## 后端结构不确定时的开发原则

页面、组件、图表只使用 `src/types/index.ts` 中的前端领域模型。后端字段不稳定时，不要把兼容逻辑写进页面。

正确位置：

```text
src/api/adapters/
```

例如后端把 `heartRate` 改成 `heart_rate`、`hr` 或放进 `records.multiparameter`，只修改 `normalizeAlgorithmDataset` 的字段候选或路径候选。

这样做的收益：

- 页面不跟着后端字段频繁改动。
- 多人协作时接口联调和 UI 开发边界清晰。
- 后续 FastAPI DTO 稳定后，可以逐步收紧 adapter 规则。

## 环境变量配置

项目根目录包含：

```text
.env.example
.env.local
```

`.env.local` 是本地运行配置，当前默认：

```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8000/api
```

这表示页面继续使用 Mock 数据，同时预留后端地址。接真实后端时改成：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://实际后端地址/api
```

改完后重启：

```bash
npm run dev
```

## 新增算法流程

以 ECG 为例：

1. 在 `src/types/index.ts` 新增 `EcgRecord`，并把 `ecg: EcgRecord[]` 加入 `AlgorithmDataset`。
2. 在 `src/mock/algorithm.ts` 增加 ECG Mock 数据。
3. 在 `src/utils/statistics.ts` 增加 `calculateEcgStatistics`。
4. 在 `src/features/algorithm/domainRegistry.tsx` 添加列定义和 `AlgorithmDomainConfig`。
5. 如需图表，在 `src/charts/options.ts` 新增 option，并在 `src/features/charts/chartRegistry.ts` 注册。

正常情况下不需要改 `AlgorithmPage` 和 `ChartAnalysisPage`。

## 调试技巧

### 文件上传

数据导入页支持两种格式：

```json
[{ "patient_id": "P001", "heart_rate": 72, "spo2": 98 }]
```

```csv
patient_id,heart_rate,spo2
P001,72,98
```

错误文件会显示解析错误，例如空文件、表头为空、不支持扩展名。

### 图表

图表不显示时先检查：

- `records` 是否为空
- `xAxis.data` 是否有值
- `series[].data` 是否有值
- 容器是否有高度

ECharts 使用按需注册，若新增散点图、热力图等新类型，需要在 `src/charts/BaseChart.tsx` 注册对应 chart/component。

### 路由刷新

开发环境由 Vite 处理。生产部署到 Nginx 时，需要配置 SPA fallback 到 `index.html`。

## 后续接后端步骤

1. FastAPI/Flask 提供统一前缀，例如 `/api`。
2. 所有接口返回 `ApiEnvelope<T>`。
3. 前端设置：

```bash
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8000/api
```

4. 如果后端字段是蛇形命名，例如 `patient_id`，建议在 `api/` 或 `services/` 做一次 DTO 转换。
5. 页面层继续使用 camelCase 的 TypeScript 类型。

FastAPI 422 `detail` 错误已经在 `src/api/client.ts` 统一格式化。联调时可在后端日志中搜索请求头 `X-Request-Id`。

## 构建策略

当前生产构建使用：

- React Router 页面懒加载
- ECharts core 按需注册
- Vite `manualChunks` 拆分 `react-vendor`、`antd-vendor`、`echarts-vendor`、`http-vendor`
- `chunkSizeWarningLimit: 900`，匹配当前 Ant Design 企业 Demo 依赖体量

提交前要求 `npm run build` 无 warning 和 error。

## 推荐后端接口

```text
GET  /api/algorithm/results
POST /api/uploads
POST /api/reports/generate
GET  /api/patients/{patientId}
```

## 扩展建议

- 睡眠：增加 AHI、ODI、总睡眠时间、REM 潜伏期等指标。
- 多参：增加血压、HRV、事件标记、阈值配置。
- 肌电：增加频域特征、通道切换、原始波形局部放大。
- 报告：增加审核状态、医生签名、后端 PDF 生成。
