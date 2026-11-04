import { Pool } from 'pg';
import { Member, MembershipType, NewMember } from '../../domain/Member';
import { MemberRepository } from '../../ports/MemberRepository';

export class PostgresMemberRepository implements MemberRepository {
  constructor(private readonly pool: Pool) {}

  findAll = async (): Promise<Member[]> => {
    const query = `
      SELECT id, name, email, membership_type AS "membershipType", active
      FROM members
      ORDER BY id ASC;
    `;
    const result = await this.pool.query(query);
    return result.rows.map((row) => ({
      id: Number(row.id),
      name: String(row.name),
      email: String(row.email),
      membershipType: row.membershipType as MembershipType,
      active: Boolean(row.active),
    }));
  };

  findById = async (id: number): Promise<Member | null> => {
    const query = `
      SELECT id, name, email, membership_type AS "membershipType", active
      FROM members
      WHERE id = $1;
    `;
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: Number(row.id),
      name: String(row.name),
      email: String(row.email),
      membershipType: row.membershipType as MembershipType,
      active: Boolean(row.active),
    };
  };

  save = async (newMember: NewMember): Promise<Member> => {
    const query = `
      INSERT INTO members (name, email, membership_type, active)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, membership_type AS "membershipType", active;
    `;
    const values = [newMember.name, newMember.email, newMember.membershipType, newMember.active];
    const result = await this.pool.query(query, values);
    const row = result.rows[0];
    return {
      id: Number(row.id),
      name: String(row.name),
      email: String(row.email),
      membershipType: row.membershipType as MembershipType,
      active: Boolean(row.active),
    };
  };

  updateActive = async (id: number, active: boolean): Promise<Member | null> => {
    const query = `
      UPDATE members
      SET active = $1
      WHERE id = $2
      RETURNING id, name, email, membership_type AS "membershipType", active;
    `;
    const result = await this.pool.query(query, [active, id]);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: Number(row.id),
      name: String(row.name),
      email: String(row.email),
      membershipType: row.membershipType as MembershipType,
      active: Boolean(row.active),
    };
  };
}
