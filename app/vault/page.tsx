import { auth } from "@/auth";
import { db } from "@/lib/db";
import { VaultBrowser } from "@/components/vault/VaultBrowser";

export default async function VaultPage() {
  const session = await auth();
  if (!session?.user?.id) return null; // middleware redirects before this renders

  const items = await db.vaultItem.findMany({
    where: { userId: session.user.id, status: { not: "SOLD" } },
    orderBy: { pulledAt: "desc" },
  });

  const serializable = items.map((item) => ({
    id: item.id,
    cardId: item.cardId,
    grade: item.grade,
    serial: item.serial,
    pulledAt: item.pulledAt.toISOString(),
    showcased: item.showcased,
    status: item.status,
  }));

  return <VaultBrowser items={serializable} />;
}
