import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsCorrectColumnToAnswerTable1779034240457 implements MigrationInterface {
    name = 'AddIsCorrectColumnToAnswerTable1779034240457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ADD "isCorrect" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "isCorrect"`);
    }

}
