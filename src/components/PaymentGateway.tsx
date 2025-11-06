import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/crm-utils";
import { PAYMENT_METHOD_LABELS } from "@/lib/crm-constants";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPayment, updateInvoice } from "@/lib/crm-helpers";

interface PaymentGatewayProps {
  invoice: any;
}

export const PaymentGateway = ({ invoice }: PaymentGatewayProps) => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [trackingCode, setTrackingCode] = useState("");
  const queryClient = useQueryClient();

  const paymentMutation = useMutation({
    mutationFn: async () => {
      // ثبت پرداخت
      await createPayment({
        invoice_id: invoice.id,
        amount: invoice.total,
        payment_method: paymentMethod,
        tracking_code: trackingCode || null,
        status: "success",
        paid_at: new Date().toISOString(),
      });

      // بهروزرسانی وضعیت فاکتور
      await updateInvoice(invoice.id, {
        status: "paid",
        paid_date: new Date().toISOString().split("T")[0],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", invoice.id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ 
        title: "پرداخت موفق", 
        description: "پرداخت با موفقیت ثبت شد.",
      });
      setOpen(false);
      setTrackingCode("");
    },
    onError: () => {
      toast({ 
        title: "خطا در ثبت پرداخت", 
        variant: "destructive",
      });
    },
  });

  const handleZarinpalPayment = () => {
    // در اینجا باید API زرینپال را فراخوانی کنید
    toast({
      title: "درگاه پرداخت",
      description: "یکپارچهسازی با زرینپال در حال توسعه است.",
    });
  };

  const handleManualPayment = () => {
    if (!trackingCode && paymentMethod !== "cash") {
      toast({
        title: "کد پیگیری الزامی است",
        variant: "destructive",
      });
      return;
    }
    paymentMutation.mutate();
  };

  if (invoice.status === "paid") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl w-full">
          <CreditCard className="h-4 w-4 ml-2" />
          ثبت پرداخت
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ثبت پرداخت فاکتور</DialogTitle>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">مبلغ قابل پرداخت:</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div>
              <Label>روش پرداخت</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="rounded-xl mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {paymentMethod !== "cash" && (
              <div>
                <Label>کد پیگیری / شماره تراکنش</Label>
                <Input
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="کد پیگیری را وارد کنید"
                  className="rounded-xl mt-2"
                />
              </div>
            )}

            <div className="space-y-2 pt-4">
              {paymentMethod === "online" && (
                <Button
                  onClick={handleZarinpalPayment}
                  className="w-full rounded-xl"
                  variant="default"
                >
                  پرداخت آنلاین با زرینپال
                </Button>
              )}
              
              <Button
                onClick={handleManualPayment}
                className="w-full rounded-xl"
                variant="outline"
                disabled={paymentMutation.isPending}
              >
                {paymentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    در حال ثبت...
                  </>
                ) : (
                  "ثبت پرداخت دستی"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
