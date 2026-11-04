import { NotFoundError } from '../../../shared/NotFoundError';
import { Member, NewMember } from '../domain/Member';
import { MemberRepository } from '../ports/MemberRepository';

export class MemberService {
  constructor(private readonly repository: MemberRepository) {}

  list = async (): Promise<Member[]> => {
    return this.repository.findAll();
  };

  getById = async (id: number): Promise<Member> => {
    const member = await this.repository.findById(id);
    if (!member) {
      throw new NotFoundError('Socio no encontrado');
    }
    return member;
  };

  create = async (newMember: NewMember): Promise<Member> => {
    return this.repository.save(newMember);
  };

  deactivate = async (id: number): Promise<Member> => {
    const member = await this.getById(id);
    const updated = await this.repository.updateActive(member.id, false);
    if (!updated) {
      throw new NotFoundError('Socio no encontrado');
    }
    return updated;
  };
}
