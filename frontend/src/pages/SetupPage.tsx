import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { PoolType } from "@/lib/types";

export function SetupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [poolName, setPoolName] = useState("My Pool");
  const [gallons, setGallons] = useState("10000");
  const [poolType, setPoolType] = useState<PoolType>("chlorine");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const signupRes = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: email }),
      });
      if (!signupRes.ok) {
        const body = (await signupRes.json().catch(() => ({}))) as { message?: string };
        setError(body.message ?? "Account creation failed");
        return;
      }

      // Sign in immediately after account creation
      const signinRes = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!signinRes.ok) {
        setError("Account created but sign-in failed. Please go to login.");
        return;
      }

      await fetch("/api/pool", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: poolName, gallons: Number(gallons), pool_type: poolType }),
      });

      navigate("/");
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-6 px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome</h1>
          <p className="text-sm text-muted-foreground mt-1">Set up your pool tracker</p>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Card>
            <CardContent className="pt-5 pb-5 flex flex-col gap-4">
              <h2 className="text-base font-semibold">Your Account</h2>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5 flex flex-col gap-4">
              <h2 className="text-base font-semibold">Your Pool</h2>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="poolName">Pool name</Label>
                <Input
                  id="poolName"
                  value={poolName}
                  onChange={(e) => setPoolName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gallons">Volume (gallons)</Label>
                <Input
                  id="gallons"
                  type="number"
                  inputMode="numeric"
                  value={gallons}
                  onChange={(e) => setGallons(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Pool type</Label>
                <div className="flex rounded-md border border-input overflow-hidden">
                  {(["chlorine", "salt"] as PoolType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPoolType(t)}
                      className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                        poolType === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Create Account & Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
