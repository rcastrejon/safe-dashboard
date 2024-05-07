import { FormCardFooter } from "@/common/form-card";
import { Select } from "@/common/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AssignmentPublic } from "@/lib/types/assignment";
import type { Route, RoutePublic } from "@/lib/types/route";
import { handleFormError } from "@/lib/utils";
import { type HttpError, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export function RoutesNewPage() {
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
            <Input {...register("name", { required: true })} id="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignmentId">Assignment</Label>
            <Select
              {...register("assignmentId", { required: true })}
              id="assignmentId"
              defaultValue=""
            >
              <option value="" disabled>
                Select an assignment
              </option>
              {assignmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
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
      <FormCardFooter
        cancelHref="/routes"
        saveForm="create"
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
