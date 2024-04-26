import { Button } from "@/components/ui/button";
import { useLogout } from "@refinedev/core";
import { toast } from "sonner";

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
      <Button
        onClick={() => {
          toast("Event has been created.", {
            duration: 1000000000,
            description: "test description",
          });
        }}
      >
        test
      </Button>
    </div>
  );
}
