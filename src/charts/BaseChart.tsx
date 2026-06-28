import { useEffect, useRef } from 'react';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

interface BaseChartProps {
  option: EChartsOption;
  height?: number;
  themeName?: 'dark' | 'light';
  className?: string;
}

type EChartsInstance = ReturnType<typeof echarts.init>;

export default function BaseChart({
  option,
  height = 360,
  themeName = 'dark',
  className,
}: BaseChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<EChartsInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    chartRef.current = echarts.init(containerRef.current, themeName);

    const resizeObserver = new ResizeObserver(() => {
      chartRef.current?.resize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [themeName]);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return (
    <div
      ref={containerRef}
      className={className ? `base-chart ${className}` : 'base-chart'}
      style={{ height }}
    />
  );
}
