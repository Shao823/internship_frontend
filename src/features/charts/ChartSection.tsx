import { Col, Row, Typography } from 'antd';

import BaseChart from '@/charts/BaseChart';

import type { RenderedChartGroup } from './chartRegistry';

interface ChartSectionProps {
  group: RenderedChartGroup;
}

export default function ChartSection({ group }: ChartSectionProps) {
  if (group.charts.length === 1) {
    const chart = group.charts[0];

    return (
      <section className="content-panel">
        <Typography.Title level={4}>{chart.title}</Typography.Title>
        <BaseChart option={chart.option} height={chart.height} />
      </section>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {group.charts.map((chart) => (
        <Col xs={chart.column?.xs ?? 24} xl={chart.column?.xl ?? 12} key={chart.id}>
          <section className="content-panel">
            <Typography.Title level={4}>{chart.title}</Typography.Title>
            <BaseChart option={chart.option} height={chart.height} />
          </section>
        </Col>
      ))}
    </Row>
  );
}
