import { InboxOutlined } from '@ant-design/icons';
import { Alert, Descriptions, Space, Table, Typography, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import { useMemo, useState } from 'react';

import PageTitle from '@/components/PageTitle';
import { importDataFile } from '@/services/uploadService';
import type { ImportedPreviewRecord, UploadFileMeta, UploadParseResult } from '@/types';
import { PREVIEW_ROW_LIMIT } from '@/utils/constants';
import { formatDateTime, formatFileSize } from '@/utils/formatters';

const { Dragger } = Upload;

type PreviewTableRecord = ImportedPreviewRecord & {
  previewRowId: string;
};

const buildPreviewColumns = (records: PreviewTableRecord[]): ColumnsType<PreviewTableRecord> => {
  const firstRecord = records[0];

  if (!firstRecord) {
    return [];
  }

  return Object.keys(firstRecord)
    .filter((key) => key !== 'previewRowId')
    .map((key) => ({
      title: key,
      dataIndex: key,
      key,
      ellipsis: true,
      render: (value: PreviewTableRecord[string]) => String(value ?? '-'),
    }));
};

export default function DataImportPage() {
  const [parseResult, setParseResult] = useState<UploadParseResult | null>(null);
  const [failedMeta, setFailedMeta] = useState<UploadFileMeta | null>(null);
  const [uploading, setUploading] = useState(false);
  const [api, contextHolder] = message.useMessage();

  const previewRows = useMemo(
    () =>
      parseResult?.records.slice(0, PREVIEW_ROW_LIMIT).map((record, index) => ({
        ...record,
        previewRowId: `preview-${index}`,
      })) ?? [],
    [parseResult],
  );
  const previewColumns = useMemo(() => buildPreviewColumns(previewRows), [previewRows]);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.json,.csv,application/json,text/csv',
    showUploadList: false,
    beforeUpload: (file) => {
      setUploading(true);
      importDataFile(file)
        .then((result) => {
          setParseResult(result);
          setFailedMeta(null);
          api.success(`解析成功，共 ${result.meta.rowCount} 条记录`);
        })
        .catch((unknownError: unknown) => {
          const errorMessage =
            unknownError instanceof Error ? unknownError.message : '文件解析失败';
          setParseResult(null);
          setFailedMeta({
            id: `${file.name}-${file.lastModified}`,
            fileName: file.name,
            fileSize: file.size,
            uploadTime: new Date().toISOString(),
            format: file.name.toLowerCase().endsWith('.csv') ? 'CSV' : 'JSON',
            status: 'error',
            rowCount: 0,
            errorMessage,
          });
          api.error(errorMessage);
        })
        .finally(() => setUploading(false));

      return false;
    },
  };

  const currentMeta = parseResult?.meta ?? failedMeta;

  return (
    <Space direction="vertical" size={20} className="page-stack">
      {contextHolder}
      <PageTitle
        title="数据导入"
        description="支持 JSON 与 CSV 文件解析，当前在前端完成预览与格式校验。"
      />
      <Dragger {...uploadProps} className="upload-panel" disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <Typography.Title level={4}>点击或拖拽文件到此区域</Typography.Title>
        <Typography.Paragraph type="secondary">
          支持 .json / .csv。Mock 阶段仅做本地解析，真实上传接口已在 api/upload.ts 中封装。
        </Typography.Paragraph>
      </Dragger>
      {currentMeta ? (
        <section className="content-panel">
          <Typography.Title level={4}>文件信息</Typography.Title>
          <Descriptions bordered column={{ xs: 1, md: 2, xl: 4 }}>
            <Descriptions.Item label="文件名">{currentMeta.fileName}</Descriptions.Item>
            <Descriptions.Item label="大小">
              {formatFileSize(currentMeta.fileSize)}
            </Descriptions.Item>
            <Descriptions.Item label="时间">
              {formatDateTime(currentMeta.uploadTime)}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {currentMeta.status === 'success' ? '解析成功' : '解析失败'}
            </Descriptions.Item>
          </Descriptions>
          {currentMeta.status === 'error' ? (
            <Alert
              className="section-gap"
              type="error"
              showIcon
              message={currentMeta.errorMessage}
            />
          ) : null}
        </section>
      ) : null}
      {parseResult ? (
        <section className="content-panel">
          <Typography.Title level={4}>数据预览</Typography.Title>
          <Typography.Paragraph type="secondary">
            当前展示前 {Math.min(PREVIEW_ROW_LIMIT, parseResult.records.length)} 条，共{' '}
            {parseResult.records.length} 条。
          </Typography.Paragraph>
          <Table
            rowKey="previewRowId"
            columns={previewColumns}
            dataSource={previewRows}
            pagination={false}
            scroll={{ x: true }}
          />
        </section>
      ) : null}
    </Space>
  );
}
