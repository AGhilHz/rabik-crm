import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react";
import { getTickets } from "@/lib/crm-helpers";
import { TICKET_STATUS, TICKET_STATUS_LABELS, TICKET_STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from "@/lib/crm-constants";
import { formatDate, getRelativeTime, getInitials, generateAvatarColor } from "@/lib/crm-utils";
import { Link } from "react-router-dom";

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });

  const filteredTickets = tickets.filter((ticket: any) => {
    const matchesSearch =
      ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer?.full_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t: any) => t.status === TICKET_STATUS.OPEN).length,
    inProgress: tickets.filter((t: any) => t.status === TICKET_STATUS.IN_PROGRESS).length,
    resolved: tickets.filter((t: any) => t.status === TICKET_STATUS.RESOLVED).length,
  };

  return (
    <Layout>
      <SEOHead
        title="مدیریت تیکتها | پنل ادمین رابیک"
        description="مدیریت تیکتهای پشتیبانی"
        canonical="https://rabik.ir/admin/tickets"
      />

      <section className="min-h-[calc(100vh-20rem)] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">مدیریت تیکتها</h1>
              <p className="text-muted-foreground">مشاهده و پاسخ به تیکتهای پشتیبانی</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.total}</CardTitle>
                <p className="text-sm text-muted-foreground">کل تیکتها</p>
              </CardHeader>
            </Card>

            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <XCircle className="h-8 w-8 text-destructive mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.open}</CardTitle>
                <p className="text-sm text-muted-foreground">باز</p>
              </CardHeader>
            </Card>

            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <Clock className="h-8 w-8 text-warning mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.inProgress}</CardTitle>
                <p className="text-sm text-muted-foreground">در حال بررسی</p>
              </CardHeader>
            </Card>

            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <CheckCircle2 className="h-8 w-8 text-success mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.resolved}</CardTitle>
                <p className="text-sm text-muted-foreground">حل شده</p>
              </CardHeader>
            </Card>
          </div>

          <Card className="gradient-card mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو بر اساس شماره تیکت، موضوع یا نام مشتری..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="pt-6">
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="all">همه ({tickets.length})</TabsTrigger>
                  <TabsTrigger value={TICKET_STATUS.OPEN}>باز ({stats.open})</TabsTrigger>
                  <TabsTrigger value={TICKET_STATUS.IN_PROGRESS}>در حال بررسی ({stats.inProgress})</TabsTrigger>
                  <TabsTrigger value={TICKET_STATUS.RESOLVED}>حل شده ({stats.resolved})</TabsTrigger>
                  <TabsTrigger value={TICKET_STATUS.CLOSED}>بسته شده</TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter}>
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm ? "تیکتی یافت نشد" : "هنوز تیکتی ثبت نشده است"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTickets.map((ticket: any) => (
                        <Link
                          key={ticket.id}
                          to={`/admin/tickets/${ticket.id}`}
                          className="block"
                        >
                          <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-all hover:shadow-md">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${generateAvatarColor(
                                ticket.customer?.full_name || "T"
                              )}`}
                            >
                              {getInitials(ticket.customer?.full_name || "تیکت")}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{ticket.ticket_number}</h3>
                                <Badge variant={TICKET_STATUS_COLORS[ticket.status] as any}>
                                  {TICKET_STATUS_LABELS[ticket.status]}
                                </Badge>
                                <Badge variant={PRIORITY_COLORS[ticket.priority] as any}>
                                  {PRIORITY_LABELS[ticket.priority]}
                                </Badge>
                              </div>
                              <h4 className="font-medium mb-1">{ticket.subject}</h4>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span>👤 {ticket.customer?.full_name}</span>
                                <span>🕐 {getRelativeTime(ticket.created_at)}</span>
                                {ticket.project && <span>📁 {ticket.project.title}</span>}
                              </div>
                            </div>
                          </div>
                        </Link>
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

export default Tickets;
