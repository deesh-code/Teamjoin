import React from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Home, Search, User, Users, Plus, Shield } from 'lucide-react';

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Discover", href: "/discover", icon: Search },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Team Management", href: "/team-management", icon: Users },
  { name: "Create TeamBox", href: "/create", icon: Plus },
  { name: "IVC", href: "/ivc", icon: Shield },
];

export function MobileNavbar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around px-4 py-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-gray-800"
              }`
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}