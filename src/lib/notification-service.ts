import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id?: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read?: boolean;
  created_at?: string;
}

export const notificationService = {
  async create(notification: Omit<Notification, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("crm_notifications")
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(userId: string) {
    const { data, error } = await supabase
      .from("crm_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async markAsRead(id: string) {
    const { error } = await supabase
      .from("crm_notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) throw error;
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from("crm_notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("crm_notifications")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  subscribe(userId: string, callback: (notification: Notification) => void) {
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "crm_notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callback(payload.new as Notification)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
};
