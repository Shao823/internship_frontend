export type MeasurementCategory = 'multiparameter' | 'sleep' | 'emg';

export interface PatientInfo {
  patientId: string;
  name: string;
  gender: '男' | '女' | '未知';
  age: number;
  heightCm: number;
  weightKg: number;
  department: string;
  bedNo: string;
}

export interface DetectionInfo {
  detectionId: string;
  projectName: string;
  deviceName: string;
  startedAt: string;
  endedAt: string;
  doctorName: string;
  technicianName: string;
}

export interface BaseRecord {
  id: string;
  patientId: string;
  timestamp: string;
}

export interface MultiParameterRecord extends BaseRecord {
  heartRate: number;
  spo2: number;
  respiration: number;
  temperature: number;
  abnormal: boolean;
  note: string;
}

export type SleepStage = 'Wake' | 'N1' | 'N2' | 'N3' | 'REM';

export type SleepEventType = 'apnea' | 'hypopnea' | 'movement' | 'desaturation';

export interface SleepRecord extends BaseRecord {
  sleepStage: SleepStage;
  sleepScore: number;
  eventCount: number;
  oxygenDropCount: number;
  arousalIndex: number;
  abnormal: boolean;
}

export interface SleepEvent {
  id: string;
  patientId: string;
  timestamp: string;
  type: SleepEventType;
  durationSec: number;
  severity: 'low' | 'medium' | 'high';
}

export interface EmgRecord extends BaseRecord {
  rms: number;
  mav: number;
  iemg: number;
  medianFrequency: number;
  waveform: number;
  abnormal: boolean;
}

export interface AlgorithmDataset {
  patient: PatientInfo;
  detection: DetectionInfo;
  multiparameter: MultiParameterRecord[];
  sleep: SleepRecord[];
  sleepEvents: SleepEvent[];
  emg: EmgRecord[];
}

export interface MetricSummary {
  average: number;
  max: number;
  min: number;
  abnormalCount: number;
  total: number;
}

export interface StatisticItem {
  title: string;
  value: number | string;
  suffix?: string;
  precision?: number;
  status?: 'normal' | 'success' | 'warning' | 'danger';
}

export type UploadFormat = 'JSON' | 'CSV';

export type PrimitiveCellValue = string | number | boolean | null;

export type ImportedPreviewRecord = Record<string, PrimitiveCellValue>;

export interface UploadFileMeta {
  id: string;
  fileName: string;
  fileSize: number;
  uploadTime: string;
  format: UploadFormat;
  status: 'success' | 'error';
  rowCount: number;
  errorMessage?: string;
}

export interface UploadParseResult {
  meta: UploadFileMeta;
  records: ImportedPreviewRecord[];
}

export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

export interface FastApiValidationIssue {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

export interface ApiErrorPayload {
  code?: number;
  message?: string;
  detail?: string | FastApiValidationIssue[];
}

export interface ReportPayload {
  patientId: string;
  detectionId: string;
  generatedAt: string;
  conclusion: string;
  advice: string[];
}
