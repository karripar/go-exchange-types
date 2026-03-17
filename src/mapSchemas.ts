import { MAP_DEFAULTS, PARTNER_SCHOOL_STATUSES } from "./mapEnums";
import type { MapPointsQueryDTO, PdfExtractionPreviewRowDTO } from "./mapDTO";

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

type ParsedPdfExtractionPreview = {
  rows: PdfExtractionPreviewRowDTO[];
  extractionSummary: {
    totalRows: number;
    rowsWithWarnings: number;
    averageConfidence: number;
    missingFieldCount: number;
  };
  warnings: string[];
  fileMetadata: {
    originalFileName: string;
    fileSizeBytes: number;
    mimeType: string;
    pageCount?: number;
  };
  status: "queued" | "running" | "completed" | "failed";
};

type ParsedPdfReviewPatch = {
  reviewerNotes?: string;
  currentRow?: Partial<PdfExtractionPreviewRowDTO>;
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

function normalizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function parsePdfExtractionPreviewPayload(input: unknown): ParseResult<ParsedPdfExtractionPreview> {
  if (!input || typeof input !== "object") return { ok: false, error: "Extraction payload must be an object" };
  const payload = input as Record<string, unknown>;

  if (!Array.isArray(payload.rows)) return { ok: false, error: "rows must be an array" };

  const rows: PdfExtractionPreviewRowDTO[] = [];
  for (const item of payload.rows) {
    if (!item || typeof item !== "object") return { ok: false, error: "rows contains an invalid row" };
    const row = item as Record<string, unknown>;

    const sourcePage = Number(row.sourcePage);
    const confidence = Number(row.confidence);
    if (!Number.isFinite(sourcePage) || sourcePage < 0) return { ok: false, error: "row sourcePage must be a non-negative number" };
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) return { ok: false, error: "row confidence must be between 0 and 1" };

    const institutionName = String(row.institutionName ?? "").trim();
    const sourceSnippet = String(row.sourceSnippet ?? "").trim();
    if (!institutionName) return { ok: false, error: "row institutionName is required" };
    if (!sourceSnippet) return { ok: false, error: "row sourceSnippet is required" };

    rows.push({
      rowId: String(row.rowId ?? "").trim() || "",
      institutionName,
      subunitName: String(row.subunitName ?? "").trim(),
      country: String(row.country ?? "").trim(),
      continent: String(row.continent ?? "").trim(),
      cities: normalizeStringArray(row.cities),
      agreementAppliesTo: String(row.agreementAppliesTo ?? "").trim(),
      degreeProgrammesInAgreement: normalizeStringArray(row.degreeProgrammesInAgreement),
      mobilityProgrammes: normalizeStringArray(row.mobilityProgrammes),
      languageRequirements: {
        summary: String((row.languageRequirements as Record<string, unknown> | undefined)?.summary ?? "").trim(),
        cefrLevel: String((row.languageRequirements as Record<string, unknown> | undefined)?.cefrLevel ?? "").trim(),
        localLanguageRequirement: String((row.languageRequirements as Record<string, unknown> | undefined)?.localLanguageRequirement ?? "").trim(),
        englishRequirement: String((row.languageRequirements as Record<string, unknown> | undefined)?.englishRequirement ?? "").trim(),
      },
      furtherInfo: String(row.furtherInfo ?? "").trim(),
      tuitionFeeBased: Boolean(row.tuitionFeeBased),
      agreementNegotiationsOngoing: Boolean(row.agreementNegotiationsOngoing),
      sourcePage,
      sourceSnippet,
      confidence,
      missingFields: normalizeStringArray(row.missingFields),
      aiFlags: normalizeStringArray(row.aiFlags),
      validationFlags: normalizeStringArray(row.validationFlags),
      reviewStatus: undefined,
    });
  }

  const extractionSummaryRaw = payload.extractionSummary as Record<string, unknown> | undefined;
  const extractionSummary = {
    totalRows: Number(extractionSummaryRaw?.totalRows ?? rows.length) || rows.length,
    rowsWithWarnings: Number(extractionSummaryRaw?.rowsWithWarnings ?? 0) || 0,
    averageConfidence: Number(extractionSummaryRaw?.averageConfidence ?? 0) || 0,
    missingFieldCount: Number(extractionSummaryRaw?.missingFieldCount ?? 0) || 0,
  };

  const fileMetadataRaw = payload.fileMetadata as Record<string, unknown> | undefined;
  const fileMetadata = {
    originalFileName: String(fileMetadataRaw?.originalFileName ?? "").trim(),
    fileSizeBytes: Number(fileMetadataRaw?.fileSizeBytes ?? 0) || 0,
    mimeType: String(fileMetadataRaw?.mimeType ?? "application/pdf").trim(),
    pageCount: Number.isFinite(Number(fileMetadataRaw?.pageCount)) ? Number(fileMetadataRaw?.pageCount) : undefined,
  };

  const statusCandidate = String(payload.status ?? "completed").trim().toLowerCase();
  const status = statusCandidate === "queued" || statusCandidate === "running" || statusCandidate === "failed"
    ? statusCandidate
    : "completed";

  return {
    ok: true,
    value: {
      rows,
      extractionSummary,
      warnings: normalizeStringArray(payload.warnings),
      fileMetadata,
      status,
    },
  };
}

function parsePdfReviewRowPatchInput(input: unknown): ParseResult<ParsedPdfReviewPatch> {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Patch payload must be an object" };
  }

  const payload = input as Record<string, unknown>;
  const reviewerNotesRaw = payload.reviewerNotes;
  const reviewerNotes = typeof reviewerNotesRaw === "string" ? reviewerNotesRaw.trim() : undefined;

  const currentRowRaw = payload.currentRow;
  if (currentRowRaw == null) {
    return { ok: true, value: { reviewerNotes } };
  }

  if (typeof currentRowRaw !== "object" || Array.isArray(currentRowRaw)) {
    return { ok: false, error: "currentRow must be an object" };
  }

  const row = currentRowRaw as Record<string, unknown>;
  const patch: Partial<PdfExtractionPreviewRowDTO> = {};

  const setString = (key: keyof PdfExtractionPreviewRowDTO) => {
    if (key in row) patch[key] = String(row[key] ?? "").trim() as never;
  };

  setString("institutionName");
  setString("subunitName");
  setString("country");
  setString("continent");
  setString("agreementAppliesTo");
  setString("furtherInfo");
  setString("sourceSnippet");

  if ("cities" in row) patch.cities = normalizeStringArray(row.cities);
  if ("degreeProgrammesInAgreement" in row) patch.degreeProgrammesInAgreement = normalizeStringArray(row.degreeProgrammesInAgreement);
  if ("mobilityProgrammes" in row) patch.mobilityProgrammes = normalizeStringArray(row.mobilityProgrammes);
  if ("missingFields" in row) patch.missingFields = normalizeStringArray(row.missingFields);
  if ("aiFlags" in row) patch.aiFlags = normalizeStringArray(row.aiFlags);

  if ("sourcePage" in row) {
    const value = Number(row.sourcePage);
    if (!Number.isFinite(value) || value < 0) return { ok: false, error: "sourcePage must be a non-negative number" };
    patch.sourcePage = value;
  }

  if ("confidence" in row) {
    const value = Number(row.confidence);
    if (!Number.isFinite(value) || value < 0 || value > 1) return { ok: false, error: "confidence must be between 0 and 1" };
    patch.confidence = value;
  }

  if ("tuitionFeeBased" in row) patch.tuitionFeeBased = Boolean(row.tuitionFeeBased);
  if ("agreementNegotiationsOngoing" in row) patch.agreementNegotiationsOngoing = Boolean(row.agreementNegotiationsOngoing);

  if ("languageRequirements" in row) {
    const lang = row.languageRequirements;
    if (!lang || typeof lang !== "object" || Array.isArray(lang)) {
      return { ok: false, error: "languageRequirements must be an object" };
    }
    const langObj = lang as Record<string, unknown>;
    patch.languageRequirements = {
      summary: String(langObj.summary ?? "").trim(),
      cefrLevel: String(langObj.cefrLevel ?? "").trim(),
      localLanguageRequirement: String(langObj.localLanguageRequirement ?? "").trim(),
      englishRequirement: String(langObj.englishRequirement ?? "").trim(),
    };
  }

  return {
    ok: true,
    value: {
      reviewerNotes,
      currentRow: patch,
    },
  };
}

function getPdfRowCommitBlockers(row: PdfExtractionPreviewRowDTO): string[] {
  const blockers: string[] = [];
  if (!row.institutionName?.trim()) blockers.push("institutionName_missing");
  if (!row.country?.trim()) blockers.push("country_missing");
  if (!Array.isArray(row.cities) || row.cities.length === 0) blockers.push("cities_missing");
  if (!row.sourceSnippet?.trim()) blockers.push("sourceSnippet_missing");
  if (!Number.isFinite(row.sourcePage) || row.sourcePage < 0) blockers.push("sourcePage_invalid");
  if (!Number.isFinite(row.confidence) || row.confidence < 0 || row.confidence > 1) blockers.push("confidence_invalid");
  if (Array.isArray(row.validationFlags) && row.validationFlags.length > 0) blockers.push("validation_flags_present");
  return blockers;
}

export {
  parseMapPointsQuery,
  parseGeocodeStartInput,
  parsePdfExtractionPreviewPayload,
  parsePdfReviewRowPatchInput,
  getPdfRowCommitBlockers,
};

export type {
  ParseResult,
  ParsedMapPointsQuery,
  ParsedGeocodeStart,
  ParsedPdfExtractionPreview,
  ParsedPdfReviewPatch,
};
