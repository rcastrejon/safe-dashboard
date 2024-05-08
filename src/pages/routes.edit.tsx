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
import type { AssignmentPublic } from "@/lib/types/assignment";
import { handleFormError } from "@/lib/utils";
import { type HttpError, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Link } from "react-router-dom";
import React from "react";

export function RoutesEditPage() {
  const { options: assignmentOptions } = useSelect<AssignmentPublic>({
    resource: "assignments",
    optionLabel: "labelName",
    optionValue: "id",
  });  

  const {
    refineCore: { onFinish, queryResult },
    formState: { isSubmitting },
    register,
    handleSubmit,
    setValue,
  } = useForm<RoutePublic, HttpError, Route>({
    refineCoreProps: {
      errorNotification: (error, _, resource) => {                
        if (!error) throw new Error("An error occurred");
        return handleFormError(error, resource);
      },
    },
    shouldUseNativeValidation: true,
  });
  
  const onSubmit = async (data: any) => {    
    data.success = data.success === 'true' ? true : data.success === 'false' ? false : null;
    await onFinish(data);
  };

  const [successStringUpdated, setSuccessStringUpdated] = React.useState(queryResult?.data?.data?.success === null || queryResult?.data?.data?.success === undefined ? "null" : queryResult?.data?.data?.success ? "true" : "false");
  
  return (
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
      <CardHeader>
        <CardTitle>Edit route</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="create"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name", { required: true })}/>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="assignmentId">Assignment</Label>
            <select id="assignmentId" {...register("assignmentId", { required: true })}>
              {assignmentOptions?.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
            <Label htmlFor="driveDate">Drive date</Label>
            <Input
              id="driveDate"
              type="date"
              {...register("driveDate", {
                required: true,
              })}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="success">Success status</Label>
            <select id="success" defaultValue={successStringUpdated} onChange={(e)=>{setValue('success', e.target.value)}}>
              <option value="null">No report yet</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="problemDescription">Problem description</Label>
            <Input id="problemDescription" {...register("problemDescription", { required: false })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Input id="comments" {...register("comments", { required: false })} />
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
