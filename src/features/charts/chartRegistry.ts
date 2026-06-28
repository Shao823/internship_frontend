import type { EChartsOption } from 'echarts';

import {
  buildEmgFftOption,
  buildEmgRmsOption,
  buildEmgWaveformOption,
  buildMultiParameterLineOption,
  buildSleepEventBarOption,
  buildSleepPieOption,
  buildSleepTimelineOption,
} from '@/charts/options';
import type { AlgorithmDataset } from '@/types';

export interface ChartColumnConfig {
  xs: number;
  xl?: number;
}

export interface RegisteredChart {
  id: string;
  title: string;
  height: number;
  column?: ChartColumnConfig;
  buildOption: (dataset: AlgorithmDataset) => EChartsOption;
}

export interface ChartGroup {
  id: string;
  charts: RegisteredChart[];
}

export interface RenderedChart extends Omit<RegisteredChart, 'buildOption'> {
  option: EChartsOption;
}

export interface RenderedChartGroup {
  id: string;
  charts: RenderedChart[];
}

export const chartGroups: ChartGroup[] = [
  {
    id: 'multiparameter',
    charts: [
      {
        id: 'multiparameter-trend',
        title: '多参趋势',
        height: 420,
        buildOption: (dataset) => buildMultiParameterLineOption(dataset.multiparameter),
      },
    ],
  },
  {
    id: 'sleep',
    charts: [
      {
        id: 'sleep-stage-timeline',
        title: '睡眠阶段时间轴',
        height: 360,
        column: { xs: 24, xl: 14 },
        buildOption: (dataset) => buildSleepTimelineOption(dataset.sleep),
      },
      {
        id: 'sleep-stage-ratio',
        title: '睡眠比例',
        height: 360,
        column: { xs: 24, xl: 10 },
        buildOption: (dataset) => buildSleepPieOption(dataset.sleep),
      },
    ],
  },
  {
    id: 'sleep-events',
    charts: [
      {
        id: 'sleep-event-bars',
        title: '睡眠事件',
        height: 320,
        buildOption: (dataset) => buildSleepEventBarOption(dataset.sleepEvents),
      },
    ],
  },
  {
    id: 'emg',
    charts: [
      {
        id: 'emg-waveform',
        title: 'EMG 波形',
        height: 340,
        column: { xs: 24, xl: 12 },
        buildOption: (dataset) => buildEmgWaveformOption(dataset.emg),
      },
      {
        id: 'emg-rms',
        title: 'RMS 曲线',
        height: 340,
        column: { xs: 24, xl: 12 },
        buildOption: (dataset) => buildEmgRmsOption(dataset.emg),
      },
    ],
  },
  {
    id: 'emg-frequency',
    charts: [
      {
        id: 'emg-fft',
        title: 'FFT 频谱图',
        height: 340,
        buildOption: (dataset) => buildEmgFftOption(dataset.emg),
      },
    ],
  },
];

export const buildRenderedChartGroups = (dataset: AlgorithmDataset): RenderedChartGroup[] =>
  chartGroups.map((group) => ({
    id: group.id,
    charts: group.charts.map(({ buildOption, ...chart }) => ({
      ...chart,
      option: buildOption(dataset),
    })),
  }));
