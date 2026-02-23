import { Request, Response } from "express";
import { z } from "zod";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { ReplayService } from "../services/replay.js";
import { StatusCodes } from "http-status-codes";
import {
  defaultErrorResponse,
  jsonRequestBody,
  jsonResponse,
} from "../utils/openapi.js";
import {
  JobCommandSchema,
  ReplayListItemSchema,
  ReplayPatchSchema,
  ReplayPostSchema,
} from "shared";

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
    responses: {
      [StatusCodes.OK]: jsonResponse(z.array(ReplayListItemSchema)),
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {
    const allJobs = await ReplayService.getAll();
    resp.json(allJobs);
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
    const patchData = ReplayPatchSchema.parse(req.body);
    const changedItem = await ReplayService.modifyItem(patchData);
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
      [StatusCodes.ACCEPTED]: {
        description: "Command requested",
      },
      default: defaultErrorResponse(),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: (req: Request, resp: Response) => {
    const params = JobCommandRequestSchema.parse(req.params);
    ReplayService.commandStatus(params.id, params.command);
    resp.sendStatus(StatusCodes.ACCEPTED);
  },
};

export const ReplayController = {
  getAll: getReplayJobs,
  getSingle: getSingleReplayJob,
  createJob: createReplayJob,
  modifyJob: modifyReplayJob,
  deleteJob: deleteReplayJob,
  statusCommand: commandReplayJob,
};
