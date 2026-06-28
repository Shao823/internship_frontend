import type {
  AlgorithmDataset,
  DetectionInfo,
  EmgRecord,
  MultiParameterRecord,
  PatientInfo,
  SleepEvent,
  SleepEventType,
  SleepRecord,
  SleepStage,
} from '@/types';

const PATIENT_ID = 'P20260601001';
const START_UTC_MS = Date.UTC(2026, 5, 1, 14, 0, 0);
const MULTI_PARAMETER_INTERVAL_MINUTES = 15;
const SLEEP_INTERVAL_MINUTES = 20;
const EMG_INTERVAL_SECONDS = 30;

const createTimestamp = (offsetMs: number) => new Date(START_UTC_MS + offsetMs).toISOString();

export const mockPatient: PatientInfo = {
  patientId: PATIENT_ID,
  name: '张明',
  gender: '男',
  age: 46,
  heightCm: 172,
  weightKg: 74,
  department: '睡眠医学中心',
  bedNo: 'B-12',
};

export const mockDetection: DetectionInfo = {
  detectionId: 'D20260601001',
  projectName: '多参 / 睡眠 / 肌电联合监测',
  deviceName: 'MedAI-Monitor X2',
  startedAt: createTimestamp(0),
  endedAt: createTimestamp(8 * 60 * 60 * 1000),
  doctorName: '李医生',
  technicianName: '邵卿宇',
};

export const mockMultiParameterRecords: MultiParameterRecord[] = Array.from(
  { length: 32 },
  (_, index) => {
    const heartRate = 68 + Math.round(Math.sin(index / 2) * 7) + (index % 11 === 0 ? 18 : 0);
    const spo2 = 97 - (index % 9 === 0 ? 5 : index % 4 === 0 ? 2 : 0);
    const respiration = 15 + Math.round(Math.cos(index / 3) * 3) + (index % 13 === 0 ? 6 : 0);
    const temperature = 36.4 + Number((Math.sin(index / 5) * 0.4).toFixed(1));
    const abnormal = heartRate > 88 || spo2 < 94 || respiration > 21 || temperature > 37.3;

    return {
      id: `mp-${String(index + 1).padStart(2, '0')}`,
      patientId: PATIENT_ID,
      timestamp: createTimestamp(index * MULTI_PARAMETER_INTERVAL_MINUTES * 60 * 1000),
      heartRate,
      spo2,
      respiration,
      temperature,
      abnormal,
      note: abnormal ? '需复核趋势或异常阈值' : '稳定',
    };
  },
);

const sleepStageSequence: SleepStage[] = [
  'Wake',
  'N1',
  'N2',
  'N2',
  'N3',
  'N3',
  'N2',
  'REM',
  'N1',
  'N2',
  'N3',
  'N3',
  'N2',
  'REM',
  'Wake',
  'N1',
  'N2',
  'N2',
  'N3',
  'REM',
  'N2',
  'N1',
  'Wake',
  'N2',
  'N3',
  'REM',
  'N2',
  'N1',
];

export const mockSleepRecords: SleepRecord[] = sleepStageSequence.map((sleepStage, index) => {
  const eventCount = index % 7 === 0 ? 3 : index % 5 === 0 ? 2 : index % 3 === 0 ? 1 : 0;
  const oxygenDropCount = sleepStage === 'REM' && index % 2 === 1 ? 2 : index % 8 === 0 ? 1 : 0;
  const sleepScore = Math.max(
    58,
    92 - eventCount * 5 - oxygenDropCount * 4 - (sleepStage === 'Wake' ? 10 : 0),
  );
  const arousalIndex = Number((3.5 + eventCount * 1.8 + oxygenDropCount * 1.2).toFixed(1));

  return {
    id: `sl-${String(index + 1).padStart(2, '0')}`,
    patientId: PATIENT_ID,
    timestamp: createTimestamp(index * SLEEP_INTERVAL_MINUTES * 60 * 1000),
    sleepStage,
    sleepScore,
    eventCount,
    oxygenDropCount,
    arousalIndex,
    abnormal: sleepScore < 75 || eventCount >= 2 || oxygenDropCount >= 2,
  };
});

const sleepEventTypes: SleepEventType[] = ['apnea', 'hypopnea', 'movement', 'desaturation'];

export const mockSleepEvents: SleepEvent[] = Array.from({ length: 24 }, (_, index) => ({
  id: `se-${String(index + 1).padStart(2, '0')}`,
  patientId: PATIENT_ID,
  timestamp: createTimestamp((index * 17 + 8) * 60 * 1000),
  type: sleepEventTypes[index % sleepEventTypes.length],
  durationSec: 12 + (index % 6) * 7,
  severity: index % 9 === 0 ? 'high' : index % 4 === 0 ? 'medium' : 'low',
}));

export const mockEmgRecords: EmgRecord[] = Array.from({ length: 64 }, (_, index) => {
  const waveform = Number(
    (
      Math.sin(index / 1.8) * 42 +
      Math.sin(index / 0.75) * 13 +
      (index % 17 === 0 ? 34 : 0)
    ).toFixed(2),
  );
  const rms = Number((22 + Math.abs(waveform) * 0.34 + (index % 19 === 0 ? 8 : 0)).toFixed(2));
  const mav = Number((18 + Math.abs(waveform) * 0.26).toFixed(2));
  const iemg = Number((120 + rms * 5.5 + index * 1.8).toFixed(2));
  const medianFrequency = Number(
    (74 + Math.sin(index / 6) * 12 - (index % 23 === 0 ? 16 : 0)).toFixed(2),
  );

  return {
    id: `emg-${String(index + 1).padStart(2, '0')}`,
    patientId: PATIENT_ID,
    timestamp: createTimestamp(index * EMG_INTERVAL_SECONDS * 1000),
    rms,
    mav,
    iemg,
    medianFrequency,
    waveform,
    abnormal: rms > 42 || medianFrequency < 62,
  };
});

export const mockAlgorithmDataset: AlgorithmDataset = {
  patient: mockPatient,
  detection: mockDetection,
  multiparameter: mockMultiParameterRecords,
  sleep: mockSleepRecords,
  sleepEvents: mockSleepEvents,
  emg: mockEmgRecords,
};
