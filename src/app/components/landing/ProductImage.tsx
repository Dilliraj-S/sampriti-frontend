"use client";

import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f2ef' width='400' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

interface Props {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function ProductImage({ src, alt, className, sizes, fill, width, height, priority }: Props) {
  const [errored, setErrored] = useState(false);
  const imgSrc = errored || !src ? PLACEHOLDER : src;
  const isRemote = src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/uploads/");

  if (isRemote || errored || !src) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={() => setErrored(true)}
        style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" } : undefined}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setErrored(true)}
    />
  );
}
