export interface PaginatedResponse<T> {
  items: T[];
  paging_info: PagingInfo;
}

export interface PagingInfo {
  page_number: number;
  total_items: number;
}
