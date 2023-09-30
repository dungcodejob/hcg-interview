import { Pagination } from "./pagination";

export type RepositoriesQueryRequest = Partial<RepositoriesFilter> &
  Pagination & {
    keyword: string;
  };

export type RepositoriesFilter = {
  owner: string | null;
  language: string | null;
  updatedDate: Date | null;
  size: {
    min: number;
    max: number;
  } | null;
};
