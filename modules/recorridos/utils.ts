import dayjs from "dayjs";
import { Reserva } from "./types";

export interface GroupedReserva {
  date: string;
  dayName: string;
  reservas: Array<Reserva>;
}

export interface RecorridoCalculations {
  dateRange: string;
  totalDays: number;
  groupedReservas: GroupedReserva[];
  totalCost: number;
}

/**
 * Calculates the date range for a recorrido based on its reservas
 */
export function calculateDateRange(reservas: Reserva[]): string {
  if (!reservas || reservas.length === 0) {
    return "";
  }

  // Get all dates from instanciaEvento
  const dates = reservas
    .map((reserva) => dayjs(reserva.instanciaEvento?.fecha))
    .sort((a, b) => a.valueOf() - b.valueOf());

  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  // Format date range using dayjs
  const formatDate = (date: dayjs.Dayjs, showMonth = true) => {
    return showMonth ? date.format("ddd D [de] MMM") : date.format("ddd D");
  };

  // Check if both dates are in the same month
  const sameMonth =
    startDate.month() === endDate.month() &&
    startDate.year() === endDate.year();

  return sameMonth
    ? `${formatDate(startDate, false)} - ${formatDate(endDate, true)}`
    : `${formatDate(startDate, true)} - ${formatDate(endDate, true)}`;
}

/**
 * Calculates the total number of days for a recorrido
 */
export function calculateTotalDays(reservas: Reserva[]): number {
  if (!reservas || reservas.length === 0) {
    return 0;
  }

  const dates = reservas
    .map((reserva) => dayjs(reserva.instanciaEvento?.fecha))
    .sort((a, b) => a.valueOf() - b.valueOf());

  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  return endDate.diff(startDate, "day") + 1;
}

/**
 * Groups reservas by date for display purposes
 */
export function groupReservasByDate(reservas: Reserva[]): GroupedReserva[] {
  if (!reservas || reservas.length === 0) {
    return [];
  }

  // Format date for display
  const formatDate = (date: dayjs.Dayjs, showMonth = true) => {
    return showMonth ? date.format("ddd D [de] MMM") : date.format("ddd D");
  };

  // Group reservas by date
  const groupedByDate = reservas.reduce(
    (acc, reserva) => {
      const date = dayjs(reserva.instanciaEvento?.fecha);
      const dateKey = date.format("YYYY-MM-DD");

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          dayName: formatDate(date, true),
          reservas: [],
        };
      }

      acc[dateKey].reservas.push(reserva);

      return acc;
    },
    {} as Record<string, GroupedReserva>,
  );

  return Object.values(groupedByDate).sort(
    (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
  );
}

/**
 * Groups reservas by date with a limit on total items (for card display)
 */
export function groupReservasByDateWithLimit(
  reservas: Reserva[],
  maxItems: number = 2,
): GroupedReserva[] {
  if (!reservas || reservas.length === 0) {
    return [];
  }

  const allGroupedReservas = groupReservasByDate(reservas);

  // Find the index where accumulated items reach maxItems
  let accumulatedItems = 0;
  let limitedIndex = 0;

  for (let i = 0; i < allGroupedReservas.length; i++) {
    accumulatedItems += allGroupedReservas[i].reservas.length;
    if (accumulatedItems >= maxItems) {
      limitedIndex = i + 1; // Include this group
      break;
    }
    limitedIndex = i + 1; // Include all groups if less than maxItems total items
  }

  return allGroupedReservas.slice(0, limitedIndex);
}

/**
 * Calculates the total cost of all reservas in a recorrido
 */
export function calculateTotalCost(reservas: Reserva[]): number {
  if (!reservas || reservas.length === 0) {
    return 0;
  }

  return reservas.reduce(
    (sum, reserva) => sum + parseFloat(reserva.precio.toString()),
    0,
  );
}

/**
 * Main function that combines all calculations
 */
export function calculateRecorridoData(
  reservas: Reserva[],
): RecorridoCalculations {
  return {
    dateRange: calculateDateRange(reservas),
    totalDays: calculateTotalDays(reservas),
    groupedReservas: groupReservasByDate(reservas),
    totalCost: calculateTotalCost(reservas),
  };
}

/**
 * Main function that combines all calculations with limited grouped reservas (for card display)
 */
export function calculateRecorridoDataWithLimit(
  reservas: Reserva[],
  maxItems: number = 2,
): RecorridoCalculations {
  return {
    dateRange: calculateDateRange(reservas),
    totalDays: calculateTotalDays(reservas),
    groupedReservas: groupReservasByDateWithLimit(reservas, maxItems),
    totalCost: calculateTotalCost(reservas),
  };
}
