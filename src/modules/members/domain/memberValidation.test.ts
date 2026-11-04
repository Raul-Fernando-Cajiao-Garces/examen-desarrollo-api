import { DomainError } from '../../../shared/DomainError';
import { parseNewMember } from './memberValidation';

describe('Member Domain Validation (parseNewMember)', () => {
  it('should successfully validate a correct member with default active=true', () => {
    const rawMember = {
      name: 'Lucía Mendoza',
      email: 'lucia.mendoza@correo.com',
      membershipType: 'estudiante',
    };

    const validated = parseNewMember(rawMember);

    expect(validated).toEqual({
      name: 'Lucía Mendoza',
      email: 'lucia.mendoza@correo.com',
      membershipType: 'estudiante',
      active: true,
    });
  });

  it('should successfully validate a correct member with explicit active=false', () => {
    const rawMember = {
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@correo.com',
      membershipType: 'docente',
      active: false,
    };

    const validated = parseNewMember(rawMember);

    expect(validated.active).toBe(false);
    expect(validated.membershipType).toBe('docente');
  });

  it('should throw DomainError when name is missing or empty', () => {
    expect(() => parseNewMember({
      email: 'lucia.mendoza@correo.com',
      membershipType: 'estudiante',
    })).toThrow(DomainError);

    expect(() => parseNewMember({
      name: '   ',
      email: 'lucia.mendoza@correo.com',
      membershipType: 'estudiante',
    })).toThrow('El nombre es obligatorio');
  });

  it('should throw DomainError when email is invalid', () => {
    expect(() => parseNewMember({
      name: 'Lucía Mendoza',
      email: 'correo-invalido-sin-arroba',
      membershipType: 'estudiante',
    })).toThrow('El correo no tiene un formato válido');

    expect(() => parseNewMember({
      name: 'Lucía Mendoza',
      email: 'test@',
      membershipType: 'estudiante',
    })).toThrow('El correo no tiene un formato válido');
  });

  it('should throw DomainError when membershipType is invalid', () => {
    expect(() => parseNewMember({
      name: 'Lucía Mendoza',
      email: 'lucia.mendoza@correo.com',
      membershipType: 'administrador',
    })).toThrow('El tipo de membresía no es válido');
  });

  it('should throw DomainError when active is not a boolean', () => {
    expect(() => parseNewMember({
      name: 'Lucía Mendoza',
      email: 'lucia.mendoza@correo.com',
      membershipType: 'estudiante',
      active: 'si',
    })).toThrow('El estado debe ser verdadero o falso');

    expect(() => parseNewMember({
      name: 'Lucía Mendoza',
      email: 'lucia.mendoza@correo.com',
      membershipType: 'estudiante',
      active: 1,
    })).toThrow('El estado debe ser verdadero o falso');
  });
});
