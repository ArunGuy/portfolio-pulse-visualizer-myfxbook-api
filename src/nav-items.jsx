import { HomeIcon, BarChart2, Mail } from "lucide-react";
import Index from "./pages/Index.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import ContactUs from "./pages/ContactUs.jsx";

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
  {
    title: "Contact Us",
    to: "/contact",
    icon: <Mail className="h-4 w-4" />,
    page: <ContactUs />,
  },
];