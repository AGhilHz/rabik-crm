import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createInvoice, createInvoiceItem, getInvoiceById, getCustomers, getProjectsByCustomer } from "@/lib/crm-helpers";
import { INVOICE_STATUS_LABELS, DEFAULT_INVOICE_DUE_DAYS, TAX_RATE } from "@/lib/crm-constants";
import { calculateTax, addDays, toISODate } from "@/lib/crm-utils";
import { ArrowRight, Save, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const invoiceItemSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  description: z.string().optional(),
  quantity: z.string().min(1, "تعداد الزامی است"),
  unit_price: z.string().min(1, "قیمت واحد الزامی است"),
});

const invoiceSchema = z.object({
  customer_id: z.string().min(1, "انتخاب مشتری الزامی است"),
  project_id: z.string().optional(),
  issue_date: z.string().min(1, "تاریخ صدور الزامی است"),
  due_date: z.string().min(1, "تاریخ سررسید الزامی است"),
  discount: z.string().optional(),
  status: z.enum(["draft", "unpaid", "paid", "overdue", "cancelled"]),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "حداقل یک آیتم الزامی است"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["customer-projects", selectedCustomer],
    queryFn: () => getProjectsByCustomer(selectedCustomer),
    enabled: !!selectedCustomer,
  });

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customer_id: "",
      project_id: "",
      issue_date: toISODate(new Date()),
      due_date: toISODate(addDays(new Date(), DEFAULT_INVOICE_DUE_DAYS)),
      discount: "0",
      status: "draft",
      notes: "",
      items: [{ title: "", description: "", quantity: "1", unit_price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchItems = form.watch("items");
  const watchDiscount = form.watch("discount");

  const subtotal = watchItems.reduce((sum, item) => {
    const qty = parseInt(item.quantity) || 0;
    const price = parseInt(item.unit_price) || 0;
    return sum + qty * price;
  }, 0);

  const discount = parseInt(watchDiscount) || 0;
  const tax = calculateTax(subtotal - discount);
  const total = subtotal - discount + tax;

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const invoice = await createInvoice({
        customer_id: data.customer_id,
        project_id: data.project_id || null,
        issue_date: data.issue_date,
        due_date: data.due_date,
        subtotal,
        discount,
        tax,
        total,
        status: data.status,
        notes: data.notes,
      });

      for (const item of data.items) {
        const qty = parseInt(item.quantity);
        const price = parseInt(item.unit_price);
        await createInvoiceItem({
          invoice_id: invoice.id,
          title: item.title,
          description: item.description || null,
          quantity: qty,
          unit_price: price,
          total: qty * price,
        });
      }

      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "فاکتور با موفقیت ایجاد شد" });
      navigate("/admin/invoices");
    },
    onError: () => {
      toast({ title: "خطا در ایجاد فاکتور", variant: "destructive" });
    },
  });

  const onSubmit = (data: InvoiceFormData) => {
    createMutation.mutate(data);
  };

  return (
    <Layout>
      <SEOHead
        title={`${isEdit ? "ویرایش" : "ایجاد"} فاکتور | پنل ادمین رابیک`}
        description="فرم مدیریت فاکتور"
        canonical={`https://rabik.ir/admin/invoices/${isEdit ? id : "new"}`}
      />

      <section className="min-h-[calc(100vh-20rem)] py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/invoices")}
              className="rounded-xl"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gradient">
                {isEdit ? "ویرایش فاکتور" : "فاکتور جدید"}
              </h1>
              <p className="text-muted-foreground">اطلاعات فاکتور را وارد کنید</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle>اطلاعات کلی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customer_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>مشتری *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedCustomer(value);
                            }}
                            value={field.value}
                          >
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
                      name="project_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>پروژه</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="انتخاب پروژه" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {projects.map((project: any) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.title}
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
                      name="issue_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تاریخ صدور *</FormLabel>
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
                          <FormLabel>تاریخ سررسید *</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" className="rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              {Object.entries(INVOICE_STATUS_LABELS).map(([value, label]) => (
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
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تخفیف (تومان)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>آیتمهای فاکتور</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ title: "", description: "", quantity: "1", unit_price: "" })}
                      className="rounded-xl"
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      افزودن آیتم
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-xl space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">آیتم {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name={`items.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>عنوان *</FormLabel>
                            <FormControl>
                              <Input {...field} className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>توضیحات</FormLabel>
                            <FormControl>
                              <Input {...field} className="rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>تعداد *</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" min="1" className="rounded-xl" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.unit_price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>قیمت واحد (تومان) *</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" className="rounded-xl" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="text-left">
                        <span className="text-sm text-muted-foreground">جمع: </span>
                        <span className="font-bold">
                          {((parseInt(watchItems[index]?.quantity) || 0) *
                            (parseInt(watchItems[index]?.unit_price) || 0)).toLocaleString("fa-IR")}{" "}
                          تومان
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle>خلاصه فاکتور</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span>جمع کل:</span>
                    <span className="font-bold">{subtotal.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تخفیف:</span>
                    <span className="text-destructive">-{discount.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مالیات ({(TAX_RATE * 100).toFixed(0)}%):</span>
                    <span>+{tax.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl">
                    <span className="font-bold">مبلغ نهایی:</span>
                    <span className="font-bold text-primary">{total.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="rounded-xl"
                  disabled={createMutation.isPending}
                >
                  <Save className="h-4 w-4 ml-2" />
                  ذخیره فاکتور
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => navigate("/admin/invoices")}
                >
                  انصراف
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </Layout>
  );
};

export default InvoiceForm;
