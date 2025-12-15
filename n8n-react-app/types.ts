export interface RowData {
  id: string | number;
  [key: string]: any;
}

export interface ApiError {
  message: string;
  code?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export enum ApiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';
