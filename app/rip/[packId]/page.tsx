import { auth } from "@/auth";
import { db } from "@/lib/db";
import { RipRoomClient } from "@/components/rip/RipRoomClient";

export default async function RipPage({ params }: { params: Promise<{ packId: string }> }) {
  const { packId } = await params;
  const session = await auth();

  let tokens = 0;
  if (session?.user?.id) {
    const user = await db.user.findUnique({ where: { id: session.user.id }, select: { tokenBalance: true } });
    tokens = user?.tokenBalance ?? 0;
  }

  return <RipRoomClient packId={packId} initialTokens={tokens} />;
}
