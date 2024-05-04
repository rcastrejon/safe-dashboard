import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VehicleEditInputs, VehiclePublic } from "@/lib/types/vehicle";
import { handleFormError } from "@/lib/utils";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Link } from "react-router-dom";

export function VehiclesEditPage() {
  const {
    refineCore: { onFinish, queryResult },
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
          id="create"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(onFinish)}
        >
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              defaultValue={queryResult?.data?.data.make}
              {...register("make", {
                required: true,
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Vehicle's model</Label>
            <Input
              className="w-full"
              id="model"
              defaultValue={queryResult?.data?.data.model}
              {...register("model", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input
              id="vin"
              defaultValue={queryResult?.data?.data.vin}
              {...register("vin", { required: true })}
            />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              min={0}
              max={10000000}
              step={1}
              defaultValue={queryResult?.data?.data.cost}
              {...register("cost", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License plate</Label>
            <Input
              id="licensePlate"
              defaultValue={queryResult?.data?.data.licensePlate}
              {...register("licensePlate", { required: true })}
            />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase date</Label>
            <Input
              id="purchaseDate"
              type="date"
              defaultValue={queryResult?.data?.data.purchaseDate}
              {...register("purchaseDate", {
                required: true,
              })}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-6 border-t py-4">
        <Link
          className="font-medium text-primary text-sm underline-offset-4 hover:underline"
          to="/vehicles"
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
