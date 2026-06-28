import { Space, Spin, Typography } from 'antd';

export default function LoadingState() {
  return (
    <div className="state-panel">
      <Space direction="vertical" align="center" size={12}>
        <Spin />
        <Typography.Text type="secondary">加载数据中</Typography.Text>
      </Space>
    </div>
  );
}
