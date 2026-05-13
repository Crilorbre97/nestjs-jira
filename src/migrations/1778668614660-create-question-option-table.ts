import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuestionOptionTable1778668614660 implements MigrationInterface {
    name = 'CreateQuestionOptionTable1778668614660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question_option" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "isCorrect" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_64f8e42188891f2b0610017c8f9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "question_option"`);
    }

}
