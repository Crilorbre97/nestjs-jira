import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuestionTable1778668482177 implements MigrationInterface {
    name = 'CreateQuestionTable1778668482177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."question_questiontype_enum" AS ENUM('multiple_choice', 'one_choice', 'open_answer')`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "questionType" "public"."question_questiontype_enum" NOT NULL, "scoreable" boolean NOT NULL, "score" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TYPE "public"."question_questiontype_enum"`);
    }

}
