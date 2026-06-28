import { apiClient, unwrapApiEnvelope } from '@/api/client';
import type { ApiEnvelope, UploadParseResult } from '@/types';
import { useMockApi } from '@/utils/env';
import { parseDataFile } from '@/utils/fileParser';

export const uploadDataFile = async (file: File): Promise<UploadParseResult> => {
  if (useMockApi) {
    return parseDataFile(file);
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ApiEnvelope<UploadParseResult>>('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return unwrapApiEnvelope(response);
};
