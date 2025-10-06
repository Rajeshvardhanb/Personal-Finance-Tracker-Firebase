
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppLogo } from "@/components/icons";
import { LoaderCircle } from "lucide-react";

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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="z-10 flex flex-col items-center gap-8">
            <AppLogo />
            <Card className="w-full max-w-sm bg-white/10 backdrop-blur-lg border-white/20 text-white shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
                    <CardDescription className="text-white/80">
                        Enter your credentials to access your dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        {error && (
                        <Alert variant="destructive" className="bg-red-500/80 border-red-400/80 text-white">
                            <AlertTitle>Login Failed</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        )}
                    <div className="grid gap-2">
                        <Label htmlFor="email" >Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="e.g., rajesh@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 placeholder:text-white/50 focus:bg-white/20"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            required 
                            placeholder="e.g., password123"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/10 border-white/20 placeholder:text-white/50 focus:bg-white/20"
                        />
                    </div>
                    <Button type="submit" className="w-full mt-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold" disabled={isAuthenticating}>
                        {isAuthenticating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
