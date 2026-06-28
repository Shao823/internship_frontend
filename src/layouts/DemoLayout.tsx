import { DashboardOutlined } from '@ant-design/icons';
import { Layout, Menu, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useNow } from '@/hooks/useNow';
import { appNavigationItems } from '@/router/navigation';
import { APP_VERSION, PROJECT_NAME } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

const { Header, Sider, Content } = Layout;

const menuItems: NonNullable<MenuProps['items']> = appNavigationItems.map((item) => ({
  key: item.path,
  icon: item.icon,
  label: item.label,
}));

export default function DemoLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const now = useNow();
  const selectedKey = menuItems.some((item) => item?.key === location.pathname)
    ? location.pathname
    : '/';

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <Space size={12} className="brand-area">
          <div className="brand-logo">
            <DashboardOutlined />
          </div>
          <div>
            <Typography.Text className="brand-title">{PROJECT_NAME}</Typography.Text>
            <Typography.Text className="brand-subtitle">真实企业 Demo 前端</Typography.Text>
          </div>
        </Space>
        <Space size={16} className="header-meta">
          <Typography.Text>{formatDateTime(now)}</Typography.Text>
          <Tag color="cyan">{APP_VERSION}</Tag>
        </Space>
      </Header>
      <Layout>
        <Sider className="app-sider" width={232} breakpoint="lg" collapsedWidth={72}>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
