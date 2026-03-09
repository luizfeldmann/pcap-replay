import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFileFromListCache, QUERY_KEY_FILES } from "./useFilesList";
import { endpoints } from "../../utils/endpoints";
import { FileListItemSchema } from "shared";

export const useSingleFile = (options: {
  id: string;
  refetchOnMount?: boolean;
  enabled?: boolean;
}) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [QUERY_KEY_FILES, options.id],
    queryFn: async () => {
      const resp = await fetch(endpoints.getSingleFile.path(options.id));
      if (!resp.ok) throw new Error(resp.statusText);
      const body = await resp.json();
      const file = FileListItemSchema.parse(body);
      return file;
    },
    placeholderData: () => getFileFromListCache(queryClient, options.id),
    refetchOnMount: options.refetchOnMount,
    enabled: options.id.length !== 0 && options.enabled !== false,
  });
};
