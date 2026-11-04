import { Book, NewBook } from '../domain/Book';

export interface BookRepository {
  findAll(): Promise<Book[]>;
  findById(id: number): Promise<Book | null>;
  save(book: NewBook): Promise<Book>;
  updateCopies(id: number, copies: number): Promise<Book | null>;
}
