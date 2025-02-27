import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Guides from "@/pages/guides";
import GuidePage from "@/pages/guide";
import Professionals from "@/pages/professionals";
import Shops from "@/pages/shops";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/guides" component={Guides} />
      <Route path="/guides/:id" component={GuidePage} />
      <Route path="/professionals" component={Professionals} />
      <Route path="/shops" component={Shops} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;