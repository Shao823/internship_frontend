import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import type { ApiEnvelope, ApiErrorPayload } from '@/types';

const SUCCESS_CODE = 0;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set('X-Request-Id', crypto.randomUUID());
  return config;
});

const formatFastApiDetail = (detail: ApiErrorPayload['detail']): string | undefined => {
  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail.map((issue) => `${issue.loc.join('.')}: ${issue.msg}`).join('；');
  }

  return undefined;
};

const normalizeApiErrorMessage = (error: AxiosError<ApiErrorPayload>): string => {
  const payload = error.response?.data;
  const validationMessage = payload ? formatFastApiDetail(payload.detail) : undefined;

  return validationMessage ?? payload?.message ?? error.message ?? '接口请求失败，请稍后重试';
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    return Promise.reject(new Error(normalizeApiErrorMessage(error)));
  },
);

export const unwrapApiEnvelope = <T>(response: AxiosResponse<ApiEnvelope<T>>): T => {
  const payload = response.data;

  if (payload.code !== SUCCESS_CODE) {
    throw new Error(payload.message || '接口返回业务错误');
  }

  return payload.data;
};
