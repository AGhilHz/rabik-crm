import { supabase } from "@/integrations/supabase/client";
import { notificationService } from "./notification-service";

export const automationService = {
  async checkOverdueInvoices() {
    const { data: invoices } = await supabase
      .from("crm_invoices")
      .select("*, crm_customers(name, email, user_id)")
      .eq("status", "pending")
      .lt("due_date", new Date().toISOString());

    for (const invoice of invoices || []) {
      await notificationService.create({
        user_id: invoice.crm_customers?.user_id || "",
        title: "فاکتور سررسید گذشته",
        message: `فاکتور #${invoice.invoice_number} سررسید گذشته است`,
        type: "warning",
      });

      await supabase
        .from("crm_invoices")
        .update({ status: "overdue" })
        .eq("id", invoice.id);
    }
  },

  async notifyProjectMilestone(projectId: string) {
    const { data: project } = await supabase
      .from("crm_projects")
      .select("*, crm_customers(user_id)")
      .eq("id", projectId)
      .single();

    if (!project) return;

    if (project.progress >= 100) {
      await notificationService.create({
        user_id: project.crm_customers?.user_id || "",
        title: "پروژه تکمیل شد",
        message: `پروژه ${project.name} با موفقیت تکمیل شد`,
        type: "success",
      });
    } else if (project.progress >= 50 && project.progress < 51) {
      await notificationService.create({
        user_id: project.crm_customers?.user_id || "",
        title: "پیشرفت پروژه",
        message: `پروژه ${project.name} به 50% رسید`,
        type: "info",
      });
    }
  },

  async notifyNewTicket(ticketId: string) {
    const { data: ticket } = await supabase
      .from("crm_tickets")
      .select("*, crm_customers(name)")
      .eq("id", ticketId)
      .single();

    if (!ticket) return;

    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    for (const admin of admins || []) {
      await notificationService.create({
        user_id: admin.id,
        title: "تیکت جدید",
        message: `تیکت جدید از ${ticket.crm_customers?.name}: ${ticket.subject}`,
        type: "info",
      });
    }
  },

  async notifyTicketResponse(ticketId: string, customerId: string) {
    const { data: customer } = await supabase
      .from("crm_customers")
      .select("user_id")
      .eq("id", customerId)
      .single();

    if (!customer?.user_id) return;

    await notificationService.create({
      user_id: customer.user_id,
      title: "پاسخ جدید",
      message: "پاسخ جدیدی به تیکت شما ارسال شد",
      type: "info",
    });
  },

  async notifyInvoicePaid(invoiceId: string) {
    const { data: invoice } = await supabase
      .from("crm_invoices")
      .select("*, crm_customers(user_id)")
      .eq("id", invoiceId)
      .single();

    if (!invoice) return;

    await notificationService.create({
      user_id: invoice.crm_customers?.user_id || "",
      title: "پرداخت موفق",
      message: `فاکتور #${invoice.invoice_number} با موفقیت پرداخت شد`,
      type: "success",
    });
  },
};
