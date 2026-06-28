import { apiClient, unwrapApiEnvelope } from '@/api/client';
import { mockDetection, mockPatient } from '@/mock/algorithm';
import type { ApiEnvelope, ReportPayload } from '@/types';
import { useMockApi } from '@/utils/env';

export const generateReport = async (): Promise<ReportPayload> => {
  if (useMockApi) {
    return {
      patientId: mockPatient.patientId,
      detectionId: mockDetection.detectionId,
      generatedAt: new Date().toISOString(),
      conclusion: '本次监测可见轻度睡眠片段化，血氧下降事件较少，肌电中位频率存在短时下降。',
      advice: [
        '建议结合临床主诉复核睡眠事件。',
        '持续观察夜间血氧趋势。',
        '如肌电异常持续，建议补充神经肌肉评估。',
      ],
    };
  }

  const response = await apiClient.post<ApiEnvelope<ReportPayload>>('/reports/generate');
  return unwrapApiEnvelope(response);
};
