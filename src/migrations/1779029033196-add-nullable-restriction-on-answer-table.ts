import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNullableRestrictionOnAnswerTable1779029033196 implements MigrationInterface {
    name = 'AddNullableRestrictionOnAnswerTable1779029033196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "response" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "response" SET NOT NULL`);
    }

}
