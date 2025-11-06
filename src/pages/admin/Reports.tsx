import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download, FileSpreadsheet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Reports() {
  const [reportType, setReportType] = useState("revenue");
  const [period, setPeriod] = useState("monthly");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["report", reportType, period],
    queryFn: async () => {
      if (reportType === "revenue") {
        const { data } = await supabase
          .from("crm_invoices")
          .select("created_at, total_amount, status")
          .eq("status", "paid");

        const grouped: Record<string, number> = {};
        data?.forEach(inv => {
          const date = new Date(inv.created_at);
          const key = period === "monthly" 
            ? date.toLocaleDateString("fa-IR", { year: "numeric", month: "short" })
            : date.toLocaleDateString("fa-IR", { year: "numeric" });
          grouped[key] = (grouped[key] || 0) + (inv.total_amount || 0);
        });

        return Object.entries(grouped).map(([period, amount]) => ({ period, amount }));
      }

      if (reportType === "projects") {
        const { data } = await supabase.from("crm_projects").select("created_at, status");

        const grouped: Record<string, number> = {};
        data?.forEach(proj => {
          const date = new Date(proj.created_at);
          const key = period === "monthly"
            ? date.toLocaleDateString("fa-IR", { year: "numeric", month: "short" })
            : date.toLocaleDateString("fa-IR", { year: "numeric" });
          grouped[key] = (grouped[key] || 0) + 1;
        });

        return Object.entries(grouped).map(([period, count]) => ({ period, count }));
      }

      if (reportType === "customers") {
        const { data } = await supabase.from("crm_customers").select("created_at");

        const grouped: Record<string, number> = {};
        data?.forEach(cust => {
          const date = new Date(cust.created_at);
          const key = period === "monthly"
            ? date.toLocaleDateString("fa-IR", { year: "numeric", month: "short" })
            : date.toLocaleDateString("fa-IR", { year: "numeric" });
          grouped[key] = (grouped[key] || 0) + 1;
        });

        return Object.entries(grouped).map(([period, count]) => ({ period, count }));
      }

      return [];
    },
  });

  const exportToCSV = () => {
    if (!reportData) return;

    const headers = Object.keys(reportData[0] || {}).join(",");
    const rows = reportData.map(row => Object.values(row).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${reportType}-${Date.now()}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">گزارشات</h1>
          <p className="text-muted-foreground mt-2">تحلیل و گزارشگیری از دادهها</p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="h-4 w-4 ml-2" />
          دانلود CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">نوع گزارش</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">درآمد</SelectItem>
                  <SelectItem value="projects">پروژهها</SelectItem>
                  <SelectItem value="customers">مشتریان</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">دوره زمانی</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">ماهانه</SelectItem>
                  <SelectItem value="yearly">سالانه</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={reportType === "revenue" ? "amount" : "count"} fill="#8884d8" name={reportType === "revenue" ? "مبلغ" : "تعداد"} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>جدول دادهها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-2">دوره</th>
                  <th className="text-right p-2">{reportType === "revenue" ? "مبلغ" : "تعداد"}</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{row.period}</td>
                    <td className="p-2">{reportType === "revenue" ? (row as any).amount?.toLocaleString("fa-IR") : (row as any).count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
