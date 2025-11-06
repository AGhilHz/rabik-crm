import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, Clock, CheckCircle2 } from "lucide-react";
import { getProjects } from "@/lib/crm-helpers";
import { PROJECT_STATUS, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from "@/lib/crm-constants";
import { formatDate, formatCurrency, getInitials, generateAvatarColor } from "@/lib/crm-utils";
import { Link } from "react-router-dom";

const Projects = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const columns = [
    { id: PROJECT_STATUS.DRAFT, title: "پیشنویس", icon: Briefcase },
    { id: PROJECT_STATUS.IN_PROGRESS, title: "در حال انجام", icon: Clock },
    { id: PROJECT_STATUS.REVIEW, title: "بررسی", icon: Clock },
    { id: PROJECT_STATUS.COMPLETED, title: "تکمیل شده", icon: CheckCircle2 },
  ];

  const getProjectsByStatus = (status: string) => {
    return projects.filter((p: any) => p.status === status);
  };

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p: any) => p.status === PROJECT_STATUS.IN_PROGRESS).length,
    completed: projects.filter((p: any) => p.status === PROJECT_STATUS.COMPLETED).length,
  };

  return (
    <Layout>
      <SEOHead
        title="مدیریت پروژهها | پنل ادمین رابیک"
        description="مدیریت پروژهها با Kanban Board"
        canonical="https://rabik.ir/admin/projects"
      />

      <section className="min-h-[calc(100vh-20rem)] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">مدیریت پروژهها</h1>
              <p className="text-muted-foreground">مشاهده و مدیریت پروژهها</p>
            </div>
            <Link to="/admin/projects/new">
              <Button className="rounded-xl">
                <Plus className="h-4 w-4 ml-2" />
                پروژه جدید
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <Briefcase className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.total}</CardTitle>
                <p className="text-sm text-muted-foreground">کل پروژهها</p>
              </CardHeader>
            </Card>

            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <Clock className="h-8 w-8 text-warning mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.inProgress}</CardTitle>
                <p className="text-sm text-muted-foreground">در حال انجام</p>
              </CardHeader>
            </Card>

            <Card className="gradient-card">
              <CardHeader className="pb-3">
                <CheckCircle2 className="h-8 w-8 text-success mb-2" />
                <CardTitle className="text-3xl font-bold">{stats.completed}</CardTitle>
                <p className="text-sm text-muted-foreground">تکمیل شده</p>
              </CardHeader>
            </Card>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {columns.map((column) => {
                const columnProjects = getProjectsByStatus(column.id);
                const Icon = column.icon;

                return (
                  <div key={column.id}>
                    <Card className="gradient-card mb-4">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <CardTitle className="text-lg">{column.title}</CardTitle>
                          <Badge variant="secondary" className="mr-auto">
                            {columnProjects.length}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>

                    <div className="space-y-4">
                      {columnProjects.length === 0 ? (
                        <Card className="gradient-card">
                          <CardContent className="pt-6">
                            <p className="text-center text-sm text-muted-foreground">
                              پروژهای وجود ندارد
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        columnProjects.map((project: any) => (
                          <Link key={project.id} to={`/admin/projects/${project.id}`}>
                            <Card className="gradient-card hover:shadow-lg transition-all cursor-pointer">
                              <CardContent className="pt-6">
                                <div className="flex items-start gap-3 mb-3">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${generateAvatarColor(
                                      project.customer?.full_name || "P"
                                    )}`}
                                  >
                                    {getInitials(project.customer?.full_name || "پروژه")}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm mb-1 truncate">
                                      {project.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {project.customer?.full_name}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                  <Badge
                                    variant={PRIORITY_COLORS[project.priority] as any}
                                    className="text-xs"
                                  >
                                    {PRIORITY_LABELS[project.priority]}
                                  </Badge>
                                  {project.agreed_price && (
                                    <span className="text-xs font-medium">
                                      {formatCurrency(project.agreed_price)}
                                    </span>
                                  )}
                                </div>

                                {project.progress > 0 && (
                                  <div className="mb-2">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-muted-foreground">پیشرفت</span>
                                      <span className="font-medium">{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-1.5">
                                      <div
                                        className="bg-primary h-1.5 rounded-full transition-all"
                                        style={{ width: `${project.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {project.due_date && (
                                  <p className="text-xs text-muted-foreground">
                                    سررسید: {formatDate(project.due_date)}
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
