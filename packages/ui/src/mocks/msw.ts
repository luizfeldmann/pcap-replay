import { setupWorker } from "msw/browser";
import type { RequestHandler } from "msw";
import { networkMocks } from "./network";

const handlers: RequestHandler[] = [...networkMocks];

export const mockWorker = setupWorker(...handlers);
