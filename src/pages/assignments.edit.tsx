import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Assignment, AssignmentPublic } from "@/lib/types/assignment";
import type { DriverPublic } from "@/lib/types/driver";
import type { VehiclePublic } from "@/lib/types/vehicle";
import { handleFormError } from "@/lib/utils";
import { type HttpError, useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Link } from "react-router-dom";

export function AssignmentsEditPage() {
  const { data: driverData, isError: driverIsError } = useList<
    DriverPublic,
    HttpError
  >({
    resource: "drivers",
  });

  const { data: vehicleData, isError: vehicleIsError } = useList<
    VehiclePublic,
    HttpError
  >({
    resource: "vehicles",
  });

  const {
    refineCore: { onFinish },
    formState: { isSubmitting },
    register,
    handleSubmit,
  } = useForm<AssignmentPublic, HttpError, Assignment>({
    refineCoreProps: {
      errorNotification: (error, _, resource) => {
        if (!error) throw new Error("An error occurred");
        return handleFormError(error, resource);
      },
    },
    shouldUseNativeValidation: true,
  });

  return (
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
      <CardHeader>
        <CardTitle>Assignment details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="create"
          className="grid gap gap-y-5"
          onSubmit={handleSubmit(onFinish)}
        >
          <div className="space-y-2">
            <Label htmlFor="vehicleId">Vehicle VIN</Label>
            <select
              className="flex"
              id="vehicleId"
              {...register("vehicleId", { required: true })}
            >
              {vehicleData?.data.map(({ vin, id }) => (
                <option key={id} value={id}>
                  {vin}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="driverId">Driver</Label>
            <select
              className="flex"
              id="driverId"
              {...register("driverId", { required: true })}
            >
              {driverData?.data.map(({ name, id }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-6 py-4 border-t">
        <Link
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          to="/assignments"
        >
          Cancel
        </Link>
        <Button form="create" type="submit" size="sm" disabled={isSubmitting}>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
