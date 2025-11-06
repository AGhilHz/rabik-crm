import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowRight, Edit, Trash2, User, Calendar, DollarSign, Flag, FileText } from "lucide-react";
import { getProjectById, deleteProject } from "@/lib/crm-helpers";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from "@/lib/crm-constants";
import { formatDate, formatCurrency, getInitials, generateAvatarColor } from "@/lib/crm-utils";
import { toast } from "@/hooks/use-toast";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id!),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "پروژه با موفقیت حذف شد" });
      navigate("/admin/projects");
    },
    onError: () => {
      toast({ title: "خطا در حذف پروژه", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
          <p>پروژه یافت نشد</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${project.title} | پنل ادمین رابیک`}
        description={`جزئیات پروژه ${project.title}`}
        canonical={`https://rabik.ir/admin/projects/${id}`}
      />

      <section className="min-h-[calc(100vh-20rem)] py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/projects")}
              className="rounded-xl"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold text-gradient">جزئیات پروژه</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="gradient-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={PROJECT_STATUS_COLORS[project.status] as any}>
                          {PROJECT_STATUS_LABELS[project.status]}
                        </Badge>
                        <Badge variant={PRIORITY_COLORS[project.priority] as any}>
                          {PRIORITY_LABELS[project.priority]}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/admin/projects/${id}/edit`}>
                        <Button size="icon" className="rounded-xl">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="rounded-xl">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف پروژه</AlertDialogTitle>
                            <AlertDialogDescription>
                              آیا مطمئن هستید؟ این عملیات قابل بازگشت نیست.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>انصراف</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate()}>
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">توضیحات:</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">پیشرفت پروژه:</h3>
                      <span className="text-2xl font-bold text-primary">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-3" />
                  </div>

                  {project.notes && (
                    <div>
                      <h3 className="font-semibold mb-2">یادداشتها:</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {project.customer && (
                <Card className="gradient-card">
                  <CardHeader>
                    <CardTitle>مشتری</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/admin/customers/${project.customer.id}`}>
                      <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-all">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${generateAvatarColor(
                            project.customer.full_name
                          )}`}
                        >
                          {getInitials(project.customer.full_name)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{project.customer.full_name}</h4>
                          <p className="text-sm text-muted-foreground">{project.customer.email}</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle>اطلاعات کلیدی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.service && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">خدمت</p>
                        <p className="font-medium">{project.service.title}</p>
                      </div>
                    </div>
                  )}

                  {project.agreed_price && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">قیمت توافقی</p>
                        <p className="font-medium">{formatCurrency(project.agreed_price)}</p>
                      </div>
                    </div>
                  )}

                  {project.start_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">تاریخ شروع</p>
                        <p className="font-medium">{formatDate(project.start_date)}</p>
                      </div>
                    </div>
                  )}

                  {project.due_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">تاریخ تحویل</p>
                        <p className="font-medium">{formatDate(project.due_date)}</p>
                      </div>
                    </div>
                  )}

                  {project.completed_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">تاریخ تکمیل</p>
                        <p className="font-medium">{formatDate(project.completed_date)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle>تاریخچه</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">ایجاد شده</p>
                    <p className="font-medium">{formatDate(project.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">آخرین بهروزرسانی</p>
                    <p className="font-medium">{formatDate(project.updated_at)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetails;
