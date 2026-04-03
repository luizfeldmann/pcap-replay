import { HttpResponse, RequestHandler, http } from "msw";
import {
  PaginatedReplayListRequestSchema,
  ReplayPatchSchema,
  ReplayPostSchema,
  type JobCommand,
  type PaginatedReplayListResponse,
  type ReplayCommandResponse,
  type ReplayListItem,
  type ReplaySettingsTcpReplay,
} from "shared";
import { getQueryParams } from "./utils";

//! Procedurally generates mock items
const generateMockItems = (): ReplayListItem[] => {
  // TODO
  return [
    {
      id: "0",
      fileId: "0",
      name: "Lorem",
      status: "STOPPED",
      createdTime: "2026-01-10T12:13:14Z",
      settings: {
        provider: "tcpreplay",
        interface: "eth0",
        repeat: {
          type: "times",
          times: 10,
        },
        load: {
          type: "pps",
          packetRate: 500,
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
    },
    {
      id: "1",
      fileId: "1",
      name: "Ipsum",
      status: "RUNNING",
      createdTime: "2026-01-09T10:11:12Z",
      startTime: "2026-01-09T10:15:00Z",
      settings: {
        provider: "tcpreplay",
        interface: "eth0",
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
    },
    {
      id: "2",
      fileId: "2",
      name: "Dolor",
      status: "FINISHED",
      createdTime: "2026-01-08T08:09:10Z",
      startTime: "2026-01-08T15:15:00Z",
      endTime: "2026-01-08T15:20:00Z",
      settings: {
        provider: "udpreplay",
        load: {
          type: "multiplier",
          speed: 1.5,
        },
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
    },
    {
      id: "3",
      fileId: "3",
      name: "Amet",
      status: "ERROR",
      createdTime: "2026-01-07T07:08:00Z",
      startTime: "2026-01-07T12:00:00Z",
      endTime: "2026-01-08T12:00:10Z",
      settings: {
        provider: "tcpreplay",
        interface: "eth0",
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
      },
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

// Reads a single replay give it's ID
const getSingleReplay = http.get<{ id: string }>(
  `/api/jobs/replay/:id`,
  ({ params }) => {
    // Lazy generate list
    if (!mockItemsCache) mockItemsCache = generateMockItems();

    // Find the item
    const replay = mockItemsCache.find((item) => item.id === params.id);
    if (!replay) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json(replay);
  },
);

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

// Command a replay to start/stop
const postCommandReplay = http.post<{ id: string; command: JobCommand }>(
  `/api/jobs/replay/:id/:command`,
  async ({ params }) => {
    // Lazy generate list
    if (!mockItemsCache) mockItemsCache = generateMockItems();

    // Try to find the item
    const item = mockItemsCache.find((item) => item.id === params.id);
    if (!item) return new HttpResponse(null, { status: 404 });

    // Handle the command type
    switch (params.command) {
      case "start":
        // Check its not already running
        if (item.status === "RUNNING")
          return new HttpResponse(null, { status: 409 });
        // Change to running
        item.status = "RUNNING";
        item.startTime = new Date().toISOString();
        item.endTime = undefined;
        break;

      case "stop":
        // To stop it must first be running
        if (item.status !== "RUNNING")
          return new HttpResponse(null, { status: 409 });
        // Change to stopped
        item.status = "STOPPED";
        item.endTime = new Date().toISOString();
        break;
    }

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Success
    return HttpResponse.json(
      {
        id: item.id,
        status: item.status,
        startTime: item.startTime,
        endTime: item.endTime,
      } satisfies ReplayCommandResponse,
      { status: 202 },
    );
  },
);

// Modify the data of one replay
const patchReplay = http.patch<{ id: string }>(
  `/api/jobs/replay/:id`,
  async ({ params, request }) => {
    // Validate request
    const requestBody = await request.json();
    const { success, data: requestData } =
      ReplayPatchSchema.safeParse(requestBody);
    if (!success) return new HttpResponse(null, { status: 400 });

    // Lazy generate list
    if (!mockItemsCache) mockItemsCache = generateMockItems();

    // Try to find the item
    const item = mockItemsCache.find((item) => item.id === params.id);
    if (!item) return new HttpResponse(null, { status: 404 });

    // Job cannot be modified while running
    if (item.status === "RUNNING")
      return new HttpResponse(null, { status: 409 });

    // Apply changes only to the data given in the patch
    if (requestData.name) item.name = requestData.name;
    if (requestData.fileId) item.fileId = requestData.fileId;
    if (requestData.settings?.interface)
      item.settings.interface = requestData.settings.interface;

    // Undefined = not part of patch
    // Null = clear the field
    if (requestData.settings?.limit !== undefined)
      item.settings.limit = requestData.settings.limit ?? undefined;

    if (requestData.settings?.load !== undefined)
      item.settings.load = requestData.settings.load ?? undefined;

    if (requestData.settings?.repeat !== undefined)
      item.settings.repeat = requestData.settings.repeat ?? undefined;

    // Undefined = not part of patch
    // Empty array = clear the field
    if (requestData.settings?.dstRemap)
      item.settings.dstRemap = requestData.settings.dstRemap;

    if (requestData.settings?.portRemap)
      item.settings.portRemap = requestData.settings.portRemap;

    // provider specific fields
    if (requestData?.settings?.provider)
      item.settings.provider = requestData.settings.provider;

    if (requestData.settings?.provider === "tcpreplay") {
      if (requestData.settings.srcRemap)
        (item.settings as ReplaySettingsTcpReplay).srcRemap =
          requestData.settings.srcRemap;
    }

    return HttpResponse.json(item);
  },
);

export const replayMocks: RequestHandler[] = [
  getReplays,
  getSingleReplay,
  postReplay,
  patchReplay,
  deleteReplay,
  postCommandReplay,
];
