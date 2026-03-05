import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY_FILES } from "./useFilesList";
import { endpoints } from "../../utils/endpoints";
import { FileListItemSchema } from "shared";

export const useSingleFile = (options: {
  id: string;
  refetchOnMount?: boolean;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [QUERY_KEY_FILES, options.id],
    queryFn: async () => {
      const resp = await fetch(endpoints.getSingleFile.path(options.id));
      if (!resp.ok) throw new Error(resp.statusText);
      const body = await resp.json();
      const file = FileListItemSchema.parse(body);
      return file;
    },
    refetchOnMount: options.refetchOnMount,
    enabled: options.id.length !== 0 && options.enabled !== false,
  });
