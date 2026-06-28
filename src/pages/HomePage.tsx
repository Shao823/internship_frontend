import { Alert, Col, Row, Space, Tag, Timeline, Typography } from 'antd';
import { Link } from 'react-router-dom';

import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import MetricCardGrid from '@/components/MetricCardGrid';
import PageTitle from '@/components/PageTitle';
import { useAlgorithmData } from '@/hooks/useAlgorithmData';
import {
  calculateEmgStatistics,
  calculateMultiParameterStatistics,
  calculateSleepStatistics,
} from '@/utils/statistics';

export default function HomePage() {
  const { data, loading, error } = useAlgorithmData();

  if (loading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState message={error ?? '未获取到数据'} />;
  }

  const multiStatistics = calculateMultiParameterStatistics(data.multiparameter);
  const sleepStatistics = calculateSleepStatistics(data.sleep);
  const emgStatistics = calculateEmgStatistics(data.emg);

  return (
    <Space direction="vertical" size={20} className="page-stack">
      <PageTitle
        title="首页"
        description="统一 Demo 入口，覆盖数据导入、算法结果展示、图表可视化与报告预览。"
      />
      <Alert
        type="info"
        showIcon
        message="当前运行在 Mock 数据模式"
        description="后端提供 JSON 算法结果、数据上传和报告生成接口后，可通过 api 层切换真实服务。"
      />
      <MetricCardGrid
        items={[
          { title: '多参数记录', value: data.multiparameter.length, status: 'normal' },
          { title: '睡眠片段', value: data.sleep.length, status: 'success' },
          { title: '肌电样本', value: data.emg.length, status: 'warning' },
          {
            title: '总异常数',
            value:
              multiStatistics.heartRate.abnormalCount +
              sleepStatistics.sleepScore.abnormalCount +
              emgStatistics.rms.abnormalCount,
            status: 'danger',
          },
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <section className="content-panel">
            <Typography.Title level={4}>项目概览</Typography.Title>
            <div className="overview-grid">
              <div>
                <Typography.Text type="secondary">患者</Typography.Text>
                <Typography.Title level={5}>{data.patient.name}</Typography.Title>
              </div>
              <div>
                <Typography.Text type="secondary">项目</Typography.Text>
                <Typography.Title level={5}>{data.detection.projectName}</Typography.Title>
              </div>
              <div>
                <Typography.Text type="secondary">设备</Typography.Text>
                <Typography.Title level={5}>{data.detection.deviceName}</Typography.Title>
              </div>
              <div>
                <Typography.Text type="secondary">医生</Typography.Text>
                <Typography.Title level={5}>{data.detection.doctorName}</Typography.Title>
              </div>
            </div>
          </section>
        </Col>
        <Col xs={24} lg={10}>
          <section className="content-panel">
            <Typography.Title level={4}>阶段路线</Typography.Title>
            <Timeline
              items={[
                { color: 'green', children: <Link to="/data-import">导入 JSON / CSV 数据</Link> },
                { color: 'green', children: <Link to="/algorithm">查看三类算法结果</Link> },
                { color: 'blue', children: <Link to="/charts">分析趋势图、饼图和频谱图</Link> },
                { color: 'cyan', children: <Link to="/report">预览并打印报告</Link> },
              ]}
            />
          </section>
        </Col>
      </Row>
      <Space wrap>
        <Tag color="green">React</Tag>
        <Tag color="blue">TypeScript</Tag>
        <Tag color="cyan">Ant Design</Tag>
        <Tag color="gold">ECharts</Tag>
        <Tag color="volcano">Axios</Tag>
      </Space>
    </Space>
  );
}
