
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  Home, 
  Users, 
  User, 
  Book, 
  Calendar, 
  QrCode,
  LogOut 
} from 'lucide-react';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isSidebarExpanded: boolean;
};

const NavItem = ({ to, icon: Icon, label, isActive, isSidebarExpanded }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      {isSidebarExpanded && <span>{label}</span>}
    </Link>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/students', icon: Users, label: 'Siswa' },
    { path: '/teachers', icon: User, label: 'Guru' },
    { path: '/subjects', icon: Book, label: 'Mata Pelajaran' },
    { path: '/schedules', icon: Calendar, label: 'Jadwal' },
    { path: '/qr-generator', icon: QrCode, label: 'QR Code' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isSidebarExpanded ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {isSidebarExpanded && (
            <div className="text-lg font-bold text-sidebar-foreground">
              HadirKu
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
              isSidebarExpanded={isSidebarExpanded}
            />
          ))}
        </nav>
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              !isSidebarExpanded && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {isSidebarExpanded && "Keluar"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <div className="h-16 border-b px-6 flex items-center bg-white shadow-sm">
          <h1 className="text-lg font-medium">
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
