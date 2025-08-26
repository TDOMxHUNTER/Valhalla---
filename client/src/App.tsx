import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Web3Provider } from "@/components/web3-provider";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Collection from "@/pages/collection";
import Stake from "@/pages/stake";
import Faucet from "@/pages/faucet";
import Roadmap from "@/pages/roadmap";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen text-white relative">
      {/* Background overlay for better content visibility */}
      <div className="fixed inset-0 bg-black/60 z-0"></div>
      
      <div className="relative z-10">
        <Navigation />
        <main className="pt-16">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/collection" component={Collection} />
            <Route path="/stake" component={Stake} />
            <Route path="/faucet" component={Faucet} />
            <Route path="/roadmap" component={Roadmap} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Web3Provider>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </Web3Provider>
  );
}

export default App;
