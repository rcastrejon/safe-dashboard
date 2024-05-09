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
import type { AssignmentPublic } from "@/lib/types/assignment";
import type { Route, RoutePublic } from "@/lib/types/route";
import { handleFormError } from "@/lib/utils";
import { type HttpError, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Link } from "react-router-dom";

export function RoutesEditPage() {
  const today = new Date().toISOString().split("T")[0];

  const { options: assignmentOptions } = useSelect<AssignmentPublic>({
    resource: "assignments",
    optionLabel: "labelName",
    optionValue: "id",
  });

  const {
    refineCore: { onFinish },
    formState: { isSubmitting },
    register,
    handleSubmit,
  } = useForm<Route, HttpError, RoutePublic>({
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
        <CardTitle>Route details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="edit"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(onFinish)}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input {...register("name", { required: true })} id="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignmentId">Assignment</Label>
            <select
              {...register("assignmentId", { required: true })}
              id="assignmentId"
              className="block w-full"
            >
              {assignmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endLatitude">End latitude</Label>
            <Input
              {...register("endLatitude", { required: true })}
              id="endLatitude"
              type="number"
              step="0.0000001"
              min="-90"
              max="90"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endLongitude">End longitude</Label>
            <Input
              {...register("endLongitude", { required: true })}
              id="endLongitude"
              type="number"
              step="0.0000001"
              min="-180"
              max="180"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="driveDate">Drive date</Label>
            <Input
              {...register("driveDate", {
                required: true,
              })}
              id="driveDate"
              type="date"
              min={today}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">
              Comments{" "}
              <span className="font-normal text-muted-foreground text-xs">
                (optional)
              </span>
            </Label>
            <Input
              {...register("comments", { required: false })}
              id="comments"
            />
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
        <Button form="edit" type="submit" size="sm" disabled={isSubmitting}>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
