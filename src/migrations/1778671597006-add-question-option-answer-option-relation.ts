import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuestionOptionAnswerOptionRelation1778671597006 implements MigrationInterface {
    name = 'AddQuestionOptionAnswerOptionRelation1778671597006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_option" ADD "questionOptionId" integer`);
        await queryRunner.query(`ALTER TABLE "answer_option" ADD CONSTRAINT "FK_ce933db7ccd90c1282f11469b40" FOREIGN KEY ("questionOptionId") REFERENCES "question_option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_option" DROP CONSTRAINT "FK_ce933db7ccd90c1282f11469b40"`);
        await queryRunner.query(`ALTER TABLE "answer_option" DROP COLUMN "questionOptionId"`);
    }

}
