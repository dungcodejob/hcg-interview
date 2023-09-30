import { Repository } from "./repository";

export type RepositoryAPIResult = {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
};
