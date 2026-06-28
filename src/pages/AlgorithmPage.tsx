import { useMemo } from 'react';
import { Space, Tabs } from 'antd';

import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import PageTitle from '@/components/PageTitle';
import AlgorithmResultPanel from '@/features/algorithm/AlgorithmResultPanel';
import { algorithmDomainConfigs } from '@/features/algorithm/domainRegistry';
import { useAlgorithmData } from '@/hooks/useAlgorithmData';

export default function AlgorithmPage() {
  const { data, loading, error } = useAlgorithmData();
  const tabItems = useMemo(
    () =>
      data
        ? algorithmDomainConfigs.map((config) => ({
            key: config.key,
            label: config.label,
            children: <AlgorithmResultPanel config={config} dataset={data} />,
          }))
        : [],
    [data],
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState message={error ?? '未获取到数据'} />;
  }

  return (
    <Space direction="vertical" size={20} className="page-stack">
      <PageTitle
        title="算法展示"
        description="按多参、睡眠、肌电三个算法域展示结果、表格与自动统计指标。"
      />
      <Tabs items={tabItems} />
    </Space>
  );
}
