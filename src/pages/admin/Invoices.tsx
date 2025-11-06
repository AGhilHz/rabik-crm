import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, DollarSign, AlertCircle } from "lucide-react";
import { getInvoices } from "@/lib/crm-helpers";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from "@/lib/crm-constants";
import { formatDate, formatCurrency, isInvoiceOverdue } from "@/lib/crm-utils";
import { Link } from "react-router-dom";
import type { Invoice } from "@/integrations/supabase/types-crm";

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  const filteredInvoices = invoices.filter((invoice: any) =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i: any) => i.status === "paid").length,
    unpaid: invoices.filter((i: any) => i.status === "unpaid").length,
    overdue: invoices.filter((i: any) => isInvoiceOverdue(i.due_date, i.status)).length,
  };

  const totalRevenue = invoices
    .filter((i: any) => i.status === "paid")
    .reduce((sum: number, i: any) => sum + i.total, 0);

  const totalUnpaid = invoices
    .filter((i: any) => i.status === "unpaid")
    .reduce((sum: number, i: any) => sum + i.total, 0);

  return (
    <Layout>
      <SEOHead
        title="مدیریت فاکتورها | پنل ادمین رابیک"
        description="مدیریت فاکتورها و پرداختها"
        canonical="https://rabik.ir/admin/invoices"
      />

      <section className="min-h-[calc(100vh-20rem)] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">مدیریت فاکتورها</h1>
              <p className="text-muted-foreground">مشاهده و مدیریت فاکتورها</p>
            </div>
            <Link to="/admin/invoices/new">
              <Button className="rounded-xl">
                <Plus className="h-4 w-4 ml-2" />
                فاکتور جدید
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.total}</CardTitle>
                <p className="text-sm text-muted-foreground">کل فاکتورها</p>
              </CardHeader>
            </Card>

            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <DollarSign className="h-8 w-8 text-success mb-2" />
                <CardTitle className="text-2xl font-bold">{formatCurrency(totalRevenue)}</CardTitle>
                <p className="text-sm text-muted-foreground">درآمد ({stats.paid} فاکتور)</p>
              </CardHeader>
            </Card>

            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <AlertCircle className="h-8 w-8 text-warning mb-2" />
                <CardTitle className="text-2xl font-bold">{formatCurrency(totalUnpaid)}</CardTitle>
                <p className="text-sm text-muted-foreground">پرداخت نشده ({stats.unpaid})</p>
              </CardHeader>
            </Card>

            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.overdue}</CardTitle>
                <p className="text-sm text-muted-foreground">سررسید گذشته</p>
              </CardHeader>
            </Card>
          </div>

          <Card className="gradient-card mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو بر اساس شماره فاکتور یا نام مشتری..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>لیست فاکتورها ({filteredInvoices.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "فاکتوری یافت نشد" : "هنوز فاکتوری ثبت نشده است"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInvoices.map((invoice: any) => {
                    const isOverdue = isInvoiceOverdue(invoice.due_date, invoice.status);
                    
                    return (
                      <Link
                        key={invoice.id}
                        to={`/admin/invoices/${invoice.id}`}
                        className="block"
                      >
                        <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-all hover:shadow-md">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{invoice.invoice_number}</h3>
                              <Badge variant={INVOICE_STATUS_COLORS[invoice.status] as any}>
                                {INVOICE_STATUS_LABELS[invoice.status]}
                              </Badge>
                              {isOverdue && (
                                <Badge variant="destructive">سررسید گذشته</Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span>👤 {invoice.customer?.full_name}</span>
                              <span>📅 صدور: {formatDate(invoice.issue_date)}</span>
                              <span>⏰ سررسید: {formatDate(invoice.due_date)}</span>
                              {invoice.project && <span>📁 {invoice.project.title}</span>}
                            </div>
                          </div>

                          <div className="text-left">
                            <div className="text-2xl font-bold text-primary">
                              {formatCurrency(invoice.total)}
                            </div>
                            {invoice.status === "paid" && invoice.paid_date && (
                              <p className="text-xs text-success">
                                پرداخت: {formatDate(invoice.paid_date)}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Invoices;
