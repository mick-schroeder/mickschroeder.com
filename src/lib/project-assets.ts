import type { ImageMetadata } from "astro";

const images = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/projects/*.{png,jpg,jpeg,webp,avif}",
  { eager: true },
);

export function resolveProjectAsset(filename: string): ImageMetadata {
  const image = images[`../assets/projects/${filename}`]?.default;
  if (!image) throw new Error(`Missing project image: ${filename}`);
  return image;
}
