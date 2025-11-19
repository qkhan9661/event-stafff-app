import { UseFormSetError, FieldValues, Path } from "react-hook-form";

export interface FieldError {
  field: string;
  message: string;
}

/**
 * Map backend field errors to react-hook-form errors
 * @param errors - Array of field errors from backend
 * @param setError - react-hook-form setError function
 */
export function mapBackendErrors<T extends FieldValues>(
  errors: FieldError[],
  setError: UseFormSetError<T>
) {
  errors.forEach((error) => {
    setError(error.field as Path<T>, {
      type: "manual",
      message: error.message,
    });
  });
}

/**
 * Extract field errors from tRPC error response
 * @param error - tRPC error object
 * @returns Array of field errors
 */
export function extractFieldErrors(error: any): FieldError[] {
  return (error.data as { fieldErrors?: FieldError[] })?.fieldErrors || [];
}

/**
 * Check if error has field validation errors
 * @param error - tRPC error object
 * @returns True if error contains field errors
 */
export function hasFieldErrors(error: any): boolean {
  const fieldErrors = extractFieldErrors(error);
  return fieldErrors.length > 0;
}
