import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@refinedev/core";
import { Link } from "react-router-dom";
import { useRef } from "react";

type LoginVariables = {
  email: string;
  password: string;
};

export function Login() {
  const { mutate: login } = useLogin<LoginVariables>();
  const form = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.current === null) return;
    const values = {
      email: form.current.email.value,
      password: form.current.password.value,
    };
    login(values, {
      onSuccess: (data) => {
        if (data.success || form.current === null) return;
        form.current.reset();
        (form.current.email as HTMLInputElement | undefined)?.focus();
      },
    });
  }

  return (
    <Card className="sm:mx-auto sm:w-full sm:max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit} ref={form}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" required type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" required type="password" />
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link className="underline" to="/register">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
