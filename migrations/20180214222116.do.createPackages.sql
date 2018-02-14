CREATE TABLE IF NOT EXISTS "packages"(
  "id"           SERIAL           PRIMARY KEY  NOT NULL,
  "serviceId"    INT              NOT NULL,
  "name"         VARCHAR(100)     NOT NULL,
  "description"  VARCHAR(500)     NOT NULL,
  "icon"         VARCHAR(100)     NULL,
  "active"       BOOLEAN          NOT NULL DEFAULT TRUE,
  "createdAt"    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("serviceId") REFERENCES "services" ("id"),
  UNIQUE ("name")
);
