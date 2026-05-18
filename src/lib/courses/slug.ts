export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/["'’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-") || "item"
  );
}

export async function reserveUniqueSlug(
  baseSlug: string,
  exists: (slug: string) => Promise<boolean>,
  excludedSlug?: string
) {
  const cleanBase = slugify(baseSlug);

  if (excludedSlug && cleanBase === excludedSlug) {
    return excludedSlug;
  }

  let candidate = cleanBase;
  let counter = 2;

  while (await exists(candidate)) {
    candidate = `${cleanBase}-${counter}`;
    counter += 1;
  }

  return candidate;
}