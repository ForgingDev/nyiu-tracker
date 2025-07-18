import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="signin" />
    </div>
  );
}

export const metadata = {
  title: "Sign In - Nyiu Z900 Tracker",
  description: "Sign in to your motorcycle tracking account",
};
