export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function generateUniqueSlug(base: string, suffix?: string) {
  const normalized = slugify(base);
  if (suffix) {
    return `${normalized}-${suffix}`;
  }
  return normalized;
}

export function ensureSlug(base: string, existing?: string | null) {
  if (existing && existing.trim().length > 0) {
    return slugify(existing);
  }
  if (!base || base.trim().length === 0) {
    const random = Math.random().toString(36).slice(2, 6);
    return `interview-form-${random}`;
  }
  const random = Math.random().toString(36).slice(2, 6);
  return generateUniqueSlug(base, random);
}


