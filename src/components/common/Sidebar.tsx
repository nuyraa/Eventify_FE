import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  Ticket,
  Wallet,
  BarChart3,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    {
      label: 'Dashboard Overview',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={19} />,
      badge: 'Utama',
    },
    {
      label: 'Manajemen Panitia',
      path: '/admin/organizers',
      icon: <Building2 size={19} />,
    },
    {
      label: 'Manajemen User',
      path: '/admin/users',
      icon: <Users size={19} />,
    },
    {
      label: 'Event & Approval',
      path: '/admin/events',
      icon: <CalendarCheck size={19} />,
      badge: 'Approval',
      badgeColor: 'yellow' as const,
    },
    {
      label: 'Pendaftaran & Tiket',
      path: '/admin/tickets',
      icon: <Ticket size={19} />,
    },
    {
      label: 'Keuangan & Payout',
      path: '/admin/finance',
      icon: <Wallet size={19} />,
    },
    {
      label: 'Laporan & Analitik',
      path: '/admin/reports',
      icon: <BarChart3 size={19} />,
    },
    {
      label: 'Notifikasi & Support',
      path: '/admin/notifications',
      icon: <Bell size={19} />,
    },
    {
      label: 'Keamanan & Audit Log',
      path: '/admin/security',
      icon: <ShieldCheck size={19} />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-neo-dark/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 z-40 w-72 h-screen bg-neo-bg border-r-3 border-neo-dark transition-transform duration-300 flex flex-col justify-between p-4 lg:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="p-3 mb-5 bg-neo-yellow rounded-2xl border-3 border-neo-dark shadow-neo flex items-center justify-between">
            <img
              src="/eventify-logo.png"
              alt="Eventify Admin"
              className="h-9 object-contain drop-shadow-[1.5px_1.5px_0px_#2B2630]"
            />
            <span className="font-space font-extrabold text-[10px] bg-neo-dark text-neo-yellow px-2 py-0.5 rounded uppercase border border-neo-dark tracking-wider">
              SUPER ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pb-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2.5 border-neo-dark font-space font-extrabold text-xs transition-all ${
                    isActive
                      ? 'bg-neo-mint shadow-neo text-neo-dark translate-x-1'
                      : 'bg-white hover:bg-neo-toska/60 text-neo-dark hover:shadow-neo-sm'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant={item.badgeColor || 'yellow'}>
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="mt-4 p-3 bg-white rounded-2xl border-3 border-neo-dark shadow-neo flex items-center gap-2.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="overflow-hidden">
            <p className="font-space font-extrabold text-[11px] text-neo-dark uppercase truncate">
              Eventify Platform v2.5
            </p>
            <p className="font-jakarta text-[10px] font-semibold text-emerald-800 truncate">
              Status: System Operational
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
