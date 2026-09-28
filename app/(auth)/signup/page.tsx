import { AuthForm, AuthFooterLink } from "@/components/auth/AuthForm";
import { signupAction } from "../actions";

export default function SignupPage() {
  return (
    <AuthForm
      title="Create your account"
      subtitle="New rippers start with 100 free tokens."
      action={signupAction}
      submitLabel="Create Account"
      fields={[
        { name: "name", label: "Display name", type: "text", autoComplete: "nickname" },
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
      ]}
      footer={<AuthFooterLink href="/login" label="Log in" prompt="Already have an account?" />}
    />
  );
}
