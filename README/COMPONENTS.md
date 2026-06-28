# 组件说明

## BaseChart

路径：`src/charts/BaseChart.tsx`

职责：

- 初始化 ECharts
- 接收 option
- 自动响应容器尺寸变化
- 卸载时销毁实例

Props：

```ts
interface BaseChartProps {
  option: EChartsOption;
  height?: number;
  themeName?: 'dark' | 'light';
  className?: string;
}
```

用法：

```tsx
<BaseChart option={buildEmgRmsOption(records)} height={320} />
```

## PageTitle

路径：`src/components/PageTitle.tsx`

职责：

- 页面标题
- 页面说明
- 右侧操作按钮区域

Props：

```ts
interface PageTitleProps {
  title: string;
  description?: string;
  extra?: ReactNode;
}
```

用法：

```tsx
<PageTitle title="报告预览" extra={<Button>打印</Button>} />
```

## MetricCardGrid

路径：`src/components/MetricCardGrid.tsx`

职责：

- 展示统计指标卡片
- 统一状态颜色
- 响应式栅格

Props：

```ts
interface MetricCardGridProps {
  items: StatisticItem[];
}
```

`StatisticItem`：

```ts
interface StatisticItem {
  title: string;
  value: number | string;
  suffix?: string;
  precision?: number;
  status?: 'normal' | 'success' | 'warning' | 'danger';
}
```

## LoadingState

路径：`src/components/LoadingState.tsx`

职责：统一页面加载状态。

用法：

```tsx
if (loading) {
  return <LoadingState />;
}
```

## ErrorState

路径：`src/components/ErrorState.tsx`

职责：统一页面错误状态。

Props：

```ts
interface ErrorStateProps {
  message: string;
}
```

## DemoLayout

路径：`src/layouts/DemoLayout.tsx`

职责：

- Header
- Sidebar
- Main Outlet
- 导航菜单
- 当前时间刷新

新增菜单时修改 `src/router/navigation.tsx`，避免布局和路由各维护一份菜单。

## AlgorithmResultPanel

路径：`src/features/algorithm/AlgorithmResultPanel.tsx`

职责：

- 根据 `AlgorithmDomainConfig` 渲染统计卡片和结果表格
- 消除多参、睡眠、肌电 Tab 中重复的 Table/Card 代码
- 支持后续 ECG、EEG、PPG 等算法域复用

Props：

```ts
interface AlgorithmResultPanelProps {
  config: AlgorithmDomainConfig;
  dataset: AlgorithmDataset;
}
```

## Algorithm Domain Registry

路径：`src/features/algorithm/domainRegistry.tsx`

职责：

- 定义算法 Tab 的 label、表格列、主统计指标和数据选择器
- 页面只读取 `algorithmDomainConfigs`

新增算法域时添加：

```ts
{
  key: 'ecg',
  label: 'ECG',
  tableTitle: 'ECG 结果',
  metricUnit: 'ms',
  metricPrecision: 1,
  getRecords: (dataset) => dataset.ecg,
  getPrimaryMetric: (dataset) => calculateEcgStatistics(dataset.ecg).rrInterval,
  columns: ecgColumns,
}
```

## ChartSection

路径：`src/features/charts/ChartSection.tsx`

职责：

- 根据图表组自动选择单图或栅格布局
- 统一渲染标题和 `BaseChart`

## Chart Registry

路径：`src/features/charts/chartRegistry.ts`

职责：

- 注册图表标题、高度、栅格和 option 构造函数
- `ChartAnalysisPage` 只负责映射渲染

## ReportDocument

路径：`src/report/ReportDocument.tsx`

职责：

- 组织报告结构
- 展示患者信息、检测信息、统计指标、图表、结论、医生建议
- 支持浏览器打印

Props：

```ts
interface ReportDocumentProps {
  data: AlgorithmDataset;
}
```

## 复用原则

- 页面级组件放 `pages/`。
- 多页面共享组件放 `components/`。
- 业务域组合逻辑放 `features/`。
- 只服务报告的组件放 `report/`。
- 图表容器放 `charts/`。
- 复杂业务状态优先写成 hook。
