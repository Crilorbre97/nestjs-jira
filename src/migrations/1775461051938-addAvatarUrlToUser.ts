import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarUrlToUser1775461051938 implements MigrationInterface {
    name = 'AddAvatarUrlToUser1775461051938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarUrl"`);
    }

}
