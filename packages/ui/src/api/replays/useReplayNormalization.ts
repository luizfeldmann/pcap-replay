import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type {
  PaginatedReplayListResponse,
  ReplayCreatedEvent,
  ReplayDeleteEvent,
  ReplayEvent,
  ReplayListItem,
  ReplayLogEvent,
  ReplayPatchEvent,
  ReplayStatusEvent,
} from "shared";
import { REPLAYS_QUERY_KEY } from "./useReplaysList";
import { itemsFilter, itemsMap, itemPrepend } from "../pagedDataTransform";

export const onReplayCreated = (qc: QueryClient, event: ReplayCreatedEvent) => {
  qc.setQueryData<InfiniteData<PaginatedReplayListResponse>>(
    [REPLAYS_QUERY_KEY],
    (oldData) => itemPrepend(oldData, "items", event.data),
  );

  qc.setQueryData<ReplayListItem>(
    [REPLAYS_QUERY_KEY, event.data.id],
    event.data,
  );
};

export const onReplayPatch = (qc: QueryClient, event: ReplayPatchEvent) => {
  qc.setQueryData<InfiniteData<PaginatedReplayListResponse>>(
    [REPLAYS_QUERY_KEY],
    (oldData) =>
      itemsMap<PaginatedReplayListResponse, ReplayListItem>(
        oldData,
        "items",
        (item) => (item.id === event.data.id ? event.data : item),
      ),
  );

  qc.setQueryData<ReplayListItem>(
    [REPLAYS_QUERY_KEY, event.data.id],
    event.data,
  );
};

export const onReplayDeleted = (qc: QueryClient, event: ReplayDeleteEvent) => {
  qc.setQueryData<InfiniteData<PaginatedReplayListResponse>>(
    [REPLAYS_QUERY_KEY],
    (oldData) =>
      itemsFilter<PaginatedReplayListResponse, ReplayListItem>(
        oldData,
        "items",
        (item) => item.id !== event.data.id,
      ),
  );

  qc.setQueryData<ReplayListItem>(
    [REPLAYS_QUERY_KEY, event.data.id],
    undefined,
  );
};

export const onReplayStatus = (qc: QueryClient, event: ReplayStatusEvent) => {
  // Given an existing replay status item, applies the status patch from the event
  const applyPatch = (prev: ReplayListItem): ReplayListItem => ({
    ...prev,
    status: event.data.status,
    startTime: event.data.startTime,
    endTime: event.data.endTime,
  });

  // Apply patch to the item in the list query
  qc.setQueryData<InfiniteData<PaginatedReplayListResponse>>(
    [REPLAYS_QUERY_KEY],
    (oldData) =>
      itemsMap<PaginatedReplayListResponse, ReplayListItem>(
        oldData,
        "items",
        (item) => {
          if (item.id !== event.data.id) return item;
          return applyPatch(item);
        },
      ),
  );

  // Apply patch to the single-item query
  const existingItem = qc.getQueryData<ReplayListItem>([
    REPLAYS_QUERY_KEY,
    event.data.id,
  ]);

  if (existingItem) {
    // Only patch if item existed in the query
    qc.setQueryData<ReplayListItem>(
      [REPLAYS_QUERY_KEY, event.data.id],
      applyPatch(existingItem),
    );
  }
};

export const onReplayLog = (qc: QueryClient, event: ReplayLogEvent) => {
  /** TODO */
};

export const onReplayEvent = (qc: QueryClient, event: ReplayEvent) => {
  switch (event.operation) {
    case "create":
      onReplayCreated(qc, event);
      break;
    case "delete":
      onReplayDeleted(qc, event);
      break;
    case "patch":
      onReplayPatch(qc, event);
      break;
    case "status":
      onReplayStatus(qc, event);
      break;
    case "log":
      onReplayLog(qc, event);
      break;
  }
};
