import { Card, Col, Row, Statistic } from 'antd';

import type { StatisticItem } from '@/types';

interface MetricCardGridProps {
  items: StatisticItem[];
}

const STATUS_COLOR: Record<NonNullable<StatisticItem['status']>, string> = {
  normal: '#dce8f6',
  success: '#58d68d',
  warning: '#f5c451',
  danger: '#ff7875',
};

export default function MetricCardGrid({ items }: MetricCardGridProps) {
  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col xs={12} md={6} key={item.title}>
          <Card className="metric-card">
            <Statistic
              title={item.title}
              value={item.value}
              suffix={item.suffix}
              precision={typeof item.value === 'number' ? item.precision : undefined}
              valueStyle={{ color: STATUS_COLOR[item.status ?? 'normal'] }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
