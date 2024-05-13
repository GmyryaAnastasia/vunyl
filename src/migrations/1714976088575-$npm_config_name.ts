import { MigrationInterface, QueryRunner } from 'typeorm';
import { Review } from 'entity/review.entity';

export class $npmConfigName1714976088575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
  INSERT INTO Review (reviewID, userID, recordID, comment, user_score) VALUES
  ('5i7j7h4b-5b6c-4d4e-8f9a-0b1c2d3e4f5', 'm4a74b0e-96a8-4e75-aa0a-43a3e86f3d6a', 'a1a1a3a4-5b6c-4d4e-8f9a-0b1c2d3e4f5', 'comment1', 5), 
  ('6i7j7h4b-5b6c-4d4e-8f9a-0b1c2d3e4f5', 'm4a74b0e-96a8-4e75-aa0a-43a3e86f3d6a', 'a1a1a3a4-5b6c-4d4e-8f9a-0b1c2d3e4f5', 'comment2', 5),  
  ('7i7j7h4b-5b6c-4d4e-8f9a-0b1c2d3e4f5', 'm4a74b0e-96a8-4e75-aa0a-43a3e86f3d6a', 'a1a1a3a4-5b6c-4d4e-8f9a-0b1c2d3e4f5', 'comment4', 5)  
`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
