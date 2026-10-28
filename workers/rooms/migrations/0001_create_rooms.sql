-- The latest state of each room shares.house lists, keyed by property and room.
-- `updated_at` moves only when a meaningful field changes. `listed` turns 0 when
-- a complete scrape no longer shows the room, which keeps its last known state.
CREATE TABLE rooms (
  property_id TEXT NOT NULL,
  room_number TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'upcoming', 'occupied')),
  available_from TEXT,
  area_m2 REAL,
  area_tatami REAL,
  rent INTEGER,
  deposit INTEGER,
  common_fee INTEGER,
  listed INTEGER NOT NULL DEFAULT 1 CHECK (listed IN (0, 1)),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (property_id, room_number)
) STRICT;

-- When each listing was last scraped successfully, so readers can tell how fresh
-- its rooms are.
CREATE TABLE properties (
  property_id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  checked_at TEXT NOT NULL
) STRICT;
