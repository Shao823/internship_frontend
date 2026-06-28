import type {
  EmgRecord,
  MetricSummary,
  MultiParameterRecord,
  SleepEvent,
  SleepEventType,
  SleepRecord,
  SleepStage,
  StatisticItem,
} from '@/types';

const EMPTY_SUMMARY: MetricSummary = {
  average: 0,
  max: 0,
  min: 0,
  abnormalCount: 0,
  total: 0,
};

export const calculateMetricSummary = <T>(
  records: T[],
  selector: (record: T) => number,
  isAbnormal: (record: T) => boolean,
): MetricSummary => {
  if (records.length === 0) {
    return EMPTY_SUMMARY;
  }

  const values = records.map(selector);
  const totalValue = values.reduce((sum, value) => sum + value, 0);

  return {
    average: totalValue / records.length,
    max: Math.max(...values),
    min: Math.min(...values),
    abnormalCount: records.filter(isAbnormal).length,
    total: records.length,
  };
};

export const buildSummaryStatistics = (
  summary: MetricSummary,
  unit: string,
  precision = 1,
): StatisticItem[] => [
  {
    title: '平均值',
    value: summary.average,
    suffix: unit,
    precision,
    status: 'normal',
  },
  {
    title: '最大值',
    value: summary.max,
    suffix: unit,
    precision,
    status: 'warning',
  },
  {
    title: '最小值',
    value: summary.min,
    suffix: unit,
    precision,
    status: 'success',
  },
  {
    title: '异常数量',
    value: summary.abnormalCount,
    suffix: ` / ${summary.total}`,
    status: summary.abnormalCount > 0 ? 'danger' : 'success',
  },
];

export const calculateMultiParameterStatistics = (records: MultiParameterRecord[]) => ({
  heartRate: calculateMetricSummary(
    records,
    (record) => record.heartRate,
    (record) => record.abnormal,
  ),
  spo2: calculateMetricSummary(
    records,
    (record) => record.spo2,
    (record) => record.abnormal,
  ),
  respiration: calculateMetricSummary(
    records,
    (record) => record.respiration,
    (record) => record.abnormal,
  ),
  temperature: calculateMetricSummary(
    records,
    (record) => record.temperature,
    (record) => record.abnormal,
  ),
});

export const calculateSleepStatistics = (records: SleepRecord[]) => ({
  sleepScore: calculateMetricSummary(
    records,
    (record) => record.sleepScore,
    (record) => record.abnormal,
  ),
  eventCount: calculateMetricSummary(
    records,
    (record) => record.eventCount,
    (record) => record.abnormal,
  ),
  oxygenDropCount: calculateMetricSummary(
    records,
    (record) => record.oxygenDropCount,
    (record) => record.abnormal,
  ),
  arousalIndex: calculateMetricSummary(
    records,
    (record) => record.arousalIndex,
    (record) => record.abnormal,
  ),
});

export const calculateEmgStatistics = (records: EmgRecord[]) => ({
  rms: calculateMetricSummary(
    records,
    (record) => record.rms,
    (record) => record.abnormal,
  ),
  mav: calculateMetricSummary(
    records,
    (record) => record.mav,
    (record) => record.abnormal,
  ),
  iemg: calculateMetricSummary(
    records,
    (record) => record.iemg,
    (record) => record.abnormal,
  ),
  medianFrequency: calculateMetricSummary(
    records,
    (record) => record.medianFrequency,
    (record) => record.abnormal,
  ),
});

export const countBySleepStage = (records: SleepRecord[]): Record<SleepStage, number> => {
  const initial: Record<SleepStage, number> = {
    Wake: 0,
    N1: 0,
    N2: 0,
    N3: 0,
    REM: 0,
  };

  return records.reduce<Record<SleepStage, number>>((accumulator, record) => {
    accumulator[record.sleepStage] += 1;
    return accumulator;
  }, initial);
};

export const countBySleepEventType = (events: SleepEvent[]): Record<SleepEventType, number> => {
  const initial: Record<SleepEventType, number> = {
    apnea: 0,
    hypopnea: 0,
    movement: 0,
    desaturation: 0,
  };

  return events.reduce<Record<SleepEventType, number>>((accumulator, event) => {
    accumulator[event.type] += 1;
    return accumulator;
  }, initial);
};
