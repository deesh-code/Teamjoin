import { Home, Search as SearchIcon, User, Users, Plus, Menu, Shield, LogIn, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";

const loggedOutNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Discover", href: "/discover", icon: SearchIcon },
  { name: "Login", href: "/login", icon: LogIn },
  { name: "Signup", href: "/signup", icon: Plus },
];

const loggedInNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Discover", href: "/discover", icon: SearchIcon },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Team Management", href: "/team-management", icon: Users },
  { name: "Create TeamBox", href: "/create", icon: Plus },
  { name: "IVC", href: "/ivc", icon: Shield },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navigation = isLoggedIn ? loggedInNavigation : loggedOutNavigation;

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 w-64">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">TJ</span>
          </div>
          <span className="font-semibold text-lg group-data-[state=collapsed]:hidden">TeamJoin</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-4 rounded-lg transition-all duration-200 hover:bg-surface-elevated text-lg font-semibold ${
                      isActive
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "text-text-secondary hover:text-text-primary"
                    }`
                  }
                >
                  <item.icon className="h-10 w-10" strokeWidth={1.5} />
                  <span className="group-data-[state=collapsed]:hidden">{item.name}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {isLoggedIn && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="flex items-center gap-3 px-3 py-4 rounded-lg transition-all duration-200 hover:bg-surface-elevated text-text-secondary hover:text-text-primary text-lg font-semibold">
                <LogOut className="h-10 w-10" strokeWidth={1.5} />
                <span className="group-data-[state=collapsed]:hidden">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-2 mt-auto">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}