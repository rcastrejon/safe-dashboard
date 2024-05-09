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
import type { RoutePublic, RouteUpdate } from "@/lib/types/route";
import { cn, handleFormError } from "@/lib/utils";
import { type HttpError, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { type Control, Controller, useWatch } from "react-hook-form";
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
    control,
    handleSubmit,
  } = useForm<RoutePublic, HttpError, RouteUpdate>({
    refineCoreProps: {
      errorNotification: (error, _, resource) => {
        if (!error) throw new Error("An error occurred");
        return handleFormError(error, resource);
      },
    },
    shouldUseNativeValidation: true,
  });

  function getStatusValueFromSucces(
    success: boolean | null,
  ): "pending" | "success" | "failed" {
    if (success === null) {
      return "pending";
    }
    return success ? "success" : "failed";
  }

  function getValuesFromStatusValue(status: string): boolean | null {
    switch (status) {
      case "success":
        return true;
      case "failed":
        return false;
      default:
      case "pending":
        return null;
    }
  }

  async function handleFinish(data: RouteUpdate) {
    if (data.success !== false) {
      data.problemDescription = null;
    }
    await onFinish(data);
  }

  return (
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
      <CardHeader>
        <CardTitle>Route details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="edit"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(handleFinish)}
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
          <div className="space-y-2">
            <Label htmlFor="success">Status</Label>
            <Controller
              name="success"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <select
                  {...rest}
                  id="success"
                  className="block w-full"
                  value={getStatusValueFromSucces(value)}
                  onChange={(e) =>
                    onChange(getValuesFromStatusValue(e.target.value))
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
              )}
            />
          </div>
          <ProblemDescriptionField control={control} />
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

function ProblemDescriptionField({
  control,
}: {
  control: Control<RouteUpdate>;
}) {
  const success = useWatch({
    control,
    name: "success",
    defaultValue: false,
  });
  const disabled = success !== false;
  return (
    <div className="space-y-2">
      <Label
        className={cn(disabled && "text-muted-foreground")}
        htmlFor="problemDescription"
      >
        Problem description
      </Label>
      <Controller
        name="problemDescription"
        control={control}
        disabled={disabled}
        rules={{ required: true }}
        render={({ field: { value, ...rest } }) => (
          <Input {...rest} id="problemDescription" value={value ?? ""} />
        )}
      />
    </div>
  );
}
