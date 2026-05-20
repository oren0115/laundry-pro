import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { DEFAULT_PUBLIC_CONTENT, type PublicContentData } from "../data/defaultPublicContent.js";

const CONFIG_ID = "default";

export async function getPublicContent(): Promise<PublicContentData> {
  const row = await prisma.publicContentConfig.findUnique({ where: { id: CONFIG_ID } });
  if (!row?.data) return structuredClone(DEFAULT_PUBLIC_CONTENT) as PublicContentData;
  return deepMerge(
    structuredClone(DEFAULT_PUBLIC_CONTENT) as Record<string, unknown>,
    row.data as Record<string, unknown>
  ) as PublicContentData;
}

export async function upsertPublicContent(
  data: PublicContentData,
  updatedBy?: string
): Promise<PublicContentData> {
  await prisma.publicContentConfig.upsert({
    where: { id: CONFIG_ID },
    create: {
      id: CONFIG_ID,
      data: data as unknown as Prisma.InputJsonValue,
      updatedBy,
    },
    update: {
      data: data as unknown as Prisma.InputJsonValue,
      updatedBy,
    },
  });
  return getPublicContent();
}

export async function seedPublicContentIfEmpty() {
  const existing = await prisma.publicContentConfig.findUnique({ where: { id: CONFIG_ID } });
  if (existing) return;
  await prisma.publicContentConfig.create({
    data: {
      id: CONFIG_ID,
      data: DEFAULT_PUBLIC_CONTENT as unknown as Prisma.InputJsonValue,
    },
  });
}

function deepMerge<T extends Record<string, unknown>>(base: T, patch: Record<string, unknown>): T {
  const out = { ...base };
  for (const key of Object.keys(patch)) {
    const pv = patch[key];
    const bv = base[key];
    if (
      pv !== null &&
      typeof pv === "object" &&
      !Array.isArray(pv) &&
      bv !== null &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[key as keyof T] = deepMerge(
        bv as Record<string, unknown>,
        pv as Record<string, unknown>
      ) as T[keyof T];
    } else if (pv !== undefined) {
      out[key as keyof T] = pv as T[keyof T];
    }
  }
  return out;
}
