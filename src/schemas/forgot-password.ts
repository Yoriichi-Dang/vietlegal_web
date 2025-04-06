// schemas/forgot-password.ts
import * as z from "zod";

// Schema for forgot password - only validate email format
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default forgotPasswordSchema;

// Export the inferred type for use in components
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
