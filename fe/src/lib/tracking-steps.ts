import type { OrderStatus } from "@/types";
import { PUBLIC_TRACKING_STEPS } from "@/data/public-content";

export type PublicStepKey = (typeof PUBLIC_TRACKING_STEPS)[number]["key"];

const STATUS_TO_STEP: Record<OrderStatus, PublicStepKey> = {
  DITERIMA: "CREATED",
  DICUCI: "WASH",
  DIKERINGKAN: "DRY",
  DISETRIKA: "IRON",
  PACKING: "DELIVER",
  SELESAI: "DONE",
  DIAMBIL: "DONE",
};

export function getPublicStepIndex(status: OrderStatus): number {
  const step = STATUS_TO_STEP[status] ?? "CREATED";
  const idx = PUBLIC_TRACKING_STEPS.findIndex((s) => s.key === step);
  return idx >= 0 ? idx : 0;
}

export function mapToPublicSteps(status: OrderStatus) {
  const currentIdx = getPublicStepIndex(status);
  return PUBLIC_TRACKING_STEPS.map((step, i) => ({
    ...step,
    state: i < currentIdx ? "done" : i === currentIdx ? "current" : "upcoming",
  })) as Array<
    (typeof PUBLIC_TRACKING_STEPS)[number] & {
      state: "done" | "current" | "upcoming";
    }
  >;
}
