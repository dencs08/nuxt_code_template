// utils/analyticsHelpers.ts

import dayjs from "dayjs";

export function getPeriodDates(period: string) {
  const match = period.match(/^(\d+)([dwmy])$/);
  if (!match) {
    throw new Error(
      "Invalid period format. Expected format like '1d', '2w', '3m', '1y'."
    );
  }
  const value = parseInt(match[1]);
  const unitMap: { [key: string]: dayjs.ManipulateType } = {
    d: "day",
    w: "week",
    m: "month",
    y: "year",
  };
  const unit = unitMap[match[2]];
  const now = dayjs();

  const currentPeriodStart = now.subtract(value, unit).startOf(unit);
  const previousPeriodStart = currentPeriodStart.clone().subtract(value, unit);

  return {
    currentPeriodStart: currentPeriodStart.toISOString(),
    previousPeriodStart: previousPeriodStart.toISOString(),
  };
}

export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  } else {
    return ((current - previous) / previous) * 100;
  }
}
