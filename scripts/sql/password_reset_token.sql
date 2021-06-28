-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS password_reset_token_id_seq;

-- Table Definition
CREATE TABLE "public"."password_reset_token" (
  "id" int4 NOT NULL DEFAULT nextval('password_reset_token_id_seq' :: regclass),
  "email" varchar NOT NULL,
  "token" varchar,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "deleted_at" timestamptz,
  "due_at" timestamptz,
  PRIMARY KEY ("id")
);
