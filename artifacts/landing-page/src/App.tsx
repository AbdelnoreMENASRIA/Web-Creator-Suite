import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import RoleSelect from "@/pages/auth/role-select";
import Register from "@/pages/auth/register";
import Login from "@/pages/auth/login";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import Dashboard from "@/pages/dashboard";
import Sessions from "@/pages/sessions";
import ChoisirMode from "@/pages/choisir-mode";
import TrouverFormateur from "@/pages/trouver-formateur";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context";

const queryClient = new QueryClient();

const STANDALONE_PATHS = ["/auth", "/dashboard", "/sessions", "/choisir", "/trouver-formateur"];

function Router() {
  const [location] = useLocation();
  const isStandalone = STANDALONE_PATHS.some(p => location === p || location.startsWith(p + "/") || location.startsWith("/auth"));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark">
      {!isStandalone && <Navbar />}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sessions" component={Sessions} />
          <Route path="/choisir" component={ChoisirMode} />
          <Route path="/trouver-formateur" component={TrouverFormateur} />
          <Route path="/auth" component={RoleSelect} />
          <Route path="/auth/register" component={Register} />
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/forgot-password" component={ForgotPassword} />
          <Route path="/auth/reset-password" component={ResetPassword} />
          <Route path="/dashboard" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isStandalone && <Footer />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
