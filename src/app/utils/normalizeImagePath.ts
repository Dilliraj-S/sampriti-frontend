const OLD_PREFIX = "/assets/products/";
const NEW_PREFIX = "/Assets/";

export function normalizeImagePath(path?: string): string {
  if (!path) return "";
  if (path.startsWith(OLD_PREFIX)) {
    return path.replace(OLD_PREFIX, NEW_PREFIX);
  }
  return path;
}

export function normalizeProductImages<T extends { image?: string; hoverImage?: string }>(product: T): T {
  return {
    ...product,
    image: normalizeImagePath(product.image),
    hoverImage: normalizeImagePath(product.hoverImage),
  };
}
