import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuestionQuestionOptionRelation1778670759717 implements MigrationInterface {
    name = 'AddQuestionQuestionOptionRelation1778670759717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_option" ADD "questionId" integer`);
        await queryRunner.query(`ALTER TABLE "question_option" ADD CONSTRAINT "FK_ba19747af180520381a117f5986" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_option" DROP CONSTRAINT "FK_ba19747af180520381a117f5986"`);
        await queryRunner.query(`ALTER TABLE "question_option" DROP COLUMN "questionId"`);
    }

}
