import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExamSessionAnswerRelation1778670925238 implements MigrationInterface {
    name = 'AddExamSessionAnswerRelation1778670925238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ADD "examSessionId" integer`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_f841d9cd0aacbeba61c190cc492" FOREIGN KEY ("examSessionId") REFERENCES "exam_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_f841d9cd0aacbeba61c190cc492"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "examSessionId"`);
    }

}
