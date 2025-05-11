import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { 
  Menu, 
  Home, 
  Users, 
  User, 
  Book, 
  Calendar, 
  QrCode,
  LogOut,
  FileSpreadsheet,
  Settings
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/sonner';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isSidebarExpanded: boolean;
  isVisible?: boolean;
};

const NavItem = ({ to, icon: Icon, label, isActive, isSidebarExpanded, isVisible = true }: NavItemProps) => {
  if (!isVisible) return null;
  
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
  const navigate = useNavigate();
  const { logout, currentUser } = useAppContext();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar');
    navigate('/login');
  };

  // Get user role for conditional rendering
  const role = currentUser?.role || '';

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard', visible: true },
    { path: '/students', icon: Users, label: 'Siswa', visible: role === 'admin' || role === 'teacher' },
    { path: '/teachers', icon: User, label: 'Guru', visible: role === 'admin' },
    { path: '/subjects', icon: Book, label: 'Mata Pelajaran', visible: role === 'admin' || role === 'teacher' },
    { path: '/schedules', icon: Calendar, label: 'Jadwal', visible: true },
    { path: '/qr-generator', icon: QrCode, label: 'QR Code', visible: role === 'admin' || role === 'teacher' },
    { path: '/attendance', icon: Calendar, label: 'Presensi', visible: true },
    { path: '/reports', icon: FileSpreadsheet, label: 'Laporan', visible: true },
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
        
        {/* User info */}
        {currentUser && isSidebarExpanded && (
          <div className="p-4 border-b border-sidebar-border">
            <p className="font-medium text-sidebar-foreground">{currentUser.name}</p>
            <p className="text-xs text-sidebar-muted-foreground capitalize">{currentUser.role}</p>
          </div>
        )}
        
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
              isSidebarExpanded={isSidebarExpanded}
              isVisible={item.visible}
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
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {isSidebarExpanded && "Keluar"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <div className="h-16 border-b px-6 flex items-center justify-between bg-white shadow-sm">
          <h1 className="text-lg font-medium">
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          {currentUser && (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                    {currentUser.name} ({currentUser.role})
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Edit Profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
