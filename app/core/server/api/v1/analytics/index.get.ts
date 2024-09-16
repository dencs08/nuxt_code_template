import { defineEventHandler } from "h3";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  // Initialize your BackendClient (SupabaseClient)
  const backendClient = event.context.backendClient;

  // Get query parameters
  const query = getQuery(event);
  const period = (query.period as string) || "1d";

  // Calculate period dates
  const { currentPeriodStart, previousPeriodStart } = getPeriodDates(period);

  try {
    // Fetch metrics using the backend client
    const [
      newSignupsCount,
      prevNewSignupsCount,
      totalUsersCount,
      prevTotalUsersCount,
      pageViewsCount,
      prevPageViewsCount,
      uniqueVisitorsCount,
      prevUniqueVisitorsCount,
      chartData,
    ] = await Promise.all([
      backendClient.getNewSignupsCount(currentPeriodStart),
      backendClient.getPreviousNewSignupsCount(
        previousPeriodStart,
        currentPeriodStart
      ),
      backendClient.getTotalUsersCount(),
      backendClient.getTotalUsersCountBeforeDate(currentPeriodStart),
      backendClient.getPageViewsCount(currentPeriodStart),
      backendClient.getPreviousPageViewsCount(
        previousPeriodStart,
        currentPeriodStart
      ),
      backendClient.getUniqueVisitorsCount(currentPeriodStart),
      backendClient.getPreviousUniqueVisitorsCount(
        previousPeriodStart,
        currentPeriodStart
      ),
      backendClient.getChartData(),
    ]);

    // Calculate percentage changes
    const newSignupsChange = calculatePercentageChange(
      newSignupsCount,
      prevNewSignupsCount
    );
    const totalUsersChange = calculatePercentageChange(
      totalUsersCount,
      prevTotalUsersCount
    );
    const pageViewsChange = calculatePercentageChange(
      pageViewsCount,
      prevPageViewsCount
    );
    const uniqueVisitorsChange = calculatePercentageChange(
      uniqueVisitorsCount,
      prevUniqueVisitorsCount
    );

    // Construct the metrics object
    const metrics = {
      newSignups: newSignupsCount,
      newSignupsChange,
      totalUsers: totalUsersCount,
      totalUsersChange,
      pageViews: pageViewsCount,
      pageViewsChange,
      uniqueVisitors: uniqueVisitorsCount,
      uniqueVisitorsChange,
      chartData,
    };

    // Return the metrics as JSON
    return metrics;
  } catch (error: any) {
    console.error("Error fetching metrics:", error);
    // Return an error response
    return {
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message,
    };
  }
});

// Helper Functions

function getPeriodDates(period: string) {
  const match = period.match(/^(\d+)([dwmy])$/);
  if (!match) return null;
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

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  } else {
    return ((current - previous) / previous) * 100;
  }
}
