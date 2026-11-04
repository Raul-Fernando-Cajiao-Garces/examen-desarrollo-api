import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { Book, NewBook } from '../domain/Book';
import { BookRepository } from '../ports/BookRepository';

export class BookService {
  constructor(private readonly repository: BookRepository) {}

  list = async (): Promise<Book[]> => {
    return this.repository.findAll();
  };

  getById = async (id: number): Promise<Book> => {
    const book = await this.repository.findById(id);
    if (!book) {
      throw new NotFoundError('Libro no encontrado');
    }
    return book;
  };

  create = async (newBook: NewBook): Promise<Book> => {
    return this.repository.save(newBook);
  };

  borrow = async (id: number): Promise<Book> => {
    const book = await this.getById(id);
    if (book.copies <= 0) {
      throw new DomainError('No hay ejemplares disponibles para préstamo');
    }
    const updated = await this.repository.updateCopies(id, book.copies - 1);
    if (!updated) {
      throw new NotFoundError('Libro no encontrado');
    }
    return updated;
  };
}
