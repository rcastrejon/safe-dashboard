import { FormCardFooter } from "@/common/form-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VehicleEditInputs, VehiclePublic } from "@/lib/types/vehicle";
import { handleFormError } from "@/lib/utils";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export function VehiclesEditPage() {
  const {
    refineCore: { onFinish },
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<VehiclePublic, HttpError, VehicleEditInputs>({
    shouldUseNativeValidation: true,
    refineCoreProps: {
      errorNotification: (error, _, resource) => {
        if (!error) throw new Error("An error occurred");
        return handleFormError(error, resource);
      },
    },
  });

  return (
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
      <CardHeader>
        <CardTitle>Vehicle details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="edit"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(onFinish)}
        >
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input
              {...register("make", {
                required: true,
              })}
              id="make"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              className="w-full"
              id="model"
              {...register("model", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input {...register("vin", { required: true })} id="vin" />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              {...register("cost", { required: true })}
              id="cost"
              type="number"
              min={0}
              max={10000000}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License plate</Label>
            <Input
              {...register("licensePlate", { required: true })}
              id="licensePlate"
            />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase date</Label>
            <Input
              {...register("purchaseDate", {
                required: true,
              })}
              id="purchaseDate"
              type="date"
            />
          </div>
        </form>
      </CardContent>
      <FormCardFooter
        cancelHref="/vehicles"
        saveForm="edit"
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
