type PartnerSchool = {
  country: string;
  title: string;
  link: string;
  studyField?: string;
};

type PartnerSchoolWithCoordinates = PartnerSchool & {
  coordinates: {
    lat: number;
    lng: number;
  };
};

type DestinationResponse = {
  destinations: {
    [program: string]: PartnerSchool[];
  };
};

type DestinationWithCoordinatesResponse = {
  destinations: {
    [program: string]: PartnerSchoolWithCoordinates[];
  };
};

//Link based document system types:
type DocumentSourceType = "google_drive" | "onedrive" | "dropbox" | "icloud" | "other_url";

type DocumentPlatform = {
  type: DocumentSourceType;
  name: string; 
  icon?: string; 
  requiresPublicAccess: boolean; 
};

// URL  for platform validation & Instructions for users on how to get shareable link
type PlatformURLPattern = {
  platform: DocumentSourceType;
  pattern: RegExp | string;
  exampleUrl: string;
  instructions: string; // Instructions here!
};

type SupportedPlatforms = {
  google_drive: {
    name: "Google Drive";
    urlPatterns: string[];
    sharingInstructions: string;
  };
  onedrive: {
    name: "OneDrive";
    urlPatterns: string[];
    sharingInstructions: string;
  };
  dropbox: {
    name: "Dropbox";
    urlPatterns: string[];
    sharingInstructions: string;
  };
  icloud: {
    name: "iCloud";
    urlPatterns: string[];
    sharingInstructions: string;
  };
  other_url: {
    name: "Other URL";
    urlPatterns: string[];
    sharingInstructions: string;
  };
};

type DocumentLinkValidation = {
  isValid: boolean;
  isAccessible: boolean;
  errorMessage?: string;
  checkedAt: string;
  statusCode?: number;
};

type DocumentLinkRequest = {
  name: string;
  url: string;
  sourceType: DocumentSourceType;
  documentType?: string;
  notes?: string;
};

type DocumentLinkUpdate = {
  name?: string;
  url?: string;
  sourceType?: DocumentSourceType;
  notes?: string;
};

type Document = {
  id: string;
  name: string;
  url: string;
  sourceType: DocumentSourceType;
  platformName?: string; 
  addedAt: string;
  notes?: string;
  lastVerified?: string; // Last time link was verified as working
  isAccessible?: boolean; 
  accessPermission?: "public" | "restricted" | "unknown";
};

type ApplicationStatus =
  | "not_started"
  | "in_progress"
  | "completed" 
  | "pending_review"
  | "approved"
  | "rejected";

type ExtendedApplicationStatus = ApplicationStatus | "draft" | "submitted";

type ApplicationPhase =
  | "esihaku"
  | "nomination"
  | "apurahat"
  | "vaihdon_jalkeen";

type DocumentStatus =
  | "uploaded"
  | "processing"
  | "approved"
  | "rejected"
  | "needs_revision";

type ApplicationPhaseData = {
  status: ApplicationStatus;
  completedAt?: string;
  deadline?: string;
  documents: ApplicationDocument[];
  notes?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
};

type ExtendedApplicationPhaseData = {
  phase: string;
  data?: unknown;
  documents: ExtendedApplicationDocument[];
  submittedAt?: string | null;
  status: ExtendedApplicationStatus;
  completedAt?: string;
  deadline?: string;
  notes?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  reviewedBy?: string;
};


type ApplicationsResponse = {
  userId: string;
  esihaku?: ApplicationPhaseData;
  nomination?: ApplicationPhaseData;
  grants?: {
    erasmus?: ApplicationPhaseData;
    kela?: ApplicationPhaseData;
  };
  postExchange?: ApplicationPhaseData;
  createdAt: string;
  updatedAt: string;
};


type ExtendedApplicationsResponse = {
  userId: string;
  esihaku?: ExtendedApplicationPhaseData;
  nomination?: ExtendedApplicationPhaseData;
  apurahat?: ExtendedApplicationPhaseData;
  vaihdon_jalkeen?: ExtendedApplicationPhaseData;
  applications: ExtendedApplicationPhaseData[];
  currentPhase: string | null;
  createdAt?: string;
  updatedAt?: string;
};


type LegacyApplicationsResponse = ExtendedApplicationPhaseData[];


type ApplicationDocument = {
  id: string;
  applicationId: string;
  applicationPhase: ApplicationPhase;
  documentType: string;
  fileName: string;
  fileUrl: string;
  sourceType: DocumentSourceType;
  platformName?: string;
  addedAt: string;
  lastVerified?: string;
  isAccessible?: boolean;
  accessPermission?: "public" | "restricted" | "unknown";
  fileSize?: number;
  mimeType?: string;
  isRequired: boolean;
  status: DocumentStatus;
  addedBy: string;
};

type ExtendedApplicationDocument = {
  id: string;
  applicationId: string;
  applicationPhase: ApplicationPhase | string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  sourceType: DocumentSourceType;
  platformName?: string;
  addedAt: string;
  lastVerified?: string;
  isAccessible?: boolean;
  accessPermission?: "public" | "restricted" | "unknown";
  fileSize?: number;
  mimeType?: string;
  isRequired?: boolean;
  status?: DocumentStatus | string;
  addedBy: string;
};

type ApplicationTask = {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  isRequired: boolean;
  isCompleted: boolean;
  completedAt?: string;
  dueDate?: string;
  documentTypes?: string[];
  externalLinks?: ExternalLink[];
};

type ExternalLink = {
  title: string;
  url: string;
  description: string;
  category?: "application" | "information" | "support";
};

type ProfileResponse = {
  _id: string;
  userName: string;
  email: string;
  registeredAt: string;
  user_level_id?: number;
  favorites: string[];
  documents: Document[];
  exchangeBadge?: boolean;
  avatarUrl?: string;
  linkedinUrl?: string;
  applications?: ApplicationsResponse;
  isBlocked?: boolean;
  applicationProgress?: {
    overallProgress: number;
    currentPhase: ApplicationPhase;
    nextDeadline?: string;
    completedPhases: ApplicationPhase[];
  };
};

type ContactMessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactResponse = {
  _id: string,
  responderName: string,
  responderEmail: string,
  message: string,
  createdAt: string,
  sentAt: string
};

type ContactMessageResponse = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "replied" | "closed";
  createdAt: string;
  updatedAt: string;
  responses?: ContactResponse[];
};


type ApplicationsProgresses = {
  esihaku?: {
    status: "not_started" | "in_progress" | "completed" | "pending_review";
    completedAt?: string;
  };
  nomination?: {
    status: "not_started" | "in_progress" | "completed" | "pending_review";
    completedAt?: string;
  };
  grants?: {
    erasmus?: {
      status: "not_started" | "in_progress" | "completed" | "pending_review";
      completedAt?: string;
    };
    kela?: {
      status: "not_started" | "in_progress" | "completed" | "pending_review";
      completedAt?: string;
    };
  };
  postExchange?: {
    status: "not_started" | "in_progress" | "completed" | "pending_review";
    completedAt?: string;
  };
}
type GrantsSummary = {
  grants: unknown[];
  erasmusGrants: unknown[];
  kelaSupport?: unknown;
  budgetEstimate?: unknown;
  totalEstimatedSupport: number;
}
type GrantApplicationData = {
  destination: string;
  program: string;
  estimatedAmount: number;
}

type BudgetEstimateData ={
  id?: string;
  userId?: string;
  destination: string;
  categories: Record<string, { estimatedCost: number; notes?: string }>;
  totalEstimate?: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

type GrantType = "erasmus_plus" | "kela" | "other";
type GrantStatus = "not_started" | "in_progress" | "completed" | "approved" | "rejected";

type GrantApplication = {
  id: string;
  userId: string;
  grantType: GrantType;
  status: GrantStatus;
  destination: string;
  program: string; 
  estimatedAmount: number;
  approvedAmount?: number;
  applicationDate: string;
  decisionDate?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Budget category types
 */
type BudgetCategory = 
  | "matkakulut"    
  | "vakuutukset"         
  | "asuminen"            
  | "ruoka_ja_arki"
  | "opintovalineet";

/**
 * Individual category expense details
 */
type CategoryExpense = {
  amount: number;
  notes: string;
}

type BudgetItem = {
  category: BudgetCategory;
  title: string;
  description: string;
  items: string[]; 
  icon: string; 
}

// budget information for a user
type Budget = {
  budgetId: string;
  userId: string;
  destination?: string;
  exchangeProgramId?: string;
  categories: Record<BudgetCategory, CategoryExpense>;
  totalAmount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Request body for creating/updating a budget
 */
type CreateBudgetRequest = {
  destination?: string;
  exchangeProgramId?: string;
  categories: Record<BudgetCategory, CategoryExpense>;
  totalAmount: number;
}

/**
 * Response from budget API endpoints
 */
type BudgetResponse = {
  success: boolean;
  budgetId?: string;
  message?: string;
  data?: Budget;
  error?: ApiError;
}

/**
 * Budget history item
 */
type BudgetHistoryItem = {
  budgetId: string;
  destination?: string;
  totalAmount: number;
  createdAt: string;
}

/**
 * Response for budget history endpoint
 */
type BudgetHistoryResponse = {
  success: boolean;
  data: BudgetHistoryItem[];
  error?: ApiError;
}

//budget estimate type ->  for backward compatibility
type BudgetEstimate = {
  id: string;
  userId: string;
  destination: string;
  grantAmount: number;
  categories: Record<string, {
    estimatedCost: number;
    notes?: string;
  }>;
  totalEstimate: number;
  balance?: number; // grantAmount - totalEstimate
  currency: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Calculator operation types
 */
type CalculatorOperation = "add" | "subtract" | "multiply" | "divide";

/**
 * Calculator history entry
 */
type CalculatorHistoryEntry = {
  historyId: string;
  userId: string;
  calculation: string; // Format: "500 + 300 = 800"
  result: number;
  timestamp: string; // ISO date string
}

/**
 * Request body for saving calculator history
 */
type SaveCalculatorHistoryRequest = {
  calculation: string;
  result: number;
}

/**
 * Response from calculator history endpoints
 */
type CalculatorHistoryResponse = {
  success: boolean;
  historyId?: string;
  data?: CalculatorHistoryEntry[];
  error?: ApiError;
}

/**
 * Budget comparison with grant estimate
 */
type BudgetGrantComparison = {
  budgetTotal: number;
  grantEstimate: number;
  difference: number; // Positive if grant covers budget, negative if over budget
  coveragePercentage: number; // Percentage of budget covered by grant
  status: "sufficient" | "insufficient" | "exact";
}

/**
 * Extended budget estimate with grant information
 */
type BudgetEstimateWithGrant = {
  budget: Budget;
  grantEstimate?: number;
  comparison?: BudgetGrantComparison;
  recommendations?: string[]; // Recommendations for the user
}

/**
 * API Error codes specific to budget calculator
 */
type BudgetErrorCode =
  | "INVALID_USER_ID"
  | "INVALID_BUDGET_DATA"
  | "BUDGET_NOT_FOUND"
  | "UNAUTHORIZED"
  | "SERVER_ERROR"
  | "VALIDATION_ERROR"
  | "DUPLICATE_BUDGET";
//  calculator (Poistan myöhemmin?)
type GrantCalculator = {
  destination: string;
  program: string; 
  baseAmount: number;
  travelDistance?: number; 
  greenTravel?: boolean; 
  inclusionSupport?: boolean; 
  totalEstimated: number;
  currency: string;
}
/**
 * Generic API error structure
 */
type ApiError = {
  code: BudgetErrorCode | string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Validation error for specific fields
 */
type ValidationError = {
  field: string;
  message: string;
  value?: any;
}

// Erasmus+ types from  
type ErasmusPlusGrantType = 
  | "base_grant"                    
  | "travel_grant"                 
  | "green_travel_supplement" 
  | "inclusion_support";  
type ErasmusPlusGrant = {
  id: string;
  userId: string;
  grantType: ErasmusPlusGrantType;
  title: string;
  description: string;
  status: GrantStatus;
  estimatedAmount?: number;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

type GrantSearchFilters = {
  destination?: string;
  program?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Kela 
type KelaSupport = {
  id: string;
  userId: string;
  status: GrantStatus;
  monthlyAmount: number;
  duration: number;
  totalAmount: number;
  studyAbroadConfirmation: boolean; 
  applicationSubmitted: boolean;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

// Response types for API
type GrantApplicationResponse = {
  grants: GrantApplication[];
  erasmusGrants: ErasmusPlusGrant[];
  kelaSupport?: KelaSupport;
  budgetEstimate?: BudgetEstimate;
  totalEstimatedSupport: number;
}

type CreateGrantApplicationRequest = {
  grantType: GrantType | ErasmusPlusGrantType;
  destination: string;
  program: string;
  estimatedAmount: number;
}

type UpdateGrantApplicationRequest = {
  status?: GrantStatus;
  estimatedAmount?: number;
  approvedAmount?: number;
  documents?: string[];
}

/**
 * Status of an application stage
 */
type ApplicationStageStatus = 
  | "not_started"
  | "in_progress"
  | "pending_review"
  | "completed";

/**
 * Application stage definition
 */
type ApplicationStage = {
  id: string;
  phase: ApplicationPhase;
  title: string;
  description: string;
  requiredDocuments: string[];
  optionalDocuments?: string[];
  externalLinks?: ExternalLink[];
  deadline?: string; // ISO 8601 date string
  order: number;
}

/**
 * User's progress on an application stage
 */
type UserApplicationProgress = {
  id: string;
  userId: string;
  stageId: string;
  status: ApplicationStageStatus;
  completedAt?: string; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

/**
 * Application stage with user's progress information
 */
type ApplicationStageWithProgress = ApplicationStage & {
  status: ApplicationStageStatus;
  completedAt?: string; // ISO 8601 date string
}

/**
 * Request body for updating stage status
 */
type UpdateStageStatusRequest = {
  status: ApplicationStageStatus;
}

/**
 * Response from updating stage status
 */
type UpdateStageStatusResponse = {
  id: string;
  phase: ApplicationPhase;
  title: string;
  description: string;
  status: ApplicationStageStatus;
  requiredDocuments: string[];
  optionalDocuments?: string[];
  deadline?: string;
  completedAt?: string;
  updatedAt: string;
}

/**
 * Event triggered when stage status changes
 */
type StageStatusChangeEvent = {
  userId: string;
  stageId: string;
  oldStatus: ApplicationStageStatus;
  newStatus: ApplicationStageStatus;
  timestamp: string;
  triggeredBy: "user" | "system" | "admin";
}

/**
 * Summary of progress for a specific phase
 */
type PhaseProgressSummary = {
  phase: ApplicationPhase;
  totalStages: number;
  completedStages: number;
  inProgressStages: number;
  notStartedStages: number;
  pendingReviewStages: number;
  progressPercentage: number; // 0-100
  nextStage?: ApplicationStage;
}

//Kokemukset ja vinkit types
/**
 * Exchange Story --> Exchange students'  report
 */
type ExchangeStory = {
  id: string;
  country: string;
  city: string;
  university: string;
  userName: string;
  userAvatar?: string;
  title: string;
  summary: string;
  fullReport: string;
  highlights: string[];
  exchangeDate: string;
  duration: number;
  tags: string[];
  coverPhoto: string;
  ratings: {
    overall: number;
    academics: number;
    social: number;
    accommodation: number;
  };
  isFeatured: boolean;
  isApproved: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

type StoryReaction = {
  id: string;
  userId: string;
  storyId: string;
  type: "like" | "save";
  createdAt: string;
}
type PaginationOptions = {
  offset?: number;
  limit?: number;
};


type ExchangeStoriesResponse = {
  stories: ExchangeStory[];
  hasMore: boolean;
}

/**
 * Story filters for search/filter functionality
 */
type StoryFilters = {
  country?: string;
  city?: string;
  university?: string;
  tags?: string[];
  search?: string;
  minRating?: number;
  sort?: "recent" | "popular" | "rating";
  isFeatured?: boolean;
}

//types for countries/cities aggregation

type CountriesResponse = {
  countries: Array<{
    country: string;
    count: number;
    cities: Array<{
      city: string;
      count: number;
    }>;
  }>;
}


// Creating story request body
type CreateStoryRequest = {
  country: string;
  city: string;
  university: string;
  userName: string;
  userAvatar?: string;
  title: string;
  summary: string;
  fullReport: string;
  highlights: string[];
  exchangeDate: string;
  duration: number;
  tags: string[];
  coverPhoto: string;
  ratings: {
    overall: number;
    academics: number;
    social: number;
    accommodation: number;
  };
  isFeatured?: boolean;
}

export type {
  PartnerSchool,
  DestinationResponse,
  PartnerSchoolWithCoordinates,
  DestinationWithCoordinatesResponse,
  ProfileResponse,
  // Link-based system types
  Document,
  DocumentSourceType,
  DocumentPlatform,
  PlatformURLPattern,
  SupportedPlatforms,
  DocumentLinkValidation,
  DocumentLinkRequest,
  DocumentLinkUpdate,
  // Application types
  ApplicationsResponse,
  ApplicationDocument,
  ApplicationPhaseData,
  ApplicationStatus,
  ApplicationPhase,
  DocumentStatus,
  ApplicationTask,
  ExternalLink,
  ExtendedApplicationStatus,
  ExtendedApplicationPhaseData,
  ExtendedApplicationsResponse,
  ExtendedApplicationDocument,
  LegacyApplicationsResponse,
  // Contact message types
  ContactMessageInput,
  ContactMessageResponse,
  ContactResponse,
  BudgetEstimateData,
  GrantsSummary,
  GrantApplicationData,
  ApplicationsProgresses,
  // Grant and financial support types
  GrantType,
  GrantStatus,
  GrantApplication,
  // Budget Calculator types
  BudgetCategory,
  CategoryExpense,
  BudgetItem,
  Budget,
  CreateBudgetRequest,
  BudgetResponse,
  BudgetHistoryItem,
  BudgetHistoryResponse,
  BudgetEstimate,
  CalculatorOperation,
  CalculatorHistoryEntry,
  SaveCalculatorHistoryRequest,
  CalculatorHistoryResponse,
  BudgetGrantComparison,
  BudgetEstimateWithGrant,
  BudgetErrorCode,
  ApiError,
  ValidationError,
  // Application stage types
  ApplicationStageStatus,
  ApplicationStage,
  UserApplicationProgress,
  ApplicationStageWithProgress,
  UpdateStageStatusRequest,
  UpdateStageStatusResponse,
  StageStatusChangeEvent,
  PhaseProgressSummary,
  // Erasmus+ types
  ErasmusPlusGrantType,
  ErasmusPlusGrant,
  GrantCalculator,
  GrantSearchFilters,
  KelaSupport,
  GrantApplicationResponse,
  CreateGrantApplicationRequest,
  UpdateGrantApplicationRequest,
  // Exchange stories types
  ExchangeStory,
  StoryReaction,
  ExchangeStoriesResponse,
  StoryFilters,
  CountriesResponse,
  CreateStoryRequest,
  PaginationOptions
};
