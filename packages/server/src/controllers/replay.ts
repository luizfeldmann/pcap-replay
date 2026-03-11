import { Request, Response } from "express";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { ReplayService } from "../services/replay.js";
import { StatusCodes } from "http-status-codes";
import {
  defaultErrorResponse,
  eventStreamResponse,
  jsonRequestBody,
  jsonResponse,
} from "../utils/openapi.js";
import {
  JobCommandSchema,
  ReplayListItemSchema,
  ReplayPatchSchema,
  ReplayPostSchema,
  PaginatedReplayListRequestSchema,
  PaginatedReplayListResponseSchema,
  ReplayCommandResponseSchema,
  ReplayLogEventSchema,
  ReplayEventSchema,
} from "shared";
import { ReplayEvents } from "../events/replays.js";
import { prepareHeadersForSSE, sendEventSSE } from "../events/events.js";

// Tag for API docs
const REPLAY_TAG = "Replay";

const JobIdSchema = ReplayListItemSchema.pick({ id: true });
const JobCommandRequestSchema = JobIdSchema.extend({
  command: JobCommandSchema,
});

const getReplayJobs = {
  docs: {
    tags: [REPLAY_TAG],
    summary: "Reads the list of all replay jobs",
    parameters: [
      {
        in: "query",
        name: "limit",
        required: true,
        schema: { type: "integer" },
      },
      {
        in: "query",
        name: "cursor",
        required: false,
        schema: { type: "string" },
      },
    ],
    responses: {
      [StatusCodes.OK]: jsonResponse(PaginatedReplayListResponseSchema),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {
    const params = PaginatedReplayListRequestSchema.parse(req.query);
    const paginatedJobs = await ReplayService.getJobsList(params);
    resp.json(paginatedJobs);
  },
};

const getSingleReplayJob = {
  docs: {
    tags: [REPLAY_TAG],
    summary: "Reads a single replay job by ID",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      [StatusCodes.OK]: jsonResponse(ReplayListItemSchema),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {
    const params = JobIdSchema.parse(req.params);
    const job = await ReplayService.getSingle(params.id);
    resp.json(job);
  },
};

const createReplayJob = {
  docs: {
    tags: [REPLAY_TAG],
    summary: "Creates a new replay job",
    requestBody: jsonRequestBody(ReplayPostSchema),
    responses: {
      [StatusCodes.CREATED]: jsonResponse(ReplayListItemSchema),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: (req: Request, resp: Response) => {
    const postData = ReplayPostSchema.parse(req.body);
    const createdItem = ReplayService.insertNew(postData);
    resp.json(createdItem);
  },
};

const modifyReplayJob = {
  docs: {
    tags: [REPLAY_TAG],
    summary: "Modifies an existing replay job",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    requestBody: jsonRequestBody(ReplayPatchSchema),
    responses: {
      [StatusCodes.OK]: jsonResponse(ReplayListItemSchema),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {
    const params = JobIdSchema.parse(req.params);
    const patchData = ReplayPatchSchema.parse(req.body);
    const changedItem = await ReplayService.modifyItem(params.id, patchData);
    resp.json(changedItem);
  },
};

const deleteReplayJob = {
  docs: {
    tags: [REPLAY_TAG],
    summary: "Deletes an existing replay job by ID",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      [StatusCodes.NO_CONTENT]: {
        description: "Deleted",
      },
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: (req: Request, resp: Response) => {
    const params = JobIdSchema.parse(req.params);
    ReplayService.deleteSingle(params.id);
    resp.sendStatus(StatusCodes.NO_CONTENT);
  },
};

const commandReplayJob = {
  docs: {
    tags: [REPLAY_TAG],
    summary: "Commands the job to change status",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
      {
        in: "path",
        name: "command",
        required: true,
        schema: { type: "string", enum: JobCommandSchema.options },
      },
    ],
    responses: {
      [StatusCodes.ACCEPTED]: jsonResponse(ReplayCommandResponseSchema),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {
    const params = JobCommandRequestSchema.parse(req.params);
    const result = await ReplayService.commandStatus(params.id, params.command);
    resp.status(StatusCodes.ACCEPTED).json(result);
  },
};

const getWatchLogs = {
  docs: {
    tags: [REPLAY_TAG],
    summary: "Streams the logs from a replay job",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      [StatusCodes.OK]: eventStreamResponse(ReplayLogEventSchema),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: (req: Request, res: Response) => {
    const params = JobIdSchema.parse(req.params);
    prepareHeadersForSSE(res);

    const { unsubscribe } = ReplayEvents.subscribeLogs(params.id, (event) =>
      sendEventSSE(res, event),
    );

    res.on("close", unsubscribe);
  },
};

const getWatchItemEvents = {
  docs: {
    tags: [REPLAY_TAG],
    summary: "Streams the events on a single replay job",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "string" } },
    ],
    responses: {
      [StatusCodes.OK]: eventStreamResponse(ReplayEventSchema),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: (req: Request, res: Response) => {
    const params = JobIdSchema.parse(req.params);
    prepareHeadersForSSE(res);

    const { unsubscribe } = ReplayEvents.subscribeSingleReplay(
      params.id,
      (event) => sendEventSSE(res, event),
    );

    res.on("close", unsubscribe);
  },
};

const getWatchListEvents = {
  docs: {
    tags: [REPLAY_TAG],
    summary: "Streams the events of the collection/list of replays",
    parameters: [],
    responses: {
      [StatusCodes.OK]: eventStreamResponse(ReplayEventSchema),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: (req: Request, res: Response) => {
    prepareHeadersForSSE(res);

    const { unsubscribe } = ReplayEvents.subscribeCollection((event) =>
      sendEventSSE(res, event),
    );

    res.on("close", unsubscribe);
  },
};

export const ReplayController = {
  getAll: getReplayJobs,
  getSingle: getSingleReplayJob,
  createJob: createReplayJob,
  modifyJob: modifyReplayJob,
  deleteJob: deleteReplayJob,
  statusCommand: commandReplayJob,
  watchListEvents: getWatchListEvents,
  watchItemEvents: getWatchItemEvents,
  watchLogs: getWatchLogs,
};
