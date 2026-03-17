import { MAP_DEFAULTS, PARTNER_SCHOOL_STATUSES } from "./mapEnums";
import type { MapPointsQueryDTO } from "./mapDTO";

type ParseSuccess<T> = { ok: true; value: T };
type ParseFail = { ok: false; error: string };
type ParseResult<T> = ParseSuccess<T> | ParseFail;

type ParsedMapPointsQuery = {
  bbox: [number, number, number, number];
  zoom: number;
  continent?: string;
  country?: string;
  status?: (typeof PARTNER_SCHOOL_STATUSES)[number];
  mobilityProgrammes: string[];
  language?: string;
  level?: string;
  search?: string;
};

type ParsedGeocodeStart = {
  limit: number;
};

function parseBbox(raw: string): ParseResult<[number, number, number, number]> {
  const values = raw
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));

  if (values.length !== 4) {
    return { ok: false, error: "Invalid bbox" };
  }

  const [minLon, minLat, maxLon, maxLat] = values;
  if (minLon < -180 || maxLon > 180 || minLat < -90 || maxLat > 90 || minLon >= maxLon || minLat >= maxLat) {
    return { ok: false, error: "Invalid bbox range" };
  }

  return { ok: true, value: [minLon, minLat, maxLon, maxLat] };
}

function parseCsvList(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeOptionalString(raw?: string): string | undefined {
  const value = raw?.trim();
  return value ? value : undefined;
}

function parsePositiveInt(raw: unknown, fallback: number, max: number): number {
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  const rounded = Math.floor(value);
  return Math.min(rounded, max);
}

function parseStatus(raw?: string): ParsedMapPointsQuery["status"] {
  const candidate = normalizeOptionalString(raw)?.toLowerCase();
  if (!candidate || candidate === "all") return undefined;
  if ((PARTNER_SCHOOL_STATUSES as readonly string[]).includes(candidate)) {
    return candidate as ParsedMapPointsQuery["status"];
  }
  return undefined;
}

function parseMapPointsQuery(query: MapPointsQueryDTO): ParseResult<ParsedMapPointsQuery> {
  const bboxRaw = normalizeOptionalString(query.bbox);
  if (!bboxRaw) return { ok: false, error: "Missing bbox" };

  const bbox = parseBbox(bboxRaw);
  if (!bbox.ok) return bbox;

  const zoom = parsePositiveInt(query.zoom, 2, 22);
  const search = normalizeOptionalString(query.q);

  return {
    ok: true,
    value: {
      bbox: bbox.value,
      zoom,
      continent: normalizeOptionalString(query.continent),
      country: normalizeOptionalString(query.country),
      status: parseStatus(query.status),
      mobilityProgrammes: parseCsvList(query.mobility),
      language: normalizeOptionalString(query.lang),
      level: normalizeOptionalString(query.level),
      search,
    },
  };
}

function parseGeocodeStartInput(limitInput: unknown): ParsedGeocodeStart {
  return {
    limit: parsePositiveInt(limitInput, MAP_DEFAULTS.geocodeLimit, MAP_DEFAULTS.maxGeocodeLimit),
  };
}

export {
  parseMapPointsQuery,
  parseGeocodeStartInput,
};

export type {
  ParseResult,
  ParsedMapPointsQuery,
  ParsedGeocodeStart,
};
