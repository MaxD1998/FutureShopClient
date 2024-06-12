export interface PageDto<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
}
