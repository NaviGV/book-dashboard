import { Book, BookFormData, PaginatedResponse, BookFilters } from '../types/book';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const bookApi = {
  async getBooks(page = 1, limit = 10, filters: BookFilters = {}): Promise<PaginatedResponse<Book>> {
    const res = await fetch(`${API_BASE_URL}/books`);
    if (!res.ok) throw new Error('Failed to fetch books');

    let books: Book[] = await res.json();

    // Apply filters locally
    if (filters.search) {
      const search = filters.search.toLowerCase();
      books = books.filter(b =>
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search)
      );
    }
    if (filters.genre && filters.genre !== 'all') {
      books = books.filter(b => b.genre === filters.genre);
    }
    if (filters.status && filters.status !== 'all') {
      books = books.filter(b => b.status === filters.status);
    }

    const total = books.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginated = books.slice(startIndex, startIndex + limit);

    return { data: paginated, total, page, totalPages };
  },

  async getBookById(id: string): Promise<Book | null> {
    const res = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async createBook(data: BookFormData): Promise<Book> {
    const res = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Create failed');
    return res.json();
  },

  async updateBook(id: string, data: BookFormData): Promise<Book> {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  },

  async deleteBook(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Delete failed');
  },

  async getGenres(): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/books`);
    if (!res.ok) return [];
    const books: Book[] = await res.json();
    return [...new Set(books.map(b => b.genre))].sort();
  }
};
