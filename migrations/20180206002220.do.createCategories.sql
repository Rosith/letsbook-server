CREATE TABLE IF NOT EXISTS "categories"(
  "id"                              SERIAL            PRIMARY KEY  NOT NULL,
  "name"                            VARCHAR(100)      NOT NULL,
  "description"                     VARCHAR(500)      NOT NULL,
  "active"                          BOOLEAN           NOT NULL DEFAULT TRUE,
  "createdAt"                       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"                       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("name")
);
