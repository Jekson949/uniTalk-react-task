export interface Operator {
  createdAt: string;
  name: string;
  avatar: string;
  isWorking: boolean;
  id: string;
}

export interface OperatorAddon {
  fieldName: string;
  text: string;
  isChecked: boolean;
  id: string;
}

export type WorkingFilter = "all" | "working" | "not_working";

export interface TableSort {
  orderBy: string;
  order: "asc" | "desc";
}

export interface TableState {
  page: number;
  rowsPerPage: number;
  sort: TableSort;
  filters: {
    search: string;
    working: WorkingFilter;
    dateFrom?: string | null;
    dateTo?: string | null;
  };
}
