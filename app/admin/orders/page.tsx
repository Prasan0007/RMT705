import Link from "next/link";
import { db } from "@/lib/db";
import { cardById } from "@/lib/card-catalog";
import { OrderRow } from "@/components/admin/OrderRow";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, email: true } }, vaultItem: true },
  });

  const rows = orders.map((o) => ({
    id: o.id,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    userName: o.user.name,
    userEmail: o.user.email,
    cardName: cardById(o.vaultItem.cardId).name,
    grade: o.vaultItem.grade,
    serial: o.vaultItem.serial,
    recipientName: o.recipientName,
    address: [o.addressLine1, o.addressLine2, o.city, o.region, o.postalCode, o.country].filter(Boolean).join(", "),
    trackingNumber: o.trackingNumber,
    carrier: o.carrier,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Link href="/admin" className="text-sm text-fg-muted hover:text-fg">
        ← Admin
      </Link>
      <h1 className="mt-2 font-display text-3xl font-black">Fulfillment queue</h1>
      <p className="mt-2 text-fg-muted">Requested ships, oldest first.</p>

      {rows.length === 0 ? (
        <div className="glass mt-8 rounded-2xl p-10 text-center text-sm text-fg-muted">No ship requests yet.</div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {rows.map((row) => (
            <OrderRow key={row.id} order={row} />
          ))}
        </div>
      )}
    </div>
  );
}
