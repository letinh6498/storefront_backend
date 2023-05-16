import client from '../database';

export type Weapon = {
  id: number;
  name: string;
  weight: number;
  type: string;
};
export class MythicalWeaponStore {
  async index(): Promise<Weapon[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM mythical_weapons';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cant not get weapons ${error}`);
    }
  }
  async create(b: Weapon): Promise<Weapon> {
    try {
      const sql =
        'INSERT INTO mythical_weapons (name, type, weight, id) VALUES($1, $2, $3, $4) RETURNING *';
      const conn = await client.connect();

      const result = await conn.query(sql, [b.name, b.type, b.weight, b.id]);

      const book = result.rows[0];

      conn.release();

      return book;
    } catch (err) {
      throw new Error(`Could not add new weapon ${b.name}. Error: ${err}`);
    }
  }
}
