import { Router } from "express";
import { ZodOpenApiPathsObject } from "zod-openapi";

const router = Router();

const getDocs = (_prefix: string): ZodOpenApiPathsObject => ({});

export const ForwardRouter = { router, getDocs };
