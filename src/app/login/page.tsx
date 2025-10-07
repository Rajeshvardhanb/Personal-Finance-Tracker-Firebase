
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
import { AppLogo } from "@/components/icons";

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
    <main className="flex min-h-screen w-full items-center justify-center bg-background">
      <Image
        src="https://picsum.photos/seed/finance-bg/1920/1080"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-40"
        data-ai-hint="cityscape finance"
      />
       <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm"></div>

      <div className="relative z-20 w-full max-w-md space-y-6 rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
          <div className="flex justify-center">
            <AppLogo />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to access your financial dashboard.
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
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/30 bg-white/20 text-foreground placeholder:text-foreground/60 focus:bg-white/30"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-white/30 bg-white/20 text-foreground placeholder:text-foreground/60 focus:bg-white/30"
              />
            </div>
            <Button
              type="submit"
              className="w-full text-white shadow-lg transition-all hover:bg-primary/90"
              disabled={isAuthenticating}
            >
              {isAuthenticating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          <div className="text-center text-sm">
            <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>
    </main>
  );
}
