import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Check, Loader2, Mail, Phone } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const ContactManager = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "علامت‌گذاری شد" });
      loadSubmissions();
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">پیام‌های تماس</h2>
        <div className="text-sm text-muted-foreground">
          {submissions.filter((s) => !s.is_read).length} خوانده نشده
        </div>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card
            key={submission.id}
            className={submission.is_read ? "opacity-60" : ""}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{submission.name}</span>
                    {!submission.is_read && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        جدید
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-normal text-muted-foreground flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {submission.email}
                    </div>
                    {submission.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {submission.phone}
                      </div>
                    )}
                  </div>
                </div>
                {!submission.is_read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsRead(submission.id)}
                  >
                    <Check className="h-4 w-4 ml-1" />
                    خوانده شد
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {new Date(submission.created_at).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};