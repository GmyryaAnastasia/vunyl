import { MigrationInterface, QueryRunner } from 'typeorm';
import { Purchase } from 'entity/purchase.entity';

export class $npmConfigName1714978154311 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
  INSERT INTO Purchase (purchaseID, userID, recordID, amount, orderNumber, orderStatus) VALUES
  ('5f7j7h4b-5b6c-4d4e-8f9a-0b1c2d3e4f5', 'm4a74b0e-96a8-4e75-aa0a-43a3e86f3d6a', 'a1a1a3a4-5b6c-4d4e-8f9a-0b1c2d3e4f5', 2, 'pi_34567899', 'paid'), 
  ('6f7j7h4b-5b6c-4d4e-8f9a-0b1c2d3e4f5', 'm4a74b0e-96a8-4e75-aa0a-43a3e86f3d6a', 'a1a1a3a4-5b6c-4d4e-8f9a-0b1c2d3e4f5', 3, 'pi_34567899', 'paid'),  
  ('7f7j7h4b-5b6c-4d4e-8f9a-0b1c2d3e4f5', 'm4a74b0e-96a8-4e75-aa0a-43a3e86f3d6a', 'a1a1a3a4-5b6c-4d4e-8f9a-0b1c2d3e4f5', 4, 'pi_34567899', 'paid')  
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
