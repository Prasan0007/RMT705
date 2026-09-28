import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PerfectCutClient } from "@/components/perfect-cut/PerfectCutClient";

export default async function PerfectCutPage() {
  const session = await auth();

  let tokens = 0;
  if (session?.user?.id) {
    const user = await db.user.findUnique({ where: { id: session.user.id }, select: { tokenBalance: true } });
    tokens = user?.tokenBalance ?? 0;
  }

  return <PerfectCutClient initialTokens={tokens} />;
}
