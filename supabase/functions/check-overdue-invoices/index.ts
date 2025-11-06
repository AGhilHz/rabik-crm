import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: invoices } = await supabaseClient
      .from("crm_invoices")
      .select("*, crm_customers(name, email, user_id)")
      .eq("status", "pending")
      .lt("due_date", new Date().toISOString());

    for (const invoice of invoices || []) {
      await supabaseClient.from("crm_notifications").insert({
        user_id: invoice.crm_customers?.user_id,
        title: "فاکتور سررسید گذشته",
        message: `فاکتور #${invoice.invoice_number} سررسید گذشته است`,
        type: "warning",
      });

      await supabaseClient
        .from("crm_invoices")
        .update({ status: "overdue" })
        .eq("id", invoice.id);
    }

    return new Response(
      JSON.stringify({ success: true, count: invoices?.length || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
