import { QueryClient, type InfiniteData } from "@tanstack/react-query";
import type {
  FileCreatedEvent,
  FileDeletedEvent,
  FileEvent,
  FileListItem,
  FilePatchEvent,
  PaginatedFileListResponse,
} from "shared";
import { QUERY_KEY_FILES } from "./useFilesList";
import { itemPrepend, itemsFilter, itemsMap } from "../pagedDataTransform";

export const onFileCreated = (qc: QueryClient, event: FileCreatedEvent) => {
  qc.setQueryData<InfiniteData<PaginatedFileListResponse>>(
    [QUERY_KEY_FILES],
    // Prepend the created file on the top of the first page
    (oldData) => itemPrepend(oldData, "items", event.data),
  );

  qc.setQueryData<FileListItem>([QUERY_KEY_FILES, event.data.id], event.data);
};

export const onFilePatch = (qc: QueryClient, event: FilePatchEvent) => {
  qc.setQueryData<InfiniteData<PaginatedFileListResponse>>(
    [QUERY_KEY_FILES],
    (oldData) =>
      itemsMap<PaginatedFileListResponse, FileListItem>(
        oldData,
        "items",
        // The modified file maps to the new data
        // the other files map to themselves
        (item) => (item.id === event.data.id ? event.data : item),
      ),
  );

  qc.setQueryData<FileListItem>([QUERY_KEY_FILES, event.data.id], event.data);
};

export const onFileDeleted = (qc: QueryClient, event: FileDeletedEvent) => {
  qc.setQueryData<InfiniteData<PaginatedFileListResponse>>(
    [QUERY_KEY_FILES],
    (oldData) =>
      itemsFilter<PaginatedFileListResponse, FileListItem>(
        oldData,
        "items",
        // Filter (keep) all files whose IDs are NOT the deleted file
        (item) => item.id !== event.data.id,
      ),
  );

  qc.setQueryData<FileListItem>([QUERY_KEY_FILES, event.data.id], undefined);
};

export const onFileEvent = (qc: QueryClient, event: FileEvent) => {
  switch (event.operation) {
    case "create":
      onFileCreated(qc, event);
      break;
    case "delete":
      onFileDeleted(qc, event);
      break;
    case "patch":
      onFilePatch(qc, event);
      break;
  }
};
