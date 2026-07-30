"use server";

import { redirect } from "next/navigation";
import z from "zod";
import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { isOwner } from "@/features/auth/utils/is-owner";
import {
  hashPassword,
  verifyPasswordHash,
} from "@/features/password/utils/hash-and-verify";
import { prisma } from "@/lib/prisma";
import { accountProfilePath } from "@/paths";
import { Prisma } from ".prisma/generated/client";
import { User as AuthUser } from ".prisma/generated/client";

const signUpSchema = z
  .object({
    currentPassword: z.string().min(6).max(191),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "New passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const updatePassword = async (
  authUser: AuthUser,
  _actionState: ActionState,
  formData: FormData,
) => {
  try {
    const { currentPassword, newPassword } = signUpSchema.parse(
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

    const validPassword = await verifyPasswordHash(
      dbUser.passwordHash,
      currentPassword,
    );

    if (!validPassword) {
      return toActionState("ERROR", "Incorrect current password", formData);
    }

    const samePassword = await verifyPasswordHash(
      dbUser.passwordHash,
      newPassword,
    );

    if (samePassword) {
      return toActionState(
        "ERROR",
        "New password cannot be the same as the current password",
        formData,
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        id: authUser.id,
      },
      data: {
        passwordHash,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return toActionState("ERROR", "Couldn't update password", formData);
    }
    return fromErrorToActionState(error, formData);
  }
  await setCookieByKey("toast", "Password updated");

  redirect(accountProfilePath());
};
