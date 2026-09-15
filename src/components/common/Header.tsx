import React, { useState } from 'react';
import { Menu, LogOut, ShieldAlert, Server, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSystem } from '../../context/SystemContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';
import { UserAvatar } from '../ui/UserAvatar';
import { ConfirmModal } from './ConfirmModal';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { config, apiStatus, toggleMaintenanceMode, checkApiHealth } = useSystem();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-neo-bg/90 backdrop-blur-md border-b-3 border-neo-dark px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left Section: Sidebar Toggle & API Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 bg-white rounded-xl border-2.5 border-neo-dark shadow-neo-sm lg:hidden hover:bg-neo-yellow cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu size={22} />
          </button>

          {/* API Server Status Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <button 
              onClick={checkApiHealth} 
              title="Klik untuk cek ulang status koneksi REST API"
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              {apiStatus === 'ONLINE' ? (
                <Badge variant="mint" icon={<Activity size={14} className="animate-pulse" />}>
                  API ONLINE (REST)
                </Badge>
              ) : (
                <Badge variant="yellow" icon={<Server size={14} />}>
                  MOCK ENGINE ACTIVE
                </Badge>
              )}
            </button>
          </div>
        </div>

        {/* Right Section: Mobile Maintenance Switch, Admin User, Logout */}
        <div className="flex items-center gap-4">
          {/* Quick Maintenance Toggle Header Switch */}
          <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 bg-white rounded-xl border-2.5 border-neo-dark shadow-neo-sm">
            <div className="flex items-center gap-1.5 text-xs font-space font-extrabold text-neo-dark uppercase">
              <ShieldAlert size={16} className={config.maintenance_mode ? 'text-neo-pink animate-bounce' : 'text-emerald-600'} />
              <span>Mobile App:</span>
            </div>
            <Switch
              checked={config.maintenance_mode}
              onChange={toggleMaintenanceMode}
            />
            <span className={`font-space font-extrabold text-xs px-2 py-0.5 rounded border border-neo-dark ${
              config.maintenance_mode ? 'bg-neo-pink text-neo-dark' : 'bg-neo-mint text-neo-dark'
            }`}>
              {config.maintenance_mode ? 'MAINTENANCE' : 'ONLINE'}
            </span>
          </div>

          {/* Admin Profile Initials Avatar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-xl border-2.5 border-neo-dark shadow-neo-sm">
              <UserAvatar name={user?.name || 'Administrator'} role="admin" size="sm" />
              <div className="hidden sm:block text-left">
                <p className="font-space font-extrabold text-xs text-neo-dark leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <span className="font-space font-bold text-[10px] uppercase text-emerald-800 tracking-wider">
                  ADMINISTRATOR
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="danger"
              size="sm"
              icon={<LogOut size={16} />}
              onClick={() => setShowLogoutModal(false)}
              title="Keluar dari sistem"
            >
              <span className="hidden sm:inline" onClick={() => setShowLogoutModal(true)}>Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari Web Admin Eventify?"
        confirmText="Ya, Logout"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
};
