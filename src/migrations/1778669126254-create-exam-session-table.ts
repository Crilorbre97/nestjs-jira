import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExamSessionTable1778669126254 implements MigrationInterface {
    name = 'CreateExamSessionTable1778669126254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exam_session" ("id" SERIAL NOT NULL, "isCompleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e95661f107b30b65c630381d1e2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exam_session"`);
    }

}
