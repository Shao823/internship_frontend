import { PrinterOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import PageTitle from '@/components/PageTitle';
import { useAlgorithmData } from '@/hooks/useAlgorithmData';
import ReportDocument from '@/report/ReportDocument';

export default function ReportPreviewPage() {
  const { data, loading, error } = useAlgorithmData();

  if (loading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState message={error ?? '未获取到数据'} />;
  }

  return (
    <Space direction="vertical" size={20} className="page-stack">
      <PageTitle
        title="报告预览"
        description="前端报告预览已实现，导出 PDF 先通过浏览器打印流程完成。"
        extra={
          <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
            打印 / 导出 PDF
          </Button>
        }
      />
      <ReportDocument data={data} />
    </Space>
  );
}
