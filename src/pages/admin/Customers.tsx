import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, UserCheck, UserX } from "lucide-react";
import { getCustomers } from "@/lib/crm-helpers";
import { CUSTOMER_STATUS_LABELS, CUSTOMER_STATUS_COLORS } from "@/lib/crm-constants";
import { formatDate, formatPhoneNumber, getInitials, generateAvatarColor } from "@/lib/crm-utils";
import { Link } from "react-router-dom";
import type { Customer } from "@/integrations/supabase/types-crm";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const filteredCustomers = customers.filter((customer: Customer) =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const stats = {
    total: customers.length,
    active: customers.filter((c: Customer) => c.status === "active").length,
    inactive: customers.filter((c: Customer) => c.status === "inactive").length,
  };

  return (
    <Layout>
      <SEOHead
        title="مدیریت مشتریان | پنل ادمین رابیک"
        description="مدیریت مشتریان و اطلاعات آنها"
        canonical="https://rabik.ir/admin/customers"
      />

      <section className="min-h-[calc(100vh-20rem)] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">مدیریت مشتریان</h1>
              <p className="text-muted-foreground">مشاهده و مدیریت اطلاعات مشتریان</p>
            </div>
            <Link to="/admin/customers/new">
              <Button className="rounded-xl">
                <Plus className="h-4 w-4 ml-2" />
                افزودن مشتری جدید
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.total}</CardTitle>
                <p className="text-sm text-muted-foreground">کل مشتریان</p>
              </CardHeader>
            </Card>

            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <UserCheck className="h-8 w-8 text-success mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.active}</CardTitle>
                <p className="text-sm text-muted-foreground">مشتریان فعال</p>
              </CardHeader>
            </Card>

            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <UserX className="h-8 w-8 text-secondary mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.inactive}</CardTitle>
                <p className="text-sm text-muted-foreground">مشتریان غیرفعال</p>
              </CardHeader>
            </Card>
          </div>

          <Card className="gradient-card mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو بر اساس نام، ایمیل یا شماره تلفن..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>لیست مشتریان ({filteredCustomers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "مشتریای یافت نشد" : "هنوز مشتریای ثبت نشده است"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCustomers.map((customer: Customer) => (
                    <Link
                      key={customer.id}
                      to={`/admin/customers/${customer.id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-all hover:shadow-md">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${generateAvatarColor(
                            customer.full_name
                          )}`}
                        >
                          {getInitials(customer.full_name)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{customer.full_name}</h3>
                            <Badge variant={CUSTOMER_STATUS_COLORS[customer.status] as any}>
                              {CUSTOMER_STATUS_LABELS[customer.status]}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>📧 {customer.email}</span>
                            {customer.phone && <span>📱 {formatPhoneNumber(customer.phone)}</span>}
                            {customer.company_name && <span>🏢 {customer.company_name}</span>}
                          </div>
                        </div>

                        <div className="text-left text-sm text-muted-foreground">
                          <div>عضویت:</div>
                          <div className="font-medium">{formatDate(customer.created_at)}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Customers;
