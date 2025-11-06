import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusLabels = {
  open: "باز",
  in_progress: "در حال بررسی",
  resolved: "حل شده",
  closed: "بسته شده",
};

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
};

export default function CustomerTicketDetails() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: ticket, isLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("crm_tickets")
        .select("*, crm_customers(name)")
        .eq("id", id)
        .single();
      return data;
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["ticket-messages", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("crm_ticket_messages")
        .select("*")
        .eq("ticket_id", id)
        .order("created_at", { ascending: true });
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`ticket-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "crm_ticket_messages", filter: `ticket_id=eq.${id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["ticket-messages", id] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("crm_ticket_messages")
        .insert({
          ticket_id: id,
          user_id: user?.id,
          message,
          is_internal: false,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-messages"] });
      setMessage("");
      toast({ title: "پیام ارسال شد" });
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{ticket?.subject}</CardTitle>
            <div className="flex gap-2">
              <Badge>{priorityLabels[ticket?.priority as keyof typeof priorityLabels]}</Badge>
              <Badge>{statusLabels[ticket?.status as keyof typeof statusLabels]}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{ticket?.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>پیامها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages?.map((msg) => (
            <div key={msg.id} className={`p-4 rounded-lg ${msg.user_id === user?.id ? "bg-blue-50 mr-12" : "bg-gray-50 ml-12"}`}>
              <p className="text-sm">{msg.message}</p>
              <span className="text-xs text-muted-foreground mt-2 block">
                {new Date(msg.created_at).toLocaleString("fa-IR")}
              </span>
            </div>
          ))}

          <div className="flex gap-2 mt-6">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              rows={3}
            />
            <Button onClick={() => sendMessage.mutate()} disabled={!message}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
