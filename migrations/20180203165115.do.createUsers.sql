CREATE TABLE IF NOT EXISTS "users"(
  "id"                              SERIAL            PRIMARY KEY  NOT NULL,
  "firstName"                       VARCHAR(100)      NOT NULL,
  "lastName"                        VARCHAR(100)      NOT NULL,
  "email"                           VARCHAR(200)      NOT NULL,
  "mobile"                          NUMERIC(10)       NULL,
  "admin"                           BOOLEAN           NOT NULL DEFAULT FALSE,
  "role"                            INT               NULL DEFAULT 3,
  "passwordDigest"                  VARCHAR(100)      NOT NULL,
  "createdAt"                       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"                       TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("email")
);
