const STORAGE_KEY = "sampriti-section-assignments";

export function getSectionAssignments(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveSectionAssignment(slug: string, section: string): void {
  try {
    const stored = getSectionAssignments();
    if (section) stored[slug] = section;
    else delete stored[slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {}
}

export function saveSectionAssignments(keys: Array<string | number | null | undefined>, section: string): void {
  try {
    const stored = getSectionAssignments();
    keys.forEach((key) => {
      const normalizedKey = String(key || "").trim();
      if (!normalizedKey) return;
      if (section) stored[normalizedKey] = section;
      else delete stored[normalizedKey];
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {}
}

export function removeSectionAssignment(slug: string): void {
  try {
    const stored = getSectionAssignments();
    delete stored[slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {}
}

export function removeSectionAssignments(keys: Array<string | number | null | undefined>): void {
  try {
    const stored = getSectionAssignments();
    keys.forEach((key) => {
      const normalizedKey = String(key || "").trim();
      if (normalizedKey) delete stored[normalizedKey];
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {}
}
