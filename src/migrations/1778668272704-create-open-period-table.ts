import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOpenPeriodTable1778668272704 implements MigrationInterface {
    name = 'CreateOpenPeriodTable1778668272704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "open_period" ("id" SERIAL NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a4ae0f8a217b18362f04782006c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "open_period"`);
    }

}
