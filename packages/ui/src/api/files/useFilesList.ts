import { useInfiniteQuery } from "@tanstack/react-query";
import { endpoints } from "../../utils/endpoints";
import { PaginatedFileListResponseSchema } from "shared";

export const QUERY_KEY_FILES = "files";

export const useFilesList = (options?: { enabled?: boolean }) =>
  useInfiniteQuery({
    queryKey: [QUERY_KEY_FILES],
    queryFn: async ({ pageParam }) => {
      const resp = await fetch(endpoints.getFiles.path("50", pageParam));
      const body = await resp.json();
      const page = PaginatedFileListResponseSchema.parse(body);
      return page;
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: options?.enabled,
  });
