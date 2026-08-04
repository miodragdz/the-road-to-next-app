"use client";

import { LucidePencil } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CommentWithMetadata } from "../types";
import { CommentUpsertForm } from "./comment-upsert-form";

type CommentEditButtonProps = {
  ticketId: string;
  comment: CommentWithMetadata;
};

const CommentEditButton = ({ ticketId, comment }: CommentEditButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogCancel className="absolute right-6 top-6 mt-0 cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Edit your existing comment
            </AlertDialogDescription>
          </AlertDialogHeader>
          <CommentUpsertForm
            ticketId={ticketId}
            comment={comment}
            onSuccess={() => setIsOpen(false)}
          />
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <LucidePencil className="w-4 h-4" />
      </Button>
    </>
  );
};

export { CommentEditButton };
