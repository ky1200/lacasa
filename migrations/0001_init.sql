-- LaCasa voting tables (the only data the site stores; content lives in lacasa.json)
CREATE TABLE IF NOT EXISTS votes (
  code TEXT NOT NULL CHECK (code IN ('KY','KX','KS')),
  decision_id TEXT NOT NULL,
  pick TEXT NOT NULL,
  lean TEXT,
  updated_at TEXT NOT NULL,
  updated_after_reveal INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (code, decision_id),
  CHECK (lean IS NULL OR lean <> pick)
);
CREATE TABLE IF NOT EXISTS finals (
  decision_id TEXT PRIMARY KEY NOT NULL,
  option_id TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('tie','overdue','lock')),
  at TEXT NOT NULL
);
