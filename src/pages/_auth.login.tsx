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

type LoginVariables = {
  email: string;
  password: string;
};

export function Login() {
  const { mutate: login } = useLogin<LoginVariables>();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };
    login(values);
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
        <form className="grid gap-4" onSubmit={handleSubmit}>
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
