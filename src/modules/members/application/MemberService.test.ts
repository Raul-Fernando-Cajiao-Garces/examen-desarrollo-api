import { NotFoundError } from '../../../shared/NotFoundError';
import { InMemoryMemberRepository } from '../adapters/persistence/InMemoryMemberRepository';
import { Member } from '../domain/Member';
import { MemberService } from './MemberService';

describe('MemberService Use Cases (with InMemoryMemberRepository)', () => {
  let repository: InMemoryMemberRepository;
  let service: MemberService;

  const initialMembers: Member[] = [
    { id: 1, name: 'Raúl Fernando', email: 'raulcajiao@uisrael.edu.ec', membershipType: 'estudiante', active: true },
    { id: 2, name: 'Cajiao Garcés', email: 'cajiaogarces@uisrael.edu.ec', membershipType: 'docente', active: true },
  ];

  beforeEach(() => {
    repository = new InMemoryMemberRepository(initialMembers);
    service = new MemberService(repository);
  });

  describe('list', () => {
    it('should return all members', async () => {
      const members = await service.list();
      expect(members).toHaveLength(2);
      expect(members[0].name).toBe('Raúl Fernando');
    });
  });

  describe('getById', () => {
    it('should return the member when it exists', async () => {
      const member = await service.getById(1);
      expect(member.id).toBe(1);
      expect(member.name).toBe('Raúl Fernando');
    });

    it('should throw NotFoundError when member does not exist', async () => {
      await expect(service.getById(999)).rejects.toThrow(NotFoundError);
      await expect(service.getById(999)).rejects.toThrow('Socio no encontrado');
    });
  });

  describe('create', () => {
    it('should persist and return a new member with generated id', async () => {
      const created = await service.create({
        name: 'Ana Gómez',
        email: 'ana.gomez@correo.com',
        membershipType: 'externo',
        active: true,
      });

      expect(created.id).toBe(3);
      expect(created.name).toBe('Ana Gómez');

      const all = await service.list();
      expect(all).toHaveLength(3);
    });
  });

  describe('deactivate (extension)', () => {
    it('should set member active to false', async () => {
      const deactivated = await service.deactivate(1);
      expect(deactivated.active).toBe(false);

      const after = await service.getById(1);
      expect(after.active).toBe(false);
    });

    it('should throw NotFoundError when deactivating a non-existent member', async () => {
      await expect(service.deactivate(999)).rejects.toThrow(NotFoundError);
      await expect(service.deactivate(999)).rejects.toThrow('Socio no encontrado');
    });
  });
});
