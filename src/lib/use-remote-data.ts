"use client";

import { useEffect, useState } from "react";

export interface RemoteData<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

export function useRemoteData<T>(fetcher: () => Promise<T>): RemoteData<T> {
  const [state, setState] = useState<RemoteData<T>>({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let active = true;
    fetcher()
      .then((data) => {
        if (active) setState({ data, loading: false, error: false });
      })
      .catch(() => {
        if (active) setState({ data: null, loading: false, error: true });
      });
    return () => {
      active = false;
    };
    // fetcher is a stable module-level function; intentionally run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
