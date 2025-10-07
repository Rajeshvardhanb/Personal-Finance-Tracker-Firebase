
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";

function Waveform() {
  return (
    <svg
        className="w-full my-12"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M0 86L60 80C120 74 240 62 360 63.7C480 65.3 600 80.3 720 86C840 91.7 960 88.3 1080 74.3C1200 60.3 1320 35.3 1380 23L1440 10.7V120H0V86Z" fill="hsl(var(--primary))" fillOpacity={0.2} />
        <path d="M0 58L60 63.7C120 69.3 240 80.3 360 86.3C480 92.3 600 93.3 720 85.3C840 77.3 960 60.3 1080 50.3C1200 40.3 1320 37.3 1380 35.8L1440 34.3V120H0V58Z" fill="hsl(var(--accent))" fillOpacity={0.3} />
        <path d="M0 10.7L60 16.3C120 22 240 33 360 38.7C480 44.3 600 44.3 720 52.3C840 60.3 960 76.3 1080 83.3C1200 90.3 1320 88.3 1380 87.3L1440 86.3V120H0V10.7Z" fill="hsl(var(--primary))" fillOpacity={0.4}/>
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
      <div className="relative hidden lg:flex flex-col items-center justify-start bg-[#f8f9fa] p-12 text-center overflow-hidden pt-24">
        
        <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
            <Image src="/Infinity Cloud Labs PNG.png" alt="Infinity Cloud Labs Logo" width={400} height={100} className="mx-auto" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Personal Finance Tracker</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Designed By Rajesh</p>
                </div>
            </div>
        </div>

        <div className="w-full my-12">
            <Waveform />
        </div>

        <div className="relative max-w-md mx-auto text-gray-700 italic border-l-4 border-transparent pl-8 mt-8">
            <div className="absolute top-0 left-0">
                <QuoteIcon />
            </div>
            <p className="pt-4 text-lg leading-relaxed">
            "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make, so you can give money back and have money to invest."
            </p>
            <footer className="mt-4 text-sm text-right text-gray-500 not-italic">- Dave Ramsey</footer>
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
    </main>
  );
}
