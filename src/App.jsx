import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { navItems } from "./nav-items";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./components/theme-provider";

const queryClient = new QueryClient();

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const { theme, setTheme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 shadow-md">
              <div className="container mx-auto flex justify-between items-center">
                <ul className="flex space-x-4">
                  {navItems.map(({ title, to, icon }) => (
                    <li key={to}>
                      <Link to={to} className="flex items-center space-x-2 hover:text-gray-600 dark:hover:text-gray-300">
                        {icon}
                        <span>{title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                  {loggedInUser && <span>{loggedInUser}</span>}
                </div>
              </div>
            </nav>
            <main className="flex-grow container mx-auto p-4">
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