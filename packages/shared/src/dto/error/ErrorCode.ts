import { z } from "zod";

export enum ErrorCode {
  INTERNAL_ERROR,
  BAD_FILE_TYPE,
  BAD_FILE_SIZE,
}

export const ErrorCodeSchema = z.enum(ErrorCode);
