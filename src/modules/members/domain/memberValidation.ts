import { DomainError } from '../../../shared/DomainError';
import { MembershipType, NewMember } from './Member';

const ALLOWED_MEMBERSHIPS: MembershipType[] = ['estudiante', 'docente', 'externo'];

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const parseNewMember = (input: unknown): NewMember => {
  if (typeof input !== 'object' || input === null) {
    throw new DomainError('El cuerpo de la petición debe ser un objeto');
  }

  const { name, email, membershipType, active } = input as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim() === '') {
    throw new DomainError('El nombre es obligatorio');
  }

  if (typeof email !== 'string' || !isValidEmail(email.trim())) {
    throw new DomainError('El correo no tiene un formato válido');
  }

  if (
    typeof membershipType !== 'string' ||
    !ALLOWED_MEMBERSHIPS.includes(membershipType.trim() as MembershipType)
  ) {
    throw new DomainError('El tipo de membresía no es válido');
  }

  let resolvedActive = true;
  if (active !== undefined && active !== null) {
    if (typeof active !== 'boolean') {
      throw new DomainError('El estado debe ser verdadero o falso');
    }
    resolvedActive = active;
  }

  return {
    name: name.trim(),
    email: email.trim(),
    membershipType: membershipType.trim() as MembershipType,
    active: resolvedActive,
  };
};
