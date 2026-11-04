import { Member, NewMember } from '../../domain/Member';
import { MemberRepository } from '../../ports/MemberRepository';

export class InMemoryMemberRepository implements MemberRepository {
  private members: Member[] = [];
  private nextId = 1;

  constructor(initialMembers: Member[] = []) {
    this.members = initialMembers.map((m) => ({ ...m }));
    this.nextId = initialMembers.length > 0 ? Math.max(...initialMembers.map((m) => m.id)) + 1 : 1;
  }

  findAll = async (): Promise<Member[]> => {
    return this.members.map((m) => ({ ...m }));
  };

  findById = async (id: number): Promise<Member | null> => {
    const found = this.members.find((m) => m.id === id);
    return found ? { ...found } : null;
  };

  save = async (newMember: NewMember): Promise<Member> => {
    const created: Member = {
      id: this.nextId++,
      name: newMember.name,
      email: newMember.email,
      membershipType: newMember.membershipType,
      active: newMember.active,
    };
    this.members.push({ ...created });
    return { ...created };
  };

  updateActive = async (id: number, active: boolean): Promise<Member | null> => {
    const index = this.members.findIndex((m) => m.id === id);
    if (index === -1) {
      return null;
    }
    this.members[index] = {
      ...this.members[index],
      active,
    };
    return { ...this.members[index] };
  };
}
