"use client";

import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Textarea } from "@/components/ui/textarea";
import { upsertComment } from "../actions/upsert-comment";
import { CommentWithMetadata } from "../types";

type CommentUpsertFormProps = {
  ticketId: string;
  comment?: CommentWithMetadata;
  onSuccess?: () => void;
};

const CommentUpsertForm = ({
  ticketId,
  comment,
  onSuccess,
}: CommentUpsertFormProps) => {
  const [actionState, action] = useActionState(
    upsertComment.bind(null, comment?.id, ticketId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState} onSuccess={onSuccess}>
      <Textarea
        name="content"
        placeholder="What's on your mind ..."
        defaultValue={
          (actionState.payload?.get("content") as string) ?? comment?.content
        }
      />
      <FieldError actionState={actionState} name="content" />

      <SubmitButton label={comment ? "Update" : "Comment"} />
    </Form>
  );
};

export { CommentUpsertForm };
