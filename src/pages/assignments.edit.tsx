import { FormCardFooter } from "@/common/form-card";
import { Select } from "@/common/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Assignment, AssignmentPublic } from "@/lib/types/assignment";
import type { DriverPublic } from "@/lib/types/driver";
import type { VehiclePublic } from "@/lib/types/vehicle";
import { handleFormError } from "@/lib/utils";
import { type HttpError, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export function AssignmentsEditPage() {
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
        <CardTitle>Assignment details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="edit"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(onFinish)}
        >
          <div className="space-y-2">
            <Label htmlFor="vehicleId">Vehicle VIN</Label>
            <Select
              {...register("vehicleId", { required: true })}
              id="vehicleId"
            >
              <option value="" disabled>
                Select a vehicle
              </option>
              {vehicleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="driverId">Driver</Label>
            <Select {...register("driverId", { required: true })} id="driverId">
              <option value="" disabled>
                Select a driver
              </option>
              {driverOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </form>
      </CardContent>
      <FormCardFooter
        cancelHref="/assignments"
        saveForm="edit"
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
