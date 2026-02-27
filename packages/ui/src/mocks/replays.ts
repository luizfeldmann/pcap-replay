import { HttpResponse, RequestHandler, http } from "msw";
import {
  PaginatedReplayListRequestSchema,
  ReplayPostSchema,
  type PaginatedReplayListResponse,
  type ReplayListItem,
} from "shared";
import { getQueryParams } from "./utils";

//! Procedurally generates mock items
const generateMockItems = (): ReplayListItem[] => {
  // TODO
  return [
    {
      id: "0",
      interface: "eth0",
      fileId: "0",
      name: "Lorem",
      status: "STOPPED",
      createdTime: "2026-01-10T12:13:14Z",
      repeat: {
        type: "times",
        times: 10,
      },
      load: {
        type: "multiplier",
        speed: 1.5,
      },
      limit: {
        type: "duration",
        maxDuration: 120,
      },
      portRemap: [
        {
          from: {
            start: 8080,
            end: 8090,
          },
          to: 80,
        },
      ],
    },
    {
      id: "1",
      interface: "eth0",
      fileId: "1",
      name: "Ipsum",
      status: "RUNNING",
      createdTime: "2026-01-09T10:11:12Z",
      startTime: "2026-01-09T10:15:00Z",
      repeat: {
        type: "loop",
      },
      load: {
        type: "mbps",
        dataRate: 50,
      },
      limit: {
        type: "packets",
        maxPackets: 1000,
      },
      srcRemap: [
        {
          ip: "v4",
          from: "192.168.0.0/16",
          to: "172.16.0.0/16",
        },
        {
          ip: "v4",
          from: "10.10.10.0/8",
          to: "10.255.255.0/8",
        },
      ],
    },
    {
      id: "2",
      interface: "eth0",
      fileId: "2",
      name: "Dolor",
      status: "FINISHED",
      createdTime: "2026-01-08T08:09:10Z",
      startTime: "2026-01-08T15:15:00Z",
      endTime: "2026-01-08T15:20:00Z",
      load: {
        type: "pps",
        packetRate: 500,
      },
      srcRemap: [
        {
          ip: "v4",
          from: "192.168.0.0/16",
          to: "172.16.0.0/16",
        },
      ],
      dstRemap: [
        {
          ip: "v4",
          from: "10.10.0.0/16",
          to: "172.31.0.0/16",
        },
        {
          ip: "v4",
          from: "192.168.100.0/8",
          to: "192.168.200.0/8",
        },
      ],
    },
    {
      id: "3",
      interface: "eth0",
      fileId: "3",
      name: "Amet",
      status: "ERROR",
      createdTime: "2026-01-07T07:08:00Z",
      startTime: "2026-01-07T12:00:00Z",
      endTime: "2026-01-08T12:00:10Z",
      srcRemap: [
        {
          ip: "v4",
          from: "192.168.0.0/16",
          to: "172.16.0.0/16",
        },
      ],
      portRemap: [
        {
          from: 3000,
          to: 5000,
        },
        {
          from: 443,
          to: 90,
        },
      ],
      dstRemap: [
        {
          ip: "v4",
          from: "192.168.0.0/16",
          to: "172.16.0.0/16",
        },
        {
          ip: "v4",
          from: "10.10.0.0/16",
          to: "172.31.0.0/16",
        },
        {
          ip: "v4",
          from: "192.168.100.0/8",
          to: "192.168.200.0/8",
        },
      ],
    },
  ];
};

// Caches list after first request
let mockItemsCache: ReplayListItem[] | undefined = undefined;

// Reads list of files
const getReplays = http.get(`/api/jobs/replay`, ({ request }) => {
  // Lazy generate list
  if (!mockItemsCache) mockItemsCache = generateMockItems();

  // Get query params
  const { success, data: requestData } =
    PaginatedReplayListRequestSchema.safeParse(getQueryParams(request.url));
  if (!success) return new HttpResponse(null, { status: 400 });

  // Slice the page
  const cursor = requestData.cursor ? new Date(requestData.cursor) : null;
  const startIndex = cursor
    ? mockItemsCache.findIndex(
        (item) => new Date(item.createdTime).getTime() < cursor.getTime(),
      )
    : 0; // If no cursor given, start from 0-th element

  const slice =
    startIndex === -1
      ? [] // No more pages
      : mockItemsCache.slice(
          startIndex,
          Math.min(startIndex + requestData.limit, mockItemsCache.length),
        );

  return HttpResponse.json({
    nextCursor: slice.length ? slice[slice.length - 1].createdTime : undefined,
    items: slice,
  } satisfies PaginatedReplayListResponse);
});

// Creates a new replay and returns the object
const postReplay = http.post(`/api/jobs/replay`, async ({ request }) => {
  // Validate request
  const requestBody = await request.json();
  const { success, data: requestData } =
    ReplayPostSchema.safeParse(requestBody);
  if (!success) return new HttpResponse(null, { status: 400 });

  // Make a new item
  if (!mockItemsCache) mockItemsCache = [];
  const newItem: ReplayListItem = {
    id: mockItemsCache.length.toFixed(0),
    createdTime: new Date().toISOString(),
    status: "STOPPED",
    ...requestData,
  };

  // Add to list and return it
  mockItemsCache.unshift(newItem);
  return HttpResponse.json(newItem, { status: 201 });
});

// Delete a replay item
const deleteReplay = http.delete<{ id: string }>(
  `/api/jobs/replay/:id`,
  ({ params }) => {
    // List must have been accessed first
    if (!mockItemsCache) return new HttpResponse(null, { status: 500 });

    // Try to find the item
    const index = mockItemsCache.findIndex((item) => item.id === params.id);
    if (index === -1) return new HttpResponse(null, { status: 404 });

    // Ensure the replay is not running
    if (mockItemsCache[index].status === "RUNNING")
      return new HttpResponse(null, { status: 423 });

    // Remove the file
    mockItemsCache.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  },
);

export const replayMocks: RequestHandler[] = [
  getReplays,
  postReplay,
  deleteReplay,
];
