import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("crm_customers")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const [formData, setFormData] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    company: customer?.company || "",
    address: customer?.address || "",
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("crm_customers")
        .update(formData)
        .eq("id", customer?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
      toast({ title: "پروفایل با موفقیت بهروزرسانی شد" });
      setIsEditing(false);
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">پروفایل من</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "لغو" : "ویرایش"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات شخصی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">نام</label>
            <Input
              value={isEditing ? formData.name : customer?.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm font-medium">ایمیل</label>
            <Input
              value={isEditing ? formData.email : customer?.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm font-medium">تلفن</label>
            <Input
              value={isEditing ? formData.phone : customer?.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm font-medium">شرکت</label>
            <Input
              value={isEditing ? formData.company : customer?.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="text-sm font-medium">آدرس</label>
            <Textarea
              value={isEditing ? formData.address : customer?.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              rows={3}
            />
          </div>
          {isEditing && (
            <Button onClick={() => updateProfile.mutate()}>
              ذخیره تغییرات
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
