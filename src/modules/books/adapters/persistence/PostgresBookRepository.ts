import { Pool } from 'pg';
import { Book, NewBook } from '../../domain/Book';
import { BookRepository } from '../../ports/BookRepository';

export class PostgresBookRepository implements BookRepository {
  constructor(private readonly pool: Pool) {}

  findAll = async (): Promise<Book[]> => {
    const query = `
      SELECT id, title, author, isbn, copies
      FROM books
      ORDER BY id ASC;
    `;
    const result = await this.pool.query(query);
    return result.rows.map((row) => ({
      id: Number(row.id),
      title: String(row.title),
      author: String(row.author),
      isbn: String(row.isbn),
      copies: Number(row.copies),
    }));
  };

  findById = async (id: number): Promise<Book | null> => {
    const query = `
      SELECT id, title, author, isbn, copies
      FROM books
      WHERE id = $1;
    `;
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: Number(row.id),
      title: String(row.title),
      author: String(row.author),
      isbn: String(row.isbn),
      copies: Number(row.copies),
    };
  };

  save = async (newBook: NewBook): Promise<Book> => {
    const query = `
      INSERT INTO books (title, author, isbn, copies)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, author, isbn, copies;
    `;
    const values = [newBook.title, newBook.author, newBook.isbn, newBook.copies];
    const result = await this.pool.query(query, values);
    const row = result.rows[0];
    return {
      id: Number(row.id),
      title: String(row.title),
      author: String(row.author),
      isbn: String(row.isbn),
      copies: Number(row.copies),
    };
  };

  updateCopies = async (id: number, copies: number): Promise<Book | null> => {
    const query = `
      UPDATE books
      SET copies = $1
      WHERE id = $2
      RETURNING id, title, author, isbn, copies;
    `;
    const result = await this.pool.query(query, [copies, id]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: Number(row.id),
      title: String(row.title),
      author: String(row.author),
      isbn: String(row.isbn),
      copies: Number(row.copies),
    };
  };
}
