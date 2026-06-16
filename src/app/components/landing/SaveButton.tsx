"use client";

import { useSavedStore, SavedItem } from "./savedStore";

interface SaveButtonProps {
  item: SavedItem;
  className?: string;
}

export default function SaveButton({ item, className = "" }: SaveButtonProps) {
  const savedIds = useSavedStore((s) => s.savedIds);
  const toggleSave = useSavedStore((s) => s.toggleSave);
  const isSaved = savedIds.includes(item.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave(item);
      }}
      className={`absolute top-3 right-3 z-30 flex h-8 w-8 cursor-pointer items-center justify-center pointer-events-auto ${className}`}
      aria-label={isSaved ? "Remove from saved" : "Save product"}
      suppressHydrationWarning
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isSaved ? "#333" : "none"}
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-200"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
