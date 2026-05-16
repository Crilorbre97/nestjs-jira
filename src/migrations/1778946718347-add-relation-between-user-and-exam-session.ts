import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationBetweenUserAndExamSession1778946718347 implements MigrationInterface {
    name = 'AddRelationBetweenUserAndExamSession1778946718347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_session" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "exam_session" ADD CONSTRAINT "FK_bb33201c8cd9f405b4a3d01daeb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exam_session" DROP CONSTRAINT "FK_bb33201c8cd9f405b4a3d01daeb"`);
        await queryRunner.query(`ALTER TABLE "exam_session" DROP COLUMN "userId"`);
    }

}
