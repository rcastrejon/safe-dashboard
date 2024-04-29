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

export function DriversNewPage() {
  const {
    refineCore: { onFinish },
    formState: { isSubmitting },
    register,
    handleSubmit,
  } = useForm<DriverPublic, HttpError, Driver>({
    refineCoreProps: {
      resource: "drivers",
      action: "create",
      errorNotification: (error, _, resource) => {
        if (!error) throw new Error("An error occurred");
        return handleFormError(error, resource);
      },
    },
    shouldFocusError: true,
    shouldUseNativeValidation: true,
  });

  return (
    <>
      <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
        <CardHeader>
          <CardTitle>Add a new driver</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="create"
            className="gap grid gap-y-4"
            onSubmit={handleSubmit(onFinish)}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required {...register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Date of birth</Label>
              <Input
                className="w-full"
                id="birthDate"
                type="date"
                required
                {...register("birthDate")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" required {...register("address")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="curp">CURP</Label>
              <Input id="curp" required {...register("curp")} />
              <p className="text-muted-foreground text-sm">Must be unique.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License number</Label>
              <Input
                id="licenseNumber"
                required
                {...register("licenseNumber")}
              />
              <p className="text-muted-foreground text-sm">Must be unique.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlySalary">Monthly salary</Label>
              <Input
                id="monthlySalary"
                type="number"
                min={0}
                max={1000000}
                step={1}
                required
                {...register("monthlySalary")}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 border-t py-6">
          <Button type="button" variant="link" size="sm" asChild>
            <Link to="/drivers">Cancel</Link>
          </Button>
          <Button form="create" type="submit" size="sm" disabled={isSubmitting}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
