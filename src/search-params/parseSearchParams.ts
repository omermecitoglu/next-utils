import { notFound } from "next/navigation";
import type { ZodType } from "zod";

export async function parseSearchParams<Output, Input extends Record<string, unknown>>(
  source: Promise<NoInfer<Input>>,
  schema: ZodType<Output, Input>,
  onFail: () => never = notFound,
): Promise<Output> {
  const result = schema.safeParse(await source);
  if (!result.success) onFail();
  return result.data;
}
