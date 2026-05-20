import type { Response } from "express";

export function success<T>(res: Response, data: T, message = "Success", status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function paginated<T>(
  res: Response,
  data: T[],
  meta: { page: number; limit: number; total: number; totalPages: number }
) {
  return res.json({ success: true, data, meta });
}

export function error(res: Response, message: string, status = 400) {
  return res.status(status).json({ success: false, message });
}
