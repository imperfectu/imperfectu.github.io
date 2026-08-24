-- Seed sample catalog (safe to re-run via upserts)

insert into public.media_items (
  id, title, description, thumbnail_url, backdrop_url, trailer_url, main_video_url,
  release_year, maturity_rating, duration_minutes, tags, genres, cast_members, creators, featured, sort_order
) values
(
  'echoes-of-glass',
  'Echoes of Glass',
  'A fractured documentary that unfolds across film, companion audio diaries, and an interactive archive of lost letters.',
  'https://picsum.photos/seed/echoes-glass/640/360',
  'https://picsum.photos/seed/echoes-glass-bg/1920/1080',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  2025, 'TV-MA', 48,
  array['Transmedia', 'Archive', 'Memory'],
  array['Documentary', 'Experimental']::public.media_genre[],
  array['Mira Chen', 'Jonah Vale'],
  array['Imperfectu Collective'],
  true, 1
),
(
  'night-circuit',
  'Night Circuit',
  'Neon-soaked thriller where the soundtrack is a second narrative — listen while you watch, or follow the audio branch alone.',
  'https://picsum.photos/seed/night-circuit/640/360',
  'https://picsum.photos/seed/night-circuit-bg/1920/1080',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  2024, 'R', 92,
  array['Audio Lore', 'Noir'],
  array['Thriller', 'Sci-Fi']::public.media_genre[],
  array[]::text[],
  array['A. Reyes'],
  false, 2
),
(
  'salt-and-signal',
  'Salt & Signal',
  'Coastal myth meets radio drama. Branching choices decide which coastal town survives the storm.',
  'https://picsum.photos/seed/salt-signal/640/360',
  null,
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  2023, 'PG-13', 64,
  array['Interactive', 'Myth'],
  array['Fantasy', 'Drama']::public.media_genre[],
  array[]::text[],
  array[]::text[],
  false, 3
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  thumbnail_url = excluded.thumbnail_url,
  backdrop_url = excluded.backdrop_url,
  trailer_url = excluded.trailer_url,
  main_video_url = excluded.main_video_url,
  release_year = excluded.release_year,
  maturity_rating = excluded.maturity_rating,
  duration_minutes = excluded.duration_minutes,
  tags = excluded.tags,
  genres = excluded.genres,
  cast_members = excluded.cast_members,
  creators = excluded.creators,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  updated_at = now();

delete from public.media_chapters where media_id = 'echoes-of-glass';
insert into public.media_chapters (media_id, label, time_seconds, sort_order) values
  ('echoes-of-glass', 'Cold open', 0, 1),
  ('echoes-of-glass', 'Act I', 90, 2),
  ('echoes-of-glass', 'Midpoint', 300, 3);

insert into public.transmedia_items (
  id, media_id, kind, title, description, asset_url, file_url, interactive_payload, sort_order
) values
(
  'tm-echoes-audio',
  'echoes-of-glass',
  'audio',
  'Mira’s Night Diaries',
  'Companion audio drama — listen after episode one.',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  null,
  null,
  1
),
(
  'tm-echoes-lore',
  'echoes-of-glass',
  'document',
  'Lost Letters Archive',
  'Scanned correspondence expanding the glass timeline.',
  null,
  '#',
  null,
  2
),
(
  'tm-echoes-interact',
  'echoes-of-glass',
  'interactive',
  'Which fragment do you keep?',
  'A branching prompt that unlocks alternate cuts.',
  null,
  null,
  '[
    {
      "id": "node-1",
      "prompt": "The archive offers two sealed envelopes. Which do you open?",
      "options": [
        { "id": "a", "label": "The red wax seal", "outcome": "Unlocks Audio Diaries Vol. 2" },
        { "id": "b", "label": "The unmarked kraft envelope", "outcome": "Reveals deleted prologue" }
      ]
    }
  ]'::jsonb,
  3
),
(
  'tm-night-audio',
  'night-circuit',
  'audio',
  'Circuit Drift OST',
  null,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  null,
  null,
  1
),
(
  'tm-salt-interact',
  'salt-and-signal',
  'interactive',
  'Storm Path',
  null,
  null,
  null,
  '[
    {
      "id": "storm-1",
      "prompt": "The radio crackles. Do you warn the northern pier or the southern dunes?",
      "options": [
        { "id": "n", "label": "Northern pier", "outcome": "Town A survives" },
        { "id": "s", "label": "Southern dunes", "outcome": "Town B survives" }
      ]
    }
  ]'::jsonb,
  1
)
on conflict (id) do update set
  media_id = excluded.media_id,
  kind = excluded.kind,
  title = excluded.title,
  description = excluded.description,
  asset_url = excluded.asset_url,
  file_url = excluded.file_url,
  interactive_payload = excluded.interactive_payload,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.content_rows (id, title, sort_order) values
  ('trending', 'Trending on Imperfectu', 1),
  ('transmedia', 'Transmedia Experiences', 2)
on conflict (id) do update set title = excluded.title, sort_order = excluded.sort_order;

insert into public.content_row_items (row_id, media_id, sort_order) values
  ('trending', 'echoes-of-glass', 1),
  ('trending', 'night-circuit', 2),
  ('trending', 'salt-and-signal', 3),
  ('transmedia', 'echoes-of-glass', 1),
  ('transmedia', 'night-circuit', 2),
  ('transmedia', 'salt-and-signal', 3)
on conflict (row_id, media_id) do update set sort_order = excluded.sort_order;
