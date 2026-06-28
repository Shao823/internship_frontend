import type { ReactNode } from 'react';
import { Space, Typography } from 'antd';

interface PageTitleProps {
  title: string;
  description?: string;
  extra?: ReactNode;
}

export default function PageTitle({ title, description, extra }: PageTitleProps) {
  return (
    <div className="page-title">
      <div>
        <Typography.Title level={2}>{title}</Typography.Title>
        {description ? (
          <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
        ) : null}
      </div>
      {extra ? <Space>{extra}</Space> : null}
    </div>
  );
}
