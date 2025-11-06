import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { getCustomerById, deleteCustomer, getProjectsByCustomer, getInvoicesByCustomer, getTicketsByCustomer } from "@/lib/crm-helpers";
import { CUSTOMER_STATUS_LABELS, CUSTOMER_STATUS_COLORS, PROJECT_STATUS_LABELS, INVOICE_STATUS_LABELS, TICKET_STATUS_LABELS } from "@/lib/crm-constants";
import { formatDate, formatPhoneNumber, formatCurrency, getInitials, generateAvatarColor } from "@/lib/crm-utils";
import { toast } from "@/hooks/use-toast";

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id!),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["customer-projects", id],
    queryFn: () => getProjectsByCustomer(id!),
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["customer-invoices", id],
    queryFn: () => getInvoicesByCustomer(id!),
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ["customer-tickets", id],
    queryFn: () => getTicketsByCustomer(id!),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCustomer(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "مشتری با موفقیت حذف شد" });
      navigate("/admin/customers");
    },
    onError: () => {
      toast({ title: "خطا در حذف مشتری", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!customer) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
          <p>مشتری یافت نشد</p>
        </div>
      </Layout>
    );
  }

  const totalPaid = invoices.filter((inv: any) => inv.status === "paid").reduce((sum: number, inv: any) => sum + inv.total, 0);
  const totalUnpaid = invoices.filter((inv: any) => inv.status === "unpaid").reduce((sum: number, inv: any) => sum + inv.total, 0);

  return (
    <Layout>
      <SEOHead
        title={`${customer.full_name} | پنل ادمین رابیک`}
        description={`پروفایل مشتری ${customer.full_name}`}
        canonical={`https://rabik.ir/admin/customers/${id}`}
      />

      <section className="min-h-[calc(100vh-20rem)] py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/customers")}
              className="rounded-xl"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold text-gradient">پروفایل مشتری</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="gradient-card lg:col-span-1">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 ${generateAvatarColor(
                      customer.full_name
                    )}`}
                  >
                    {getInitials(customer.full_name)}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{customer.full_name}</h2>
                  <Badge variant={CUSTOMER_STATUS_COLORS[customer.status] as any}>
                    {CUSTOMER_STATUS_LABELS[customer.status]}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {customer.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{formatPhoneNumber(customer.phone)}</span>
                    </div>
                  )}
                  {customer.company_name && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.company_name}</span>
                    </div>
                  )}
                  {customer.city && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.city}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>عضویت: {formatDate(customer.created_at)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Link to={`/admin/customers/${id}/edit`} className="flex-1">
                    <Button className="w-full rounded-xl">
                      <Edit className="h-4 w-4 ml-2" />
                      ویرایش
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="rounded-xl">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف مشتری</AlertDialogTitle>
                        <AlertDialogDescription>
                          آیا مطمئن هستید؟ این عملیات قابل بازگشت نیست.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>انصراف</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate()}>
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="gradient-card">
                  <CardHeader className="pb-3">
                    <Briefcase className="h-6 w-6 text-primary mb-2" />
                    <CardTitle className="text-2xl font-bold">{projects.length}</CardTitle>
                    <p className="text-sm text-muted-foreground">پروژهها</p>
                  </CardHeader>
                </Card>

                <Card className="gradient-card">
                  <CardHeader className="pb-3">
                    <FileText className="h-6 w-6 text-success mb-2" />
                    <CardTitle className="text-2xl font-bold">{invoices.length}</CardTitle>
                    <p className="text-sm text-muted-foreground">فاکتورها</p>
                  </CardHeader>
                </Card>

                <Card className="gradient-card">
                  <CardHeader className="pb-3">
                    <MessageSquare className="h-6 w-6 text-warning mb-2" />
                    <CardTitle className="text-2xl font-bold">{tickets.length}</CardTitle>
                    <p className="text-sm text-muted-foreground">تیکتها</p>
                  </CardHeader>
                </Card>
              </div>

              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle>آمار مالی</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">پرداخت شده</p>
                      <p className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">پرداخت نشده</p>
                      <p className="text-2xl font-bold text-warning">{formatCurrency(totalUnpaid)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {customer.address && (
                <Card className="gradient-card">
                  <CardHeader>
                    <CardTitle>آدرس</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{customer.address}</p>
                    {customer.postal_code && (
                      <p className="text-sm text-muted-foreground mt-2">کد پستی: {customer.postal_code}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {customer.notes && (
                <Card className="gradient-card">
                  <CardHeader>
                    <CardTitle>یادداشتها</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Card className="gradient-card">
            <CardContent className="pt-6">
              <Tabs defaultValue="projects">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="projects">پروژهها ({projects.length})</TabsTrigger>
                  <TabsTrigger value="invoices">فاکتورها ({invoices.length})</TabsTrigger>
                  <TabsTrigger value="tickets">تیکتها ({tickets.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="projects">
                  {projects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">پروژهای ثبت نشده است</p>
                  ) : (
                    <div className="space-y-3">
                      {projects.map((project: any) => (
                        <div key={project.id} className="p-4 border rounded-xl">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{project.title}</h4>
                              <p className="text-sm text-muted-foreground">{formatDate(project.created_at)}</p>
                            </div>
                            <Badge>{PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS]}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="invoices">
                  {invoices.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">فاکتوری ثبت نشده است</p>
                  ) : (
                    <div className="space-y-3">
                      {invoices.map((invoice: any) => (
                        <div key={invoice.id} className="p-4 border rounded-xl">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{invoice.invoice_number}</h4>
                              <p className="text-sm text-muted-foreground">{formatDate(invoice.issue_date)}</p>
                            </div>
                            <div className="text-left">
                              <Badge>{INVOICE_STATUS_LABELS[invoice.status as keyof typeof INVOICE_STATUS_LABELS]}</Badge>
                              <p className="text-sm font-bold mt-1">{formatCurrency(invoice.total)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tickets">
                  {tickets.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">تیکتی ثبت نشده است</p>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map((ticket: any) => (
                        <div key={ticket.id} className="p-4 border rounded-xl">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{ticket.subject}</h4>
                              <p className="text-sm text-muted-foreground">{formatDate(ticket.created_at)}</p>
                            </div>
                            <Badge>{TICKET_STATUS_LABELS[ticket.status as keyof typeof TICKET_STATUS_LABELS]}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default CustomerProfile;
