import { HomeIcon, BarChart2 } from "lucide-react";
import Index from "./pages/Index.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Portfolio",
    to: "/portfolio",
    icon: <BarChart2 className="h-4 w-4" />,
    page: <PortfolioPage />,
  },
];
