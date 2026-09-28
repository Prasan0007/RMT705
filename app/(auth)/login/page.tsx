import Link from "next/link";
import { AuthForm, AuthFooterLink } from "@/components/auth/AuthForm";
import { loginAction } from "../actions";

export default function LoginPage() {
  return (
    <AuthForm
      title="Welcome back"
      subtitle="Log in to rip packs and check your vault."
      action={loginAction}
      submitLabel="Log In"
      fields={[
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
      ]}
      footer={
        <div className="flex flex-col gap-2">
          <AuthFooterLink href="/signup" label="Sign up" prompt="Don't have an account?" />
          <Link href="/forgot-password" className="text-xs text-fg-muted hover:text-fg">
            Forgot your password?
          </Link>
        </div>
      }
    />
  );
}
