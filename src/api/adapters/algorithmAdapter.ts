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

import {
  asString,
  getArrayByPaths,
  getBoolean,
  getNumber,
  getRecordByPaths,
  getString,
  isRecord,
  unwrapDataPayload,
  type UnknownRecord,
} from './common';

const DEFAULT_PATIENT_ID = 'UNKNOWN_PATIENT';
const DEFAULT_DETECTION_ID = 'UNKNOWN_DETECTION';
const DEFAULT_TIMESTAMP = '1970-01-01T00:00:00.000Z';

const PATIENT_PATHS = [
  ['patient'],
  ['patientInfo'],
  ['patient_info'],
  ['subject'],
  ['subjectInfo'],
  ['subject_info'],
];

const DETECTION_PATHS = [
  ['detection'],
  ['detectionInfo'],
  ['detection_info'],
  ['exam'],
  ['session'],
  ['project'],
];

const MULTIPARAMETER_PATHS = [
  ['multiparameter'],
  ['multiParameter'],
  ['multi_parameter'],
  ['multiParam'],
  ['multi_param'],
  ['multiParams'],
  ['multi_params'],
  ['vitalSigns'],
  ['vital_signs'],
  ['multiparameterRecords'],
  ['multiparameter_records'],
  ['records', 'multiparameter'],
  ['records', 'multi_parameter'],
  ['results', 'multiparameter'],
  ['algorithmResults', 'multiparameter'],
  ['algorithm_results', 'multiparameter'],
];

const SLEEP_PATHS = [
  ['sleep'],
  ['sleepRecords'],
  ['sleep_records'],
  ['sleepStages'],
  ['sleep_stages'],
  ['records', 'sleep'],
  ['results', 'sleep'],
  ['algorithmResults', 'sleep'],
  ['algorithm_results', 'sleep'],
];

const SLEEP_EVENT_PATHS = [
  ['sleepEvents'],
  ['sleep_events'],
  ['events'],
  ['records', 'sleepEvents'],
  ['records', 'sleep_events'],
  ['results', 'sleepEvents'],
  ['results', 'sleep_events'],
  ['algorithmResults', 'sleepEvents'],
  ['algorithm_results', 'sleep_events'],
];

const EMG_PATHS = [
  ['emg'],
  ['emgRecords'],
  ['emg_records'],
  ['muscle'],
  ['muscleSignals'],
  ['muscle_signals'],
  ['records', 'emg'],
  ['results', 'emg'],
  ['algorithmResults', 'emg'],
  ['algorithm_results', 'emg'],
];

const normalizeGender = (value: unknown): PatientInfo['gender'] => {
  const normalized = asString(value, '未知').trim().toLowerCase();

  if (['男', 'm', 'male', 'man'].includes(normalized)) {
    return '男';
  }

  if (['女', 'f', 'female', 'woman'].includes(normalized)) {
    return '女';
  }

  return '未知';
};

const normalizeSleepStage = (value: unknown): SleepStage => {
  const normalized = asString(value, 'Wake').toUpperCase();

  if (['N1', 'N2', 'N3', 'REM'].includes(normalized)) {
    return normalized as SleepStage;
  }

  if (['WAKE', 'W'].includes(normalized)) {
    return 'Wake';
  }

  return 'Wake';
};

const normalizeSleepEventType = (value: unknown): SleepEventType => {
  const normalized = asString(value, 'movement').toLowerCase();

  if (['apnea', 'hypopnea', 'movement', 'desaturation'].includes(normalized)) {
    return normalized as SleepEventType;
  }

  return 'movement';
};

const normalizeSeverity = (value: unknown): SleepEvent['severity'] => {
  const normalized = asString(value, 'low').toLowerCase();

  if (['low', 'medium', 'high'].includes(normalized)) {
    return normalized as SleepEvent['severity'];
  }

  return 'low';
};

const normalizeTimestamp = (record: UnknownRecord, fallback = DEFAULT_TIMESTAMP) =>
  getString(
    record,
    ['timestamp', 'time', 'recordedAt', 'recorded_at', 'acquisitionTime', 'acquisition_time', 'ts'],
    fallback,
  );

const normalizeBaseRecord = (
  record: UnknownRecord,
  index: number,
  prefix: string,
  patientId: string,
) => ({
  id: getString(record, ['id', '_id', 'recordId', 'record_id'], `${prefix}-${index + 1}`),
  patientId: getString(record, ['patientId', 'patient_id', 'subjectId', 'subject_id'], patientId),
  timestamp: normalizeTimestamp(record),
});

export const normalizePatientInfo = (payload: unknown): PatientInfo => {
  const unwrappedPayload = unwrapDataPayload(payload);
  const root = isRecord(unwrappedPayload) ? unwrappedPayload : {};
  const patient = getRecordByPaths(root, PATIENT_PATHS) ?? root;

  return {
    patientId: getString(
      patient,
      ['patientId', 'patient_id', 'id', 'subjectId', 'subject_id'],
      DEFAULT_PATIENT_ID,
    ),
    name: getString(
      patient,
      ['name', 'patientName', 'patient_name', 'subjectName', 'subject_name'],
      '未知患者',
    ),
    gender: normalizeGender(getString(patient, ['gender', 'sex'], '未知')),
    age: getNumber(patient, ['age'], 0),
    heightCm: getNumber(patient, ['heightCm', 'height_cm', 'height'], 0),
    weightKg: getNumber(patient, ['weightKg', 'weight_kg', 'weight'], 0),
    department: getString(
      patient,
      ['department', 'dept', 'departmentName', 'department_name'],
      '-',
    ),
    bedNo: getString(patient, ['bedNo', 'bed_no', 'bed', 'bedNumber', 'bed_number'], '-'),
  };
};

const normalizeDetectionInfo = (root: UnknownRecord): DetectionInfo => {
  const detection = getRecordByPaths(root, DETECTION_PATHS) ?? root;

  return {
    detectionId: getString(
      detection,
      ['detectionId', 'detection_id', 'id', 'sessionId', 'session_id', 'examId', 'exam_id'],
      DEFAULT_DETECTION_ID,
    ),
    projectName: getString(
      detection,
      ['projectName', 'project_name', 'name', 'title', 'detectionName', 'detection_name'],
      '算法检测项目',
    ),
    deviceName: getString(detection, ['deviceName', 'device_name', 'device'], '-'),
    startedAt: getString(
      detection,
      ['startedAt', 'started_at', 'startTime', 'start_time', 'beginTime', 'begin_time'],
      DEFAULT_TIMESTAMP,
    ),
    endedAt: getString(
      detection,
      ['endedAt', 'ended_at', 'endTime', 'end_time', 'finishTime', 'finish_time'],
      DEFAULT_TIMESTAMP,
    ),
    doctorName: getString(detection, ['doctorName', 'doctor_name', 'doctor'], '-'),
    technicianName: getString(detection, ['technicianName', 'technician_name', 'technician'], '-'),
  };
};

const normalizeMultiParameterRecord = (
  record: UnknownRecord,
  index: number,
  patientId: string,
): MultiParameterRecord => {
  const heartRate = getNumber(record, ['heartRate', 'heart_rate', 'hr'], 0);
  const spo2 = getNumber(record, ['spo2', 'SpO2', 'oxygenSaturation', 'oxygen_saturation'], 0);
  const respiration = getNumber(
    record,
    ['respiration', 'respirationRate', 'respiration_rate', 'rr'],
    0,
  );
  const temperature = getNumber(
    record,
    ['temperature', 'temp', 'bodyTemperature', 'body_temperature'],
    0,
  );
  const computedAbnormal = heartRate > 88 || spo2 < 94 || respiration > 21 || temperature > 37.3;

  return {
    ...normalizeBaseRecord(record, index, 'mp', patientId),
    heartRate,
    spo2,
    respiration,
    temperature,
    abnormal: getBoolean(record, ['abnormal', 'isAbnormal', 'is_abnormal'], computedAbnormal),
    note: getString(
      record,
      ['note', 'remark', 'description'],
      computedAbnormal ? '需复核' : '稳定',
    ),
  };
};

const normalizeSleepRecord = (
  record: UnknownRecord,
  index: number,
  patientId: string,
): SleepRecord => {
  const sleepScore = getNumber(record, ['sleepScore', 'sleep_score', 'score'], 0);
  const eventCount = getNumber(record, ['eventCount', 'event_count', 'events'], 0);
  const oxygenDropCount = getNumber(
    record,
    ['oxygenDropCount', 'oxygen_drop_count', 'desaturationCount', 'desaturation_count'],
    0,
  );
  const computedAbnormal =
    sleepScore > 0 && (sleepScore < 75 || eventCount >= 2 || oxygenDropCount >= 2);

  return {
    ...normalizeBaseRecord(record, index, 'sl', patientId),
    sleepStage: normalizeSleepStage(
      getString(record, ['sleepStage', 'sleep_stage', 'stage'], 'Wake'),
    ),
    sleepScore,
    eventCount,
    oxygenDropCount,
    arousalIndex: getNumber(record, ['arousalIndex', 'arousal_index'], 0),
    abnormal: getBoolean(record, ['abnormal', 'isAbnormal', 'is_abnormal'], computedAbnormal),
  };
};

const normalizeSleepEvent = (
  record: UnknownRecord,
  index: number,
  patientId: string,
): SleepEvent => ({
  ...normalizeBaseRecord(record, index, 'se', patientId),
  type: normalizeSleepEventType(getString(record, ['type', 'eventType', 'event_type'], 'movement')),
  durationSec: getNumber(record, ['durationSec', 'duration_sec', 'duration', 'seconds'], 0),
  severity: normalizeSeverity(getString(record, ['severity', 'level'], 'low')),
});

const normalizeEmgRecord = (record: UnknownRecord, index: number, patientId: string): EmgRecord => {
  const rms = getNumber(record, ['rms', 'RMS'], 0);
  const medianFrequency = getNumber(
    record,
    ['medianFrequency', 'median_frequency', 'mf', 'frequencyMedian', 'frequency_median'],
    0,
  );

  return {
    ...normalizeBaseRecord(record, index, 'emg', patientId),
    rms,
    mav: getNumber(record, ['mav', 'MAV'], 0),
    iemg: getNumber(record, ['iemg', 'IEMG'], 0),
    medianFrequency,
    waveform: getNumber(record, ['waveform', 'wave', 'amplitude'], 0),
    abnormal: getBoolean(
      record,
      ['abnormal', 'isAbnormal', 'is_abnormal'],
      rms > 42 || medianFrequency < 62,
    ),
  };
};

export const normalizeAlgorithmDataset = (payload: unknown): AlgorithmDataset => {
  const unwrappedPayload = unwrapDataPayload(payload);
  const root = isRecord(unwrappedPayload) ? unwrappedPayload : {};
  const patient = normalizePatientInfo(root);
  const detection = normalizeDetectionInfo(root);

  return {
    patient,
    detection,
    multiparameter: getArrayByPaths(root, MULTIPARAMETER_PATHS).map((record, index) =>
      normalizeMultiParameterRecord(record, index, patient.patientId),
    ),
    sleep: getArrayByPaths(root, SLEEP_PATHS).map((record, index) =>
      normalizeSleepRecord(record, index, patient.patientId),
    ),
    sleepEvents: getArrayByPaths(root, SLEEP_EVENT_PATHS).map((record, index) =>
      normalizeSleepEvent(record, index, patient.patientId),
    ),
    emg: getArrayByPaths(root, EMG_PATHS).map((record, index) =>
      normalizeEmgRecord(record, index, patient.patientId),
    ),
  };
};
