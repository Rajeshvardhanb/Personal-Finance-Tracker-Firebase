
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

const quotes = [
  {
    quote: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make, so you can give money back and have money to invest.",
    author: "Dave Ramsey"
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    quote: "The goal isn't more money. The goal is living life on your own terms.",
    author: "Chris Brogan"
  },
  {
    quote: "Beware of little expenses. A small leak will sink a great ship.",
    author: "Benjamin Franklin"
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState("rajesh@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const { login, isAuthenticating } = useAuth();
  const router = useRouter();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      <div className="hidden lg:flex w-1/2 flex-col justify-center bg-[#f0f2f5] p-12">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <Image
                src="/Infinity Cloud Labs PNG.png"
                alt="Infinity Cloud Labs Logo"
                width={200}
                height={100}
                className="mb-8"
            />

            <div className="w-full my-8 h-24">
                 <svg viewBox="0 0 800 120" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
                    <defs>
                      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: 'rgba(99, 102, 241, 0.6)'}} />
                        <stop offset="100%" style={{stopColor: 'rgba(56, 189, 248, 0.6)'}} />
                      </linearGradient>
                    </defs>
                    
                    <path d="M0 60 Q 200 120, 400 60 T 800 60" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" opacity="0.3"/>
                    <path d="M0 65 Q 200 10, 400 65 T 800 65" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" opacity="0.4"/>
                    <path d="M0 70 Q 200 130, 400 70 T 800 70" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" opacity="0.2"/>
                    <path d="M0 75 Q 200 20, 400 75 T 800 75" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" opacity="0.5"/>
                    <path d="M0 80 Q 200 140, 400 80 T 800 80" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" opacity="0.1"/>
                    <path d="M0 55 Q 200 0, 400 55 T 800 55" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" opacity="0.6"/>
                    <path d="M0 50 Q 200 110, 400 50 T 800 50" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" opacity="0.3"/>
                    <path d="M0 45 Q 200 5, 400 45 T 800 45" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" opacity="0.7"/>
                    <path d="M0 40 Q 200 100, 400 40 T 800 40" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" opacity="0.4"/>
                    <path d="M0 35 Q 200 -10, 400 35 T 800 35" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" opacity="0.5"/>
                </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                Your Personal Finance Tracker
            </h1>
            <p className="mt-2 text-sm text-gray-500">
                Designed By Rajesh
            </p>
        </div>
        <div className="mt-16 max-w-md mx-auto text-center">
            <Quote className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-4 text-lg italic text-gray-600">
                "{quotes[currentQuoteIndex].quote}"
            </p>
            <p className="mt-4 font-semibold text-gray-500">
                - {quotes[currentQuoteIndex].author}
            </p>
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
