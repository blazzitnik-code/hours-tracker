const PALETTE = ["#1e6b45", "#7c3aed", "#b45309", "#0369a1", "#db2777", "#374151"];

export function companyColor(index: number): string {
  return PALETTE[index % PALETTE.length];
}
