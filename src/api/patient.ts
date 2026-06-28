import { normalizePatientInfo } from '@/api/adapters/algorithmAdapter';
import { apiClient } from '@/api/client';
import { getMockAlgorithmDataset } from '@/services/mockDataService';
import type { PatientInfo } from '@/types';
import { useMockApi } from '@/utils/env';

export const fetchPatient = async (patientId: string): Promise<PatientInfo> => {
  if (useMockApi) {
    const dataset = await getMockAlgorithmDataset();

    if (dataset.patient.patientId !== patientId) {
      throw new Error(`Mock 患者不存在：${patientId}`);
    }

    return dataset.patient;
  }

  const response = await apiClient.get<unknown>(`/patients/${patientId}`);
  return normalizePatientInfo(response.data);
};
