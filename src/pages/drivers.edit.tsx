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
import type { Driver, DriverPublic } from "@/lib/types/driver";
import { handleFormError } from "@/lib/utils";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Link } from "react-router-dom";

export function DriversEditPage() {
  const {
    refineCore: { onFinish, queryResult },
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<DriverPublic, HttpError, Driver>({
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
        <CardTitle>Driver details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="create"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(onFinish)}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              defaultValue={queryResult?.data?.data.name}
              {...register("name", {
                required: true,
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date of birth</Label>
            <Input
              className="w-full"
              id="birthDate"
              type="date"
              defaultValue={queryResult?.data?.data.birthDate}
              {...register("birthDate", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              defaultValue={queryResult?.data?.data.address}
              {...register("address", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="curp">CURP</Label>
            <Input
              id="curp"
              defaultValue={queryResult?.data?.data.curp}
              {...register("curp", { required: true })}
            />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License number</Label>
            <Input
              id="licenseNumber"
              defaultValue={queryResult?.data?.data.licenseNumber}
              {...register("licenseNumber", { required: true })}
            />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlySalary">Monthly salary</Label>
            <Input
              id="monthlySalary"
              type="number"
              step={1}
              min={0}
              max={100000}
              defaultValue={queryResult?.data?.data.monthlySalary}
              {...register("monthlySalary", {
                required: true,
              })}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-6 border-t py-4">
        <Link
          className="font-medium text-primary text-sm underline-offset-4 hover:underline"
          to="/drivers"
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
