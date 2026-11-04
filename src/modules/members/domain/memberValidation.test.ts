import { DomainError } from '../../../shared/DomainError';
import { parseNewMember } from './memberValidation';

describe('Member Domain Validation (parseNewMember)', () => {
  it('should successfully validate a correct member with default active=true', () => {
    const rawMember = {
      name: 'Raúl Fernando',
      email: 'raulcajiao@uisrael.edu.ec',
      membershipType: 'estudiante',
    };

    const validated = parseNewMember(rawMember);

    expect(validated).toEqual({
      name: 'Raúl Fernando',
      email: 'raulcajiao@uisrael.edu.ec',
      membershipType: 'estudiante',
      active: true,
    });
  });

  it('should successfully validate a correct member with explicit active=false', () => {
    const rawMember = {
      name: 'Cajiao Garcés',
      email: 'cajiaogarces@uisrael.edu.ec',
      membershipType: 'docente',
      active: false,
    };

    const validated = parseNewMember(rawMember);

    expect(validated.active).toBe(false);
    expect(validated.membershipType).toBe('docente');
  });

  it('should throw DomainError when name is missing or empty', () => {
    expect(() => parseNewMember({
      email: 'raulcajiao@uisrael.edu.ec',
      membershipType: 'estudiante',
    })).toThrow(DomainError);

    expect(() => parseNewMember({
      name: '   ',
      email: 'raulcajiao@uisrael.edu.ec',
      membershipType: 'estudiante',
    })).toThrow('El nombre es obligatorio');
  });

  it('should throw DomainError when email is invalid', () => {
    expect(() => parseNewMember({
      name: 'Raúl Fernando',
      email: 'correo-invalido-sin-arroba',
      membershipType: 'estudiante',
    })).toThrow('El correo no tiene un formato válido');

    expect(() => parseNewMember({
      name: 'Raúl Fernando',
      email: 'test@',
      membershipType: 'estudiante',
    })).toThrow('El correo no tiene un formato válido');
  });

  it('should throw DomainError when membershipType is invalid', () => {
    expect(() => parseNewMember({
      name: 'Raúl Fernando',
      email: 'raulcajiao@uisrael.edu.ec',
      membershipType: 'administrador',
    })).toThrow('El tipo de membresía no es válido');
  });

  it('should throw DomainError when active is not a boolean', () => {
    expect(() => parseNewMember({
      name: 'Raúl Fernando',
      email: 'raulcajiao@uisrael.edu.ec',
      membershipType: 'estudiante',
      active: 'si',
    })).toThrow('El estado debe ser verdadero o falso');

    expect(() => parseNewMember({
      name: 'Raúl Fernando',
      email: 'raulcajiao@uisrael.edu.ec',
      membershipType: 'estudiante',
      active: 1,
    })).toThrow('El estado debe ser verdadero o falso');
  });
});
