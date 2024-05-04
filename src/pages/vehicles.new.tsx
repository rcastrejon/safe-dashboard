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
import type { VehicleInputs, VehiclePublic } from "@/lib/types/vehicle";
import { handleFormError } from "@/lib/utils";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Link } from "react-router-dom";

export function VehiclesNewPage() {
  const {
    refineCore: { onFinish },
    formState: { isSubmitting },
    register,
    handleSubmit,
  } = useForm<VehiclePublic, HttpError, VehicleInputs>({
    refineCoreProps: {
      meta: {
        // This is necesary to avoid sending the form data as JSON in the
        // Content-Type header. Instead, leave it empty so the browser can
        // automatically set it to the correct value.
        headers: {},
      },
      errorNotification: (error, _, resource) => {
        if (!error) throw new Error("An error occurred");
        return handleFormError(error, resource);
      },
    },
    shouldUseNativeValidation: true,
  });

  const onSubmit = async ({ fileList, ...rest }: VehicleInputs) => {
    const file: File | undefined = fileList?.[0];
    const formData = new FormData();

    if (file) {
      formData.append("photo", file);
    }
    for (const [key, value] of Object.entries(rest)) {
      formData.append(key, value.toString());
    }

    // @ts-expect-error
    await onFinish(formData);
  };

  return (
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
      <CardHeader>
        <CardTitle>Add a new vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="create"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input id="name" {...register("make", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Vehicle's model</Label>
            <Input
              className="w-full"
              id="model"
              {...register("model", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input id="vin" {...register("vin", { required: true })} />
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
              {...register("cost", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License plate</Label>
            <Input
              id="licensePlate"
              {...register("licensePlate", { required: true })}
            />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase date</Label>
            <Input
              id="purchaseDate"
              type="date"
              {...register("purchaseDate", {
                required: true,
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileInput">Photo</Label>
            <Input
              id="fileInput"
              type="file"
              accept="image/png, image/jpeg"
              {...register("fileList", {
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
