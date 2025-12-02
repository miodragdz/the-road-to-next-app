import * as z from "zod";

export type ActionState = {
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  payload?: FormData;
};

export const fromErrorToActionState = (
  error: unknown,
  formData?: FormData
): ActionState => {
  if (error instanceof z.ZodError) {
    // if validation error with Zod, return first error message
    return {
      message: "",
      fieldErrors: z.flattenError(error).fieldErrors,
      payload: formData,
    };
  } else if (error instanceof Error) {
    // if another error instance, return error message
    // e.g. database error
    return {
      message: error.message,
      fieldErrors: {},
      payload: formData,
    };
  } else {
    // if not an error instance but something else crashed
    // return generic error message
    return {
      message: "An unknown error occurred",
      fieldErrors: {},
      payload: formData,
    };
  }
};
