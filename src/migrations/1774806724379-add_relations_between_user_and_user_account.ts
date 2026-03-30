import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationsBetweenUserAndUserAccount1774806724379 implements MigrationInterface {
    name = 'AddRelationsBetweenUserAndUserAccount1774806724379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userAccountId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_3574ef159f2858d2eb7b9652ceb" UNIQUE ("userAccountId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3574ef159f2858d2eb7b9652ceb" FOREIGN KEY ("userAccountId") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3574ef159f2858d2eb7b9652ceb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_3574ef159f2858d2eb7b9652ceb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userAccountId"`);
    }

}
