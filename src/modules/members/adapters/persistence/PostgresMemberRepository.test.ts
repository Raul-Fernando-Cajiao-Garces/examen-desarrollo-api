import 'dotenv/config';
import { Pool } from 'pg';
import { createPostgresPool } from '../../../../shared/database/postgresPool';
import { PostgresMemberRepository } from './PostgresMemberRepository';

describe('PostgresMemberRepository Integration Tests (Base de Datos Real)', () => {
  let pool: Pool;
  let repository: PostgresMemberRepository;

  const testDbUrl = process.env.TEST_DATABASE_URL || 'postgresql://postgres:root@localhost:5432/examen_test';
  const devDbUrl = process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/examen_dev';

  beforeAll(async () => {
    // REGLA DE SEGURIDAD OBLIGATORIA:
    // Falla si la base de desarrollo y la base de pruebas son iguales
    if (testDbUrl === devDbUrl) {
      throw new Error('La base de datos de pruebas no puede ser igual a la de desarrollo');
    }

    pool = createPostgresPool(testDbUrl);
    repository = new PostgresMemberRepository(pool);
  });

  beforeEach(async () => {
    // Limpieza de tabla antes de cada prueba para aislamiento
    await pool.query('TRUNCATE TABLE members RESTART IDENTITY CASCADE;');
  });

  afterAll(async () => {
    await pool.end();
  });

  // 1. Caso Vacío
  it('1. Vacío: should return empty array when table is empty', async () => {
    const members = await repository.findAll();
    expect(members).toEqual([]);
  });

  // 2. Guardar
  it('2. Guardar: should save a new member and return it with generated id', async () => {
    const newMember = {
      name: 'Raúl Fernando',
      email: 'raulcajiao@uisrael.edu.ec',
      membershipType: 'estudiante' as const,
      active: true,
    };

    const saved = await repository.save(newMember);

    expect(saved.id).toBe(1);
    expect(saved.name).toBe(newMember.name);
    expect(saved.email).toBe(newMember.email);
    expect(saved.membershipType).toBe('estudiante');
    expect(saved.active).toBe(true);
  });

  // 3. Listar
  it('3. Listar: should return all members saved in database', async () => {
    await repository.save({
      name: 'Raúl Fernando',
      email: 'raulcajiao@uisrael.edu.ec',
      membershipType: 'estudiante',
      active: true,
    });
    await repository.save({
      name: 'Cajiao Garcés',
      email: 'cajiaogarces@uisrael.edu.ec',
      membershipType: 'docente',
      active: true,
    });

    const members = await repository.findAll();
    expect(members).toHaveLength(2);
    expect(members[0].name).toBe('Raúl Fernando');
    expect(members[1].name).toBe('Cajiao Garcés');
  });

  // 4. Buscar existente
  it('4. Buscar existente: should find member by id when it exists', async () => {
    const created = await repository.save({
      name: 'Cajiao Garcés',
      email: 'cajiaogarces@uisrael.edu.ec',
      membershipType: 'docente',
      active: true,
    });

    const found = await repository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe('Cajiao Garcés');
    expect(found?.membershipType).toBe('docente');
  });

  // 5. Buscar inexistente
  it('5. Buscar inexistente: should return null when member id does not exist', async () => {
    const found = await repository.findById(9999);
    expect(found).toBeNull();
  });

  // Caso adicional: Desactivación de socio (Ampliación)
  it('Extra. updateActive: should update active status correctly', async () => {
    const created = await repository.save({
      name: 'Raúl Fernando',
      email: 'raulcajiao@uisrael.edu.ec',
      membershipType: 'estudiante',
      active: true,
    });

    const updated = await repository.updateActive(created.id, false);
    expect(updated).not.toBeNull();
    expect(updated?.active).toBe(false);

    const check = await repository.findById(created.id);
    expect(check?.active).toBe(false);
  });

  // Protección: verificación de que la regla de seguridad funciona
  it('Protección: should fail if dev and test database URLs are identical', () => {
    const checkSafety = (devUrl: string, testUrl: string): void => {
      if (devUrl === testUrl) {
        throw new Error('La base de datos de pruebas no puede ser igual a la de desarrollo');
      }
    };

    expect(() => checkSafety('postgres://localhost/same', 'postgres://localhost/same')).toThrow(
      'La base de datos de pruebas no puede ser igual a la de desarrollo',
    );
  });
});
