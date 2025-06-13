export interface Book {
  id?: string;
  _id?: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  status: 'Available' | 'Issued';
  isbn?: string;
  description?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  status: 'Available' | 'Issued';
  isbn?: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface BookFilters {
  search?: string;
  genre?: string;
  status?: string;
}
