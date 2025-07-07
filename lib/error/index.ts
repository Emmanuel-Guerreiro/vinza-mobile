import { z } from "zod";

// Zod schema for API error responses
export const apiErrorSchema = z.object({
  key: z.string(),
  message: z.string(),
  message_eng: z.string(),
  status: z.number(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

// Function to parse and validate API error responses
export const parseApiError = async (response: Response): Promise<ApiError> => {
  try {
    const errorData = await response.json();
    return apiErrorSchema.parse(errorData);
  } catch {
    // If parsing fails, return a default error
    return {
      key: "app.general.network_error",
      message: "Error de red",
      message_eng: "Network error",
      status: response.status,
    };
  }
};
