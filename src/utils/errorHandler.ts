
import { toast } from "@/components/ui/sonner";

/**
 * Central error handler for application errors
 * @param error The error to handle
 * @param customMessage An optional custom message to show to the user
 */
export const handleError = (error: unknown, customMessage?: string): void => {
  // Log the error for debugging
  console.error("Application error:", error);

  // Determine the error message to display
  let errorMessage: string;
  
  if (error instanceof Error) {
    errorMessage = customMessage || error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = customMessage || "Terjadi kesalahan. Silakan coba lagi.";
  }

  // Show a toast notification
  toast.error(errorMessage);
};

/**
 * Wraps an async function with error handling
 * @param fn The async function to wrap
 * @param errorMessage Optional error message to show if the function fails
 * @returns A new function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string
): (...args: Parameters<T>) => Promise<ReturnType<T> | undefined> {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorMessage);
      return undefined;
    }
  };
}
