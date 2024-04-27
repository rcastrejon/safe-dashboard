import { Button } from "@/components/ui/button";
import { useLogout } from "@refinedev/core";

export function Dashboard() {
  const { mutate: logout } = useLogout();
  return (
    <div>
      <h1>Dashboard</h1>
      <Button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </Button>
    </div>
  );
}
