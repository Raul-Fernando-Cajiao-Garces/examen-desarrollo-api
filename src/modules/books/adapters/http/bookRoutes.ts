import { NextFunction, Request, Response, Router } from 'express';
import { HTTP_STATUS } from '../../../../shared/httpStatus';
import { NotFoundError } from '../../../../shared/NotFoundError';
import { BookService } from '../../application/BookService';
import { parseNewBook } from '../../domain/bookValidation';

export const createBookRouter = (bookService: BookService): Router => {
  const router = Router();

  // POST /books - Crear un nuevo libro (201 / 400)
  router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = parseNewBook(req.body);
      const createdBook = await bookService.create(validatedData);
      res.status(HTTP_STATUS.CREATED).json(createdBook);
    } catch (error) {
      next(error);
    }
  });

  // GET /books - Listar todos los libros (200)
  router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const books = await bookService.list();
      res.status(HTTP_STATUS.OK).json(books);
    } catch (error) {
      next(error);
    }
  });

  // GET /books/:id - Ver un libro por id (200 / 404)
  router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        throw new NotFoundError('Libro no encontrado');
      }
      const book = await bookService.getById(id);
      res.status(HTTP_STATUS.OK).json(book);
    } catch (error) {
      next(error);
    }
  });

  // PATCH /books/:id/borrow - Préstamo de libro (Ampliación) (200 / 400 / 404)
  router.patch('/:id/borrow', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        throw new NotFoundError('Libro no encontrado');
      }
      const updatedBook = await bookService.borrow(id);
      res.status(HTTP_STATUS.OK).json(updatedBook);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
