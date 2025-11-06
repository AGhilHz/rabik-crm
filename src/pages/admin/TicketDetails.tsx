import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Send, User, Calendar } from "lucide-react";
import { getTicketById, getTicketMessages, createTicketMessage, updateTicket } from "@/lib/crm-helpers";
import { TICKET_STATUS_LABELS, TICKET_STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from "@/lib/crm-constants";
import { formatDateTime, getInitials, generateAvatarColor } from "@/lib/crm-utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("");

  const { data: ticket, isLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id!),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["ticket-messages", id],
    queryFn: () => getTicketMessages(id!),
    refetchInterval: 5000, // Real-time: هر 5 ثانیه refresh
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      return createTicketMessage({
        ticket_id: id!,
        sender_id: user?.id,
        sender_type: "admin",
        message: message.trim(),
        is_internal: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-messages", id] });
      setMessage("");
      toast({ title: "پیام ارسال شد" });
    },
    onError: () => {
      toast({ title: "خطا در ارسال پیام", variant: "destructive" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => updateTicket(id!, { status: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast({ title: "وضعیت بهروزرسانی شد" });
    },
  });

  const updatePriorityMutation = useMutation({
    mutationFn: (priority: string) => updateTicket(id!, { priority: priority as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast({ title: "اولویت بهروزرسانی شد" });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
          <p>تیکت یافت نشد</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`تیکت ${ticket.ticket_number} | پنل ادمین رابیک`}
        description={`جزئیات تیکت ${ticket.ticket_number}`}
        canonical={`https://rabik.ir/admin/tickets/${id}`}
      />

      <section className="min-h-[calc(100vh-20rem)] py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/tickets")}
              className="rounded-xl"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold text-gradient">جزئیات تیکت</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card className="gradient-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold">{ticket.ticket_number}</h2>
                        <Badge variant={TICKET_STATUS_COLORS[ticket.status] as any}>
                          {TICKET_STATUS_LABELS[ticket.status]}
                        </Badge>
                        <Badge variant={PRIORITY_COLORS[ticket.priority] as any}>
                          {PRIORITY_LABELS[ticket.priority]}
                        </Badge>
                      </div>
                      <h3 className="text-xl mb-4">{ticket.subject}</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle>اطلاعات تیکت</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">مشتری</p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${generateAvatarColor(
                          ticket.customer?.full_name
                        )}`}
                      >
                        {getInitials(ticket.customer?.full_name)}
                      </div>
                      <span className="font-medium">{ticket.customer?.full_name}</span>
                    </div>
                  </div>

                  {ticket.project && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">پروژه</p>
                      <p className="font-medium">{ticket.project.title}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">تاریخ ایجاد</p>
                    <p className="font-medium">{formatDateTime(ticket.created_at)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">وضعیت</p>
                    <Select
                      value={newStatus || ticket.status}
                      onValueChange={(value) => {
                        setNewStatus(value);
                        updateStatusMutation.mutate(value);
                      }}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">اولویت</p>
                    <Select
                      value={newPriority || ticket.priority}
                      onValueChange={(value) => {
                        setNewPriority(value);
                        updatePriorityMutation.mutate(value);
                      }}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>گفتگو ({messages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">هنوز پیامی ارسال نشده است</p>
                ) : (
                  messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender_type === "admin" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                          msg.sender_type === "admin" ? "bg-primary" : generateAvatarColor("Customer")
                        }`}
                      >
                        {msg.sender_type === "admin" ? "A" : "C"}
                      </div>
                      <div className={`flex-1 ${msg.sender_type === "admin" ? "text-right" : ""}`}>
                        <div
                          className={`inline-block p-4 rounded-2xl ${
                            msg.sender_type === "admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="پیام خود را بنویسید..."
                  className="rounded-xl"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Ctrl + Enter برای ارسال</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default TicketDetails;
