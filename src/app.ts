import express from 'express';
import { createBookRouter } from './modules/books/adapters/http/bookRoutes';
import { InMemoryBookRepository } from './modules/books/adapters/persistence/InMemoryBookRepository';
import { PostgresBookRepository } from './modules/books/adapters/persistence/PostgresBookRepository';
import { BookService } from './modules/books/application/BookService';
import { BookRepository } from './modules/books/ports/BookRepository';
import { createMemberRouter } from './modules/members/adapters/http/memberRoutes';
import { InMemoryMemberRepository } from './modules/members/adapters/persistence/InMemoryMemberRepository';
import { PostgresMemberRepository } from './modules/members/adapters/persistence/PostgresMemberRepository';
import { MemberService } from './modules/members/application/MemberService';
import { MemberRepository } from './modules/members/ports/MemberRepository';
import { createPostgresPool } from './shared/database/postgresPool';
import { errorHandler, notFoundHandler } from './shared/httpErrorHandlers';

const app = express();

app.use(express.json());

// Datos iniciales de prueba para modo en memoria
const sampleBooks = [
  { id: 1, title: '20 Pasos para ser un Desarrollador Senior', author: 'Raúl Cajiao', isbn: '9781234784587', copies: 4 },
  { id: 2, title: 'Por qué saber usar IA no te hace programador', author: 'Raúl Cajiao', isbn: '9784895438924', copies: 2 },
];

const sampleMembers = [
  { id: 1, name: 'Raúl Fernando', email: 'raulcajiao@uisrael.edu.ec', membershipType: 'estudiante' as const, active: true },
  { id: 2, name: 'Cajiao Garcés', email: 'cajiaogarces@uisrael.edu.ec', membershipType: 'docente' as const, active: true },
];

// Fábrica del repositorio de Libros (Variante A)
export const createBookRepository = (): { name: string; repository: BookRepository } => {
  const databaseUrl = process.env.DATABASE_URL;
  const adapter = process.env.BOOKS_ADAPTER;

  if (databaseUrl && adapter === 'sql') {
    const pool = createPostgresPool(databaseUrl);
    return {
      name: 'PostgreSQL with pg',
      repository: new PostgresBookRepository(pool),
    };
  }

  return {
    name: 'in memory',
    repository: new InMemoryBookRepository(sampleBooks),
  };
};

// Fábrica del repositorio de Socios (Variante B)
export const createMemberRepository = (): { name: string; repository: MemberRepository } => {
  const databaseUrl = process.env.DATABASE_URL;
  const adapter = process.env.MEMBERS_ADAPTER;

  if (databaseUrl && adapter === 'sql') {
    const pool = createPostgresPool(databaseUrl);
    return {
      name: 'PostgreSQL with pg',
      repository: new PostgresMemberRepository(pool),
    };
  }

  return {
    name: 'in memory',
    repository: new InMemoryMemberRepository(sampleMembers),
  };
};

const { name: booksAdapterName, repository: bookRepository } = createBookRepository();
console.log(`Books persistence: ${booksAdapterName}`);

const { name: membersAdapterName, repository: memberRepository } = createMemberRepository();
console.log(`Members persistence: ${membersAdapterName}`);

// Servicios de aplicación
export const bookService = new BookService(bookRepository);
export const memberService = new MemberService(memberRepository);

// Rutas montadas bajo los prefijos oficiales
app.use('/books', createBookRouter(bookService));
app.use('/members', createMemberRouter(memberService));

// Ruta de diagnóstico
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', name: 'examen-desarrollo-api' });
});

// Manejadores globales de error
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
