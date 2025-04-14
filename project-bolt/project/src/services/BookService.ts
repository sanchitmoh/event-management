import api from './api';

export interface Book {
  id?: number;
  title: string;
  author: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  isbn?: string;
  category?: string;
  publicationYear?: number;
}

class BookService {
  async getAllBooks(): Promise<Book[]> {
    return api.get<Book[]>('/books');
  }

  async getBookById(id: number): Promise<Book> {
    return api.get<Book>(`/books/${id}`);
  }

  async getBooksByCategory(category: string): Promise<Book[]> {
    return api.get<Book[]>(`/books/category/${category}`);
  }

  async createBook(book: Book): Promise<Book> {
    return api.post<Book>('/books', book);
  }

  async updateBook(id: number, book: Book): Promise<Book> {
    return api.put<Book>(`/books/${id}`, book);
  }

  async deleteBook(id: number): Promise<void> {
    return api.delete<void>(`/books/${id}`);
  }

  async searchBooks(query: string): Promise<Book[]> {
    return api.get<Book[]>(`/books/search?query=${query}`);
  }
}

export default new BookService(); 