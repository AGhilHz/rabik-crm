-- ============================================
-- CRM System Base Migration
-- جداول پایه سیستم مدیریت مشتریان
-- ============================================

-- 1. جدول مشتریان (Customers)
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company_name TEXT,
  national_id TEXT,
  address TEXT,
  city TEXT DEFAULT 'گرگان',
  postal_code TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. جدول پروژه‌ها (Projects)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'review', 'completed', 'cancelled', 'on_hold')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  start_date DATE,
  due_date DATE,
  completed_date DATE,
  agreed_price BIGINT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. جدول فایل‌های پروژه (Project Files)
CREATE TABLE public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. جدول فاکتورها (Invoices)
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  issue_date DATE DEFAULT CURRENT_DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  subtotal BIGINT NOT NULL DEFAULT 0,
  discount BIGINT DEFAULT 0,
  tax BIGINT DEFAULT 0,
  total BIGINT NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('draft', 'unpaid', 'paid', 'overdue', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. جدول آیتم‌های فاکتور (Invoice Items)
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 1 NOT NULL,
  unit_price BIGINT NOT NULL,
  total BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. جدول پرداخت‌ها (Payments)
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  amount BIGINT NOT NULL,
  payment_method TEXT DEFAULT 'online' CHECK (payment_method IN ('online', 'cash', 'bank_transfer', 'cheque', 'card')),
  transaction_id TEXT,
  tracking_code TEXT,
  gateway TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. جدول تیکت‌های پشتیبانی (Support Tickets)
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- 8. جدول پیام‌های تیکت (Ticket Messages)
CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_type TEXT DEFAULT 'admin' CHECK (sender_type IN ('admin', 'customer')),
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. جدول فایل‌های تیکت (Ticket Files)
CREATE TABLE public.ticket_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES public.ticket_messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. جدول نوتیفیکیشن‌ها (Notifications)
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. جدول تاریخچه فعالیت‌ها (Activity Log)
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- Indexes برای بهینه‌سازی
-- ============================================

CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_status ON public.customers(status);
CREATE INDEX idx_customers_user_id ON public.customers(user_id);

CREATE INDEX idx_projects_customer_id ON public.projects(customer_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_assigned_to ON public.projects(assigned_to);

CREATE INDEX idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);

CREATE INDEX idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX idx_payments_status ON public.payments(status);

CREATE INDEX idx_tickets_customer_id ON public.support_tickets(customer_id);
CREATE INDEX idx_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_tickets_assigned_to ON public.support_tickets(assigned_to);

CREATE INDEX idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

CREATE INDEX idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);

-- ============================================
-- Functions
-- ============================================

-- تابع به‌روزرسانی خودکار updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تابع تولید شماره فاکتور
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  year_suffix TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.invoices
  WHERE invoice_number LIKE 'INV' || year_suffix || '%';
  
  RETURN 'INV' || year_suffix || LPAD(next_number::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- تابع تولید شماره تیکت
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.support_tickets;
  
  RETURN 'TKT' || LPAD(next_number::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- تابع محاسبه خودکار مجموع فاکتور
CREATE OR REPLACE FUNCTION public.calculate_invoice_total()
RETURNS TRIGGER AS $$
DECLARE
  invoice_subtotal BIGINT;
BEGIN
  SELECT COALESCE(SUM(total), 0)
  INTO invoice_subtotal
  FROM public.invoice_items
  WHERE invoice_id = NEW.invoice_id;
  
  UPDATE public.invoices
  SET subtotal = invoice_subtotal,
      total = invoice_subtotal - COALESCE(discount, 0) + COALESCE(tax, 0)
  WHERE id = NEW.invoice_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تابع ثبت لاگ فعالیت
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
  description_text TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    action_type := 'created';
    description_text := TG_TABLE_NAME || ' created';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'updated';
    description_text := TG_TABLE_NAME || ' updated';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'deleted';
    description_text := TG_TABLE_NAME || ' deleted';
  END IF;
  
  INSERT INTO public.activity_logs (user_id, entity_type, entity_id, action, description)
  VALUES (auth.uid(), TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), action_type, description_text);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Triggers
-- ============================================

-- Trigger برای updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger برای شماره فاکتور
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invoice_number_trigger BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();

-- Trigger برای شماره تیکت
CREATE OR REPLACE FUNCTION public.set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := public.generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_number_trigger BEFORE INSERT ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_ticket_number();

-- Trigger برای محاسبه مجموع فاکتور
CREATE TRIGGER calculate_invoice_total_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
  FOR EACH ROW EXECUTE FUNCTION public.calculate_invoice_total();

-- Triggers برای لاگ فعالیت
CREATE TRIGGER log_customer_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER log_project_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER log_invoice_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER log_ticket_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies برای Customers
CREATE POLICY "Admins can view all customers"
  ON public.customers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can view own profile"
  ON public.customers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update customers"
  ON public.customers FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can update own profile"
  ON public.customers FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can delete customers"
  ON public.customers FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Policies برای Projects
CREATE POLICY "Admins can view all projects"
  ON public.projects FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can view own projects"
  ON public.projects FOR SELECT
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Policies برای Project Files
CREATE POLICY "Admins can view all project files"
  ON public.project_files FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can view own project files"
  ON public.project_files FOR SELECT
  USING (project_id IN (
    SELECT p.id FROM public.projects p
    JOIN public.customers c ON p.customer_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage project files"
  ON public.project_files FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Policies برای Invoices
CREATE POLICY "Admins can view all invoices"
  ON public.invoices FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can view own invoices"
  ON public.invoices FOR SELECT
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage invoices"
  ON public.invoices FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Policies برای Invoice Items
CREATE POLICY "Admins can view all invoice items"
  ON public.invoice_items FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can view own invoice items"
  ON public.invoice_items FOR SELECT
  USING (invoice_id IN (
    SELECT i.id FROM public.invoices i
    JOIN public.customers c ON i.customer_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage invoice items"
  ON public.invoice_items FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Policies برای Payments
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can view own payments"
  ON public.payments FOR SELECT
  USING (invoice_id IN (
    SELECT i.id FROM public.invoices i
    JOIN public.customers c ON i.customer_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage payments"
  ON public.payments FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Policies برای Support Tickets
CREATE POLICY "Admins can view all tickets"
  ON public.support_tickets FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can view own tickets"
  ON public.support_tickets FOR SELECT
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage tickets"
  ON public.support_tickets FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can create tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- Policies برای Ticket Messages
CREATE POLICY "Admins can view all ticket messages"
  ON public.ticket_messages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can view own ticket messages"
  ON public.ticket_messages FOR SELECT
  USING (
    ticket_id IN (
      SELECT t.id FROM public.support_tickets t
      JOIN public.customers c ON t.customer_id = c.id
      WHERE c.user_id = auth.uid()
    )
    AND is_internal = false
  );

CREATE POLICY "Admins can manage ticket messages"
  ON public.ticket_messages FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can create ticket messages"
  ON public.ticket_messages FOR INSERT
  WITH CHECK (
    ticket_id IN (
      SELECT t.id FROM public.support_tickets t
      JOIN public.customers c ON t.customer_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- Policies برای Ticket Files
CREATE POLICY "Admins can view all ticket files"
  ON public.ticket_files FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can view own ticket files"
  ON public.ticket_files FOR SELECT
  USING (ticket_id IN (
    SELECT t.id FROM public.support_tickets t
    JOIN public.customers c ON t.customer_id = c.id
    WHERE c.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage ticket files"
  ON public.ticket_files FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Policies برای Notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policies برای Activity Logs
CREATE POLICY "Admins can view all activity logs"
  ON public.activity_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (true);
