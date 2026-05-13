import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExamTable1778667831943 implements MigrationInterface {
    name = 'CreateExamTable1778667831943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exam" ("id" SERIAL NOT NULL, "title" character varying(50) NOT NULL, "description" text NOT NULL, "isOpen" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_56071ab3a94aeac01f1b5ab74aa" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exam"`);
    }

}
