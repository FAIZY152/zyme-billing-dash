import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider, useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import Customers from "./pages/Customers";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Loading component
const Loading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-muted-foreground">Loading...</span>
    </div>
  </div>
);

// Protected App Layout
const AppLayout = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">Z</span>
            </div>
            <span className="font-semibold text-lg text-foreground">Zybill</span>
          </div>
          <MobileSidebar />
        </div>
        
        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

// Protected Route HOC
const ProtectedAppLayout = withAuthenticationRequired(AppLayout, {
  onRedirecting: () => <Loading />,
});

const App = () => (
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN || "your-auth0-domain.auth0.com"}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || "your-auth0-client-id"}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ProtectedAppLayout />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Auth0Provider>
);

export default App;
