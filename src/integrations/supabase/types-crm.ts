// ============================================
// CRM System TypeScript Types
// ============================================

export type CustomerStatus = 'active' | 'inactive' | 'blocked';

export type ProjectStatus = 'draft' | 'in_progress' | 'review' | 'completed' | 'cancelled' | 'on_hold';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type InvoiceStatus = 'draft' | 'unpaid' | 'paid' | 'overdue' | 'cancelled';

export type PaymentMethod = 'online' | 'cash' | 'bank_transfer' | 'cheque' | 'card';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';

export type SenderType = 'admin' | 'customer';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Customer
export interface Customer {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  national_id: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  status: CustomerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface CustomerInsert {
  user_id?: string | null;
  full_name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  national_id?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  status?: CustomerStatus;
  notes?: string | null;
}

export interface CustomerUpdate {
  full_name?: string;
  email?: string;
  phone?: string | null;
  company_name?: string | null;
  national_id?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  status?: CustomerStatus;
  notes?: string | null;
}

// Project
export interface Project {
  id: string;
  customer_id: string;
  service_id: string | null;
  title: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  start_date: string | null;
  due_date: string | null;
  completed_date: string | null;
  agreed_price: number | null;
  progress: number;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  customer_id: string;
  service_id?: string | null;
  title: string;
  description?: string | null;
  status?: ProjectStatus;
  priority?: Priority;
  start_date?: string | null;
  due_date?: string | null;
  agreed_price?: number | null;
  assigned_to?: string | null;
  notes?: string | null;
}

export interface ProjectUpdate {
  title?: string;
  description?: string | null;
  status?: ProjectStatus;
  priority?: Priority;
  start_date?: string | null;
  due_date?: string | null;
  completed_date?: string | null;
  agreed_price?: number | null;
  progress?: number;
  assigned_to?: string | null;
  notes?: string | null;
}

// Project File
export interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface ProjectFileInsert {
  project_id: string;
  file_name: string;
  file_path: string;
  file_size?: number | null;
  file_type?: string | null;
  uploaded_by?: string | null;
}

// Invoice
export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  project_id: string | null;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceInsert {
  customer_id: string;
  project_id?: string | null;
  issue_date?: string;
  due_date: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total?: number;
  status?: InvoiceStatus;
  notes?: string | null;
}

export interface InvoiceUpdate {
  due_date?: string;
  paid_date?: string | null;
  discount?: number;
  tax?: number;
  status?: InvoiceStatus;
  notes?: string | null;
}

// Invoice Item
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  title: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

export interface InvoiceItemInsert {
  invoice_id: string;
  title: string;
  description?: string | null;
  quantity?: number;
  unit_price: number;
  total: number;
}

export interface InvoiceItemUpdate {
  title?: string;
  description?: string | null;
  quantity?: number;
  unit_price?: number;
  total?: number;
}

// Payment
export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id: string | null;
  tracking_code: string | null;
  gateway: string | null;
  status: PaymentStatus;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface PaymentInsert {
  invoice_id: string;
  amount: number;
  payment_method?: PaymentMethod;
  transaction_id?: string | null;
  tracking_code?: string | null;
  gateway?: string | null;
  status?: PaymentStatus;
  paid_at?: string | null;
  notes?: string | null;
}

export interface PaymentUpdate {
  status?: PaymentStatus;
  paid_at?: string | null;
  notes?: string | null;
}

// Support Ticket
export interface SupportTicket {
  id: string;
  ticket_number: string;
  customer_id: string;
  project_id: string | null;
  subject: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
}

export interface SupportTicketInsert {
  customer_id: string;
  project_id?: string | null;
  subject: string;
  description: string;
  priority?: Priority;
  status?: TicketStatus;
  assigned_to?: string | null;
}

export interface SupportTicketUpdate {
  subject?: string;
  description?: string;
  priority?: Priority;
  status?: TicketStatus;
  assigned_to?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
}

// Ticket Message
export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string | null;
  sender_type: SenderType;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export interface TicketMessageInsert {
  ticket_id: string;
  sender_id?: string | null;
  sender_type?: SenderType;
  message: string;
  is_internal?: boolean;
}

// Ticket File
export interface TicketFile {
  id: string;
  ticket_id: string;
  message_id: string | null;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface TicketFileInsert {
  ticket_id: string;
  message_id?: string | null;
  file_name: string;
  file_path: string;
  file_size?: number | null;
  file_type?: string | null;
  uploaded_by?: string | null;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationInsert {
  user_id: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string | null;
}

export interface NotificationUpdate {
  is_read?: boolean;
}

// Activity Log
export interface ActivityLog {
  id: string;
  user_id: string | null;
  entity_type: string;
  entity_id: string;
  action: string;
  description: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface ActivityLogInsert {
  user_id?: string | null;
  entity_type: string;
  entity_id: string;
  action: string;
  description?: string | null;
  metadata?: Record<string, any> | null;
}

// Extended types with relations
export interface CustomerWithStats extends Customer {
  projects_count?: number;
  invoices_count?: number;
  tickets_count?: number;
  total_paid?: number;
  total_unpaid?: number;
}

export interface ProjectWithRelations extends Project {
  customer?: Customer;
  service?: {
    id: string;
    title: string;
  };
  assigned_user?: {
    id: string;
    email: string;
  };
  files_count?: number;
}

export interface InvoiceWithRelations extends Invoice {
  customer?: Customer;
  project?: Project;
  items?: InvoiceItem[];
  payments?: Payment[];
}

export interface TicketWithRelations extends SupportTicket {
  customer?: Customer;
  project?: Project;
  assigned_user?: {
    id: string;
    email: string;
  };
  messages_count?: number;
  unread_messages?: number;
}
