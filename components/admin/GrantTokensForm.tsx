"use client";

import { useState, useTransition } from "react";
import { grantTokensAction } from "@/app/actions/admin";

export function GrantTokensForm() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setMessage(null);
    startTransition(async () => {
      const res = await grantTokensAction(email, Number(amount), note);
      if (res.ok) {
        setMessage({ kind: "ok", text: "Balance updated." });
        setAmount("");
        setNote("");
      } else {
        setMessage({ kind: "error", text: res.error ?? "Failed." });
      }
    });
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-col gap-3">
        <input
          placeholder="Account email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
        />
        <input
          placeholder="Amount (negative to deduct)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
        />
        <input
          placeholder="Note (e.g. support refund)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
        />
        {message && (
          <p className={`text-sm ${message.kind === "ok" ? "text-emerald-400" : "text-red-400"}`}>{message.text}</p>
        )}
        <button
          onClick={submit}
          disabled={pending || !email || !amount}
          className="rounded-full bg-white/10 py-2.5 text-sm font-semibold hover:bg-white/15 disabled:opacity-50"
        >
          {pending ? "Applying…" : "Apply"}
        </button>
      </div>
    </div>
  );
}
