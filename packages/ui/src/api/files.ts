import { useInfiniteQuery } from "@tanstack/react-query";
import { PaginatedFileListResponseSchema } from "shared";
import endpoints from "../constants/endpoints.json";

const QUERY_KEY = "files";

export const useFiles = () =>
  useInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: "50",
      });
      if (pageParam.length) params.append("cursor", pageParam);
      const resp = await fetch(`${endpoints.getFiles}?${params.toString()}`);
      const body = await resp.json();
      const page = PaginatedFileListResponseSchema.parse(body);
      return page;
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
