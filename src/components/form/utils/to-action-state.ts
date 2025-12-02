import * as z from "zod";

export type ActionState = { message: string; payload?: FormData };

export const fromErrorToActionState = (
  error: unknown,
  formData?: FormData
): ActionState => {
  if (error instanceof z.ZodError) {
    // if validation error with Zod, return first error message
    return {
      message: error.issues[0]?.message,
      payload: formData,
    };
  } else if (error instanceof Error) {
    // if another error instance, return error message
    // e.g. database error
    return {
      message: error.message,
      payload: formData,
    };
  } else {
    // if not an error instance but something else crashed
    // return generic error message
    return {
      message: "An unknown error occurred",
      payload: formData,
    };
  }
};
