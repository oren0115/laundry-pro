import { STATUS_LABELS } from "@/lib/api";
import type { OrderStatus, StatusLog } from "@/types";
import { cn } from "@/lib/utils";

const FLOW: OrderStatus[] = [
  "DITERIMA",
  "DICUCI",
  "DIKERINGKAN",
  "DISETRIKA",
  "PACKING",
  "SELESAI",
  "DIAMBIL",
];

export function OrderTimeline({
  currentStatus,
  logs,
}: {
  currentStatus: OrderStatus;
  logs?: StatusLog[];
}) {
  const currentIdx = FLOW.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((currentIdx + 1) / FLOW.length) * 100}%` }}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FLOW.map((status, i) => {
          const done = i <= currentIdx;
          const active = status === currentStatus;
          const log = logs?.find((l) => l.status === status);
          return (
            <div
              key={status}
              className={cn(
                "rounded-lg border p-3 text-sm",
                done ? "border-primary/30 bg-primary/5" : "border-border opacity-50",
                active && "ring-2 ring-primary"
              )}
            >
              <p className="font-medium">{STATUS_LABELS[status]}</p>
              {log && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString("id-ID")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
