import type { EChartsOption } from 'echarts';

import type { EmgRecord, MultiParameterRecord, SleepEvent, SleepRecord, SleepStage } from '@/types';
import { countBySleepEventType, countBySleepStage } from '@/utils/statistics';
import { formatShortTime } from '@/utils/formatters';

const chartTextColor = '#dce8f6';
const chartAxisColor = '#52677f';

const baseGrid = {
  left: 46,
  right: 28,
  top: 54,
  bottom: 64,
};

const baseTooltip = {
  trigger: 'axis' as const,
  backgroundColor: 'rgba(10, 20, 35, 0.92)',
  borderColor: '#28465f',
  textStyle: {
    color: chartTextColor,
  },
};

const categoryAxisStyle = {
  axisLine: { lineStyle: { color: chartAxisColor } },
  axisLabel: { color: chartTextColor },
};

const valueAxisStyle = {
  splitLine: { lineStyle: { color: 'rgba(130, 160, 190, 0.16)' } },
  axisLabel: { color: chartTextColor },
};

export const buildMultiParameterLineOption = (records: MultiParameterRecord[]): EChartsOption => ({
  color: ['#5ad8a6', '#5b8ff9', '#f6bd16', '#ff7a45'],
  tooltip: baseTooltip,
  legend: {
    top: 10,
    textStyle: { color: chartTextColor },
    data: ['Heart Rate', 'SpO2', 'Respiration', 'Temperature'],
  },
  grid: baseGrid,
  xAxis: {
    type: 'category',
    data: records.map((record) => formatShortTime(record.timestamp)),
    ...categoryAxisStyle,
  },
  yAxis: [
    {
      type: 'value',
      name: '生命体征',
      ...valueAxisStyle,
    },
  ],
  dataZoom: [
    { type: 'inside', start: 0, end: 100 },
    { type: 'slider', start: 0, end: 100, bottom: 18 },
  ],
  series: [
    {
      name: 'Heart Rate',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: records.map((record) => record.heartRate),
    },
    {
      name: 'SpO2',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: records.map((record) => record.spo2),
    },
    {
      name: 'Respiration',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: records.map((record) => record.respiration),
    },
    {
      name: 'Temperature',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: records.map((record) => record.temperature),
    },
  ],
});

const sleepStageScore: Record<SleepStage, number> = {
  Wake: 4,
  REM: 3,
  N1: 2,
  N2: 1,
  N3: 0,
};

export const buildSleepTimelineOption = (records: SleepRecord[]): EChartsOption => ({
  tooltip: baseTooltip,
  grid: baseGrid,
  xAxis: {
    type: 'category',
    data: records.map((record) => formatShortTime(record.timestamp)),
    ...categoryAxisStyle,
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 4,
    interval: 1,
    axisLabel: {
      color: chartTextColor,
      formatter: (value: number) => {
        const entry = Object.entries(sleepStageScore).find(([, score]) => score === value);
        return entry?.[0] ?? '';
      },
    },
    splitLine: { lineStyle: { color: 'rgba(130, 160, 190, 0.16)' } },
  },
  dataZoom: [
    { type: 'inside', start: 0, end: 100 },
    { type: 'slider', start: 0, end: 100, bottom: 18 },
  ],
  series: [
    {
      name: 'Sleep Stage',
      type: 'line',
      step: 'middle',
      areaStyle: { opacity: 0.18 },
      lineStyle: { width: 2 },
      data: records.map((record) => sleepStageScore[record.sleepStage]),
    },
  ],
});

export const buildSleepPieOption = (records: SleepRecord[]): EChartsOption => {
  const stageCount = countBySleepStage(records);

  return {
    color: ['#8fd3ff', '#5b8ff9', '#5ad8a6', '#f6bd16', '#ff7a45'],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 20, 35, 0.92)',
      borderColor: '#28465f',
      textStyle: { color: chartTextColor },
    },
    legend: {
      bottom: 0,
      textStyle: { color: chartTextColor },
    },
    series: [
      {
        name: '睡眠阶段占比',
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '44%'],
        data: Object.entries(stageCount).map(([name, value]) => ({ name, value })),
        label: { color: chartTextColor },
      },
    ],
  };
};

export const buildSleepEventBarOption = (events: SleepEvent[]): EChartsOption => {
  const eventCount = countBySleepEventType(events);
  const entries = Object.entries(eventCount);

  return {
    color: ['#ff9f7f'],
    tooltip: baseTooltip,
    grid: baseGrid,
    xAxis: {
      type: 'category',
      data: entries.map(([type]) => type),
      ...categoryAxisStyle,
    },
    yAxis: {
      type: 'value',
      name: '事件数',
      ...valueAxisStyle,
    },
    series: [
      {
        name: '事件数量',
        type: 'bar',
        barWidth: 32,
        data: entries.map(([, value]) => value),
      },
    ],
  };
};

export const buildEmgWaveformOption = (records: EmgRecord[]): EChartsOption => ({
  color: ['#5ad8a6'],
  tooltip: baseTooltip,
  grid: baseGrid,
  xAxis: {
    type: 'category',
    data: records.map((record) => formatShortTime(record.timestamp)),
    ...categoryAxisStyle,
  },
  yAxis: {
    type: 'value',
    name: 'uV',
    ...valueAxisStyle,
  },
  dataZoom: [
    { type: 'inside', start: 0, end: 100 },
    { type: 'slider', start: 0, end: 100, bottom: 18 },
  ],
  series: [
    {
      name: 'EMG Waveform',
      type: 'line',
      showSymbol: false,
      data: records.map((record) => record.waveform),
    },
  ],
});

export const buildEmgRmsOption = (records: EmgRecord[]): EChartsOption => ({
  color: ['#f6bd16'],
  tooltip: baseTooltip,
  grid: baseGrid,
  xAxis: {
    type: 'category',
    data: records.map((record) => formatShortTime(record.timestamp)),
    ...categoryAxisStyle,
  },
  yAxis: {
    type: 'value',
    name: 'RMS',
    ...valueAxisStyle,
  },
  dataZoom: [{ type: 'inside', start: 0, end: 100 }],
  series: [
    {
      name: 'RMS',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: records.map((record) => record.rms),
    },
  ],
});

export const buildEmgFftOption = (records: EmgRecord[]): EChartsOption => {
  const frequencyBins = Array.from({ length: 24 }, (_, index) => index * 8 + 8);
  const spectrum = frequencyBins.map((frequency, index) => {
    const median = records.length > 0 ? records[index % records.length].medianFrequency : 70;
    return Number(
      (Math.max(0, 100 - Math.abs(frequency - median) * 1.3) + (index % 4) * 3).toFixed(2),
    );
  });

  return {
    color: ['#5b8ff9'],
    tooltip: baseTooltip,
    grid: baseGrid,
    xAxis: {
      type: 'category',
      name: 'Hz',
      data: frequencyBins,
      ...categoryAxisStyle,
    },
    yAxis: {
      type: 'value',
      name: 'Power',
      ...valueAxisStyle,
    },
    series: [
      {
        name: 'FFT',
        type: 'bar',
        barWidth: 14,
        data: spectrum,
      },
    ],
  };
};
