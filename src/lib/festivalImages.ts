// Curated Unsplash photo IDs for festival cover images.
// Unsplash license: free for commercial and non-commercial use, no attribution required.
// Format: https://images.unsplash.com/photo-{ID}?w=800&h=400&fit=crop&q=80

const BASE = 'https://images.unsplash.com/photo';
const PARAMS = '?w=800&h=400&fit=crop&q=80&auto=format';

// ── 10 archetype photos ────────────────────────────────────────────────────────
const PHOTOS = {
  electronicMainstage: `${BASE}-1540575467537-5bae3e3ca2b8${PARAMS}`,
  outdoorCrowd:        `${BASE}-1501281668745-f7f57925c3b4${PARAMS}`,
  rockStage:           `${BASE}-1506157786151-b8491531f063${PARAMS}`,
  desertNight:         `${BASE}-1514533212735-5df27d970db5${PARAMS}`,
  festivalLights:      `${BASE}-1493225457124-a3eb161ffa5f${PARAMS}`,
  jazzIntimate:        `${BASE}-1551632811-561732d1e306${PARAMS}`,
  natureFestival:      `${BASE}-1504280390367-361c6d9f38f4${PARAMS}`,
  crowdEnergy:         `${BASE}-1470229722913-7c0e2dbbafd3${PARAMS}`,
  indieOutdoor:        `${BASE}-1464375117522-1311d6a5b81f${PARAMS}`,
  countryField:        `${BASE}-1524368535928-5b5e00ddc76b${PARAMS}`,
} as const;

// ── Festival ID → cover image ──────────────────────────────────────────────────
const FESTIVAL_IMAGES: Record<string, string> = {
  // Electronic / EDM
  tomorrowland:           PHOTOS.electronicMainstage,
  ultra_miami:            PHOTOS.electronicMainstage,
  electric_daisy_carnival: PHOTOS.electronicMainstage,
  creamfields_uk:         PHOTOS.electronicMainstage,
  defqon1:                PHOTOS.electronicMainstage,
  awakenings:             PHOTOS.electronicMainstage,
  movement_detroit:       PHOTOS.electronicMainstage,
  sonar:                  PHOTOS.electronicMainstage,
  world_club_dome:        PHOTOS.festivalLights,
  parookaville:           PHOTOS.festivalLights,
  mysteryland:            PHOTOS.festivalLights,
  balaton_sound:          PHOTOS.festivalLights,
  untold:                 PHOTOS.festivalLights,

  // Large outdoor / multi-genre
  glastonbury:            PHOTOS.outdoorCrowd,
  bonnaroo:               PHOTOS.outdoorCrowd,
  roskilde:               PHOTOS.outdoorCrowd,
  lollapalooza_chicago:   PHOTOS.outdoorCrowd,
  splendour_in_the_grass: PHOTOS.outdoorCrowd,
  osheaga:                PHOTOS.outdoorCrowd,
  outside_lands:          PHOTOS.outdoorCrowd,
  governors_ball:         PHOTOS.outdoorCrowd,
  summerfest:             PHOTOS.outdoorCrowd,
  bumbershoot:            PHOTOS.outdoorCrowd,
  firefly:                PHOTOS.outdoorCrowd,
  reading_leeds:          PHOTOS.outdoorCrowd,
  pukkelpop:              PHOTOS.outdoorCrowd,
  lowlands:               PHOTOS.outdoorCrowd,
  way_out_west:           PHOTOS.outdoorCrowd,
  flow_festival:          PHOTOS.outdoorCrowd,

  // Rock / Metal
  rock_in_rio:            PHOTOS.rockStage,
  download_festival:      PHOTOS.rockStage,
  hellfest:               PHOTOS.rockStage,
  knotfest:               PHOTOS.rockStage,
  rock_am_ring:           PHOTOS.rockStage,
  rock_im_park:           PHOTOS.rockStage,

  // Desert / night / nature
  coachella:              PHOTOS.desertNight,
  burning_man:            PHOTOS.natureFestival,
  ozora:                  PHOTOS.natureFestival,
  shambhala:              PHOTOS.natureFestival,
  lightning_in_a_bottle:  PHOTOS.natureFestival,
  electric_forest:        PHOTOS.natureFestival,
  rainbow_serpent:        PHOTOS.natureFestival,
  envision_festival:      PHOTOS.natureFestival,

  // Festival energy / European
  primavera:              PHOTOS.festivalLights,
  primavera_porto:        PHOTOS.festivalLights,
  sziget:                 PHOTOS.festivalLights,
  exit_festival:          PHOTOS.festivalLights,
  benicassim:             PHOTOS.festivalLights,
  corona_capital:         PHOTOS.festivalLights,
  mad_cool:               PHOTOS.festivalLights,
  melt_festival:          PHOTOS.festivalLights,

  // Jazz / Blues
  newport_jazz:           PHOTOS.jazzIntimate,
  new_orleans_jazz:       PHOTOS.jazzIntimate,
  montreux_jazz:          PHOTOS.jazzIntimate,
  jazz_in_the_gardens:    PHOTOS.jazzIntimate,
  we_out_here:            PHOTOS.jazzIntimate,

  // Indie / Alternative
  pitchfork_chicago:      PHOTOS.indieOutdoor,
  newport_folk:           PHOTOS.indieOutdoor,
  hinterland:             PHOTOS.indieOutdoor,
  shaky_knees:            PHOTOS.indieOutdoor,
  high_water:             PHOTOS.indieOutdoor,
  bottlerock:             PHOTOS.indieOutdoor,
  beachlife:              PHOTOS.indieOutdoor,
  end_of_the_road:        PHOTOS.indieOutdoor,
  green_man:              PHOTOS.indieOutdoor,
  bestival:               PHOTOS.indieOutdoor,

  // Hip-hop / Urban
  afropunk:               PHOTOS.crowdEnergy,
  dreamville:             PHOTOS.crowdEnergy,
  rolling_loud_california: PHOTOS.crowdEnergy,
  afrofuture_detroit:     PHOTOS.crowdEnergy,

  // Country
  stagecoach:             PHOTOS.countryField,
  two_step_inn:           PHOTOS.countryField,
  cattle_country:         PHOTOS.countryField,

  // World / Asian / Oceania
  womad:                  PHOTOS.outdoorCrowd,
  fuji_rock:              PHOTOS.natureFestival,
  sunburn_goa:            PHOTOS.electronicMainstage,
  s2o_songkran:           PHOTOS.electronicMainstage,
  vh1_supersonic:         PHOTOS.electronicMainstage,
  wonderfruit:            PHOTOS.natureFestival,
  byron_bay_bluesfest:    PHOTOS.outdoorCrowd,
  laneway_festival:       PHOTOS.indieOutdoor,

  // Other
  fusion_festival:        PHOTOS.natureFestival,
  berghain_festival:      PHOTOS.electronicMainstage,
  dekmantel:              PHOTOS.electronicMainstage,
  airbeat_one:            PHOTOS.electronicMainstage,
  nature_one:             PHOTOS.electronicMainstage,
  vive_latino:            PHOTOS.festivalLights,
  reggae_sumfest:         PHOTOS.outdoorCrowd,
  afropunk_brooklyn:      PHOTOS.crowdEnergy,
  tanglewood:             PHOTOS.indieOutdoor,
  lovin_life:             PHOTOS.outdoorCrowd,
  sips_sounds:            PHOTOS.indieOutdoor,
  sunset_espee:           PHOTOS.indieOutdoor,
  quebec_summer:          PHOTOS.outdoorCrowd,
  dour_festival:          PHOTOS.rockStage,
  festival_international_benicassim: PHOTOS.festivalLights,
  beyond_wonderland:      PHOTOS.electronicMainstage,
  bass_canyon:            PHOTOS.electronicMainstage,
  lost_lands:             PHOTOS.electronicMainstage,
};

// ── Genre-based gradient fallback ─────────────────────────────────────────────
const GENRE_GRADIENTS: Record<string, string> = {
  electronic: 'from-blue-900 via-indigo-800 to-purple-900',
  rock:       'from-red-900 via-gray-900 to-orange-900',
  indie:      'from-amber-700 via-teal-800 to-emerald-900',
  jazz:       'from-teal-900 via-blue-900 to-slate-800',
  country:    'from-amber-700 via-yellow-700 to-orange-700',
  metal:      'from-gray-950 via-red-950 to-zinc-900',
  folk:       'from-green-800 via-emerald-700 to-teal-800',
  hiphop:     'from-purple-900 via-violet-800 to-indigo-900',
  world:      'from-emerald-800 via-teal-700 to-cyan-800',
  classical:  'from-slate-800 via-blue-900 to-indigo-800',
  pop:        'from-pink-700 via-rose-600 to-purple-700',
  ambient:    'from-indigo-900 via-blue-800 to-cyan-900',
  blues:      'from-blue-900 via-indigo-900 to-purple-800',
  reggae:     'from-green-700 via-yellow-700 to-red-700',
  latin:      'from-orange-700 via-red-600 to-pink-700',
};

const DEFAULT_GRADIENT = 'from-purple-600 via-purple-700 to-pink-600';

export interface FestivalCover {
  imageUrl: string | null;
  gradient: string;
}

export function getFestivalCover(festivalId: string, genres: string[]): FestivalCover {
  const imageUrl = FESTIVAL_IMAGES[festivalId] ?? null;
  const primaryGenre = genres[0]?.toLowerCase().replace(/[^a-z]/g, '') ?? '';
  const gradient = GENRE_GRADIENTS[primaryGenre] ?? DEFAULT_GRADIENT;
  return { imageUrl, gradient };
}
