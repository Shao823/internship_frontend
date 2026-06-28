export type UnknownRecord = Record<string, unknown>;

export const isRecord = (value: unknown): value is UnknownRecord =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export const asString = (value: unknown, fallback: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
};

export const asNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
  }

  return fallback;
};

export const asBoolean = (value: unknown, fallback: boolean): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (['true', '1', 'yes', 'y', '异常', 'abnormal'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'no', 'n', '正常', 'normal'].includes(normalized)) {
      return false;
    }
  }

  return fallback;
};

export const getValue = (record: UnknownRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (key in record) {
      return record[key];
    }
  }

  return undefined;
};

export const getString = (record: UnknownRecord, keys: string[], fallback: string): string =>
  asString(getValue(record, keys), fallback);

export const getNumber = (record: UnknownRecord, keys: string[], fallback: number): number =>
  asNumber(getValue(record, keys), fallback);

export const getBoolean = (record: UnknownRecord, keys: string[], fallback: boolean): boolean =>
  asBoolean(getValue(record, keys), fallback);

export const getRecord = (record: UnknownRecord, keys: string[]): UnknownRecord | undefined => {
  const value = getValue(record, keys);
  return isRecord(value) ? value : undefined;
};

export const getPathValue = (record: UnknownRecord, path: string[]): unknown =>
  path.reduce<unknown>((currentValue, key) => {
    if (!isRecord(currentValue)) {
      return undefined;
    }

    return currentValue[key];
  }, record);

export const getRecordByPaths = (
  record: UnknownRecord,
  paths: string[][],
): UnknownRecord | undefined => {
  for (const path of paths) {
    const value = getPathValue(record, path);

    if (isRecord(value)) {
      return value;
    }
  }

  return undefined;
};

export const getArrayByPaths = (record: UnknownRecord, paths: string[][]): UnknownRecord[] => {
  for (const path of paths) {
    const value = getPathValue(record, path);

    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  return [];
};

export const unwrapDataPayload = (payload: unknown): unknown => {
  if (!isRecord(payload)) {
    return payload;
  }

  const code = payload.code;
  if (typeof code === 'number' && code !== 0) {
    throw new Error(asString(payload.message, '接口返回业务错误'));
  }

  const data = payload.data;
  if (data !== undefined) {
    return data;
  }

  const result = payload.result;
  if (result !== undefined) {
    return result;
  }

  return payload;
};
