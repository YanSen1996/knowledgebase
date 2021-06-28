-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS user_token_id_seq;

-- Table Definition
CREATE TABLE "public"."user_token" (
  "id" int4 NOT NULL DEFAULT nextval('user_token_id_seq' :: regclass),
  "token" varchar NOT NULL,
  "deleted_at" timestamptz,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "user_id" int4 NOT NULL,
  PRIMARY KEY ("id")
);
