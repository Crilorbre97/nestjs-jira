import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAnswerOptionTable1778669338329 implements MigrationInterface {
    name = 'CreateAnswerOptionTable1778669338329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answer_option" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_69dad60c2f58e523232f06f5d8d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "answer_option"`);
    }

}
