import { HttpResponse, RequestHandler, http } from "msw";
import {
  FilePatchSchema,
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
    new Date(Date.UTC(2026, 1, 10, 9) - i * TIME_SPAN).toISOString();

  return Array.from({ length: NUM_FILES }, (_, i) => ({
    id: i.toString(),
    name: `file-${i}.pcap`,
    size: logScaleSize(i),
    time: timeScale(i),
  }));
};

// Caches list after first request
let mockFilesCache: FileListItem[] | undefined = undefined;

// Reads the info of a single file
const getSingleFile = http.get<{ id: string }>(
  `/api/files/:id`,
  ({ params }) => {
    // Lazy generate list
    if (!mockFilesCache) mockFilesCache = generateMockFiles();

    // Find the file
    const file = mockFilesCache.find((item) => item.id === params.id);
    if (!file) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json(file);
  },
);

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

// Upload a file
const uploadFile = http.post("/api/files", async ({ request }) => {
  // Get form data from stream
  const formData = await request.formData();

  // Verify its a file
  const file = formData.get("file");
  if (!(file instanceof File)) return new HttpResponse(null, { status: 400 });

  // Add to the list
  if (!mockFilesCache) mockFilesCache = [];

  const newItem: FileListItem = {
    id: mockFilesCache.length.toFixed(0),
    name: file.name,
    size: file.size,
    time: new Date().toISOString(),
  };
  mockFilesCache.unshift(newItem);

  // Return new full item to the client
  return HttpResponse.json(newItem, { status: 201 });
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

// Patch a file
const patchFile = http.patch<{ id: string }>(
  `/api/files/:id`,
  async ({ params, request }) => {
    // List must have been accessed first
    if (!mockFilesCache) return new HttpResponse(null, { status: 500 });

    // Parse request
    const requestBody = await request.json();
    const { success, data: requestData } =
      FilePatchSchema.safeParse(requestBody);
    if (!success) return new HttpResponse(null, { status: 400 });

    // Try to find the item
    const file = mockFilesCache.find((item) => item.id === params.id);
    if (!file) return new HttpResponse(null, { status: 404 });

    // Modify file
    if (requestData.name) file.name = requestData.name;

    // Return updated file
    return HttpResponse.json(file);
  },
);

export const filesMocks: RequestHandler[] = [
  getSingleFile,
  getFiles,
  uploadFile,
  patchFile,
  deleteFile,
];
