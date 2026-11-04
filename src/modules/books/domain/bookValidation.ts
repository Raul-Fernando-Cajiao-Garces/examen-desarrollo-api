import { DomainError } from '../../../shared/DomainError';
import { NewBook } from './Book';

const isValidIsbn = (isbn: string): boolean => {
  // Acepta dígitos y guiones, debe tener 10 o 13 dígitos
  if (!/^[\d-]+$/.test(isbn)) {
    return false;
  }
  const digitsOnly = isbn.replace(/-/g, '');
  return digitsOnly.length === 10 || digitsOnly.length === 13;
};

export const parseNewBook = (input: unknown): NewBook => {
  if (typeof input !== 'object' || input === null) {
    throw new DomainError('El cuerpo de la petición debe ser un objeto');
  }

  const { title, author, isbn, copies } = input as Record<string, unknown>;

  if (typeof title !== 'string' || title.trim() === '') {
    throw new DomainError('El título es obligatorio');
  }

  if (typeof author !== 'string' || author.trim() === '') {
    throw new DomainError('El autor es obligatorio');
  }

  if (typeof isbn !== 'string' || !isValidIsbn(isbn.trim())) {
    throw new DomainError('El ISBN no es válido');
  }

  if (typeof copies !== 'number' || !Number.isInteger(copies) || copies < 0) {
    throw new DomainError('Los ejemplares deben ser un número igual o mayor que 0');
  }

  return {
    title: title.trim(),
    author: author.trim(),
    isbn: isbn.trim(),
    copies,
  };
};
