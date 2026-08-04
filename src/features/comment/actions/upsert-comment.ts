"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { ticketPath } from "@/paths";

const upsertCommentSchema = z.object({
  content: z.string().min(1).max(1024),
});

export const upsertComment = async (
  id: string | undefined,
  ticketId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const { user } = await getAuthOrRedirect();

  try {
    if (id) {
      const comment = await prisma.comment.findUnique({
        where: { id },
      });

      if (!comment || !isOwner(user, comment)) {
        return toActionState("ERROR", "Not authorized");
      }
    }

    const data = upsertCommentSchema.parse(Object.fromEntries(formData));

    await prisma.comment.upsert({
      where: { id: id || "" },
      update: data,
      create: {
        userId: user.id,
        ticketId,
        ...data,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketPath(ticketId));

  return toActionState("SUCCESS", id ? "Comment updated" : "Comment created");
};
