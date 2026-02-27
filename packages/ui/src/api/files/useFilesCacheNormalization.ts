import { useEffect } from "react";
import { QUERY_KEY_FILES, useFilesList } from "./useFilesList";
import { useQueryClient } from "@tanstack/react-query";

export const useFilesCacheNormalization = () => {
  const queryClient = useQueryClient();
  const listQuery = useFilesList({ enabled: false });

  // Instantly resolve the single-file queries
  useEffect(
    () =>
      listQuery.data?.pages.forEach((page) =>
        page.items.forEach((file) =>
          queryClient.setQueryData([QUERY_KEY_FILES, file.id], file),
        ),
      ),
    [queryClient, listQuery.data],
  );
};
