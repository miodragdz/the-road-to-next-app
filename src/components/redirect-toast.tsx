"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { consumeCookiedByKey } from "@/actions/cookies";

// we do not use here hook useRedirectToast because all components which would use that hook would have to be client components
// this way only this component is a client component
const RedirectToast = () => {
  useEffect(() => {
    const showCookieToast = async () => {
      // Due to React Strict mode we have this run twice and double toast message
      // So consumeCookiedByKey is introduced and used here instead of get and delete cookie
      // Now, for second render message is already null and no double toast
      const message = await consumeCookiedByKey("toast");

      if (message) {
        toast.success(message);
      }
    };

    showCookieToast();
  }, []);

  return null;
};

export { RedirectToast };
