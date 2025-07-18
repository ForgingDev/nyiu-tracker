import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="signup" />
    </div>
  );
}

export const metadata = {
  title: "Sign Up - Nyiu Z900 Tracker",
  description: "Create your motorcycle tracking account",
};
