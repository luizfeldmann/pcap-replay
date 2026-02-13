import { HttpResponse, RequestHandler, http } from "msw";
import {
  PaginatedRequestSchema,
  type FileListItem,
  type PaginatedFileListResponse,
} from "shared";
import { getQueryParams } from "./utils";

// Generates mock list of files
const generateMockFiles = (): FileListItem[] => {
  const NUM_FILES = 300;
  const SIZE_MIN = 128; // bytes
  const SIZE_MAX = 192 * Math.pow(10, 9); // GB
  const TIME_SPAN = 1000 * (15 + 60 * (7 + 60 * 2)); // 2h7min15s

  const logScaleSize = (i: number) =>
    Math.round(SIZE_MIN * Math.pow(SIZE_MAX / SIZE_MIN, i / (NUM_FILES - 1)));

  const timeScale = (i: number) =>
    new Date(Date.UTC(2026, 2, 10, 9) - i * TIME_SPAN).toISOString();

  return Array.from({ length: NUM_FILES }, (_, i) => ({
    id: i.toString(),
    name: `file-${i}.pcap`,
    size: logScaleSize(i),
    time: timeScale(i),
  }));
};

// Caches list after first request
let mockFilesCache: FileListItem[] | undefined = undefined;

// Reads list of files
const getFiles = http.get(`/api/files`, ({ request }) => {
  // Lazy generate list
  if (!mockFilesCache) mockFilesCache = generateMockFiles();

  // Get query params
  const { success, data: requestData } = PaginatedRequestSchema.safeParse(
    getQueryParams(request.url),
  );
  if (!success) return new HttpResponse(null, { status: 400 });

  // Slice the page
  const cursor = requestData.cursor ? new Date(requestData.cursor) : null;
  const startIndex = cursor
    ? mockFilesCache.findIndex(
        (file) => new Date(file.time).getTime() < cursor.getTime(),
      )
    : 0; // If no cursor given, start from 0-th element

  const slice =
    startIndex === -1
      ? [] // No more pages
      : mockFilesCache.slice(
          startIndex,
          Math.min(startIndex + requestData.limit, mockFilesCache.length),
        );

  return HttpResponse.json({
    nextCursor: slice.length ? slice[slice.length - 1].time : undefined,
    items: slice,
  } satisfies PaginatedFileListResponse);
});

// Delete a file
const deleteFile = http.delete<{ id: string }>(
  `/api/files/:id`,
  ({ params }) => {
    // List must have been accessed first
    if (!mockFilesCache) return new HttpResponse(null, { status: 500 });

    // Try to find the item
    const index = mockFilesCache.findIndex((item) => item.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });

    // Remove the file
    mockFilesCache.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  },
);

export const filesMocks: RequestHandler[] = [getFiles, deleteFile];
