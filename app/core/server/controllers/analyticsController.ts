import type { H3Event } from "h3";
import dayjs from "dayjs";
import {
  getPeriodDates,
  calculatePercentageChange,
} from "~/core/server/utils/analytics";

async function getChartUncached(event: any) {
  const backendClient = event.context.backendClient;
  const query = getQuery(event);
  const period = (query.period as string) || "1y";

  try {
    // Set the start date to the beginning of the period (e.g., 1 year ago)
    const startDate = dayjs().subtract(1, "year").startOf("month");
    const endDate = dayjs().endOf("month"); // Current month

    const months: string[] = [];
    const signupsPerMonth: number[] = [];
    const pageViewsPerMonth: number[] = [];
    const uniqueVisitorsPerMonth: number[] = [];

    let currentMonth = startDate;

    // Iterate through each month from the start date to the end date
    while (
      currentMonth.isBefore(endDate) ||
      currentMonth.isSame(endDate, "month")
    ) {
      const monthStart = currentMonth.startOf("month").toISOString();
      const monthEnd = currentMonth.endOf("month").toISOString();

      // Push the formatted month name (e.g., "January", "February", etc.)
      months.push(currentMonth.format("MMMM"));

      const [newSignupsCount, pageViewsCount, uniqueVisitorsCount] =
        await Promise.all([
          backendClient.getNewSignupsCountBetweenDates(monthStart, monthEnd),
          backendClient.getPageViewsCountBetweenDates(monthStart, monthEnd),
          backendClient.getUniqueVisitorsCountBetweenDates(
            monthStart,
            monthEnd
          ),
        ]);

      signupsPerMonth.push(newSignupsCount || 0);
      pageViewsPerMonth.push(pageViewsCount || 0);
      uniqueVisitorsPerMonth.push(uniqueVisitorsCount || 0);

      // Move to the next month
      currentMonth = currentMonth.add(1, "month");
    }

    const chartData = {
      months,
      signupsPerMonth,
      pageViewsPerMonth,
      uniqueVisitorsPerMonth,
    };

    return chartData;
  } catch (error: any) {
    console.error("Error fetching chart data:", error);
    return {
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message,
    };
  }
}

export const getChart = defineCachedFunction(
  async (event: H3Event) => await getChartUncached(event),
  {
    maxAge: 60 * 60, // 1 hour
    swr: true,
    staleMaxAge: 60 * 60 * 24, // 24 hours
    name: "getChart",
    getKey: (event) => "default",
    shouldBypassCache: (e) => getQuery(e).force === "true",
  }
);

async function getMatricsUncached(event: any) {
  const backendClient = event.context.backendClient;

  const query = getQuery(event);
  const period = (query.period as string) || "1d";

  let periodDates;
  try {
    periodDates = getPeriodDates(period);
  } catch (error: any) {
    return {
      statusCode: 400,
      statusMessage: "Bad Request",
      message: error.message,
    };
  }

  const { currentPeriodStart, previousPeriodStart } = periodDates;

  try {
    const [
      newSignupsCount,
      prevNewSignupsCount,
      totalUsersCount,
      prevTotalUsersCount,
      pageViewsCount,
      prevPageViewsCount,
      uniqueVisitorsCount,
      prevUniqueVisitorsCount,
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
    ]);

    const metrics = {
      newSignups: newSignupsCount,
      newSignupsChange: calculatePercentageChange(
        newSignupsCount,
        prevNewSignupsCount
      ),
      totalUsers: totalUsersCount,
      totalUsersChange: calculatePercentageChange(
        totalUsersCount,
        prevTotalUsersCount
      ),
      pageViews: pageViewsCount,
      pageViewsChange: calculatePercentageChange(
        pageViewsCount,
        prevPageViewsCount
      ),
      uniqueVisitors: uniqueVisitorsCount,
      uniqueVisitorsChange: calculatePercentageChange(
        uniqueVisitorsCount,
        prevUniqueVisitorsCount
      ),
    };

    return metrics;
  } catch (error: any) {
    console.error("Error fetching metrics:", error);
    return {
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message,
    };
  }
}

export const getMetrics = defineCachedFunction(
  async (event: H3Event) => await getMatricsUncached(event),
  {
    maxAge: 60 * 60, // 1 hour
    swr: true,
    staleMaxAge: 60 * 60 * 24, // 24 hours
    name: "getMetrics",
    getKey: (event) => "default",
    shouldBypassCache: (e) => getQuery(e).force === "true",
  }
);
