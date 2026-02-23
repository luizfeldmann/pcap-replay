import { setupWorker } from "msw/browser";
import type { RequestHandler } from "msw";
import { networkMocks } from "./network";
import { filesMocks } from "./files";
import { replayMocks } from "./replays";

const handlers: RequestHandler[] = [
  ...networkMocks,
  ...filesMocks,
  ...replayMocks,
];

export const mockWorker = setupWorker(...handlers);
