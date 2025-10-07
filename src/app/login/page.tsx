
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";

const quotes = [
    {
        text: "An investment in knowledge pays the best interest.",
        author: "Benjamin Franklin"
    },
    {
        text: "The best investment you can make, is an investment in yourself. The more you learn, the more you'll earn.",
        author: "Warren Buffett"
    },
    {
        text: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make, so you can give money back and have money to invest. You can't win until you do this.",
        author: "Dave Ramsey"
    },
     {
        text: "The stock market is a device for transferring money from the impatient to the patient.",
        author: "Warren Buffett"
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
    const interval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000); // Change quote every 5 seconds
    return () => clearInterval(interval);
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
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center bg-[#f0f2f5] p-12 overflow-hidden text-slate-800">
        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-lg h-full">
            <div className="absolute top-16 space-y-4">
                <Image
                    src="/Infinity Cloud Labs PNG.png"
                    alt="Infinity Cloud Labs Logo"
                    width={250}
                    height={125}
                    className="mx-auto"
                />
            </div>
            
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <div className="w-[600px] h-[600px] opacity-70">
                    <svg
                        viewBox="0 0 1000 1000"
                        preserveAspectRatio="xMidYMid slice"
                        className="w-full h-full"
                    >
                        <defs>
                            <linearGradient
                            id="waveGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                            >
                            <stop offset="0%" style={{ stopColor: "rgba(56, 189, 248, 0.2)" }} />
                            <stop offset="100%" style={{ stopColor: "rgba(99, 102, 241, 0.2)" }} />
                            </linearGradient>
                        </defs>
                        <path d="M-100 500 Q 150 350, 400 500 T 900 500 T 1100 500" fill="none" stroke="url(#waveGradient)" strokeWidth="1.5" />
                        <path d="M-100 520 Q 150 670, 400 520 T 900 520 T 1100 520" fill="none" stroke="url(#waveGradient)" strokeWidth="1.5" />
                        <path d="M-150 480 Q 200 330, 450 480 T 950 480 T 1150 480" fill="none" stroke="url(#waveGradient)" strokeWidth="1" />
                        <path d="M-150 540 Q 200 690, 450 540 T 950 540 T 1150 540" fill="none" stroke="url(#waveGradient)" strokeWidth="1" />
                        <path d="M-200 460 Q 250 310, 500 460 T 1000 460 T 1200 460" fill="none" stroke="url(#waveGradient)" strokeWidth="0.75" />
                        <path d="M-200 560 Q 250 710, 500 560 T 1000 560 T 1200 560" fill="none" stroke="url(#waveGradient)" strokeWidth="0.75" />
                        <path d="M-250 440 Q 300 290, 550 440 T 1050 440 T 1250 440" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                        <path d="M-250 580 Q 300 730, 550 580 T 1050 580 T 1250 580" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                    </svg>
                </div>
            </div>

            <div className="absolute bottom-16 w-full max-w-lg">
                <div className="space-y-2 mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Your Personal Finance Tracker</h1>
                    <p className="text-lg text-slate-600">Designed By Rajesh</p>
                </div>
                 <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 text-slate-300">
                    <path d="M0 19.3143C0 12.0857 2.28571 6.85714 6.85714 3.62857C11.4286 0.4 16.4286 0 20 2.28571L16.4286 9.51429C14.7143 8.37143 13.4286 8.37143 12.5714 9.51429C11.7143 10.6571 11.7143 11.8 12.5714 12.9429C13.4286 14.0857 14.2857 14.6571 15.1429 14.6571H16L12.5714 22.8571H6.85714C2.28571 22.8571 0 21.7143 0 19.3143ZM20 19.3143C20 12.0857 22.2857 6.85714 26.8571 3.62857C31.4286 0.4 36.4286 0 40 2.28571L36.4286 9.51429C34.7143 8.37143 33.4286 8.37143 32.5714 9.51429C31.7143 10.6571 31.7143 11.8 32.5714 12.9429C33.4286 14.0857 34.2857 14.6571 35.1429 14.6571H36L32.5714 22.8571H26.8571C22.2857 22.8571 20 21.7143 20 19.3143Z" fill="currentColor"/>
                </svg>
                <p className="text-2xl italic text-slate-700">
                    "{quotes[currentQuoteIndex].text}"
                </p>
                <p className="mt-4 text-xl font-semibold text-slate-500">
                    - {quotes[currentQuoteIndex].author}
                </p>
            </div>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background bg-grid-pattern">
        <div className="w-full max-w-sm space-y-6 bg-card p-10 rounded-2xl shadow-xl">
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
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50 border-border"
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
                className="bg-muted/50 border-border"
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
            <a href="#" className="text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
