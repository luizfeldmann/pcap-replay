import { z } from "zod";

export enum ReplayStatus {
  STOPPED,
  RUNNING,
  FINISHED,
  ERROR,
}

export const ReplayStatusSchema = z.enum(ReplayStatus);
