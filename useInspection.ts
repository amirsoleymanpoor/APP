import { useState, useCallback } from 'react';
import { InspectionResult, ApiResponse } from '../types';
import { inspectComponent } from '../services/api';

interface UseInspectionReturn {
  result: InspectionResult | null;
  loading: boolean;
  error: string | null;
  inspect: (image: string, mimeType: string, componentType: string, sensitivity: string, instructions: string) => Promise<void>;
  clear: () => void;
}

export function useInspection(): UseInspectionReturn {
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inspect = useCallback(async (
    image: string,
    mimeType: string,
    componentType: string,
    sensitivity: string,
    instructions: string
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data: ApiResponse = await inspectComponent(image, mimeType, componentType, sensitivity, instructions);

      if (!data.success || !data.result) {
        throw new Error(data.error || 'خطای ناشناخته در سرور');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'خطا در تحلیل تصویر');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { result, loading, error, inspect, clear };
}
