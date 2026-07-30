"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { accountProfilePath } from "@/paths";
import { Prisma } from ".prisma/generated/client";
import { User as AuthUser } from ".prisma/generated/client";

const signUpSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(191)
    .refine((value) => !value.includes(" "), "Username cannot contain spaces"),
  firstName: z
    .string()
    .min(0)
    .max(191)
    .refine(
      (value) => !value.includes(" "),
      "First Name cannot contain spaces",
    ),
  lastName: z
    .string()
    .min(0)
    .max(191)
    .refine((value) => !value.includes(" "), "Last Name cannot contain spaces"),
});

export const updateUser = async (
  authUser: AuthUser,
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { username, firstName, lastName } = signUpSchema.parse(
      Object.fromEntries(formData),
    );

    const dbUser = await prisma.user.findUnique({
      where: {
        id: authUser.id,
      },
    });

    if (!dbUser) {
      return toActionState("ERROR", "User not found", formData);
    }
    if (!isOwner(authUser, { userId: dbUser.id })) {
      return toActionState("ERROR", "Not Authorized", formData);
    }
    if (
      dbUser.username === username &&
      dbUser.firstName === firstName &&
      dbUser.lastName === lastName
    ) {
      return toActionState("ERROR", "No changes made", formData);
    }

    await prisma.user.update({
      where: { id: authUser.id },
      data: { username, firstName, lastName },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState("ERROR", "Couldn't update user", formData);
    }
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(accountProfilePath());

  return toActionState("SUCCESS", "User data updated", formData);
};
