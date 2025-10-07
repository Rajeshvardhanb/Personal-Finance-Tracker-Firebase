
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

const financialQuotes = [
  {
    quote: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make, so you can give money back and have money to invest.",
    author: "Dave Ramsey",
  },
  {
    quote: "The stock market is a device for transferring money from the impatient to the patient.",
    author: "Warren Buffett",
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    quote: "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
    author: "Robert Kiyosaki",
  },
  {
    quote: "The goal isn't more money. The goal is living life on your terms.",
    author: "Chris Brogan",
  },
  {
    quote: "Do not save what is left after spending, but spend what is left after saving.",
    author: "Warren Buffett",
  },
  {
    quote: "A budget is telling your money where to go instead of wondering where it went.",
    author: "John C. Maxwell",
  },
  {
    quote: "You must gain control over your money or the lack of it will forever control you.",
    author: "Dave Ramsey",
  },
  {
    quote: "Beware of little expenses. A small leak will sink a great ship.",
    author: "Benjamin Franklin",
  },
  {
    quote: "Rich people invest in time, poor people invest in money.",
    author: "Warren Buffett",
  },
];


function Waveform() {
  return (
    <svg
      className="w-full"
      viewBox="0 0 1440 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 172L60 160C120 148 240 124 360 127.3C480 130.7 600 160.7 720 172C840 183.3 960 176.7 1080 148.7C1200 120.7 1320 70.7 1380 46L1440 21.3V240H0V172Z"
        fill="hsl(var(--primary))"
        fillOpacity={0.2}
      />
      <path
        d="M0 116L60 127.3C120 138.7 240 160.7 360 172.7C480 184.7 600 186.7 720 170.7C840 154.7 960 120.7 1080 100.7C1200 80.7 1320 74.7 1380 71.5L1440 68.7V240H0V116Z"
        fill="hsl(var(--accent))"
        fillOpacity={0.3}
      />
      <path
        d="M0 21.3L60 32.7C120 44 240 66 360 77.3C480 88.7 600 88.7 720 104.7C840 120.7 960 152.7 1080 166.7C1200 180.7 1320 176.7 1380 174.7L1440 172.7V240H0V21.3Z"
        fill="hsl(var(--primary))"
        fillOpacity={0.4}
      />
    </svg>
  );
}


function QuoteIcon() {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3334 25.0002C15.1667 25.0002 16.6667 23.5002 16.6667 21.6668C16.6667 19.8335 15.1667 18.3335 13.3334 18.3335C11.5001 18.3335 10.0001 19.8335 10.0001 21.6668C10.0001 22.5418 10.3247 23.3502 10.8751 23.9585L6.87508 28.3335C7.94175 29.2585 9.30841 29.8502 10.7501 30.0002V33.3335H5.00008C4.54175 33.3335 4.16675 32.9585 4.16675 32.5002V25.8335C4.16675 18.3335 10.0001 13.3335 16.6667 13.3335V16.6668C14.3334 16.6668 12.3334 17.5835 10.8751 19.0418C12.0001 18.5835 13.5001 19.5002 13.3334 25.0002Z" fill="#E0E0E0"/>
        <path d="M30.8333 18.3335C29 18.3335 27.5 19.8335 27.5 21.6668C27.5 23.5002 29 25.0002 30.8333 25.0002C32.6666 25.0002 34.1666 23.5002 34.1666 21.6668C34.1666 19.8335 32.6666 18.3335 30.8333 18.3335ZM28.375 19.0418C29.8333 17.5835 31.8333 16.6668 34.1666 16.6668V13.3335C27.5 13.3335 21.6666 18.3335 21.6666 25.8335V32.5002C21.6666 32.9585 22.0416 33.3335 22.5 33.3335H28.25V30.0002C26.7916 29.8502 25.425 29.2585 24.3583 28.3335L28.3583 23.9585C27.8083 23.3502 27.5 22.5418 27.5 21.6668C27.5 19.5002 29.5 18.5835 30.625 19.0418L28.375 19.0418Z" fill="#E0E0E0"/>
      </svg>
    )
}

export default function LoginPage() {
  const [email, setEmail] = useState("rajesh@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const { login, isAuthenticating } = useAuth();
  const router = useRouter();
  const [quote, setQuote] = useState(financialQuotes[0]);

  useEffect(() => {
    // Select a random quote on the client side to avoid hydration mismatch
    setQuote(financialQuotes[Math.floor(Math.random() * financialQuotes.length)]);
  }, []);

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
    <main className="relative grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="relative flex flex-col items-center justify-start bg-[#f8f9fa] p-12 text-center overflow-hidden pt-0">
        
        <div className="relative z-10 flex flex-col items-center justify-start space-y-8 pt-0">
            <Image src="/Infinity Cloud Labs PNG.png" alt="Infinity Cloud Labs Logo" width={400} height={100} className="mx-auto" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Personal Finance Tracker</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Designed By Rajesh</p>
                </div>
            </div>
        </div>

        <div className="relative z-10 max-w-md mx-auto text-gray-700 italic border-l-4 border-transparent pl-8 mt-12">
            <div className="absolute top-0 left-0">
                <QuoteIcon />
            </div>
            <p className="pt-4 text-lg leading-relaxed">
              "{quote.quote}"
            </p>
            <footer className="mt-4 text-sm text-right text-gray-500 not-italic">- {quote.author}</footer>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center bg-slate-100 bg-grid-pattern p-8">
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
      
      <div className="absolute bottom-0 left-0 right-0 z-0">
          <Waveform />
      </div>
    </main>
  );
}
