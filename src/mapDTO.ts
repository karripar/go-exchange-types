import type {
  GeocodePrecision,
  MapJobStatus,
  PartnerSchoolStatus,
  PdfCommitStatus,
  PdfImportJobStatus,
  PdfImportStatusDetail,
  PdfPreviewReviewStatus,
} from "./mapEnums";

type MapPointDTO = {
  id: string;
  name: string;
  country?: string;
  city?: string;
  status?: PartnerSchoolStatus;
  coordinates: [number, number];
};

type MapPointsResponseDTO = {
  items: MapPointDTO[];
};

type MapOptionsResponseDTO = {
  continents: string[];
  countries: string[];
  mobilityProgrammes: string[];
  languages: string[];
  levels: string[];
};

type LanguageRequirementDTO = {
  language: string;
  level: string;
  notes?: string;
};

type MapSchoolDetailDTO = {
  id: string;
  externalKey?: string;
  name: string;
  continent?: string;
  country?: string;
  city?: string;
  status?: PartnerSchoolStatus;
  mobilityProgrammes?: string[];
  languageRequirements?: LanguageRequirementDTO[];
  agreementScope?: string;
  degreeProgrammesInAgreement?: string[];
  furtherInfo?: string;
  location?: { type: "Point"; coordinates: [number, number] };
  geocodePrecision?: GeocodePrecision;
  geocodeProvider?: string;
  geocodeQuery?: string;
  geocodeUpdatedAt?: string;
  sourceImportId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type MapPointsQueryDTO = {
  bbox: string;
  zoom?: string;
  continent?: string;
  country?: string;
  status?: string;
  mobility?: string;
  lang?: string;
  level?: string;
  q?: string;
};

type MapAdminRowErrorDTO = {
  row?: number;
  schoolId?: string;
  externalKey?: string;
  message: string;
};

type MapImportSummaryDTO = {
  inserted: number;
  updated: number;
  unchanged: number;
  failedRows: number;
};

type MapImportStatusDTO = {
  _id: string;
  originalFileName: string;
  fileUrl: string;
  fileHash: string;
  status: MapJobStatus;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  summary?: MapImportSummaryDTO;
  errorLog?: string;
  rowErrors?: MapAdminRowErrorDTO[];
  warnings?: MapAdminRowErrorDTO[];
};

type StartImportResponseDTO = {
  importId: string;
};

type MapGeocodeSummaryDTO = {
  totalCandidates: number;
  processed: number;
  updated: number;
  skipped: number;
  failed: number;
};

type MapGeocodeJobStatusDTO = {
  _id: string;
  status: MapJobStatus;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  requestedLimit?: number;
  summary?: MapGeocodeSummaryDTO;
  errorLog?: string;
  rowErrors?: MapAdminRowErrorDTO[];
};

type StartGeocodeResponseDTO = {
  jobId: string;
};

type LatestGeocodeResponseDTO = {
  job: MapGeocodeJobStatusDTO | null;
};

type ApiErrorDTO = {
  error: string;
};

type PdfLanguageRequirementsDTO = {
  summary: string;
  cefrLevel: string;
  localLanguageRequirement: string;
  englishRequirement: string;
};

type PdfExtractionPreviewRowDTO = {
  rowId: string;
  institutionName: string;
  subunitName: string;
  country: string;
  continent: string;
  cities: string[];
  agreementAppliesTo: string;
  degreeProgrammesInAgreement: string[];
  mobilityProgrammes: string[];
  languageRequirements: PdfLanguageRequirementsDTO;
  furtherInfo: string;
  tuitionFeeBased: boolean;
  agreementNegotiationsOngoing: boolean;
  sourcePage: number;
  sourceSnippet: string;
  confidence: number;
  missingFields: string[];
  aiFlags: string[];
  validationFlags: string[];
  reviewStatus?: PdfPreviewReviewStatus;
};

type PdfReviewRowDTO = {
  rowId: string;
  reviewState: PdfPreviewReviewStatus;
  editedBy?: string;
  editedAt?: string;
  reviewerNotes?: string;
  wasEdited?: boolean;
  originalExtractedRow: PdfExtractionPreviewRowDTO;
  currentRow: PdfExtractionPreviewRowDTO;
};

type PdfReviewRowPatchDTO = {
  reviewerNotes?: string;
  currentRow?: Partial<PdfExtractionPreviewRowDTO>;
};

type PdfReviewSummaryDTO = {
  _id: string;
  status: PdfImportJobStatus;
  totalRows: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  editedCount: number;
  warnings: string[];
};

type PdfCommitPreviewBlockedRowDTO = {
  rowId: string;
  reviewState: PdfPreviewReviewStatus;
  blockers: string[];
  currentRow: PdfExtractionPreviewRowDTO;
};

type PdfCommitPreviewDTO = {
  _id: string;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  editedCount: number;
  commitReadyRows: PdfReviewRowDTO[];
  blockedRows: PdfCommitPreviewBlockedRowDTO[];
  warnings: string[];
};

type StartPdfCommitResponseDTO = {
  importId: string;
  commitStatus: "queued";
};

type PdfCommitResultRowDTO = {
  rowId: string;
  institutionName: string;
  result: "committed" | "skipped" | "failed";
  reason?: string;
  partnerSchoolId?: string;
  geocodeStatus?: string;
  validationFlags: string[];
};

type PdfCommitResultDTO = {
  _id: string;
  status: PdfCommitStatus;
  requestedAt?: string;
  startedAt?: string;
  finishedAt?: string;
  committedBy?: string;
  committedCount: number;
  skippedCount: number;
  failedCount: number;
  geocodedCount: number;
  unresolvedCount: number;
  warnings: string[];
  rowResults: PdfCommitResultRowDTO[];
  errorLog?: string;
};

type PdfExtractionSummaryDTO = {
  totalRows: number;
  rowsWithWarnings: number;
  averageConfidence: number;
  missingFieldCount: number;
};

type PdfFileMetadataDTO = {
  originalFileName: string;
  fileSizeBytes: number;
  mimeType: string;
  pageCount?: number;
};

type PdfImportStatusDTO = {
  _id: string;
  status: PdfImportJobStatus;
  statusDetail?: PdfImportStatusDetail;
  orchestrationMode?: "single" | "chunked";
  parentImportId?: string;
  chunkIndex?: number;
  pageRange?: {
    startPage: number;
    endPage: number;
  };
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  errorLog?: string;
  extractionSummary?: PdfExtractionSummaryDTO;
  warnings?: string[];
  chunking?: {
    totalChunks: number;
    chunkSizePages: number;
    strategyVersion: string;
  };
  progress?: {
    chunksQueued: number;
    chunksRunning: number;
    chunksCompleted: number;
    chunksFailed: number;
    chunksRetried: number;
    progressPercent?: number;
    mergeStartedAt?: string;
    mergeFinishedAt?: string;
    lastChunkFinishedAt?: string;
  };
  latestContextSnapshot?: {
    currentContinent?: string;
    currentCountry?: string;
    lastInstitutionFingerprint?: string;
    lastRowTail?: string;
    sourceChunkIndex?: number;
    capturedAt?: string;
  };
  orchestration?: {
    isParent: boolean;
    parentImportId?: string;
    childCounts?: {
      total: number;
      queued: number;
      running: number;
      completed: number;
      failed: number;
    };
    childChunks?: Array<{
      importId: string;
      chunkIndex: number;
      status: PdfImportJobStatus;
      statusDetail?: PdfImportStatusDetail;
      attempt: number;
      pageRange?: {
        startPage: number;
        endPage: number;
      };
      contextSnapshotOut?: {
        currentContinent?: string;
        currentCountry?: string;
        lastInstitutionFingerprint?: string;
        lastRowTail?: string;
        sourceChunkIndex?: number;
        capturedAt?: string;
      };
    }>;
  };
  fileMetadata: PdfFileMetadataDTO;
};

type StartPdfImportResponseDTO = {
  importId: string;
};

type StartPdfImportModeDTO = "single" | "chunked";

type StartPdfImportRequestDTO = {
  mode?: StartPdfImportModeDTO;
};

type PdfImportRowsResponseDTO = {
  _id: string;
  status: PdfImportJobStatus;
  rows: PdfReviewRowDTO[];
  extractionSummary?: PdfExtractionSummaryDTO;
  warnings?: string[];
  fileMetadata: PdfFileMetadataDTO;
};

type CancelPdfImportResponseDTO = {
  importId: string;
  status: PdfImportJobStatus;
  statusDetail?: PdfImportStatusDetail;
  message: string;
};

export type {
  MapPointDTO,
  MapPointsResponseDTO,
  MapOptionsResponseDTO,
  MapSchoolDetailDTO,
  MapPointsQueryDTO,
  LanguageRequirementDTO,
  MapAdminRowErrorDTO,
  MapImportSummaryDTO,
  MapImportStatusDTO,
  StartImportResponseDTO,
  MapGeocodeSummaryDTO,
  MapGeocodeJobStatusDTO,
  StartGeocodeResponseDTO,
  LatestGeocodeResponseDTO,
  ApiErrorDTO,
  PdfLanguageRequirementsDTO,
  PdfExtractionPreviewRowDTO,
  PdfExtractionSummaryDTO,
  PdfFileMetadataDTO,
  PdfImportStatusDTO,
  StartPdfImportResponseDTO,
  StartPdfImportModeDTO,
  StartPdfImportRequestDTO,
  PdfImportRowsResponseDTO,
  CancelPdfImportResponseDTO,
  PdfReviewRowDTO,
  PdfReviewRowPatchDTO,
  PdfReviewSummaryDTO,
  PdfCommitPreviewBlockedRowDTO,
  PdfCommitPreviewDTO,
  StartPdfCommitResponseDTO,
  PdfCommitResultRowDTO,
  PdfCommitResultDTO,
};
