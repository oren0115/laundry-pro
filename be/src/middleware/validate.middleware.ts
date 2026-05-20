import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { error } from "../utils/apiResponse.js";

export type ValidatedData = {
  body?: unknown;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
};

export interface ValidatedRequest extends Request {
  validated?: ValidatedData;
}

export function validate(schema: ZodSchema) {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      const msg = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
      return error(res, msg, 422);
    }
    const data = result.data as ValidatedData;

    if (data.body !== undefined) {
      req.body = data.body;
    }

    req.validated = {
      body: data.body ?? req.body,
      query: (data.query as Record<string, unknown> | undefined) ?? { ...req.query },
      params: (data.params as Record<string, unknown> | undefined) ?? { ...req.params },
    };

    next();
  };
}
