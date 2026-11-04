import { NextFunction, Request, Response, Router } from 'express';
import { HTTP_STATUS } from '../../../../shared/httpStatus';
import { NotFoundError } from '../../../../shared/NotFoundError';
import { MemberService } from '../../application/MemberService';
import { parseNewMember } from '../../domain/memberValidation';

export const createMemberRouter = (memberService: MemberService): Router => {
  const router = Router();

  // POST /members - Crear un nuevo socio (201 / 400)
  router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = parseNewMember(req.body);
      const createdMember = await memberService.create(validatedData);
      res.status(HTTP_STATUS.CREATED).json(createdMember);
    } catch (error) {
      next(error);
    }
  });

  // GET /members - Listar todos los socios (200)
  router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const members = await memberService.list();
      res.status(HTTP_STATUS.OK).json(members);
    } catch (error) {
      next(error);
    }
  });

  // GET /members/:id - Ver un socio por id (200 / 404)
  router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        throw new NotFoundError('Socio no encontrado');
      }
      const member = await memberService.getById(id);
      res.status(HTTP_STATUS.OK).json(member);
    } catch (error) {
      next(error);
    }
  });

  // PATCH /members/:id/deactivate - Desactivar socio (Ampliación) (200 / 404)
  router.patch('/:id/deactivate', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        throw new NotFoundError('Socio no encontrado');
      }
      const updatedMember = await memberService.deactivate(id);
      res.status(HTTP_STATUS.OK).json(updatedMember);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
