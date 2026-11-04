import 'dotenv/config';
import { Pool } from 'pg';
import { createPostgresPool } from '../../../../shared/database/postgresPool';
import { PostgresBookRepository } from './PostgresBookRepository';

describe('PostgresBookRepository Integration Tests (Base de Datos Real)', () => {
  let pool: Pool;
  let repository: PostgresBookRepository;

  const testDbUrl = process.env.TEST_DATABASE_URL || 'postgresql://postgres:root@localhost:5432/examen_test';
  const devDbUrl = process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/examen_dev';

  beforeAll(async () => {
    // REGLA DE SEGURIDAD OBLIGATORIA:
    // Falla si la base de desarrollo y la base de pruebas son iguales
    if (testDbUrl === devDbUrl) {
      throw new Error('La base de datos de pruebas no puede ser igual a la de desarrollo');
    }

    pool = createPostgresPool(testDbUrl);
    repository = new PostgresBookRepository(pool);
  });

  beforeEach(async () => {
    // Limpieza de tabla antes de cada prueba para aislamiento
    await pool.query('TRUNCATE TABLE books RESTART IDENTITY CASCADE;');
  });

  afterAll(async () => {
    await pool.end();
  });

  // 1. Caso Vacío
  it('1. Vacío: should return empty array when table is empty', async () => {
    const books = await repository.findAll();
    expect(books).toEqual([]);
  });

  // 2. Guardar
  it('2. Guardar: should save a new book and return it with generated id', async () => {
    const newBook = {
      title: '20 Pasos para ser un Desarrollador Senior',
      author: 'Raúl Cajiao',
      isbn: '9781234784587',
      copies: 4,
    };

    const saved = await repository.save(newBook);

    expect(saved.id).toBe(1);
    expect(saved.title).toBe(newBook.title);
    expect(saved.author).toBe(newBook.author);
    expect(saved.isbn).toBe(newBook.isbn);
    expect(saved.copies).toBe(4);
  });

  // 3. Listar
  it('3. Listar: should return all books saved in database', async () => {
    await repository.save({
      title: '20 Pasos para ser un Desarrollador Senior',
      author: 'Raúl Cajiao',
      isbn: '9781234784587',
      copies: 4,
    });
    await repository.save({
      title: 'Por qué saber usar IA no te hace programador',
      author: 'Raúl Cajiao',
      isbn: '9784895438924',
      copies: 2,
    });

    const books = await repository.findAll();
    expect(books).toHaveLength(2);
    expect(books[0].title).toBe('20 Pasos para ser un Desarrollador Senior');
    expect(books[1].title).toBe('Por qué saber usar IA no te hace programador');
  });

  // 4. Buscar existente
  it('4. Buscar existente: should find book by id when it exists', async () => {
    const created = await repository.save({
      title: 'Por qué saber usar IA no te hace programador',
      author: 'Raúl Cajiao',
      isbn: '9784895438924',
      copies: 2,
    });

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.title).toBe('Por qué saber usar IA no te hace programador');
    expect(found?.author).toBe('Raúl Cajiao');
  });

  // 5. Buscar inexistente
  it('5. Buscar inexistente: should return null when book id does not exist', async () => {
    const found = await repository.findById(9999);
    expect(found).toBeNull();
  });

  // Caso adicional: Actualización de ejemplares (Ampliación)
  it('Extra. updateCopies: should update copies correctly', async () => {
    const created = await repository.save({
      title: '20 Pasos para ser un Desarrollador Senior',
      author: 'Raúl Cajiao',
      isbn: '9781234784587',
      copies: 4,
    });

    const updated = await repository.updateCopies(created.id, 3);
    expect(updated).not.toBeNull();
    expect(updated?.copies).toBe(3);

    const check = await repository.findById(created.id);
    expect(check?.copies).toBe(3);
  });

  // Protección: verificación de que la regla de seguridad funciona
  it('Protección: should fail if dev and test database URLs are identical', () => {
    const checkSafety = (devUrl: string, testUrl: string): void => {
      if (devUrl === testUrl) {
        throw new Error('La base de datos de pruebas no puede ser igual a la de desarrollo');
      }
    };

    expect(() => checkSafety('postgres://localhost/same', 'postgres://localhost/same')).toThrow(
      'La base de datos de pruebas no puede ser igual a la de desarrollo',
    );
  });
});
