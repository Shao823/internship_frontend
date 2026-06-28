import { useMemo } from 'react';
import { Space } from 'antd';

import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import PageTitle from '@/components/PageTitle';
import ChartSection from '@/features/charts/ChartSection';
import { buildRenderedChartGroups } from '@/features/charts/chartRegistry';
import { useAlgorithmData } from '@/hooks/useAlgorithmData';

export default function ChartAnalysisPage() {
  const { data, loading, error } = useAlgorithmData();
  const chartGroups = useMemo(() => (data ? buildRenderedChartGroups(data) : []), [data]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState message={error ?? '未获取到数据'} />;
  }

  return (
    <Space direction="vertical" size={20} className="page-stack">
      <PageTitle
        title="图表分析"
        description="ECharts 暗色主题图表，支持 Tooltip、Legend、DataZoom 与容器自适应。"
      />
      {chartGroups.map((group) => (
        <ChartSection key={group.id} group={group} />
      ))}
    </Space>
  );
}
