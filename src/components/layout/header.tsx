"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { BarChart3, Calendar, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-700 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full opacity-80"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                Nyiu Tracker
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <nav className="flex space-x-1">
                <Link
                  href="/"
                  className="group inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200"
                >
                  <BarChart3 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  Dashboard
                </Link>
                <Link
                  href="/services"
                  className="group inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200"
                >
                  <Settings className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  Services
                </Link>
                <Link
                  href="/events"
                  className="group inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200"
                >
                  <Calendar className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  Events
                </Link>
              </nav>
            )}

            <div className="flex items-center space-x-3">
              {isPending ? (
                <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
              ) : session?.user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-300">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="h-8 w-8 rounded-full border-2 border-green-500"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium hidden sm:block">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = "/signin")}
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => (window.location.href = "/signup")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
