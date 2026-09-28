import Link from "next/link";
import { db } from "@/lib/db";
import { formatTokens } from "@/lib/utils";
import { GrantTokensForm } from "@/components/admin/GrantTokensForm";

export default async function AdminDashboard() {
  const [userCount, pendingOrders, totalPurchased, totalSpent, pullCount] = await Promise.all([
    db.user.count(),
    db.order.count({ where: { status: { in: ["REQUESTED", "LABEL_CREATED"] } } }),
    db.tokenTransaction.aggregate({ where: { type: "PURCHASE" }, _sum: { amount: true } }),
    db.tokenTransaction.aggregate({
      where: { type: { in: ["RIP_SPEND", "PERFECT_CUT_SPEND"] } },
      _sum: { amount: true },
    }),
    db.pullEvent.count(),
  ]);

  const stats = [
    { label: "Accounts", value: userCount.toLocaleString() },
    { label: "Orders needing fulfillment", value: pendingOrders.toLocaleString() },
    { label: "Tokens purchased (all time)", value: formatTokens(totalPurchased._sum.amount ?? 0) },
    { label: "Tokens spent on rips", value: formatTokens(Math.abs(totalSpent._sum.amount ?? 0)) },
    { label: "Packs ripped", value: pullCount.toLocaleString() },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">Admin</div>
      <h1 className="font-display text-3xl font-black sm:text-4xl">Operations</h1>
      <p className="mt-2 text-fg-muted">Internal tools — not visible to regular accounts.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wide text-fg-muted">{s.label}</div>
            <div className="mt-1 font-display text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/orders"
          className="rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan px-5 py-2.5 text-sm font-bold text-black"
        >
          Manage Orders
        </Link>
      </div>

      <div className="mt-10 max-w-md">
        <h2 className="mb-3 font-display text-lg font-bold">Grant / adjust tokens</h2>
        <GrantTokensForm />
      </div>
    </div>
  );
}
