import type { Request, Response } from "express";
import { getPublicContent } from "../services/publicContent.service.js";
import { success } from "../utils/apiResponse.js";

export async function getContent(_req: Request, res: Response) {
  const content = await getPublicContent();
  return success(res, content);
}
