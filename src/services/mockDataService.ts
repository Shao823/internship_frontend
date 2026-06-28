import { mockAlgorithmDataset } from '@/mock/algorithm';
import type { AlgorithmDataset } from '@/types';

const MOCK_DELAY_MS = 120;

export const getMockAlgorithmDataset = (): Promise<AlgorithmDataset> =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(mockAlgorithmDataset), MOCK_DELAY_MS);
  });
