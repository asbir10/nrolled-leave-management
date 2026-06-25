const palette = [
    "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B",
    "#10B981", "#06B6D4", "#3B82F6", "#EF4444",
    "#14B8A6", "#F97316",
  ];
  export function avatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    }
    return palette[hash % palette.length];
  }
  export function initials(name: string): string {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("");
  }