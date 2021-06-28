-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS document_id_seq;

-- Table Definition
CREATE TABLE "public"."document" (
    "id" int4 NOT NULL,
    "topic" varchar NOT NULL,
    "content" varchar NOT NULL,
    "tags" _varchar NOT NULL DEFAULT '{}'::character varying[],
    "user_id" int4 NOT NULL,
    "created_at" timestamptz NOT NULL,
    "updated_at" timestamptz NOT NULL,
    PRIMARY KEY ("id")
);
