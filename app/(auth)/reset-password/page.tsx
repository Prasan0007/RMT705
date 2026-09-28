import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { resetPasswordAction } from "../actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="glass rounded-3xl p-7 text-center">
        <h1 className="font-display text-xl font-bold">Missing reset link</h1>
        <p className="mt-2 text-sm text-fg-muted">
          Open the link from your email, or{" "}
          <Link href="/forgot-password" className="font-semibold text-accent-cyan hover:underline">
            request a new one
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <AuthForm
      title="Choose a new password"
      subtitle="This link works once and expires after 30 minutes."
      action={resetPasswordAction}
      submitLabel="Update password"
      successMessage="Password updated — you can log in with it now."
      hiddenFields={{ token }}
      fields={[{ name: "password", label: "New password", type: "password", autoComplete: "new-password" }]}
      footer={
        <Link href="/login" className="font-semibold text-accent-cyan hover:underline">
          Back to login
        </Link>
      }
    />
  );
}
