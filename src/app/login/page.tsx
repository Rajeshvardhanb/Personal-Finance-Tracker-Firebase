
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppLogo } from "@/components/icons";
import { LoaderCircle } from "lucide-react";
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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="hidden bg-muted lg:flex lg:flex-col lg:items-start lg:justify-between p-8 bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 text-white">
        <AppLogo />
        <div className="space-y-4">
            <h1 className="text-5xl font-bold">Welcome to Your Financial Hub</h1>
            <p className="text-lg text-white/80">
                Track, manage, and forecast your finances with precision and ease, an app by Rajesh.
            </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center font-bold text-white text-sm">R</div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center">
              <Image src="/Infinity Cloud Labs PNG.png" alt="Infinity Cloud Labs Logo" width="100" height="100" className="rounded-full" />
            </div>
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your dashboard.
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            {error && (
                <Alert variant="destructive" className="bg-red-500/20 border-red-500/40 text-red-700">
                    <AlertTitle>Login Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="rajesh@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isAuthenticating}>
              {isAuthenticating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
           <p className="mt-4 text-center text-sm text-muted-foreground">
            This application is proudly developed and maintained by Rajesh B.
          </p>
        </div>
      </div>
    </div>
  );
}
