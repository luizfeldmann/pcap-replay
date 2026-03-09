import { Response } from "express";

//! Adds the headers required for SSE
export const prepareHeadersForSSE = (res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
};

//! Sends an event to the response stream
export const sendEventSSE = (res: Response, event: Object) =>
  res.write(`data: ${JSON.stringify(event)}\n\n`);
