import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Customers from "./pages/admin/Customers";
import CustomerForm from "./pages/admin/CustomerForm";
import CustomerProfile from "./pages/admin/CustomerProfile";
import Projects from "./pages/admin/Projects";
import ProjectForm from "./pages/admin/ProjectForm";
import ProjectDetails from "./pages/admin/ProjectDetails";
import Invoices from "./pages/admin/Invoices";
import InvoiceForm from "./pages/admin/InvoiceForm";
import InvoiceDetails from "./pages/admin/InvoiceDetails";
import Tickets from "./pages/admin/Tickets";
import TicketDetails from "./pages/admin/TicketDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/customers/new" element={<CustomerForm />} />
          <Route path="/admin/customers/:id" element={<CustomerProfile />} />
          <Route path="/admin/customers/:id/edit" element={<CustomerForm />} />
          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/admin/projects/new" element={<ProjectForm />} />
          <Route path="/admin/projects/:id" element={<ProjectDetails />} />
          <Route path="/admin/projects/:id/edit" element={<ProjectForm />} />
          <Route path="/admin/invoices" element={<Invoices />} />
          <Route path="/admin/invoices/new" element={<InvoiceForm />} />
          <Route path="/admin/invoices/:id" element={<InvoiceDetails />} />
          <Route path="/admin/tickets" element={<Tickets />} />
          <Route path="/admin/tickets/:id" element={<TicketDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
