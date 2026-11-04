export type MembershipType = 'estudiante' | 'docente' | 'externo';

export interface Member {
  id: number;
  name: string;
  email: string;
  membershipType: MembershipType;
  active: boolean;
}

export type NewMember = Omit<Member, 'id'>;
