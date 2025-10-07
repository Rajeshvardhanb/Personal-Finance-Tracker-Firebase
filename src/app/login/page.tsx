
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle, Quote } from "lucide-react";
import Image from "next/image";

function Waveform() {
  return (
    <svg width="300" height="60" viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="waveGradient" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#5eead4" />
        </linearGradient>
      </defs>
      <path d="M0 30 Q 37.5 10, 75 30 T 150 30 T 225 30 T 300 30" stroke="url(#waveGradient)" strokeWidth="2" fill="none" strokeOpacity="0.5" />
      <path d="M0 30 Q 37.5 40, 75 30 T 150 30 T 225 30 T 300 30" stroke="url(#waveGradient)" strokeWidth="2" fill="none" strokeOpacity="0.5" />
      <path d="M0 30 Q 37.5 20, 75 30 T 150 30 T 225 30 T 300 30" stroke="url(#waveGradient)" strokeWidth="2" fill="none" strokeOpacity="0.2" />
      <path d="M0 30 Q 37.5 50, 75 30 T 150 30 T 225 30 T 300 30" stroke="url(#waveGradient)" strokeWidth="2" fill="none" strokeOpacity="0.2" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("rajesh@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const { login, isAuthenticating } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { success, error: loginError } = await login(email, password);
    if (success) {
      router.push("/");
    } else {
      setError(loginError || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col items-center justify-center space-y-12 bg-[#f8f9fa] p-12 text-center">
        <div className="space-y-6">
          <Image src="/Infinity%20Cloud%20Labs%20PNG.png" alt="Infinity Cloud Labs Logo" width={150} height={40} className="mx-auto" />
          <Waveform />
        </div>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Personal Finance Tracker</h1>
            <p className="mt-2 text-sm text-muted-foreground">Designed By Rajesh</p>
          </div>
          <blockquote className="relative max-w-md mx-auto text-lg text-gray-700 italic border-l-4 border-gray-300 pl-6">
            <Quote className="absolute top-0 left-0 h-8 w-8 -translate-x-4 -translate-y-4 text-gray-300" />
            "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make, so you can give money back and have money to invest."
            <footer className="mt-4 text-sm text-gray-500 not-italic">- Dave Ramsey</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center bg-background bg-grid-pattern p-8">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl bg-card p-8 shadow-2xl">
            <div className="text-left mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign In</h1>
              <p className="mt-2 text-muted-foreground">
                Welcome back! Please enter your credentials.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-muted"
                />
              </div>
              <div className="pt-2 space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white transition-all hover:scale-105 hover:shadow-lg"
                  disabled={isAuthenticating}
                >
                  {isAuthenticating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
