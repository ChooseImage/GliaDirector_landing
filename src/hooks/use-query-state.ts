import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

export function useQueryState(key: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key);

  const setValue = useCallback((newValue: string | null) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (newValue === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, newValue);
      }
      return newParams;
    });
  }, [key, setSearchParams]);

  return [value, setValue] as const;
}
