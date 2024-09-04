import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { navItems } from "./nav-items";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <nav className="bg-card text-card-foreground p-4 shadow-md">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-primary">Mhagutsfund</span>
                  <ul className="flex space-x-4">
                    {navItems.map(({ title, to, icon }) => (
                      <li key={to}>
                        <Link to={to} className="flex items-center space-x-2 hover:text-primary">
                          {icon}
                          <span>{title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center space-x-4">
                  {loggedInUser && <span className="text-sm">{loggedInUser}</span>}
                </div>
              </div>
            </nav>
            <main className="flex-grow container mx-auto p-4 elegant-scrollbar">
              <Routes>
                {navItems.map(({ to, page }) => (
                  <Route key={to} path={to} element={page} />
                ))}
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;