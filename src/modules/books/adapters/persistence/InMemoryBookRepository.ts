import { Book, NewBook } from '../../domain/Book';
import { BookRepository } from '../../ports/BookRepository';

export class InMemoryBookRepository implements BookRepository {
  private books: Book[] = [];
  private nextId = 1;

  constructor(initialBooks: Book[] = []) {
    this.books = initialBooks.map((b) => ({ ...b }));
    this.nextId = initialBooks.length > 0 ? Math.max(...initialBooks.map((b) => b.id)) + 1 : 1;
  }

  findAll = async (): Promise<Book[]> => {
    return this.books.map((b) => ({ ...b }));
  };

  findById = async (id: number): Promise<Book | null> => {
    const found = this.books.find((b) => b.id === id);
    return found ? { ...found } : null;
  };

  save = async (newBook: NewBook): Promise<Book> => {
    const created: Book = {
      id: this.nextId++,
      title: newBook.title,
      author: newBook.author,
      isbn: newBook.isbn,
      copies: newBook.copies,
    };
    this.books.push({ ...created });
    return { ...created };
  };

  updateCopies = async (id: number, copies: number): Promise<Book | null> => {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) {
      return null;
    }
    this.books[index] = {
      ...this.books[index],
      copies,
    };
    return { ...this.books[index] };
  };
}
