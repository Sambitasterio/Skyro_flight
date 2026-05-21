import type { CabinClass } from "@/types/flight";
import type { SeatRow } from "@/types/database";

const COLUMNS_LEFT = ["A", "B", "C"] as const;
const COLUMNS_RIGHT = ["D", "E", "F"] as const;

export const SEAT_COLUMNS = [...COLUMNS_LEFT, ...COLUMNS_RIGHT] as const;

export interface ParsedSeatNumber {
  row: number;
  column: string;
}

export interface SeatZone {
  class: CabinClass;
  label: string;
  rowStart: number;
  rowEnd: number;
  rows: SeatGridRow[];
}

export interface SeatGridRow {
  rowNumber: number;
  seats: Map<string, SeatRow>;
}

const ZONE_META: { class: CabinClass; label: string; rowStart: number; rowEnd: number }[] =
  [
    { class: "first", label: "First class", rowStart: 1, rowEnd: 4 },
    { class: "business", label: "Business", rowStart: 5, rowEnd: 12 },
    { class: "economy", label: "Economy", rowStart: 13, rowEnd: 42 },
  ];

export function parseSeatNumber(seatNumber: string): ParsedSeatNumber | null {
  const match = /^(\d+)([A-F])$/i.exec(seatNumber.trim());
  if (!match) return null;
  return {
    row: Number.parseInt(match[1], 10),
    column: match[2].toUpperCase(),
  };
}

export function sortSeats(seats: SeatRow[]): SeatRow[] {
  return [...seats].sort((a, b) => {
    const pa = parseSeatNumber(a.seat_number);
    const pb = parseSeatNumber(b.seat_number);
    if (!pa || !pb) return a.seat_number.localeCompare(b.seat_number);
    if (pa.row !== pb.row) return pa.row - pb.row;
    return pa.column.localeCompare(pb.column);
  });
}

export function buildSeatZones(seats: SeatRow[]): SeatZone[] {
  const byKey = new Map<string, SeatRow>();
  for (const seat of seats) {
    byKey.set(seat.seat_number, seat);
  }

  return ZONE_META.map((zone) => {
    const rows: SeatGridRow[] = [];
    for (let row = zone.rowStart; row <= zone.rowEnd; row += 1) {
      const seatMap = new Map<string, SeatRow>();
      for (const col of SEAT_COLUMNS) {
        const key = `${row}${col}`;
        const seat = byKey.get(key);
        if (seat) seatMap.set(col, seat);
      }
      rows.push({ rowNumber: row, seats: seatMap });
    }
    return { ...zone, rows };
  });
}

export function isPremiumSeat(seat: SeatRow): boolean {
  return Number(seat.extra_fee) > 0;
}

export function seatMatchesCabin(seat: SeatRow, cabin: CabinClass): boolean {
  return seat.class === cabin;
}
