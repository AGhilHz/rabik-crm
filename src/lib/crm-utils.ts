// ============================================
// CRM System Utility Functions
// ============================================

import { TAX_RATE } from './crm-constants';

/**
 * فرمت کردن مبلغ به تومان
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
};

/**
 * فرمت کردن تاریخ میلادی به شمسی
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fa-IR').format(d);
};

/**
 * فرمت کردن تاریخ و زمان
 */
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * محاسبه تعداد روزهای باقیمانده تا سررسید
 */
export const getDaysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * بررسی اینکه آیا فاکتور سررسید گذشته است
 */
export const isInvoiceOverdue = (dueDate: string, status: string): boolean => {
  if (status === 'paid' || status === 'cancelled') return false;
  return getDaysUntilDue(dueDate) < 0;
};

/**
 * محاسبه مالیات
 */
export const calculateTax = (amount: number): number => {
  return Math.round(amount * TAX_RATE);
};

/**
 * محاسبه مجموع فاکتور
 */
export const calculateInvoiceTotal = (
  subtotal: number,
  discount: number = 0,
  tax: number = 0
): number => {
  return subtotal - discount + tax;
};

/**
 * محاسبه مجموع آیتمهای فاکتور
 */
export const calculateItemTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

/**
 * تبدیل وضعیت به رنگ Badge
 */
export const getStatusColor = (
  status: string,
  statusColors: Record<string, string>
): string => {
  return statusColors[status] || 'secondary';
};

/**
 * تولید رنگ تصادفی برای آواتار
 */
export const generateAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * گرفتن اولین حرف نام برای آواتار
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return name.substring(0, 2);
};

/**
 * اعتبارسنجی ایمیل
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * اعتبارسنجی شماره تلفن ایران
 */
export const isValidIranianPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+98|0)?9\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * فرمت کردن شماره تلفن
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '-';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }
  
  return phone;
};

/**
 * اعتبارسنجی کد ملی ایران
 */
export const isValidNationalId = (nationalId: string): boolean => {
  if (!nationalId || nationalId.length !== 10) return false;
  
  const check = parseInt(nationalId[9]);
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    sum += parseInt(nationalId[i]) * (10 - i);
  }
  
  const remainder = sum % 11;
  
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
};

/**
 * محاسبه درصد پیشرفت
 */
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * تبدیل بایت به فرمت قابل خواندن
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * گرفتن پسوند فایل
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * بررسی نوع فایل
 */
export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
};

/**
 * تولید رنگ برای نوع فایل
 */
export const getFileTypeColor = (filename: string): string => {
  const ext = getFileExtension(filename).toLowerCase();
  
  const colorMap: Record<string, string> = {
    pdf: 'text-red-500',
    doc: 'text-blue-500',
    docx: 'text-blue-500',
    xls: 'text-green-500',
    xlsx: 'text-green-500',
    zip: 'text-yellow-500',
    rar: 'text-yellow-500',
    jpg: 'text-purple-500',
    jpeg: 'text-purple-500',
    png: 'text-purple-500',
    gif: 'text-purple-500',
  };
  
  return colorMap[ext] || 'text-gray-500';
};

/**
 * کوتاه کردن متن
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * تبدیل تاریخ به فرمت ISO
 */
export const toISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * اضافه کردن روز به تاریخ
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * محاسبه زمان نسبی (مثلا "2 ساعت پیش")
 */
export const getRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'همین الان';
  if (diffMins < 60) return `${diffMins} دقیقه پیش`;
  if (diffHours < 24) return `${diffHours} ساعت پیش`;
  if (diffDays < 7) return `${diffDays} روز پیش`;
  
  return formatDate(d);
};

/**
 * جستجو در آرایه با فیلتر چندگانه
 */
export const searchAndFilter = <T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  filters?: Partial<Record<keyof T, any>>
): T[] => {
  let filtered = items;
  
  // اعمال فیلترها
  if (filters) {
    filtered = filtered.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === '') return true;
        return item[key] === value;
      });
    });
  }
  
  // اعمال جستجو
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }
  
  return filtered;
};

/**
 * مرتبسازی آرایه
 */
export const sortBy = <T>(
  items: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...items].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal < bVal ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });
};

/**
 * گروهبندی آرایه بر اساس کلید
 */
export const groupBy = <T>(
  items: T[],
  key: keyof T
): Record<string, T[]> => {
  return items.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * دانلود فایل
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * کپی کردن متن در کلیپبورد
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
