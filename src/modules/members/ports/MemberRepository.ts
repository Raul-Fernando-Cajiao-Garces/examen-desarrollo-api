import { Member, NewMember } from '../domain/Member';

export interface MemberRepository {
  findAll(): Promise<Member[]>;
  findById(id: number): Promise<Member | null>;
  save(member: NewMember): Promise<Member>;
  updateActive(id: number, active: boolean): Promise<Member | null>;
}
