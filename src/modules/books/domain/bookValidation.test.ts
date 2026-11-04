import { DomainError } from '../../../shared/DomainError';
import { parseNewBook } from './bookValidation';

describe('Book Domain Validation (parseNewBook)', () => {
  it('should successfully validate a correct book with 13 digits ISBN', () => {
    const rawBook = {
      title: '20 Pasos para ser un Desarrollador Senior',
      author: 'Raúl Cajiao',
      isbn: '978-1-234-78458-7',
      copies: 4,
    };

    const validated = parseNewBook(rawBook);

    expect(validated).toEqual({
      title: '20 Pasos para ser un Desarrollador Senior',
      author: 'Raúl Cajiao',
      isbn: '978-1-234-78458-7',
      copies: 4,
    });
  });

  it('should successfully validate a correct book with second example and 0 copies', () => {
    const rawBook = {
      title: 'Por qué saber usar IA no te hace programador',
      author: 'Raúl Cajiao',
      isbn: '9784895438924',
      copies: 0,
    };

    const validated = parseNewBook(rawBook);

    expect(validated.copies).toBe(0);
    expect(validated.title).toBe('Por qué saber usar IA no te hace programador');
    expect(validated.isbn).toBe('9784895438924');
  });

  it('should throw DomainError when title is missing or empty', () => {
    expect(() => parseNewBook({
      author: 'Raúl Cajiao',
      isbn: '9781234784587',
      copies: 1,
    })).toThrow(DomainError);

    expect(() => parseNewBook({
      title: '   ',
      author: 'Raúl Cajiao',
      isbn: '9781234784587',
      copies: 1,
    })).toThrow('El título es obligatorio');
  });

  it('should throw DomainError when author is missing or empty', () => {
    expect(() => parseNewBook({
      title: '20 Pasos para ser un Desarrollador Senior',
      isbn: '9781234784587',
      copies: 1,
    })).toThrow(DomainError);

    expect(() => parseNewBook({
      title: '20 Pasos para ser un Desarrollador Senior',
      author: '  ',
      isbn: '9781234784587',
      copies: 1,
    })).toThrow('El autor es obligatorio');
  });

  it('should throw DomainError when ISBN is invalid', () => {
    // Menos de 10 dígitos
    expect(() => parseNewBook({
      title: 'Por qué saber usar IA no te hace programador',
      author: 'Raúl Cajiao',
      isbn: '12345',
      copies: 1,
    })).toThrow('El ISBN no es válido');

    // Caracteres inválidos
    expect(() => parseNewBook({
      title: 'Por qué saber usar IA no te hace programador',
      author: 'Raúl Cajiao',
      isbn: '978-0-307-ABCD-8',
      copies: 1,
    })).toThrow('El ISBN no es válido');
  });

  it('should throw DomainError when copies is negative or not an integer', () => {
    expect(() => parseNewBook({
      title: '20 Pasos para ser un Desarrollador Senior',
      author: 'Raúl Cajiao',
      isbn: '9781234784587',
      copies: -1,
    })).toThrow('Los ejemplares deben ser un número igual o mayor que 0');

    expect(() => parseNewBook({
      title: '20 Pasos para ser un Desarrollador Senior',
      author: 'Raúl Cajiao',
      isbn: '9781234784587',
      copies: 2.5,
    })).toThrow('Los ejemplares deben ser un número igual o mayor que 0');
  });
});
