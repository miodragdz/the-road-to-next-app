import { Prisma } from ".prisma/generated/client";

export type TicketWithMetadata = Prisma.TicketGetPayload<{
  include: {
    user: {
      select: { username: true };
    };
  };
}>;
