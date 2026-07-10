import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

import { env } from "@/env";

export const openaiProvider = createOpenAICompatible({
  name: "openaiProxy",
  apiKey: env.OPENAI_API_KEY,
  baseURL: env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
  supportsStructuredOutputs: true,
});
