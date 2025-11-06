import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowRight, Trash2, Download, Send, DollarSign } from "lucide-react";
import { getInvoiceById, deleteInvoice } from "@/lib/crm-helpers";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS, TAX_RATE } from "@/lib/crm-constants";
import { formatDate, formatCurrency, isInvoiceOverdue, getDaysUntilDue } from "@/lib/crm-utils";
import { toast } from "@/hooks/use-toast";
import { InvoicePDF } from "@/components/InvoicePDF";
import { PaymentGateway } from "@/components/PaymentGateway";
import { sendInvoiceEmail } from "@/lib/email-service";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id!),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteInvoice(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "فاکتور با موفقیت حذف شد" });
      navigate("/admin/invoices");
    },
    onError: () => {
      toast({ title: "خطا در حذف فاکتور", variant: "destructive" });
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

  if (!invoice) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
          <p>فاکتور یافت نشد</p>
        </div>
      </Layout>
    );
  }

  const isOverdue = isInvoiceOverdue(invoice.due_date, invoice.status);
  const daysUntilDue = getDaysUntilDue(invoice.due_date);
  const { generatePDF } = InvoicePDF({ invoice });

  const handleSendEmail = async () => {
    try {
      const success = await sendInvoiceEmail(invoice);
      if (success) {
        toast({ 
          title: "ارسال موفق", 
          description: `فاکتور به ${invoice.customer?.email} ارسال شد.`,
        });
      } else {
        toast({ 
          title: "خطا در ارسال", 
          description: "لطفاً دوباره تلاش کنید.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({ 
        title: "خطا", 
        description: "برای فعالسازی ارسال ایمیل، با Resend یا SendGrid یکپارچه کنید.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <SEOHead
        title={`فاکتور ${invoice.invoice_number} | پنل ادمین رابیک`}
        description={`جزئیات فاکتور ${invoice.invoice_number}`}
        canonical={`https://rabik.ir/admin/invoices/${id}`}
      />

      <section className="min-h-[calc(100vh-20rem)] py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/invoices")}
              className="rounded-xl"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold text-gradient">جزئیات فاکتور</h1>
          </div>

          <Card className="gradient-card mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">{invoice.invoice_number}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={INVOICE_STATUS_COLORS[invoice.status] as any}>
                      {INVOICE_STATUS_LABELS[invoice.status]}
                    </Badge>
                    {isOverdue && <Badge variant="destructive">سررسید گذشته</Badge>}
                    {!isOverdue && invoice.status === "unpaid" && daysUntilDue <= 3 && (
                      <Badge variant="warning">{daysUntilDue} روز تا سررسید</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={generatePDF}>
                    <Download className="h-4 w-4 ml-2" />
                    PDF
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={handleSendEmail}>
                    <Send className="h-4 w-4 ml-2" />
                    ارسال
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="rounded-xl">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف فاکتور</AlertDialogTitle>
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">مشتری:</h3>
                  <p className="text-lg">{invoice.customer?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{invoice.customer?.email}</p>
                  {invoice.customer?.phone && (
                    <p className="text-sm text-muted-foreground">{invoice.customer.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">تاریخ صدور: </span>
                    <span className="font-medium">{formatDate(invoice.issue_date)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">تاریخ سررسید: </span>
                    <span className="font-medium">{formatDate(invoice.due_date)}</span>
                  </div>
                  {invoice.paid_date && (
                    <div>
                      <span className="text-sm text-muted-foreground">تاریخ پرداخت: </span>
                      <span className="font-medium text-success">{formatDate(invoice.paid_date)}</span>
                    </div>
                  )}
                  {invoice.project && (
                    <div>
                      <span className="text-sm text-muted-foreground">پروژه: </span>
                      <span className="font-medium">{invoice.project.title}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card mb-6">
            <CardHeader>
              <CardTitle>آیتمهای فاکتور</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان</TableHead>
                    <TableHead>توضیحات</TableHead>
                    <TableHead className="text-center">تعداد</TableHead>
                    <TableHead className="text-left">قیمت واحد</TableHead>
                    <TableHead className="text-left">جمع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="text-muted-foreground">{item.description || "-"}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-left">{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell className="text-left font-bold">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="gradient-card mb-6">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span>جمع کل:</span>
                  <span className="font-bold">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between">
                    <span>تخفیف:</span>
                    <span className="text-destructive">-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>مالیات ({(TAX_RATE * 100).toFixed(0)}%):</span>
                  <span>+{formatCurrency(invoice.tax)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-2xl">
                  <span className="font-bold">مبلغ نهایی:</span>
                  <span className="font-bold text-primary">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {invoice.payments && invoice.payments.length > 0 && (
            <Card className="gradient-card mb-6">
              <CardHeader>
                <CardTitle>تاریخچه پرداختها</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoice.payments.map((payment: any) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 border rounded-xl">
                      <div>
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.payment_method} - {formatDate(payment.paid_at || payment.created_at)}
                        </p>
                        {payment.tracking_code && (
                          <p className="text-xs text-muted-foreground">کد پیگیری: {payment.tracking_code}</p>
                        )}
                      </div>
                      <Badge variant={payment.status === "success" ? "default" : "destructive"}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {invoice.notes && (
            <Card className="gradient-card mb-6">
              <CardHeader>
                <CardTitle>یادداشتها</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}

          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle>پرداخت فاکتور</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentGateway invoice={invoice} />
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default InvoiceDetails;
