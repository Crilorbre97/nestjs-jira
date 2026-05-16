import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteOnCascadeOnExamSession1778946491798 implements MigrationInterface {
    name = 'AddDeleteOnCascadeOnExamSession1778946491798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_session" DROP CONSTRAINT "FK_4c7c50218a13ce1f29b7b37f9fe"`);
        await queryRunner.query(`ALTER TABLE "exam_session" ADD CONSTRAINT "FK_4c7c50218a13ce1f29b7b37f9fe" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_session" DROP CONSTRAINT "FK_4c7c50218a13ce1f29b7b37f9fe"`);
        await queryRunner.query(`ALTER TABLE "exam_session" ADD CONSTRAINT "FK_4c7c50218a13ce1f29b7b37f9fe" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
