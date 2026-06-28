import { normalizeAlgorithmDataset } from '@/api/adapters/algorithmAdapter';
import { apiClient } from '@/api/client';
import { getMockAlgorithmDataset } from '@/services/mockDataService';
import type { AlgorithmDataset } from '@/types';
import { useMockApi } from '@/utils/env';

export const fetchAlgorithmResults = async (): Promise<AlgorithmDataset> => {
  if (useMockApi) {
    return getMockAlgorithmDataset();
  }

  const response = await apiClient.get<unknown>('/algorithm/results');
  return normalizeAlgorithmDataset(response.data);
};
