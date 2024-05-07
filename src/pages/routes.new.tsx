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
import type { RoutePublic, Route } from "@/lib/types/route";
import { handleFormError } from "@/lib/utils";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Link } from "react-router-dom";

export function RoutesNewPage() {
  const {
    refineCore: { onFinish },
    formState: { isSubmitting },
    register,
    handleSubmit,
  } = useForm<RoutePublic, HttpError, Route>({
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
        <CardTitle>Add a new route</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="create"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(onFinish)}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startLongitude">Start longitude</Label>
            <Input id="startLongitude" type="number" {...register("startLongitude", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startLatitude">Start latitude</Label>
            <Input id="startLatitude" type="number" {...register("startLatitude", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endLongitude">End longitude</Label>
            <Input id="endLongitude" type="number" {...register("endLongitude", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endLatitude">End latitude</Label>
            <Input id="endLatitude" type="number" {...register("endLatitude", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="driveDate">Monthly salary</Label>
            <Input
              id="driveDate"
              type="date"
              {...register("driveDate", {
                required: true,
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Input id="comments" {...register("name", { required: true })} />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-6 border-t py-4">
        <Link
          className="font-medium text-primary text-sm underline-offset-4 hover:underline"
          to="/routes"
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
