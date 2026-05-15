import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateQuestionTable1778827996612 implements MigrationInterface {
    name = 'UpdateQuestionTable1778827996612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "title" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "title" character varying NOT NULL`);
    }

}
