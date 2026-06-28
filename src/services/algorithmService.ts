import { fetchAlgorithmResults } from '@/api/algorithm';
import type { AlgorithmDataset } from '@/types';

export const loadAlgorithmDataset = (): Promise<AlgorithmDataset> => fetchAlgorithmResults();
