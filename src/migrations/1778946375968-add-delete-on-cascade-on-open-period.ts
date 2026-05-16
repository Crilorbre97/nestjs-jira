import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteOnCascadeOnOpenPeriod1778946375968 implements MigrationInterface {
    name = 'AddDeleteOnCascadeOnOpenPeriod1778946375968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "open_period" DROP CONSTRAINT "FK_d87c162b1fde1a5d5620a9cd5dd"`);
        await queryRunner.query(`ALTER TABLE "open_period" ADD CONSTRAINT "FK_d87c162b1fde1a5d5620a9cd5dd" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "open_period" DROP CONSTRAINT "FK_d87c162b1fde1a5d5620a9cd5dd"`);
        await queryRunner.query(`ALTER TABLE "open_period" ADD CONSTRAINT "FK_d87c162b1fde1a5d5620a9cd5dd" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
