import { supabase } from "@/integrations/supabase/client";
import type {
  Customer,
  CustomerInsert,
  CustomerUpdate,
  Project,
  ProjectInsert,
  ProjectUpdate,
  Invoice,
  InvoiceInsert,
  InvoiceUpdate,
  InvoiceItem,
  InvoiceItemInsert,
  Payment,
  PaymentInsert,
  SupportTicket,
  SupportTicketInsert,
  SupportTicketUpdate,
  TicketMessage,
  TicketMessageInsert,
  Notification,
  NotificationInsert,
} from "@/integrations/supabase/types-crm";

// ============================================
// Customer Functions
// ============================================

export const getCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Customer[];
};

export const getCustomerById = async (id: string) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Customer;
};

export const createCustomer = async (customer: CustomerInsert) => {
  const { data, error } = await supabase
    .from("customers")
    .insert(customer)
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
};

export const updateCustomer = async (id: string, updates: CustomerUpdate) => {
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
};

export const deleteCustomer = async (id: string) => {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
};

// ============================================
// Project Functions
// ============================================

export const getProjects = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      customer:customers(*),
      service:services(id, title)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getProjectsByCustomer = async (customerId: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Project[];
};

export const getProjectById = async (id: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      customer:customers(*),
      service:services(id, title)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createProject = async (project: ProjectInsert) => {
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
};

export const updateProject = async (id: string, updates: ProjectUpdate) => {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
};

// ============================================
// Invoice Functions
// ============================================

export const getInvoices = async () => {
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customer:customers(*),
      project:projects(id, title)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getInvoicesByCustomer = async (customerId: string) => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Invoice[];
};

export const getInvoiceById = async (id: string) => {
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customer:customers(*),
      project:projects(id, title),
      items:invoice_items(*),
      payments:payments(*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createInvoice = async (invoice: InvoiceInsert) => {
  const { data, error } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
};

export const updateInvoice = async (id: string, updates: InvoiceUpdate) => {
  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Invoice;
};

export const deleteInvoice = async (id: string) => {
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw error;
};

// ============================================
// Invoice Item Functions
// ============================================

export const getInvoiceItems = async (invoiceId: string) => {
  const { data, error } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as InvoiceItem[];
};

export const createInvoiceItem = async (item: InvoiceItemInsert) => {
  const { data, error } = await supabase
    .from("invoice_items")
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data as InvoiceItem;
};

export const deleteInvoiceItem = async (id: string) => {
  const { error } = await supabase.from("invoice_items").delete().eq("id", id);
  if (error) throw error;
};

// ============================================
// Payment Functions
// ============================================

export const getPaymentsByInvoice = async (invoiceId: string) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Payment[];
};

export const createPayment = async (payment: PaymentInsert) => {
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
};

// ============================================
// Support Ticket Functions
// ============================================

export const getTickets = async () => {
  const { data, error } = await supabase
    .from("support_tickets")
    .select(`
      *,
      customer:customers(*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getTicketsByCustomer = async (customerId: string) => {
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as SupportTicket[];
};

export const getTicketById = async (id: string) => {
  const { data, error } = await supabase
    .from("support_tickets")
    .select(`
      *,
      customer:customers(*),
      project:projects(id, title)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createTicket = async (ticket: SupportTicketInsert) => {
  const { data, error } = await supabase
    .from("support_tickets")
    .insert(ticket)
    .select()
    .single();

  if (error) throw error;
  return data as SupportTicket;
};

export const updateTicket = async (id: string, updates: SupportTicketUpdate) => {
  const { data, error } = await supabase
    .from("support_tickets")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as SupportTicket;
};

// ============================================
// Ticket Message Functions
// ============================================

export const getTicketMessages = async (ticketId: string) => {
  const { data, error } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as TicketMessage[];
};

export const createTicketMessage = async (message: TicketMessageInsert) => {
  const { data, error } = await supabase
    .from("ticket_messages")
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data as TicketMessage;
};

// ============================================
// Notification Functions
// ============================================

export const getNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data as Notification[];
};

export const getUnreadNotificationsCount = async (userId: string) => {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw error;
  return count || 0;
};

export const createNotification = async (notification: NotificationInsert) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert(notification)
    .select()
    .single();

  if (error) throw error;
  return data as Notification;
};

export const markNotificationAsRead = async (id: string) => {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) throw error;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw error;
};

// ============================================
// Statistics Functions
// ============================================

export const getDashboardStats = async () => {
  const [customers, projects, invoices, tickets] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("invoices").select("*", { count: "exact", head: true }),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }),
  ]);

  const activeProjects = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress");

  const unpaidInvoices = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("status", "unpaid");

  const openTickets = await supabase
    .from("support_tickets")
    .select("*", { count: "exact", head: true })
    .in("status", ["open", "in_progress"]);

  return {
    totalCustomers: customers.count || 0,
    totalProjects: projects.count || 0,
    activeProjects: activeProjects.count || 0,
    totalInvoices: invoices.count || 0,
    unpaidInvoices: unpaidInvoices.count || 0,
    totalTickets: tickets.count || 0,
    openTickets: openTickets.count || 0,
  };
};

export const getRevenueStats = async () => {
  const { data: paidInvoices, error } = await supabase
    .from("invoices")
    .select("total, paid_date")
    .eq("status", "paid");

  if (error) throw error;

  const totalRevenue = paidInvoices?.reduce((sum, inv) => sum + inv.total, 0) || 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyRevenue =
    paidInvoices
      ?.filter((inv) => {
        if (!inv.paid_date) return false;
        const date = new Date(inv.paid_date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, inv) => sum + inv.total, 0) || 0;

  return {
    totalRevenue,
    monthlyRevenue,
  };
};
