export type NumericMetricKey =
  | "newSignups"
  | "newSignupsChange"
  | "totalUsers"
  | "totalUsersChange"
  | "pageViews"
  | "pageViewsChange"
  | "uniqueVisitors"
  | "uniqueVisitorsChange";

export interface StatDisplayItem {
  title: string;
  metricKey: NumericMetricKey;
  changeKey: NumericMetricKey;
}

export interface MetricsData {
  newSignups: number;
  newSignupsChange: number;
  totalUsers: number;
  totalUsersChange: number;
  pageViews: number;
  pageViewsChange: number;
  uniqueVisitors: number;
  uniqueVisitorsChange: number;
  chartData: any; // Replace 'any' with the appropriate type if possible
}
