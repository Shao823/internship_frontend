import { useMemo } from 'react';
import { Descriptions, Space, Tag, Typography } from 'antd';

import BaseChart from '@/charts/BaseChart';
import {
  buildEmgRmsOption,
  buildMultiParameterLineOption,
  buildSleepPieOption,
} from '@/charts/options';
import type { AlgorithmDataset } from '@/types';
import { formatDateTime, formatNumber } from '@/utils/formatters';
import {
  calculateEmgStatistics,
  calculateMultiParameterStatistics,
  calculateSleepStatistics,
} from '@/utils/statistics';

interface ReportDocumentProps {
  data: AlgorithmDataset;
}

export default function ReportDocument({ data }: ReportDocumentProps) {
  const multiStatistics = useMemo(
    () => calculateMultiParameterStatistics(data.multiparameter),
    [data.multiparameter],
  );
  const sleepStatistics = useMemo(() => calculateSleepStatistics(data.sleep), [data.sleep]);
  const emgStatistics = useMemo(() => calculateEmgStatistics(data.emg), [data.emg]);
  const chartOptions = useMemo(
    () => [
      buildMultiParameterLineOption(data.multiparameter),
      buildSleepPieOption(data.sleep),
      buildEmgRmsOption(data.emg),
    ],
    [data.emg, data.multiparameter, data.sleep],
  );

  return (
    <article className="report-document">
      <header className="report-header">
        <div>
          <Typography.Title level={2}>算法检测报告预览</Typography.Title>
          <Typography.Text type="secondary">报告编号：{data.detection.detectionId}</Typography.Text>
        </div>
        <Tag color="cyan">Mock Preview</Tag>
      </header>
      <section className="report-section">
        <Typography.Title level={4}>患者信息</Typography.Title>
        <Descriptions bordered column={{ xs: 1, md: 2, xl: 4 }}>
          <Descriptions.Item label="姓名">{data.patient.name}</Descriptions.Item>
          <Descriptions.Item label="患者ID">{data.patient.patientId}</Descriptions.Item>
          <Descriptions.Item label="性别">{data.patient.gender}</Descriptions.Item>
          <Descriptions.Item label="年龄">{data.patient.age}</Descriptions.Item>
          <Descriptions.Item label="科室">{data.patient.department}</Descriptions.Item>
          <Descriptions.Item label="床号">{data.patient.bedNo}</Descriptions.Item>
          <Descriptions.Item label="身高">{data.patient.heightCm} cm</Descriptions.Item>
          <Descriptions.Item label="体重">{data.patient.weightKg} kg</Descriptions.Item>
        </Descriptions>
      </section>
      <section className="report-section">
        <Typography.Title level={4}>检测信息</Typography.Title>
        <Descriptions bordered column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="项目">{data.detection.projectName}</Descriptions.Item>
          <Descriptions.Item label="设备">{data.detection.deviceName}</Descriptions.Item>
          <Descriptions.Item label="开始时间">
            {formatDateTime(data.detection.startedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="结束时间">
            {formatDateTime(data.detection.endedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="医生">{data.detection.doctorName}</Descriptions.Item>
          <Descriptions.Item label="技师">{data.detection.technicianName}</Descriptions.Item>
        </Descriptions>
      </section>
      <section className="report-section">
        <Typography.Title level={4}>统计指标</Typography.Title>
        <div className="report-stat-grid">
          <div>
            <Typography.Text type="secondary">平均心率</Typography.Text>
            <strong>{formatNumber(multiStatistics.heartRate.average, 1)} bpm</strong>
          </div>
          <div>
            <Typography.Text type="secondary">平均血氧</Typography.Text>
            <strong>{formatNumber(multiStatistics.spo2.average, 1)}%</strong>
          </div>
          <div>
            <Typography.Text type="secondary">平均睡眠评分</Typography.Text>
            <strong>{formatNumber(sleepStatistics.sleepScore.average, 1)}</strong>
          </div>
          <div>
            <Typography.Text type="secondary">平均 RMS</Typography.Text>
            <strong>{formatNumber(emgStatistics.rms.average, 2)}</strong>
          </div>
        </div>
      </section>
      <section className="report-section">
        <Typography.Title level={4}>图表摘要</Typography.Title>
        <div className="report-chart-grid">
          {chartOptions.map((option, index) => (
            <BaseChart option={option} height={280} key={index} />
          ))}
        </div>
      </section>
      <section className="report-section">
        <Typography.Title level={4}>结论</Typography.Title>
        <Typography.Paragraph>
          本次监测显示生命体征整体平稳，夜间存在少量觉醒和氧降事件；肌电 RMS
          在部分时间窗内升高，中位频率有短时下降趋势。
        </Typography.Paragraph>
      </section>
      <section className="report-section">
        <Typography.Title level={4}>医生建议</Typography.Title>
        <Space direction="vertical">
          <Typography.Text>1. 结合临床主诉复核睡眠事件和血氧下降时间点。</Typography.Text>
          <Typography.Text>
            2. 若夜间症状持续，建议增加连续监测样本并对接正式报告生成服务。
          </Typography.Text>
          <Typography.Text>3. 肌电异常片段建议由医生结合原始信号进行人工确认。</Typography.Text>
        </Space>
      </section>
    </article>
  );
}
