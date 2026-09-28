"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ActionResult } from "@/app/(auth)/actions";

interface Field {
  name: string;
  label: string;
  type: string;
  autoComplete?: string;
}

export function AuthForm({
  title,
  subtitle,
  action,
  fields,
  submitLabel,
  footer,
  successMessage,
  hiddenFields,
}: {
  title: string;
  subtitle: string;
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  fields: Field[];
  submitLabel: string;
  footer: React.ReactNode;
  /** When the action returns `ok: true` with no redirect, show this instead of the form. */
  successMessage?: string;
  hiddenFields?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  if (state?.ok && successMessage) {
    return (
      <div className="glass rounded-3xl p-7 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15 text-2xl text-emerald-300">
          ✓
        </div>
        <p className="mt-4 text-sm text-fg-muted">{successMessage}</p>
        <div className="mt-5 text-sm text-fg-muted">{footer}</div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-7">
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>

      <form action={formAction} className="mt-6 flex flex-col gap-3">
        {hiddenFields &&
          Object.entries(hiddenFields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-fg-muted">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              required
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
            />
          </div>
        ))}

        {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan py-3 font-bold text-black transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {pending ? "Please wait…" : submitLabel}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-fg-muted">{footer}</div>
    </div>
  );
}

export function AuthFooterLink({ href, label, prompt }: { href: string; label: string; prompt: string }) {
  return (
    <>
      {prompt}{" "}
      <Link href={href} className="font-semibold text-accent-cyan hover:underline">
        {label}
      </Link>
    </>
  );
}
