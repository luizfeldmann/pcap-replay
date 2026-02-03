import { Router } from "express";
import { ZodOpenApiPathsObject } from "zod-openapi";

const router = Router();

const getDocs = (prefix: string): ZodOpenApiPathsObject => ({});

export const ForwardRouter = { router, getDocs };
