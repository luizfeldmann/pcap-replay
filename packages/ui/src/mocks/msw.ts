import { setupWorker } from "msw/browser";
import type { RequestHandler } from "msw";
import { networkMocks } from "./network";
import { filesMocks } from "./files";

const handlers: RequestHandler[] = [...networkMocks, ...filesMocks];

export const mockWorker = setupWorker(...handlers);
