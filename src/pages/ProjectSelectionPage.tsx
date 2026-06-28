import { Card, Col, Row, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import PageTitle from '@/components/PageTitle';
import { mockProjects, type DemoProject } from '@/mock/projects';
import { formatDateTime } from '@/utils/formatters';

const statusText: Record<DemoProject['status'], string> = {
  ready: '可演示',
  'in-progress': '开发中',
  pending: '待接入',
};

const statusColor: Record<DemoProject['status'], string> = {
  ready: 'green',
  'in-progress': 'blue',
  pending: 'orange',
};

const columns: ColumnsType<DemoProject> = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '负责人',
    dataIndex: 'owner',
    key: 'owner',
    width: 140,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (status: DemoProject['status']) => (
      <Tag color={statusColor[status]}>{statusText[status]}</Tag>
    ),
  },
  {
    title: '模块',
    dataIndex: 'modules',
    key: 'modules',
    render: (modules: string[]) => (
      <Space wrap>
        {modules.map((module) => (
          <Tag key={module}>{module}</Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 190,
    render: (updatedAt: string) => formatDateTime(updatedAt),
  },
];

export default function ProjectSelectionPage() {
  return (
    <Space direction="vertical" size={20} className="page-stack">
      <PageTitle
        title="项目选择"
        description="预留多项目入口，后续可对接后端项目列表与权限体系。"
      />
      <Row gutter={[16, 16]}>
        {mockProjects.map((project) => (
          <Col xs={24} lg={8} key={project.id}>
            <Card className="project-card">
              <Space direction="vertical" size={12}>
                <Tag color={statusColor[project.status]}>{statusText[project.status]}</Tag>
                <Typography.Title level={4}>{project.name}</Typography.Title>
                <Typography.Text type="secondary">{project.owner}</Typography.Text>
                <Space wrap>
                  {project.modules.map((module) => (
                    <Tag key={module}>{module}</Tag>
                  ))}
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      <Table rowKey="id" columns={columns} dataSource={mockProjects} pagination={false} />
    </Space>
  );
}
