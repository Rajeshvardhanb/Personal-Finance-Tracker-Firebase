
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

            <div className="w-full my-4">
                 <svg viewBox="0 0 800 100" preserveAspectRatio="none" className="w-full h-auto">
                    <defs>
                      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: 'rgba(99, 102, 241, 0.5)'}} />
                        <stop offset="100%" style={{stopColor: 'rgba(56, 189, 248, 0.5)'}} />
                      </linearGradient>
                    </defs>
                    
                    {Array.from({ length: 10 }).map((_, i) => (
                        <path 
                            key={`wave1-${i}`}
                            d={`M0,${50 + i*2} C150,${100 + i*2} 350,${0 + i*2} 500,${50 + i*2} C650,${100 + i*2} 850,${0 + i*2} 1000,${50 + i*2}`} 
                            fill="none" 
                            stroke="url(#waveGradient)" 
                            strokeWidth="0.5"
                            style={{transform: `translateX(${-i * 10}px)`, opacity: 1 - i*0.05}}
                        />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <path 
                            key={`wave2-${i}`}
                            d={`M-100,${55 - i*1.5} C100,${-10 - i*1.5} 300,${110 - i*1.5} 450,${55 - i*1.5} C600,${0 - i*1.5} 750,${110 - i*1.5} 900,${55 - i*1.5}`} 
                            fill="none" 
                            stroke="url(#waveGradient)"
                            strokeWidth="0.5"
                            style={{opacity: 0.5 - i*0.04}}
                        />
                    ))}
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
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-grid-pattern bg-background">
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

    