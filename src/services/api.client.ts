const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/admin';

interface ApiResponse<T = any> {
  status: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function request<T = any>(method: string, path: string, body?: any): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const opts: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);
    const res = await fetch(API_BASE + path, opts);
    clearTimeout(timeout);
    const json = await res.json();
    if (!res.ok) return { status: false, message: json.message || 'Request failed' };
    return json;
  } catch (err: any) {
    return { status: false, message: 'Cannot connect to server. Make sure the backend is running on port 5000.' };
  }
}

export const api = {
  get: <T = any>(path: string) => request<T>('GET', path),
  post: <T = any>(path: string, body?: any) => request<T>('POST', path, body),
  put: <T = any>(path: string, body?: any) => request<T>('PUT', path, body),
  patch: <T = any>(path: string, body?: any) => request<T>('PATCH', path, body),
  delete: <T = any>(path: string) => request<T>('DELETE', path),
};

export const uploadApi = {
  upload: async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(API_BASE + '/upload', { method: 'POST', body: formData, signal: controller.signal, credentials: 'include' });
      clearTimeout(timeout);
      if (!res.ok) { const e = await res.json().catch(() => ({})); console.error('Upload failed:', e.message || res.statusText); return null; }
      const json = await res.json();
      if (json.status) return API_BASE.replace('/api/admin', '') + json.data.url;
    } catch (err: any) {
      console.error('Upload failed:', err.message);
    }
    return null;
  }
};