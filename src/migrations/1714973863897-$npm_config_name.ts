import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1714973863897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
  INSERT INTO User (id, firstName, lastName, email, role) VALUES
  ('m5a74b0e-96a8-4e75-aa0a-43a3e86f3d6a', 'admin', 'admin', 'nastgm26@gmail.com', 'admin'), 
  ('m4a74b0e-96a8-4e75-aa0a-43a3e86f3d6a', 'user2', 'user2', 'user1@gmail.com', 'user')  
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
