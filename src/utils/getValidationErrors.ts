import { ZodError, ZodType } from "zod";

export function getValidationErrors<T>(
  schema: ZodType<T>,
  data: T
): Partial<Record<keyof T, string>> {
  try {
    schema.parse(data);
    return {};
  } catch (err) {
    if (err instanceof ZodError) {
      const formattedErrors = err.format();
      const fieldErrors: Partial<Record<keyof T, string>> = {};

      (Object.keys(formattedErrors) as (keyof T)[]).forEach((key) => {
        const error = formattedErrors[key];
        if (error && Array.isArray(error._errors) && error._errors.length > 0) {
          fieldErrors[key] = error._errors[0];
        }
      });

      return fieldErrors;
    }
    return {};
  }
}
