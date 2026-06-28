import { uploadDataFile } from '@/api/upload';
import type { UploadParseResult } from '@/types';

export const importDataFile = (file: File): Promise<UploadParseResult> => uploadDataFile(file);
