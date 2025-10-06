
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center">
                <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-700 via-purple-700 to-cyan-500">
                    <AppLogo />
                </div>
            </div>
            <Card>
                <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold tracking-tight">Welcome!</CardTitle>
                <CardDescription>
                    Enter your credentials to sign in.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    )}
                    <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="e.g., rajesh@example.com"
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
                            placeholder="e.g., password123"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isAuthenticating}>
                        {isAuthenticating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                    </div>
                </form>
                 <div className="mt-6 text-center text-xs text-muted-foreground">
                    <p>This application is proudly developed and maintained by Rajesh B.</p>
                </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
