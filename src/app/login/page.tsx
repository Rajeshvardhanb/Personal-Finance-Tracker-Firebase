
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle, Quote } from "lucide-react";
import Image from "next/image";

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
      setError(loginError || "An unexpected error occurred. Please contact Rajesh.");
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-white">
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center bg-[#020617] p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="waveGradientDarker" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'rgba(99, 102, 241, 0.3)'}} />
                <stop offset="100%" style={{stopColor: 'rgba(56, 189, 248, 0.3)'}} />
              </linearGradient>
            </defs>
            <path d="M0 300 Q 200 420, 400 300 T 800 300 V 600 H 0 Z" fill="url(#waveGradientDarker)" opacity="0.3"/>
            <path d="M0 310 Q 200 190, 400 310 T 800 310 V 600 H 0 Z" fill="url(#waveGradientDarker)" opacity="0.3"/>
            <path d="M0 290 Q 200 430, 400 290 T 800 290 V 600 H 0 Z" fill="url(#waveGradientDarker)" opacity="0.2"/>
            
            <path d="M0 300 Q 100 250, 200 300 T 400 300 T 600 300 T 800 300" fill="none" stroke="url(#waveGradientDarker)" strokeWidth="0.7" opacity="0.5"/>
            <path d="M0 310 Q 100 360, 200 310 T 400 310 T 600 310 T 800 310" fill="none" stroke="url(#waveGradientDarker)" strokeWidth="0.7" opacity="0.6"/>
            <path d="M0 290 Q 100 240, 200 290 T 400 290 T 600 290 T 800 290" fill="none" stroke="url(#waveGradientDarker)" strokeWidth="0.7" opacity="0.55"/>
            <path d="M0 280 Q 100 330, 200 280 T 400 280 T 600 280 T 800 280" fill="none" stroke="url(#waveGradientDarker)" strokeWidth="0.7" opacity="0.4"/>
            <path d="M0 320 Q 100 270, 200 320 T 400 320 T 600 320 T 800 320" fill="none" stroke="url(#waveGradientDarker)" strokeWidth="0.7" opacity="0.45"/>

            <path d="M-100 150 Q 100 350, 300 150 T 700 150 T 900 150" fill="none" stroke="url(#waveGradientDarker)" strokeWidth="0.7" opacity="0.4"/>
            <path d="M-100 450 Q 100 250, 300 450 T 700 450 T 900 450" fill="none" stroke="url(#waveGradientDarker)" strokeWidth="0.7" opacity="0.4"/>
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-start text-center w-full h-full pt-8">
            <Image
                src="/Infinity Cloud Labs PNG.png"
                alt="Infinity Cloud Labs Logo"
                width={400}
                height={200}
            />
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background bg-grid-pattern">
        <div className="w-full max-w-sm space-y-6 bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="text-gray-500">
              Welcome back! Please enter your credentials.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 border-gray-300"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-100 border-gray-300"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:opacity-90 shadow-md"
              disabled={isAuthenticating}
            >
              {isAuthenticating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          <div className="text-center text-sm">
            <a href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
