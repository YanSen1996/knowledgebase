-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS user_id_seq;

-- Table Definition
CREATE TABLE "public"."user" (
  "id" int4 NOT NULL DEFAULT nextval('user_id_seq' :: regclass),
  "nickname" varchar NOT NULL,
  "email" varchar NOT NULL,
  "password" varchar NOT NULL,
  "last_login" timestamptz,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE(email)
);
