import { Request, Response } from "express";
import { ZodOpenApiOperationObject } from "zod-openapi";

const getReplayJobs = {
  docs: {
    responses: {},
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {},
};

const getSingleReplayJob = {
  docs: {
    responses: {},
  } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {},
};

const createReplayJob = {
  docs: { responses: {} } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {},
};

const modifyReplayJob = {
  docs: { responses: {} } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {},
};

const deleteReplayJob = {
  docs: { responses: {} } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {},
};

const commandReplayJob = {
  docs: { responses: {} } satisfies ZodOpenApiOperationObject,
  handler: async (req: Request, resp: Response) => {},
};

export const ReplayController = {
  getAll: getReplayJobs,
  getSingle: getSingleReplayJob,
  createJob: createReplayJob,
  modifyJob: modifyReplayJob,
  deleteJob: deleteReplayJob,
  statusCommand: commandReplayJob,
};
