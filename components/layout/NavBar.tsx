import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NavBarClient } from "./NavBarClient";

export async function NavBar() {
  const session = await auth();
  let tokens = 0;

  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { tokenBalance: true },
    });
    tokens = user?.tokenBalance ?? 0;
  }

  return (
    <NavBarClient
      user={
        session?.user
          ? { name: session.user.name ?? "Ripper", email: session.user.email ?? "", tokens, role: session.user.role }
          : null
      }
    />
  );
}
