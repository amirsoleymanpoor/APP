import { ApiResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function inspectComponent(
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  componentType: string = 'برد الکترونیکی PCB',
  sensitivity: string = 'medium',
  customInstructions: string = ''
): Promise<ApiResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch(`${API_BASE}/api/inspect-component`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
        componentType,
        sensitivity,
        customInstructions,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return { success: false, error: 'زمان انتظار برای پاسخ API به پایان رسید (۶۰ ثانیه).' };
    }
    return { success: false, error: error.message || 'خطا در ارتباط با سرور' };
  }
}
