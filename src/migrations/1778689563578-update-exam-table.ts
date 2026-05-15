import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExamTable1778689563578 implements MigrationInterface {
    name = 'UpdateExamTable1778689563578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "isOpen" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "isOpen" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "exam" ALTER COLUMN "description" SET NOT NULL`);
    }

}
