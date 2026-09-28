import { AuthForm, AuthFooterLink } from "@/components/auth/AuthForm";
import { requestPasswordResetAction } from "../actions";

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Reset your password"
      subtitle="We'll email you a link to set a new one."
      action={requestPasswordResetAction}
      submitLabel="Send reset link"
      successMessage="If an account exists for that email, a reset link is on its way."
      fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]}
      footer={<AuthFooterLink href="/login" label="Log in" prompt="Remembered it?" />}
    />
  );
}
