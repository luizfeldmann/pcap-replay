import {
  QueryClient,
  useInfiniteQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { endpoints } from "../../utils/endpoints";
import {
  PaginatedFileListResponseSchema,
  type PaginatedFileListResponse,
} from "shared";

export const QUERY_KEY_FILES = "files";

export const useFilesList = (options?: { enabled?: boolean }) =>
  useInfiniteQuery({
    queryKey: [QUERY_KEY_FILES],
    queryFn: async ({ pageParam }) => {
      const resp = await fetch(endpoints.getFiles.path("50", pageParam));
      if (!resp.ok) throw new Error(resp.statusText);
      const body = await resp.json();
      const page = PaginatedFileListResponseSchema.parse(body);
      return page;
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: options?.enabled,
  });

export const getFileFromListCache = (queryClient: QueryClient, id: string) => {
  const data = queryClient.getQueryData<
    InfiniteData<PaginatedFileListResponse>
  >([QUERY_KEY_FILES]);
  if (!data) return undefined;

  for (const page of data.pages) {
    const found = page.items.find((f) => f.id === id);
    if (found) return found;
  }
};
