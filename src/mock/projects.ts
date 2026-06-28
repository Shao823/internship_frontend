export interface DemoProject {
  id: string;
  name: string;
  owner: string;
  status: 'ready' | 'in-progress' | 'pending';
  modules: string[];
  updatedAt: string;
}

export const mockProjects: DemoProject[] = [
  {
    id: 'project-multi-sleep-emg',
    name: '多参 / 睡眠 / 肌电联合 Demo',
    owner: '前端演示组',
    status: 'ready',
    modules: ['数据导入', '算法展示', '图表分析', '报告预览'],
    updatedAt: '2026-06-18T09:30:00.000Z',
  },
  {
    id: 'project-sleep-optimization',
    name: '同仁睡眠算法优化',
    owner: '算法组',
    status: 'in-progress',
    modules: ['睡眠分期', '事件识别', '误差分析'],
    updatedAt: '2026-06-15T11:20:00.000Z',
  },
  {
    id: 'project-respiration-spo2',
    name: '呼吸血氧算法验证',
    owner: '生理信号组',
    status: 'pending',
    modules: ['峰值检测', '滑窗统计', '异常识别'],
    updatedAt: '2026-06-12T16:45:00.000Z',
  },
];
