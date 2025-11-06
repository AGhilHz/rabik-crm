// ============================================
// CRM System Constants
// ============================================

export const CUSTOMER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
} as const;

export const CUSTOMER_STATUS_LABELS = {
  active: 'فعال',
  inactive: 'غیرفعال',
  blocked: 'مسدود شده',
} as const;

export const CUSTOMER_STATUS_COLORS = {
  active: 'success',
  inactive: 'secondary',
  blocked: 'destructive',
} as const;

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold',
} as const;

export const PROJECT_STATUS_LABELS = {
  draft: 'پیش‌نویس',
  in_progress: 'در حال انجام',
  review: 'در حال بررسی',
  completed: 'تکمیل شده',
  cancelled: 'لغو شده',
  on_hold: 'متوقف شده',
} as const;

export const PROJECT_STATUS_COLORS = {
  draft: 'secondary',
  in_progress: 'info',
  review: 'warning',
  completed: 'success',
  cancelled: 'destructive',
  on_hold: 'secondary',
} as const;

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const PRIORITY_LABELS = {
  low: 'کم',
  medium: 'متوسط',
  high: 'بالا',
  urgent: 'فوری',
} as const;

export const PRIORITY_COLORS = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
  urgent: 'destructive',
} as const;

export const INVOICE_STATUS = {
  DRAFT: 'draft',
  UNPAID: 'unpaid',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

export const INVOICE_STATUS_LABELS = {
  draft: 'پیش‌نویس',
  unpaid: 'پرداخت نشده',
  paid: 'پرداخت شده',
  overdue: 'سررسید گذشته',
  cancelled: 'لغو شده',
} as const;

export const INVOICE_STATUS_COLORS = {
  draft: 'secondary',
  unpaid: 'warning',
  paid: 'success',
  overdue: 'destructive',
  cancelled: 'secondary',
} as const;

export const PAYMENT_METHOD = {
  ONLINE: 'online',
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CHEQUE: 'cheque',
  CARD: 'card',
} as const;

export const PAYMENT_METHOD_LABELS = {
  online: 'پرداخت آنلاین',
  cash: 'نقدی',
  bank_transfer: 'انتقال بانکی',
  cheque: 'چک',
  card: 'کارت به کارت',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_STATUS_LABELS = {
  pending: 'در انتظار',
  success: 'موفق',
  failed: 'ناموفق',
  refunded: 'برگشت داده شده',
} as const;

export const PAYMENT_STATUS_COLORS = {
  pending: 'warning',
  success: 'success',
  failed: 'destructive',
  refunded: 'secondary',
} as const;

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  WAITING_CUSTOMER: 'waiting_customer',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const TICKET_STATUS_LABELS = {
  open: 'باز',
  in_progress: 'در حال بررسی',
  waiting_customer: 'در انتظار مشتری',
  resolved: 'حل شده',
  closed: 'بسته شده',
} as const;

export const TICKET_STATUS_COLORS = {
  open: 'destructive',
  in_progress: 'info',
  waiting_customer: 'warning',
  resolved: 'success',
  closed: 'secondary',
} as const;

export const NOTIFICATION_TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const NOTIFICATION_TYPE_LABELS = {
  info: 'اطلاعات',
  success: 'موفقیت',
  warning: 'هشدار',
  error: 'خطا',
} as const;

// Tax rate (9% VAT in Iran)
export const TAX_RATE = 0.09;

// Default values
export const DEFAULT_INVOICE_DUE_DAYS = 7;
export const DEFAULT_CITY = 'گرگان';

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-rar-compressed',
];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'jYYYY/jMM/jDD'; // Jalali
export const DISPLAY_DATETIME_FORMAT = 'jYYYY/jMM/jDD HH:mm'; // Jalali
