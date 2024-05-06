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
import { type HttpError, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Link } from "react-router-dom";

export function AssignmentsNewPage() {
  const { options: driverOptions } = useSelect<DriverPublic>({
    resource: "drivers",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: vehicleOptions } = useSelect<VehiclePublic>({
    resource: "vehicles",
    optionLabel: "vin",
    optionValue: "id",
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
        <CardTitle>Create assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="create"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(onFinish)}
        >
          <div className="flex flex-col space-y-2">
            <Label htmlFor="vehicleId">Vehicle VIN</Label>
            <select
              id="vehicleId"
              {...register("vehicleId", { required: true })}
            >
              {vehicleOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="driverId">Driver</Label>
            <select id="driverId" {...register("driverId", { required: true })}>
              {driverOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-6 border-t py-4">
        <Link
          className="font-medium text-primary text-sm underline-offset-4 hover:underline"
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
