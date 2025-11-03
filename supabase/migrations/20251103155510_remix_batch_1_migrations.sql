
-- Migration: 20251103154846
-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  price_from BIGINT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert services"
  ON public.services FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services"
  ON public.services FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Portfolio table
CREATE TABLE public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  demo_url TEXT,
  tags TEXT[] DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active portfolio"
  ON public.portfolio FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert portfolio"
  ON public.portfolio FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio"
  ON public.portfolio FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio"
  ON public.portfolio FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- FAQ table
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active FAQs"
  ON public.faqs FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert FAQs"
  ON public.faqs FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update FAQs"
  ON public.faqs FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete FAQs"
  ON public.faqs FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert contact submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert initial data
INSERT INTO public.services (title, description, icon, price_from, order_index) VALUES
('طراحی و توسعه وب‌سایت حرفه‌ای', 'طراحی و توسعه وب‌سایت‌های مدرن، سریع و ریسپانسیو با تکنولوژی‌های روز دنیا', 'Globe', 10000000, 1),
('بهینه‌سازی موتورهای جستجو (سئو)', 'افزایش رتبه سایت شما در گوگل و جذب مشتریان بیشتر با استراتژی‌های سئو پیشرفته', 'Search', 5000000, 2),
('پیاده‌سازی سیستم CRM', 'مدیریت حرفه‌ای ارتباط با مشتریان و افزایش فروش با سیستم‌های CRM اختصاصی', 'Users', 15000000, 3),
('تولید محتوای دیجیتال', 'تولید محتوای جذاب و استاندارد برای وب‌سایت، شبکه‌های اجتماعی و بلاگ', 'FileText', 3000000, 4),
('بازاریابی دیجیتال', 'افزایش فروش و آگاهی از برند با کمپین‌های تبلیغاتی هدفمند در فضای دیجیتال', 'TrendingUp', 8000000, 5);

INSERT INTO public.portfolio (title, description, image_url, demo_url, tags, order_index) VALUES
('پنل پیامک رابیک', 'سیستم ارسال پیامک انبوه با پنل مدیریتی پیشرفته', '/src/assets/portfolio-sms.jpg', 'https://sms.rabik.ir', ARRAY['Web App', 'SMS', 'Dashboard'], 1),
('فروشگاه آنلاین', 'پلتفرم فروش آنلاین با سیستم پرداخت و مدیریت محصول', '/src/assets/portfolio-ecommerce.jpg', '#', ARRAY['E-commerce', 'React', 'Payment'], 2),
('سیستم CRM شرکتی', 'مدیریت مشتریان و فرآیندهای فروش برای شرکت‌ها', '/src/assets/portfolio-crm.jpg', '#', ARRAY['CRM', 'Enterprise', 'SaaS'], 3);

INSERT INTO public.blog_posts (title, excerpt, content, image_url, slug, is_published, published_at) VALUES
('سئو محلی: چگونه در گرگان رتبه اول گوگل بگیرید', 'راهنمای کامل بهینه‌سازی سایت برای جستجوهای محلی و افزایش مشتری', 'محتوای کامل مقاله درباره سئو محلی...', '/src/assets/blog-seo.jpg', 'local-seo-gorgan', true, now()),
('CRM هوشمند: راز حفظ مشتری', 'چگونه با سیستم CRM مناسب، مشتریان خود را حفظ کنید', 'محتوای کامل مقاله درباره CRM...', '/src/assets/blog-crm.jpg', 'smart-crm-customer-retention', true, now()),
('بازاریابی دیجیتال بدون ریسک', 'استراتژی‌های کم‌ریسک برای شروع بازاریابی دیجیتال', 'محتوای کامل مقاله درباره بازاریابی...', '/src/assets/blog-marketing.jpg', 'digital-marketing-low-risk', true, now()),
('طراحی سایت responsive در ۱۴۰۴', 'بهترین روش‌ها برای طراحی سایت‌های موبایل‌محور', 'محتوای کامل مقاله درباره طراحی ریسپانسیو...', '/src/assets/blog-responsive.jpg', 'responsive-design-2025', true, now());

INSERT INTO public.faqs (question, answer, order_index) VALUES
('هزینه طراحی سایت چقدر است؟', 'هزینه طراحی سایت بسته به نوع پروژه، تعداد صفحات و امکانات مورد نیاز متفاوت است. برای دریافت قیمت دقیق با ما تماس بگیرید.', 1),
('چقدر زمان می‌برد تا سایتم آماده شود؟', 'معمولاً طراحی یک سایت استاندارد ۲ تا ۴ هفته زمان می‌برد. پروژه‌های پیچیده‌تر ممکن است بیشتر طول بکشند.', 2),
('آیا پشتیبانی بعد از تحویل پروژه دارید؟', 'بله، ما پشتیبانی رایگان ۳ ماهه برای تمام پروژه‌ها ارائه می‌دهیم و پس از آن می‌توانید از پکیج‌های پشتیبانی استفاده کنید.', 3),
('آیا سایت من برای موبایل بهینه می‌شود؟', 'کاملاً! تمام سایت‌هایی که طراحی می‌کنیم کاملاً responsive و برای موبایل، تبلت و دسکتاپ بهینه شده‌اند.', 4),
('آیا می‌توانم خودم محتوای سایت را ویرایش کنم؟', 'بله، تمام سایت‌ها با پنل مدیریت کاربرپسند تحویل داده می‌شوند که می‌توانید به راحتی محتوا را ویرایش کنید.', 5),
('هزینه سئو چقدر است؟', 'بسته به وضعیت سایت و رقابت در حوزه کاری شما، پکیج‌های سئو از ۵ میلیون تومان شروع می‌شود.', 6),
('آیا گارانتی دارید؟', 'بله، ما گارانتی کیفیت کار و رضایت مشتری ارائه می‌دهیم. در صورت عدم رضایت، هزینه شما برگشت داده می‌شود.', 7),
('چگونه می‌توانم سفارش دهم؟', 'کافیست از طریق فرم تماس، تلگرام یا شماره تماس با ما در ارتباط باشید. مشاوره اولیه رایگان است.', 8);
