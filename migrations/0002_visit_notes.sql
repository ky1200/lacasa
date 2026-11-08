-- 11 Nov site visit: shared measurements, ticks, quotes and notes.
CREATE TABLE IF NOT EXISTS visit_notes (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  code TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
