// Date helpers — Monday-first week, month grids, local ISO dates.
import {
  startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  eachDayOfInterval, format, addMonths, isSameMonth, isSameDay,
} from "date-fns";

export function localISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function weekRange(ref: Date) {
  return {
    start: startOfWeek(ref, { weekStartsOn: 1 }),
    end: endOfWeek(ref, { weekStartsOn: 1 }),
  };
}

export function monthRange(ref: Date) {
  return { start: startOfMonth(ref), end: endOfMonth(ref) };
}

// 6-week grid (Mon-first) covering the month containing `ref`.
export function monthGrid(ref: Date): Date[] {
  const gridStart = startOfWeek(startOfMonth(ref), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(ref), { weekStartsOn: 1 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export { format, addMonths, isSameMonth, isSameDay };
