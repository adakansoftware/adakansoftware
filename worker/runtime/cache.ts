// Static documents publish on deployment. API reads remain uncached.
export function revalidatePath(..._arguments: unknown[]) {}
export function revalidateTag(..._arguments: unknown[]) {}
export function unstable_cache<T extends (...arguments_: never[]) => unknown>(callback: T, ..._arguments: unknown[]): T {
  return callback
}
