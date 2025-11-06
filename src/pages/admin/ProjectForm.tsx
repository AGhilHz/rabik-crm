import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createProject, updateProject, getProjectById, getCustomers } from "@/lib/crm-helpers";
import { supabase } from "@/integrations/supabase/client";
import { PROJECT_STATUS_LABELS, PRIORITY_LABELS } from "@/lib/crm-constants";
import { ArrowRight, Save } from "lucide-react";
import { useEffect } from "react";

const projectSchema = z.object({
  customer_id: z.string().min(1, "انتخاب مشتری الزامی است"),
  service_id: z.string().optional(),
  title: z.string().min(3, "عنوان باید حداقل 3 کاراکتر باشد"),
  description: z.string().optional(),
  status: z.enum(["draft", "in_progress", "review", "completed", "cancelled", "on_hold"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  agreed_price: z.string().optional(),
  progress: z.string().optional(),
  notes: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: project } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id!),
    enabled: isEdit,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true);
      return data || [];
    },
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      customer_id: "",
      service_id: "",
      title: "",
      description: "",
      status: "draft",
      priority: "medium",
      start_date: "",
      due_date: "",
      agreed_price: "",
      progress: "0",
      notes: "",
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        customer_id: project.customer_id,
        service_id: project.service_id || "",
        title: project.title,
        description: project.description || "",
        status: project.status,
        priority: project.priority,
        start_date: project.start_date || "",
        due_date: project.due_date || "",
        agreed_price: project.agreed_price?.toString() || "",
        progress: project.progress?.toString() || "0",
        notes: project.notes || "",
      });
    }
  }, [project, form]);

  const createMutation = useMutation({
    mutationFn: (data: any) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "پروژه با موفقیت ایجاد شد" });
      navigate("/admin/projects");
    },
    onError: () => {
      toast({ title: "خطا در ایجاد پروژه", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateProject(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({ title: "پروژه با موفقیت بهروزرسانی شد" });
      navigate(`/admin/projects/${id}`);
    },
    onError: () => {
      toast({ title: "خطا در بهروزرسانی پروژه", variant: "destructive" });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    const payload = {
      ...data,
      agreed_price: data.agreed_price ? parseInt(data.agreed_price) : null,
      progress: data.progress ? parseInt(data.progress) : 0,
      service_id: data.service_id || null,
      start_date: data.start_date || null,
      due_date: data.due_date || null,
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Layout>
      <SEOHead
        title={`${isEdit ? "ویرایش" : "افزودن"} پروژه | پنل ادمین رابیک`}
        description="فرم مدیریت پروژه"
        canonical={`https://rabik.ir/admin/projects/${isEdit ? id : "new"}`}
      />

      <section className="min-h-[calc(100vh-20rem)] py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/projects")}
              className="rounded-xl"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gradient">
                {isEdit ? "ویرایش پروژه" : "پروژه جدید"}
              </h1>
              <p className="text-muted-foreground">اطلاعات پروژه را وارد کنید</p>
            </div>
          </div>

          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>اطلاعات پروژه</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customer_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>مشتری *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="انتخاب مشتری" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {customers.map((customer: any) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  {customer.full_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="service_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>خدمت</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="انتخاب خدمت" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map((service: any) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان پروژه *</FormLabel>
                        <FormControl>
                          <Input {...field} className="rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>توضیحات</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="rounded-xl" rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وضعیت *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اولویت *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تاریخ شروع</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" className="rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="due_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تاریخ تحویل</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" className="rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreed_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>قیمت توافقی (تومان)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="progress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>درصد پیشرفت (0-100)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="0" max="100" className="rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>یادداشتها</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="rounded-xl" rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="rounded-xl"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      <Save className="h-4 w-4 ml-2" />
                      {isEdit ? "بهروزرسانی" : "ذخیره"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => navigate("/admin/projects")}
                    >
                      انصراف
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectForm;
