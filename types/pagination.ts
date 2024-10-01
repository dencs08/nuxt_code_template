interface FilterValue {
  value: string;
  matchMode: "contains" | "startsWith" | "endsWith" | "equals";
}

export interface Filters {
  [key: string]: FilterValue;
  global?: FilterValue;
}

export interface PaginationParams {
  offset?: number | string;
  limit?: number | string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filters?: Filters | string;
  force?: boolean;
}

export interface PaginatedResponse {
  data: any[];
  totalRecords: number;
  totalQueryRecords: number;
}
