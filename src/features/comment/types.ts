import { Prisma } from ".prisma/generated/client";

export type CommentWithMetadata = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: { username: true; firstName: true; lastName: true };
    };
  };
}>;
