import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type {
  AlgorithmDataset,
  EmgRecord,
  MeasurementCategory,
  MetricSummary,
  MultiParameterRecord,
  SleepRecord,
} from '@/types';
import { formatDateTime } from '@/utils/formatters';
import {
  calculateEmgStatistics,
  calculateMultiParameterStatistics,
  calculateSleepStatistics,
} from '@/utils/statistics';

export type AlgorithmTableRecord = MultiParameterRecord | SleepRecord | EmgRecord;

export interface AlgorithmDomainConfig {
  key: MeasurementCategory;
  label: string;
  tableTitle: string;
  metricUnit: string;
  metricPrecision: number;
  getRecords: (dataset: AlgorithmDataset) => AlgorithmTableRecord[];
  getPrimaryMetric: (dataset: AlgorithmDataset) => MetricSummary;
  columns: ColumnsType<AlgorithmTableRecord>;
}

const renderDateTime = (value: string) => formatDateTime(value);

const renderAbnormalStatus = (abnormal: boolean) =>
  abnormal ? (
    <Tag color="red" icon={<WarningOutlined />}>
      异常
    </Tag>
  ) : (
    <Tag color="green" icon={<CheckCircleOutlined />}>
      正常
    </Tag>
  );

const timestampColumn = {
  title: '时间',
  dataIndex: 'timestamp',
  key: 'timestamp',
  render: renderDateTime,
};

const statusColumn = {
  title: '状态',
  dataIndex: 'abnormal',
  key: 'abnormal',
  render: renderAbnormalStatus,
};

const multiParameterColumns: ColumnsType<AlgorithmTableRecord> = [
  timestampColumn,
  { title: '心率', dataIndex: 'heartRate', key: 'heartRate' },
  { title: 'SpO2', dataIndex: 'spo2', key: 'spo2' },
  { title: '呼吸', dataIndex: 'respiration', key: 'respiration' },
  { title: '体温', dataIndex: 'temperature', key: 'temperature' },
  statusColumn,
  { title: '备注', dataIndex: 'note', key: 'note' },
];

const sleepColumns: ColumnsType<AlgorithmTableRecord> = [
  timestampColumn,
  { title: '分期', dataIndex: 'sleepStage', key: 'sleepStage' },
  { title: '评分', dataIndex: 'sleepScore', key: 'sleepScore' },
  { title: '事件数', dataIndex: 'eventCount', key: 'eventCount' },
  { title: '氧降次数', dataIndex: 'oxygenDropCount', key: 'oxygenDropCount' },
  { title: '觉醒指数', dataIndex: 'arousalIndex', key: 'arousalIndex' },
  statusColumn,
];

const emgColumns: ColumnsType<AlgorithmTableRecord> = [
  timestampColumn,
  { title: 'RMS', dataIndex: 'rms', key: 'rms' },
  { title: 'MAV', dataIndex: 'mav', key: 'mav' },
  { title: 'IEMG', dataIndex: 'iemg', key: 'iemg' },
  { title: '中位频率', dataIndex: 'medianFrequency', key: 'medianFrequency' },
  { title: '波形', dataIndex: 'waveform', key: 'waveform' },
  statusColumn,
];

export const algorithmDomainConfigs: AlgorithmDomainConfig[] = [
  {
    key: 'multiparameter',
    label: '多参',
    tableTitle: '多参数结果',
    metricUnit: 'bpm',
    metricPrecision: 1,
    getRecords: (dataset) => dataset.multiparameter,
    getPrimaryMetric: (dataset) =>
      calculateMultiParameterStatistics(dataset.multiparameter).heartRate,
    columns: multiParameterColumns,
  },
  {
    key: 'sleep',
    label: '睡眠',
    tableTitle: '睡眠结果',
    metricUnit: '分',
    metricPrecision: 1,
    getRecords: (dataset) => dataset.sleep,
    getPrimaryMetric: (dataset) => calculateSleepStatistics(dataset.sleep).sleepScore,
    columns: sleepColumns,
  },
  {
    key: 'emg',
    label: '肌电',
    tableTitle: '肌电结果',
    metricUnit: '',
    metricPrecision: 2,
    getRecords: (dataset) => dataset.emg,
    getPrimaryMetric: (dataset) => calculateEmgStatistics(dataset.emg).rms,
    columns: emgColumns,
  },
];
