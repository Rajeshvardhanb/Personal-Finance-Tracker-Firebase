
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
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <Image
            src="/Infinity Cloud Labs PNG.png"
            alt="Infinity Cloud Labs Logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-800">Welcome!</h1>
          <p className="text-sm text-gray-500">
            Please sign in to your account
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-500/20 border-red-500/40 text-red-700">
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-gray-600">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border-gray-200"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-600"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border-gray-200"
            />
          </div>
          <Button
            type="submit"
            className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isAuthenticating}
          >
            {isAuthenticating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
        <div className="text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </main>
  );
}
