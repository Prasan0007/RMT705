"use client";

import { useState, useTransition } from "react";
import { markShippedAction, markLabelCreatedAction } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

export interface OrderRowData {
  id: string;
  status: "REQUESTED" | "LABEL_CREATED" | "SHIPPED" | "DELIVERED" | "CANCELED";
  createdAt: string;
  userName: string;
  userEmail: string;
  cardName: string;
  grade: number;
  serial: string;
  recipientName: string;
  address: string;
  trackingNumber: string | null;
  carrier: string | null;
}

const STATUS_STYLE: Record<OrderRowData["status"], string> = {
  REQUESTED: "bg-amber-400/15 text-amber-300",
  LABEL_CREATED: "bg-blue-400/15 text-blue-300",
  SHIPPED: "bg-emerald-400/15 text-emerald-300",
  DELIVERED: "bg-emerald-400/15 text-emerald-300",
  CANCELED: "bg-red-400/15 text-red-300",
};

export function OrderRow({ order }: { order: OrderRowData }) {
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");
  const [carrier, setCarrier] = useState(order.carrier ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function createLabel() {
    startTransition(async () => {
      const res = await markLabelCreatedAction(order.id);
      if (res.ok) setStatus("LABEL_CREATED");
    });
  }

  function ship() {
    setError(null);
    startTransition(async () => {
      const res = await markShippedAction(order.id, tracking, carrier);
      if (res.ok) setStatus("SHIPPED");
      else setError(res.error ?? "Failed.");
    });
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{order.cardName}</span>
            <span className="text-xs text-fg-muted">Grade {order.grade.toFixed(1)} · {order.serial}</span>
          </div>
          <div className="mt-1 text-xs text-fg-muted">
            {order.userName} · {order.userEmail}
          </div>
          <div className="mt-1 text-xs text-fg-muted">
            Ship to: {order.recipientName} — {order.address}
          </div>
        </div>
        <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase", STATUS_STYLE[status])}>
          {status.replace("_", " ")}
        </span>
      </div>

      {status !== "SHIPPED" && status !== "DELIVERED" && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
          {status === "REQUESTED" && (
            <button
              onClick={createLabel}
              disabled={pending}
              className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15 disabled:opacity-50"
            >
              Mark label created
            </button>
          )}
          <input
            placeholder="Carrier"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-28 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs outline-none focus:border-accent-cyan"
          />
          <input
            placeholder="Tracking #"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            className="w-40 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs outline-none focus:border-accent-cyan"
          />
          <button
            onClick={ship}
            disabled={pending || !tracking || !carrier}
            className="rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan px-3 py-1.5 text-xs font-bold text-black disabled:opacity-50"
          >
            Mark shipped
          </button>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      )}

      {(status === "SHIPPED" || status === "DELIVERED") && order.trackingNumber && (
        <div className="mt-3 border-t border-white/[0.06] pt-3 text-xs text-fg-muted">
          {order.carrier} · {order.trackingNumber}
        </div>
      )}
    </div>
  );
}
