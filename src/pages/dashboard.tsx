import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPublic } from "@/lib/types/user";
import { useLogout, useSelect } from "@refinedev/core";
import { DriverPublic } from "@/lib/types/driver";
import { VehiclePublic } from "@/lib/types/vehicle";
import { RoutePublic } from "@/lib/types/route";
import { AssignmentPublic } from "@/lib/types/assignment";

export function Dashboard() {
  const { mutate: logout } = useLogout();
  const { options: userOptions } = useSelect<UserPublic>({ resource: "users", optionLabel: "email", optionValue: "id"});
  const { options: driverOptions } = useSelect<DriverPublic>({ resource: "drivers", optionLabel: "name", optionValue: "id"});
  const { options: vehicleOptions } = useSelect<VehiclePublic>({ resource: "vehicles", optionLabel: "vin", optionValue: "id"});
  const { options: routeOptions } = useSelect<RoutePublic>({ resource: "routes", optionLabel: "driveDate", optionValue: "id"});
  const { options: assignmentOptions } = useSelect<AssignmentPublic>({ resource: "assignments", optionLabel: "id", optionValue: "id"});

  return (
    <div>
      <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
        <CardHeader>
          <CardTitle>Total users</CardTitle>
        </CardHeader>
        <CardContent>
          {userOptions.length}
        </CardContent>
      </Card>

      <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x" style={{marginTop: "10px"}}>
        <CardHeader>
          <CardTitle>Total drivers</CardTitle>
        </CardHeader>
        <CardContent>
          {driverOptions.length}
        </CardContent>
      </Card>

      <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x" style={{marginTop: "10px"}}>
        <CardHeader>
          <CardTitle>Total vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicleOptions.length}
        </CardContent>
      </Card>

      <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x" style={{marginTop: "10px"}}>
        <CardHeader>
          <CardTitle>Total routes</CardTitle>
        </CardHeader>
        <CardContent>
          {routeOptions.filter(route => {
            const today = new Date();
            const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            return route.label === todayString;
          }).length
          }
        </CardContent>
      </Card>

      <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x" style={{marginTop: "10px"}}>
        <CardHeader>
          <CardTitle>Total assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {assignmentOptions.length}
        </CardContent>
      </Card>

      <Button
        onClick={() => {
          logout();
        }}
        style={{marginTop: "10px"}}
      >
        Logout
      </Button>
    </div>
  );
}
