import { FormCardFooter } from "@/common/form-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Driver, DriverPublic } from "@/lib/types/driver";
import { handleFormError } from "@/lib/utils";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export function DriversEditPage() {
  const {
    refineCore: { onFinish },
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
          id="edit"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(onFinish)}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              {...register("name", {
                required: true,
              })}
              id="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date of birth</Label>
            <Input
              {...register("birthDate", { required: true })}
              id="birthDate"
              className="w-full"
              type="date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input {...register("address", { required: true })} id="address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="curp">CURP</Label>
            <Input {...register("curp", { required: true })} id="curp" />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License number</Label>
            <Input
              {...register("licenseNumber", { required: true })}
              id="licenseNumber"
            />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlySalary">Monthly salary</Label>
            <Input
              {...register("monthlySalary", {
                required: true,
              })}
              id="monthlySalary"
              type="number"
              step={1}
              min={0}
              max={100000}
            />
          </div>
        </form>
      </CardContent>
      <FormCardFooter
        cancelHref="/drivers"
        saveForm="edit"
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
