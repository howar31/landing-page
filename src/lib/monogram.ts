import { type Project } from "@/data/projects";

// First character is a CJK ideograph (incl. Extension A) or Japanese kana.
const CJK_FIRST = /^[぀-ヿ㐀-鿿]/;

/**
 * Derive a short monogram for a project's placeholder tile.
 * Priority: explicit override → first CJK character → initials of the first
 * two ASCII-leading words → first two characters of the title.
 */
export function deriveMonogram(project: Project): string {
  if (project.monogram && project.monogram.trim() !== "") {
    return project.monogram.trim();
  }
  const title = project.title.trim();
  if (CJK_FIRST.test(title)) {
    return title[0];
  }
  const words = title.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w));
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return title.slice(0, 2).toUpperCase();
}
