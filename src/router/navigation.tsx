import {
  BarChartOutlined,
  CloudUploadOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  HomeOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';

export interface AppNavigationItem {
  path: string;
  label: string;
  icon: ReactNode;
}

export const appNavigationItems: AppNavigationItem[] = [
  { path: '/', icon: <HomeOutlined />, label: '首页' },
  { path: '/data-import', icon: <CloudUploadOutlined />, label: '数据导入' },
  { path: '/projects', icon: <ProjectOutlined />, label: '项目选择' },
  { path: '/algorithm', icon: <FundProjectionScreenOutlined />, label: '算法展示' },
  { path: '/charts', icon: <BarChartOutlined />, label: '图表分析' },
  { path: '/report', icon: <FileTextOutlined />, label: '报告预览' },
];
