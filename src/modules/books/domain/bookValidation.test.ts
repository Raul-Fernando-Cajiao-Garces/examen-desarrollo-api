import { DomainError } from '../../../shared/DomainError';
import { parseNewBook } from './bookValidation';

describe('Book Domain Validation (parseNewBook)', () => {
  it('should successfully validate a correct book with 13 digits ISBN', () => {
    const rawBook = {
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      isbn: '978-0-307-47472-8',
      copies: 3,
    };

    const validated = parseNewBook(rawBook);

    expect(validated).toEqual({
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      isbn: '978-0-307-47472-8',
      copies: 3,
    });
  });

  it('should successfully validate a correct book with 10 digits ISBN and 0 copies', () => {
    const rawBook = {
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      isbn: '0134494164',
      copies: 0,
    };

    const validated = parseNewBook(rawBook);

    expect(validated.copies).toBe(0);
    expect(validated.isbn).toBe('0134494164');
  });

  it('should throw DomainError when title is missing or empty', () => {
    expect(() => parseNewBook({
      author: 'Autor',
      isbn: '9780307474728',
      copies: 1,
    })).toThrow(DomainError);

    expect(() => parseNewBook({
      title: '   ',
      author: 'Autor',
      isbn: '9780307474728',
      copies: 1,
    })).toThrow('El título es obligatorio');
  });

  it('should throw DomainError when author is missing or empty', () => {
    expect(() => parseNewBook({
      title: 'Título Válido',
      isbn: '9780307474728',
      copies: 1,
    })).toThrow(DomainError);

    expect(() => parseNewBook({
      title: 'Título Válido',
      author: '  ',
      isbn: '9780307474728',
      copies: 1,
    })).toThrow('El autor es obligatorio');
  });

  it('should throw DomainError when ISBN is invalid', () => {
    // Menos de 10 dígitos
    expect(() => parseNewBook({
      title: 'Libro',
      author: 'Autor',
      isbn: '12345',
      copies: 1,
    })).toThrow('El ISBN no es válido');

    // Caracteres inválidos
    expect(() => parseNewBook({
      title: 'Libro',
      author: 'Autor',
      isbn: '978-0-307-ABCD-8',
      copies: 1,
    })).toThrow('El ISBN no es válido');
  });

  it('should throw DomainError when copies is negative or not an integer', () => {
    expect(() => parseNewBook({
      title: 'Libro',
      author: 'Autor',
      isbn: '9780307474728',
      copies: -1,
    })).toThrow('Los ejemplares deben ser un número igual o mayor que 0');

    expect(() => parseNewBook({
      title: 'Libro',
      author: 'Autor',
      isbn: '9780307474728',
      copies: 2.5,
    })).toThrow('Los ejemplares deben ser un número igual o mayor que 0');
  });
});
