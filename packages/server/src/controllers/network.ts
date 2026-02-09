import { z } from "zod";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { jsonResponse } from "../utils/openapi";
import { NetworkService } from "../services/network";
import { NetworkInterfaceSchema } from "shared";

// Tag for API docs
const NETWORK_TAG = "Network";

const getInterfaces = {
  docs: {
    tags: [NETWORK_TAG],
    summary: "List all network interfaces",
    responses: {
      [StatusCodes.OK]: jsonResponse(z.array(NetworkInterfaceSchema)),
    },
  } satisfies ZodOpenApiOperationObject,
  handler: (req: Request, resp: Response) => {
    const ifaces = NetworkService.getInterfaces();
    resp.json(ifaces);
  },
};

export const NetworkController = {
  getInterfaces,
};
