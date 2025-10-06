
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
  },
  {
    quote: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make, so you can give money back and have money to invest.",
    author: "Dave Ramsey"
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
    <main className="flex min-h-screen w-full">
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-12 text-white">
        <div className="flex flex-col items-center text-center">
            <Image
                src="/Infinity Cloud Labs PNG.png"
                alt="Infinity Cloud Labs Logo"
                width={200}
                height={200}
                className="mb-8"
            />
            <h1 className="text-3xl font-bold tracking-tight">
                Your Personal Finance Tracker
            </h1>
            <p className="mt-2 text-lg text-white/80">
                Designed by Rajesh
            </p>
        </div>
        <div className="mt-16 max-w-md text-center">
            <Quote className="mx-auto h-8 w-8 text-white/50" />
            <p className="mt-4 text-xl italic">
                "{quotes[currentQuoteIndex].quote}"
            </p>
            <p className="mt-4 font-semibold text-white/70">
                - {quotes[currentQuoteIndex].author}
            </p>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
            <p className="text-muted-foreground">
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
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90"
              disabled={isAuthenticating}
            >
              {isAuthenticating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          <div className="text-center text-sm">
            <a href="#" className="text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
