import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface MutationOptions<TData = any> {
  onSuccess?: (data?: TData) => void;
  onError?: (error: any) => void;
}

interface FieldError {
  field: string;
  message: string;
}

/**
 * Generic hook for handling CRUD mutations with consistent error handling
 * @returns Object containing backend errors state and mutation handlers
 */
export function useCrudMutations() {
  const { toast } = useToast();
  const [backendErrors, setBackendErrors] = useState<FieldError[]>([]);

  /**
   * Handle mutation success
   */
  const handleSuccess = (message: string, options?: MutationOptions) => {
    toast({
      message,
      type: "success",
    });
    setBackendErrors([]);
    options?.onSuccess?.();
  };

  /**
   * Handle mutation error with field validation support
   */
  const handleError = (error: any, options?: MutationOptions) => {
    // Extract field errors from tRPC error response
    const fieldErrors = (error.data as { fieldErrors?: FieldError[] })?.fieldErrors || [];

    if (fieldErrors.length > 0) {
      // Set field errors to be displayed on the form
      setBackendErrors(fieldErrors);
      toast({
        message: "Please check the form for errors",
        type: "error",
      });
    } else {
      // Show specific error message for non-validation errors
      setBackendErrors([]);
      toast({
        message: error.message || "An error occurred",
        type: "error",
      });
    }

    options?.onError?.(error);
  };

  /**
   * Create wrapper for create mutation
   */
  const createMutationOptions = (
    successMessage: string,
    options?: MutationOptions
  ) => ({
    onSuccess: (data?: any) => handleSuccess(successMessage, { ...options, onSuccess: () => options?.onSuccess?.(data) }),
    onError: (error: any) => handleError(error, options),
  });

  /**
   * Create wrapper for update mutation
   */
  const updateMutationOptions = (
    successMessage: string,
    options?: MutationOptions
  ) => ({
    onSuccess: (data?: any) => handleSuccess(successMessage, { ...options, onSuccess: () => options?.onSuccess?.(data) }),
    onError: (error: any) => handleError(error, options),
  });

  /**
   * Create wrapper for delete mutation
   */
  const deleteMutationOptions = (
    successMessage: string,
    options?: MutationOptions
  ) => ({
    onSuccess: (data?: any) => handleSuccess(successMessage, { ...options, onSuccess: () => options?.onSuccess?.(data) }),
    onError: (error: any) => handleError(error, options),
  });

  /**
   * Clear all backend errors
   */
  const clearErrors = () => setBackendErrors([]);

  return {
    backendErrors,
    setBackendErrors,
    clearErrors,
    handleSuccess,
    handleError,
    createMutationOptions,
    updateMutationOptions,
    deleteMutationOptions,
  };
}
