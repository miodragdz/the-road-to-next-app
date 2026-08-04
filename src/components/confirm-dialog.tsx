import { cloneElement, useActionState, useState } from "react";
import { toast } from "sonner";
import { Form } from "./form/form";
import { SubmitButton } from "./form/submit-button";
import { ActionState, EMPTY_ACTION_STATE } from "./form/utils/to-action-state";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type UseConfirmDialogProps = {
  title?: string;
  description?: string;
  action: () => Promise<ActionState>;
  trigger: React.ReactElement;
};

const useConfirmDialog = ({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Make sure you understand the consequences.",
  action,
  trigger,
}: UseConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dialogTrigger = cloneElement(trigger, {
    onClick: () => setIsOpen((state) => !state),
  } as React.HTMLAttributes<HTMLElement>);

  // The action can revalidate a list and unmount this component (e.g. deleting
  // a comment removes its row), which would swallow <Form>'s effect-based toast.
  // So we toast here, in the action continuation, which runs to completion even
  // after unmount. We then blank out the message so <Form> won't toast again on
  // the (non-unmount) occasions where its effect does run.
  const decoratedAction = async (): Promise<ActionState> => {
    const actionState = await action();

    if (actionState.status === "SUCCESS") {
      if (actionState.message) {
        toast.success(actionState.message);
      }
    } else if (actionState.status === "ERROR") {
      if (actionState.message) {
        toast.error(actionState.message);
      }
    }

    return { ...actionState, message: "" };
  };

  const [actionState, formAction] = useActionState(
    decoratedAction,
    EMPTY_ACTION_STATE,
  );

  const handleSuccess = () => {
    setIsOpen(false);
  };

  const handleError = () => {
    setIsOpen(false);
  };

  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <Form
            action={formAction}
            actionState={actionState}
            onSuccess={handleSuccess}
            onError={handleError}
          >
            <SubmitButton label="Confirm" />
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [dialogTrigger, dialog];
};

export { useConfirmDialog };
