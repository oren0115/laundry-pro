import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import type { PublicContentData } from "@/types/public-content";
import { DEFAULT_PUBLIC_CONTENT } from "@/lib/public-content-defaults";

type Ctx = {
  content: PublicContentData;
  loading: boolean;
  refresh: () => Promise<void>;
};

const PublicContentContext = createContext<Ctx | null>(null);

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export function PublicContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PublicContentData>(DEFAULT_PUBLIC_CONTENT);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await axios.get<{ success: boolean; data: PublicContentData }>(
        `${API_URL}/public/content`
      );
      if (data.success && data.data) setContent(data.data);
    } catch {
      setContent(DEFAULT_PUBLIC_CONTENT);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(() => ({ content, loading, refresh }), [content, loading, refresh]);

  return (
    <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>
  );
}

export function usePublicContent() {
  const ctx = useContext(PublicContentContext);
  if (!ctx) {
    return {
      content: DEFAULT_PUBLIC_CONTENT,
      loading: false,
      refresh: async () => {},
    };
  }
  return ctx;
}
