import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1733080057960 implements MigrationInterface {
  name = "CreateTable1733080057960";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" ADD "accessToken" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "UQ_69ed5ce783e0c16540f12630a00" UNIQUE ("accessToken")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "UQ_69ed5ce783e0c16540f12630a00"`
    );
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "accessToken"`);
  }
}
