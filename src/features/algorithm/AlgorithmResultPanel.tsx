import { Space, Table, Typography } from 'antd';

import MetricCardGrid from '@/components/MetricCardGrid';
import type { AlgorithmDataset } from '@/types';
import { buildSummaryStatistics } from '@/utils/statistics';

import type { AlgorithmDomainConfig } from './domainRegistry';

interface AlgorithmResultPanelProps {
  config: AlgorithmDomainConfig;
  dataset: AlgorithmDataset;
}

export default function AlgorithmResultPanel({ config, dataset }: AlgorithmResultPanelProps) {
  const records = config.getRecords(dataset);
  const primaryMetric = config.getPrimaryMetric(dataset);

  return (
    <Space direction="vertical" size={16} className="page-stack">
      <MetricCardGrid
        items={buildSummaryStatistics(primaryMetric, config.metricUnit, config.metricPrecision)}
      />
      <section className="content-panel">
        <Typography.Title level={4}>{config.tableTitle}</Typography.Title>
        <Table
          rowKey="id"
          columns={config.columns}
          dataSource={records}
          pagination={{ pageSize: 8 }}
          scroll={{ x: true }}
        />
      </section>
    </Space>
  );
}
