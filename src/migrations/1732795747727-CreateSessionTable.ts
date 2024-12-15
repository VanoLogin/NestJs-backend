import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessionTable1732795747727 implements MigrationInterface {
  name = "CreateSessionTable1732795747727";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" character varying NOT NULL, "refreshTokenValidUntil" TIMESTAMP NOT NULL, "accessTokenValidUntil" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "UQ_8d4c5daf230e32347f71ea7bcaa" UNIQUE ("refreshToken"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female')`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "gender" "public"."user_gender_enum"`
    );
    await queryRunner.query(`DROP TABLE "session"`);
  }
}
