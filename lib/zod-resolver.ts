import { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import { z } from "zod";


export function zodResolver<T extends FieldValues = FieldValues>(
  schema: z.ZodType<T, any, any>,
): Resolver<T> {
  return async (values) => {
    try {
      const result = await schema.safeParseAsync(values);

      if (result.success) {
        return {
          values: result.data as T,
          errors: {},
        };
      }

      const errors: Record<string, any> = {};
      const issues =
        (result.error as any).issues || (result.error as any).errors || [];

      for (const issue of issues) {
        const path = issue.path.join(".");
        if (path && !errors[path]) {
          errors[path] = {
            type: issue.code,
            message: issue.message,
          };
        }
      }

      return {
        values: {} as Record<string, never>,
        errors: errors as FieldErrors<T>,
      };
    } catch (err: any) {
      const issues = err?.issues || err?.errors || [];
      const errors: Record<string, any> = {};

      for (const issue of issues) {
        const path = issue.path?.join(".") || "root";
        if (!errors[path]) {
          errors[path] = {
            type: issue.code || "validation",
            message: issue.message || "Invalid input",
          };
        }
      }

      return {
        values: {} as Record<string, never>,
        errors: errors as FieldErrors<T>,
      };
    }
  };
}
