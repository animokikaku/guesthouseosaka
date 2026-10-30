-- The sync's own state, in its one row: when it last purged the cached pages
-- that show rooms.
CREATE TABLE sync_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  purged_at TEXT NOT NULL
) STRICT;
