import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExamOpenPeriodRelation1778670487763 implements MigrationInterface {
    name = 'AddExamOpenPeriodRelation1778670487763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "open_period" ADD "examId" integer`);
        await queryRunner.query(`ALTER TABLE "open_period" ADD CONSTRAINT "FK_d87c162b1fde1a5d5620a9cd5dd" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "open_period" DROP CONSTRAINT "FK_d87c162b1fde1a5d5620a9cd5dd"`);
        await queryRunner.query(`ALTER TABLE "open_period" DROP COLUMN "examId"`);
    }

}
