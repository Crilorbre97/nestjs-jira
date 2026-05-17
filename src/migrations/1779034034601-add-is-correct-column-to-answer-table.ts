import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsCorrectColumnToAnswerTable1779034034601 implements MigrationInterface {
    name = 'AddIsCorrectColumnToAnswerTable1779034034601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ADD "isCorrect" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "isCorrect"`);
    }

}
