import { API_BASE_URL, APP_CONFIG } from '../constants';
import { ApiMethod, RowData } from '../types';

class SheetApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async request<T>(endpoint: string, method: ApiMethod, body?: any): Promise<T> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), APP_CONFIG.apiTimeout);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      clearTimeout(id);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error (${response.status}): ${errorBody || response.statusText}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      } else {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { message: text } as unknown as T;
        }
      }
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  async listRows(): Promise<RowData[]> {
    return this.request<RowData[]>('/list', ApiMethod.GET);
  }

  async findRow(id: string | number): Promise<RowData> {
    const safeId = encodeURIComponent(String(id));
    return this.request<RowData>(`/find?id=${safeId}`, ApiMethod.GET);
  }

  async addRow(data: Omit<RowData, 'id'>): Promise<any> {
    return this.request('/add', ApiMethod.POST, data);
  }

  async updateRow(id: string | number, data: Partial<RowData>): Promise<any> {
    const safeId = encodeURIComponent(String(id));
    return this.request(`/update?id=${safeId}`, ApiMethod.PUT, data);
  }

  async deleteRow(id: string | number): Promise<any> {
    const safeId = encodeURIComponent(String(id));
    return this.request(`/delete?id=${safeId}`, ApiMethod.DELETE);
  }
}

export const sheetApi = new SheetApi(API_BASE_URL);
