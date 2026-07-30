"use client";

import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "../actions/update-user";
import { User as AuthUser } from ".prisma/generated/client";

type UserUpdateFormProps = {
  user: AuthUser;
};

export const UserUpdateForm = ({ user }: UserUpdateFormProps) => {
  const [actionState, action] = useActionState(
    updateUser.bind(null, user),
    EMPTY_ACTION_STATE,
  );

  const { username, firstName, lastName } = user;

  return (
    <Form action={action} actionState={actionState}>
      <Label htmlFor="username" className="text-xs text-muted-foreground">
        Username
      </Label>
      <Input
        id="username"
        name="username"
        defaultValue={
          (actionState.payload?.get("username") as string) || username
        }
      />
      <FieldError actionState={actionState} name="username" />

      <Label htmlFor="firstName" className="text-xs text-muted-foreground mt-2">
        First Name
      </Label>
      <Input
        id="firstName"
        name="firstName"
        placeholder="First Name"
        defaultValue={
          (actionState.payload?.get("firstName") as string) || firstName
        }
      />
      <FieldError actionState={actionState} name="firstName" />
      <Label htmlFor="lastName" className="text-xs text-muted-foreground mt-2">
        Last Name
      </Label>
      <Input
        id="lastName"
        name="lastName"
        placeholder="Last Name"
        defaultValue={
          (actionState.payload?.get("lastName") as string) || lastName
        }
      />
      <FieldError actionState={actionState} name="lastName" />
      <SubmitButton label="Update" className="mt-4" />
    </Form>
  );
};
