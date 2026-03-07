import { z } from "zod";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodOpenApiOperationObject } from "zod-openapi";
import { NetworkInterfaceSchema } from "shared";
import { jsonResponse } from "../utils/openapi.js";
import { NetworkService } from "../services/network.js";

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
