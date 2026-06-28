import type {
  ImportedPreviewRecord,
  PrimitiveCellValue,
  UploadFormat,
  UploadParseResult,
} from '@/types';

const JSON_EXTENSION = 'json';
const CSV_EXTENSION = 'csv';

const parsePrimitive = (rawValue: string): PrimitiveCellValue => {
  const value = rawValue.trim();

  if (value === '') {
    return null;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  const numericValue = Number(value);
  if (!Number.isNaN(numericValue) && value !== '') {
    return numericValue;
  }

  return value;
};

const normalizeRecord = (record: unknown): ImportedPreviewRecord => {
  if (record === null || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error('数据行必须是对象结构');
  }

  return Object.entries(record).reduce<ImportedPreviewRecord>((accumulator, [key, value]) => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    ) {
      accumulator[key] = value;
      return accumulator;
    }

    accumulator[key] = JSON.stringify(value);
    return accumulator;
  }, {});
};

const parseJsonRecords = (text: string): ImportedPreviewRecord[] => {
  const parsedValue: unknown = JSON.parse(text);
  const source = Array.isArray(parsedValue)
    ? parsedValue
    : parsedValue !== null &&
        typeof parsedValue === 'object' &&
        'data' in parsedValue &&
        Array.isArray((parsedValue as { data: unknown }).data)
      ? (parsedValue as { data: unknown[] }).data
      : [parsedValue];

  return source.map(normalizeRecord);
};

const splitCsvLine = (line: string): string[] => {
  const cells: string[] = [];
  let current = '';
  let insideQuote = false;

  for (const char of line) {
    if (char === '"') {
      insideQuote = !insideQuote;
      continue;
    }

    if (char === ',' && !insideQuote) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
};

const parseCsvRecords = (text: string): ImportedPreviewRecord[] => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('CSV 至少需要表头和一行数据');
  }

  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  if (headers.some((header) => header.length === 0)) {
    throw new Error('CSV 表头不能为空');
  }

  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    return headers.reduce<ImportedPreviewRecord>((record, header, index) => {
      record[header] = parsePrimitive(cells[index] ?? '');
      return record;
    }, {});
  });
};

export const inferUploadFormat = (fileName: string): UploadFormat => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === JSON_EXTENSION) {
    return 'JSON';
  }

  if (extension === CSV_EXTENSION) {
    return 'CSV';
  }

  throw new Error('仅支持 JSON 或 CSV 文件');
};

export const parseDataFile = async (file: File): Promise<UploadParseResult> => {
  const format = inferUploadFormat(file.name);
  const text = await file.text();

  if (text.trim().length === 0) {
    throw new Error('文件内容为空');
  }

  const records = format === 'JSON' ? parseJsonRecords(text) : parseCsvRecords(text);

  if (records.length === 0) {
    throw new Error('未解析到有效数据');
  }

  return {
    meta: {
      id: `${file.name}-${file.lastModified}`,
      fileName: file.name,
      fileSize: file.size,
      uploadTime: new Date().toISOString(),
      format,
      status: 'success',
      rowCount: records.length,
    },
    records,
  };
};
