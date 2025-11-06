import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, FolderKanban, FileText, MessageSquare, TrendingUp, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [customers, projects, invoices, tickets] = await Promise.all([
        supabase.from("crm_customers").select("*", { count: "exact" }),
        supabase.from("crm_projects").select("*", { count: "exact" }),
        supabase.from("crm_invoices").select("total_amount, status"),
        supabase.from("crm_tickets").select("status", { count: "exact" }),
      ]);

      const totalRevenue = invoices.data?.filter(i => i.status === "paid").reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;
      const pendingRevenue = invoices.data?.filter(i => i.status === "pending").reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;
      const openTickets = tickets.data?.filter(t => t.status === "open").length || 0;

      return {
        totalCustomers: customers.count || 0,
        totalProjects: projects.count || 0,
        totalInvoices: invoices.data?.length || 0,
        totalRevenue,
        pendingRevenue,
        totalTickets: tickets.count || 0,
        openTickets,
      };
    },
  });

  const { data: revenueChart } = useQuery({
    queryKey: ["revenue-chart"],
    queryFn: async () => {
      const { data } = await supabase
        .from("crm_invoices")
        .select("created_at, total_amount, status")
        .eq("status", "paid")
        .order("created_at", { ascending: true });

      const monthlyData: Record<string, number> = {};
      data?.forEach(inv => {
        const month = new Date(inv.created_at).toLocaleDateString("fa-IR", { year: "numeric", month: "short" });
        monthlyData[month] = (monthlyData[month] || 0) + (inv.total_amount || 0);
      });

      return Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }));
    },
  });

  const { data: projectsChart } = useQuery({
    queryKey: ["projects-chart"],
    queryFn: async () => {
      const { data } = await supabase.from("crm_projects").select("status");
      const statusCount: Record<string, number> = {};
      data?.forEach(p => {
        statusCount[p.status] = (statusCount[p.status] || 0) + 1;
      });

      const labels: Record<string, string> = {
        planning: "برنامه‌ریزی",
        in_progress: "در حال انجام",
        completed: "تکمیل شده",
        on_hold: "متوقف شده",
      };

      return Object.entries(statusCount).map(([status, count]) => ({ name: labels[status] || status, value: count }));
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">داشبورد مدیریت</h1>
        <p className="text-muted-foreground mt-2">آمار و گزارشات کلی سیستم</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">مشتریان</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">کل مشتریان</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">پروژه‌ها</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">کل پروژه‌ها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">درآمد</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRevenue.toLocaleString("fa-IR")}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats?.pendingRevenue.toLocaleString("fa-IR")} در انتظار</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تیکت‌ها</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats?.openTickets} تیکت باز</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>نمودار درآمد ماهانه</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" name="درآمد" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>وضعیت پروژه‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={projectsChart} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={80} fill="#8884d8" dataKey="value">
                  {projectsChart?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
