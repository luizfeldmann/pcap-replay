import { HttpResponse, RequestHandler, http } from "msw";
import { ReplayPostSchema, type ReplayListItem } from "shared";

// Caches list after first request
let mockItemsCache: ReplayListItem[] | undefined = undefined;

const postReplay = http.get(`/api/jobs/replay`, async ({ request }) => {
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
  HttpResponse.json(newItem, { status: 201 });
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

export const replayMocks: RequestHandler[] = [postReplay, deleteReplay];
