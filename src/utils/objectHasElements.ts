export const objectHasElements = (
  obj: Record<string, unknown> | null | undefined
): boolean => {
  if (!obj) return false;
  return Object.keys(obj).length > 0;
};
