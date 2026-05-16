import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationBetweenAnswerAnswerOption1778951978525 implements MigrationInterface {
    name = 'UpdateRelationBetweenAnswerAnswerOption1778951978525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_1de4a8677e4c30dbf49a7c24b5e"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "UQ_1de4a8677e4c30dbf49a7c24b5e"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "answerOptionId"`);
        await queryRunner.query(`ALTER TABLE "answer_option" ADD "answerId" integer`);
        await queryRunner.query(`ALTER TABLE "answer_option" ADD CONSTRAINT "FK_83490e3071c313dd68687221be5" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_option" DROP CONSTRAINT "FK_83490e3071c313dd68687221be5"`);
        await queryRunner.query(`ALTER TABLE "answer_option" DROP COLUMN "answerId"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD "answerOptionId" integer`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "UQ_1de4a8677e4c30dbf49a7c24b5e" UNIQUE ("answerOptionId")`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_1de4a8677e4c30dbf49a7c24b5e" FOREIGN KEY ("answerOptionId") REFERENCES "answer_option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
