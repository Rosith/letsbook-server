CREATE TABLE IF NOT EXISTS "customers"(
  "id"                              SERIAL            PRIMARY KEY  NOT NULL,
  "firstName"                       VARCHAR(100)      NOT NULL,
  "lastName"                        VARCHAR(100)      NOT NULL,
  "email"                           VARCHAR(200)      NULL,
  "mobile"                          NUMERIC(10)       NULL,
  "passwordDigest"                  VARCHAR(100)      NULL,
  "createdAt"                       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"                       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("mobile"),
  UNIQUE ("email")
);
