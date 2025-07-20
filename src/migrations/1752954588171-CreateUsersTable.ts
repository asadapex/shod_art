import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE user_role AS ENUM (
        'root', 'worker', 'manager', 'logistics', 'smm', 'call-center'
      );
      
      CREATE TABLE users (
        id UUID PRIMARY KEY,
        login VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role user_role NOT NULL DEFAULT 'worker',
        can_edit_products BOOLEAN NOT NULL DEFAULT false,
        can_manage_logistics BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TRIGGER update_users_timestamp
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`DROP TYPE user_role`);
  }
}