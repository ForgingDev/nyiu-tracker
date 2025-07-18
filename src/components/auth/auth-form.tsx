"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        await signUp.email({
          email,
          password,
          name,
        });
      } else {
        await signIn.email({
          email,
          password,
        });
      }

      // Redirect to homepage after successful authentication
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: "google" | "github") => {
    setLoading(true);
    setError("");

    try {
      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Social authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8 border-gray-700/60 bg-gray-800/80 backdrop-blur-sm shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            {mode === "signin" ? "Welcome Back" : "Join Nyiu Tracker"}
          </h1>
          <p className="text-gray-400 text-lg">
            {mode === "signin"
              ? "Sign in to access your motorcycle dashboard"
              : "Start tracking your motorcycle journey today"}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-5">
          {mode === "signup" && (
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-300"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="h-12"
              />
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-300"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-300"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength={6}
              className="h-12"
            />
            {mode === "signup" && (
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-600/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-800 px-3 text-gray-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        <div className="text-center text-sm">
          {mode === "signin" ? (
            <p className="text-gray-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-200"
                onClick={() => router.push("/signup")}
              >
                Sign up for free
              </button>
            </p>
          ) : (
            <p className="text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-200"
                onClick={() => router.push("/signin")}
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
