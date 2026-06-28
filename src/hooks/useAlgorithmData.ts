import { useEffect, useState } from 'react';

import { loadAlgorithmDataset } from '@/services/algorithmService';
import type { AlgorithmDataset } from '@/types';

interface UseAlgorithmDataResult {
  data: AlgorithmDataset | null;
  loading: boolean;
  error: string | null;
}

export const useAlgorithmData = (): UseAlgorithmDataResult => {
  const [data, setData] = useState<AlgorithmDataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    loadAlgorithmDataset()
      .then((dataset) => {
        if (!ignore) {
          setData(dataset);
          setError(null);
        }
      })
      .catch((unknownError: unknown) => {
        if (!ignore) {
          setError(unknownError instanceof Error ? unknownError.message : '加载算法数据失败');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { data, loading, error };
};
