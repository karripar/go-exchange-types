const PARTNER_SCHOOL_STATUSES = ["confirmed", "negotiation", "unknown"] as const;
const GEOCODE_PRECISIONS = ["none", "city", "manual"] as const;
const MAP_JOB_STATUSES = ["queued", "running", "succeeded", "failed"] as const;
const PDF_IMPORT_JOB_STATUSES = ["queued", "running", "completed", "failed"] as const;
const PDF_PREVIEW_REVIEW_STATUSES = ["pending", "approved", "rejected", "edited"] as const;

const MAP_DEFAULTS = {
  geocodeLimit: 250,
  maxGeocodeLimit: 5000,
  pointsMaxItems: 3000,
} as const;

type PartnerSchoolStatus = (typeof PARTNER_SCHOOL_STATUSES)[number];
type GeocodePrecision = (typeof GEOCODE_PRECISIONS)[number];
type MapJobStatus = (typeof MAP_JOB_STATUSES)[number];
type PdfImportJobStatus = (typeof PDF_IMPORT_JOB_STATUSES)[number];
type PdfPreviewReviewStatus = (typeof PDF_PREVIEW_REVIEW_STATUSES)[number];

export {
  PARTNER_SCHOOL_STATUSES,
  GEOCODE_PRECISIONS,
  MAP_JOB_STATUSES,
  PDF_IMPORT_JOB_STATUSES,
  PDF_PREVIEW_REVIEW_STATUSES,
  MAP_DEFAULTS,
};

export type {
  PartnerSchoolStatus,
  GeocodePrecision,
  MapJobStatus,
  PdfImportJobStatus,
  PdfPreviewReviewStatus,
};
