import { Request, Response } from "express";

const getReplayJobs = {
  docs: {},
  handler: async (req: Request, resp: Response) => {},
};

const getSingleReplayJob = {
  docs: {},
  handler: async (req: Request, resp: Response) => {},
};

const createReplayJob = {
  docs: {},
  handler: async (req: Request, resp: Response) => {},
};

const modifyReplayJob = {
  docs: {},
  handler: async (req: Request, resp: Response) => {},
};

const deleteReplayJob = {
  docs: {},
  handler: async (req: Request, resp: Response) => {},
};

const commandReplayJob = {
  docs: {},
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
