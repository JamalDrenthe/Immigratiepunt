import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import HelpMee from "@/pages/HelpMee";
import Registreren from "@/pages/Registreren";
import Inloggen from "@/pages/Inloggen";
import Account from "@/pages/Account";
import OverOns from "@/pages/OverOns";
import Contact from "@/pages/Contact";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "next-themes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/over-ons" component={OverOns} />
      <Route path="/about" component={OverOns} />
      <Route path="/contact" component={Contact} />
      <Route path="/help-mee" component={HelpMee} />
      <Route path="/registreren" component={Registreren} />
      <Route path="/inloggen" component={Inloggen} />
      <Route path="/account" component={Account} />
      <Route path="/account/abonnement" component={Account} />
      <Route path="/account/prijzen" component={Account} />
      <Route path="/account/potjes" component={Account} />
      <Route path="/account/subsidies" component={Account} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
