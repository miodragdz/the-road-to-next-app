import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { upsertTicket } from "../actions/upsert-ticket";
import { SubmitButton } from "./form/submit-button";
import { Ticket } from ".prisma/generated/client";

type TicketUpsertFormProps = {
  ticket?: Ticket;
};

const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  return (
    <form
      action={upsertTicket.bind(null, ticket?.id)}
      className="flex flex-col gap-y-2"
    >
      <Label htmlFor="title">Title</Label>
      <Input id="title" name="title" type="text" defaultValue={ticket?.title} />

      <Label htmlFor="content">Content</Label>
      <Textarea id="content" name="content" defaultValue={ticket?.content} />

      <SubmitButton label={ticket ? "Update" : "Create"} />
    </form>
  );
};

export { TicketUpsertForm };
