import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { InMemoryBookRepository } from '../adapters/persistence/InMemoryBookRepository';
import { Book } from '../domain/Book';
import { BookService } from './BookService';

describe('BookService Use Cases (with InMemoryBookRepository)', () => {
  let repository: InMemoryBookRepository;
  let service: BookService;

  const initialBooks: Book[] = [
    { id: 1, title: '20 Pasos para ser un Desarrollador Senior', author: 'Raúl Cajiao', isbn: '9781234784587', copies: 4 },
    { id: 2, title: 'Por qué saber usar IA no te hace programador', author: 'Raúl Cajiao', isbn: '9784895438924', copies: 0 },
  ];

  beforeEach(() => {
    repository = new InMemoryBookRepository(initialBooks);
    service = new BookService(repository);
  });

  describe('list', () => {
    it('should return all books', async () => {
      const books = await service.list();
      expect(books).toHaveLength(2);
      expect(books[0].title).toBe('20 Pasos para ser un Desarrollador Senior');
      expect(books[1].title).toBe('Por qué saber usar IA no te hace programador');
    });
  });

  describe('getById', () => {
    it('should return the book when it exists', async () => {
      const book = await service.getById(1);
      expect(book.id).toBe(1);
      expect(book.title).toBe('20 Pasos para ser un Desarrollador Senior');
    });

    it('should throw NotFoundError when book does not exist', async () => {
      await expect(service.getById(999)).rejects.toThrow(NotFoundError);
      await expect(service.getById(999)).rejects.toThrow('Libro no encontrado');
    });
  });

  describe('create', () => {
    it('should persist and return a new book with generated id', async () => {
      const created = await service.create({
        title: 'Por qué saber usar IA no te hace programador',
        author: 'Raúl Cajiao',
        isbn: '9784895438924',
        copies: 2,
      });

      expect(created.id).toBe(3);
      expect(created.title).toBe('Por qué saber usar IA no te hace programador');

      const all = await service.list();
      expect(all).toHaveLength(3);
    });
  });

  describe('borrow (extension)', () => {
    it('should decrement copies when available', async () => {
      const borrowed = await service.borrow(1);
      expect(borrowed.copies).toBe(3);

      const after = await service.getById(1);
      expect(after.copies).toBe(3);
    });

    it('should throw DomainError when no copies are left', async () => {
      await expect(service.borrow(2)).rejects.toThrow(DomainError);
      await expect(service.borrow(2)).rejects.toThrow('No hay ejemplares disponibles para préstamo');
    });

    it('should throw NotFoundError when borrowing a non-existent book', async () => {
      await expect(service.borrow(999)).rejects.toThrow(NotFoundError);
    });
  });
});
