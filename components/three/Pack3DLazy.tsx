"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Pack3D = dynamic(() => import("./Pack3D").then((m) => m.Pack3D), {
  ssr: false,
  loading: () => <Pack3DSkeleton />,
});

function Pack3DSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="aspect-[0.69] h-[70%] animate-pulse rounded-2xl bg-gradient-to-br from-accent-violet/20 via-accent-cyan/10 to-accent-gold/20" />
    </div>
  );
}

export function Pack3DLazy(props: {
  colorA?: string;
  colorB?: string;
  interactive?: boolean;
  spin?: boolean;
  className?: string;
}) {
  return <Pack3D {...props} className={cn(props.className)} />;
}
