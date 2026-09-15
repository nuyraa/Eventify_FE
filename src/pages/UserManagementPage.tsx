import React, { useState, useEffect } from 'react';
import { eventifyApi } from '../services/api';
import type { User, UserStatus } from '../types';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Trash2,
  Download,
  Eye,
  Ticket,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await eventifyApi.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Gagal mengambil data user:', err);
    }
  };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
      await eventifyApi.updateUser(userId, { status: newStatus });
      showNotif(`Status akun user diubah menjadi ${newStatus.toUpperCase()}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Yakin ingin menghapus permanen akun "${userName}"?`)) return;
    try {
      await eventifyApi.deleteUser(userId);
    } catch (err) {
      console.error(err);
    } finally {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showNotif(`Akun "${userName}" telah dihapus.`);
    }
  };

  const exportUsersToCSV = () => {
    const headers = ['ID', 'Nama', 'Email', 'Telepon', 'Role', 'Status', 'Tanggal Daftar'];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.phone || '-',
      u.role,
      u.status || 'active',
      new Date(u.created_at).toLocaleDateString('id-ID'),
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Eventify_Users_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 font-jakarta">
      {/* Header Notification */}
      {notification && (
        <div className="p-4 bg-neo-mint border-3 border-neo-dark rounded-xl shadow-neo font-space font-extrabold text-sm flex items-center justify-between animate-bounce">
          <span>{notification}</span>
          <CheckCircle2 size={20} />
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 bg-neo-yellow rounded-2xl border-3 border-neo-dark shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-extrabold text-2xl md:text-3xl text-neo-dark flex items-center gap-3">
            <Users size={32} /> Manajemen User & Peserta
          </h1>
          <p className="font-jakarta font-semibold text-xs md:text-sm text-neo-dark/80 mt-1">
            Direktori peserta & customer platform, kelola status akun (suspend/blokir), dan riset riwayat partisipasi event.
          </p>
        </div>

        <Button onClick={exportUsersToCSV} variant="secondary" icon={<Download size={18} />} className="shrink-0">
          Export Data CSV
        </Button>
      </div>

      {/* Filters & Search Controls */}
      <Card className="bg-white border-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Cari berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
          />
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-neo-dark shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border-2.5 border-neo-dark font-space font-bold text-xs shadow-neo-sm focus:outline-none"
            >
              <option value="all">Semua Role</option>
              <option value="customer">Customer / Peserta</option>
              <option value="organizer">Panitia / Organizer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border-2.5 border-neo-dark font-space font-bold text-xs shadow-neo-sm focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active (Aktif)</option>
              <option value="suspended">Suspended (Ditangguhkan)</option>
              <option value="blocked">Blocked (Dibidik/Blokir)</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <Table headers={['Profil User', 'No. Handphone', 'Role Sistem', 'Tanggal Registrasi', 'Status Akun', 'Aksi Kontrol']}>
          {filteredUsers.map((u) => (
            <tr key={u.id} className="hover:bg-neo-yellow/15 transition-colors">
              <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-bold text-xs">
                <p className="text-neo-dark font-extrabold">{u.name}</p>
                <p className="font-jakarta text-[11px] text-gray-500 font-semibold">{u.email}</p>
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs font-semibold">
                {u.phone || '-'}
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-extrabold text-xs uppercase">
                <Badge variant={u.role === 'admin' ? 'pink' : u.role === 'organizer' ? 'yellow' : 'mint'}>
                  {u.role}
                </Badge>
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs font-semibold">
                {new Date(u.created_at).toLocaleDateString('id-ID')}
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark text-xs">
                <Badge variant={(u.status || 'active') === 'active' ? 'mint' : 'pink'}>
                  {(u.status || 'active').toUpperCase()}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setIsDetailModalOpen(true);
                    }}
                    title="Detail Profil & Riwayat"
                    className="p-1.5 bg-white rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-neo-toska transition-all cursor-pointer"
                  >
                    <Eye size={15} />
                  </button>
                  {u.status !== 'suspended' ? (
                    <button
                      onClick={() => handleStatusChange(u.id, 'suspended')}
                      title="Suspend Akun"
                      className="p-1.5 bg-white rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-neo-yellow transition-all cursor-pointer"
                    >
                      <UserX size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(u.id, 'active')}
                      title="Aktifkan Akun"
                      className="p-1.5 bg-white rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-neo-mint transition-all cursor-pointer"
                    >
                      <UserCheck size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    title="Hapus Akun"
                    className="p-1.5 bg-neo-pink text-neo-dark rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-red-300 transition-all cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Modal Detail Profil User */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title={`Detail Profil (${selectedUser?.name})`}>
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-4 bg-neo-yellow/30 rounded-xl border-2.5 border-neo-dark space-y-2 text-xs">
              <p><strong>Nama Lengkap:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Handphone:</strong> {selectedUser.phone || '-'}</p>
              <p><strong>Role:</strong> {selectedUser.role.toUpperCase()}</p>
              <p><strong>Status Akun:</strong> {(selectedUser.status || 'active').toUpperCase()}</p>
              <p><strong>Terdaftar Sejak:</strong> {new Date(selectedUser.created_at).toLocaleString('id-ID')}</p>
            </div>

            <div>
              <h4 className="font-space font-extrabold text-sm text-neo-dark mb-2 flex items-center gap-2">
                <Ticket size={16} /> Riwayat Partisipasi & Tiket
              </h4>
              <div className="p-3 bg-white rounded-xl border-2 border-neo-dark text-xs font-semibold text-gray-600">
                • Nusantara Soundwave Music Fest 2026 (Regular Festival) - <span className="text-emerald-700 font-bold">LUNAS</span>
                <br />
                • IndoTech Summit & AI Expo 2026 (Executive VIP) - <span className="text-emerald-700 font-bold">LUNAS</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};