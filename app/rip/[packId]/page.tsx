import { RipRoomClient } from "@/components/rip/RipRoomClient";

export default async function RipPage({ params }: { params: Promise<{ packId: string }> }) {
  const { packId } = await params;
  return <RipRoomClient packId={packId} />;
}
