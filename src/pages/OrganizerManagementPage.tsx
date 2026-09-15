import React, { useState, useEffect } from 'react';
import { eventifyApi } from '../services/api';
import type { User } from '../types';
import {
  Building2,
  Plus,
  Search,
  KeyRound,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const OrganizerManagementPage: React.FC = () => {
  const [organizers, setOrganizers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const allUsers = await eventifyApi.getUsers();
      setOrganizers(allUsers.filter((u) => u.role === 'organizer'));
    } catch (err) {
      console.error(err);
    }
  };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    try {
      await eventifyApi.createUser({
        name,
        email,
        phone,
        organization: organization || 'Instansi Panitia',
        role: 'organizer',
      });
      showNotif(`Berhasil menambahkan akun panitia "${name}"!`);
      setIsAddModalOpen(false);
      resetForm();
      fetchOrganizers();
    } catch (err: any) {
      alert(err.message || 'Gagal membuat panitia');
    }
  };

  const handleEditOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await eventifyApi.updateUser(selectedUser.id, {
        name,
        email,
        phone,
        organization,
      });
      showNotif(`Data panitia "${name}" berhasil diperbarui!`);
      setIsEditModalOpen(false);
      fetchOrganizers();
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui panitia');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !selectedUser) return;
    showNotif(`Password akun panitia "${selectedUser.name}" telah di-reset!`);
    setIsResetPassModalOpen(false);
    setNewPassword('');
  };

  const toggleStatus = async (user: User) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await eventifyApi.updateUser(user.id, { status: nextStatus });
      showNotif(`Status panitia ${user.name} diubah menjadi ${nextStatus.toUpperCase()}`);
      fetchOrganizers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Hapus permanen akun panitia "${name}"?`)) return;
    try {
      await eventifyApi.deleteUser(id);
    } catch (err) {
      console.error(err);
    } finally {
      setOrganizers((prev) => prev.filter((o) => o.id !== id));
      showNotif(`Akun panitia "${name}" telah dihapus.`);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setOrganization('');
  };

  const openEditModal = (u: User) => {
    setSelectedUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone);
    setOrganization(u.organization || '');
    setIsEditModalOpen(true);
  };

  const openResetPassModal = (u: User) => {
    setSelectedUser(u);
    setNewPassword('');
    setIsResetPassModalOpen(true);
  };

  const filteredOrganizers = organizers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.organization && u.organization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <div className="p-6 bg-neo-toska/80 rounded-2xl border-3 border-neo-dark shadow-neo flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-extrabold text-2xl md:text-3xl text-neo-dark flex items-center gap-3">
            <Building2 size={32} /> Manajemen Instansi Panitia
          </h1>
          <p className="font-jakarta font-semibold text-xs md:text-sm text-neo-dark/80 mt-1">
            Kelola akun penyelenggara event, instansi yang diwakili, hak akses, dan riset riwayat aktivitas.
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          variant="primary"
          icon={<Plus size={18} />}
          className="shrink-0"
        >
          Tambah Akun Panitia
        </Button>
      </div>

      {/* Filters & Directory Table */}
      <Card className="bg-white border-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <Input
            placeholder="Cari nama panitia, email, atau organisasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="max-w-md"
          />
          <div className="font-space font-extrabold text-xs text-gray-600">
            Total Panitia: <strong>{filteredOrganizers.length} Instansi</strong>
          </div>
        </div>

        <Table
          headers={[
            'Informasi Panitia',
            'Organisasi / Instansi',
            'No. Handphone',
            'Event Dikelola',
            'Status Akun',
            'Aksi Admin',
          ]}
        >
          {filteredOrganizers.map((u) => (
            <tr key={u.id} className="hover:bg-neo-yellow/15 transition-colors">
              <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-bold text-xs">
                <p className="text-neo-dark font-extrabold">{u.name}</p>
                <p className="font-jakarta text-[11px] text-gray-500 font-semibold">{u.email}</p>
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta font-extrabold text-xs">
                <Badge variant="yellow">{u.organization || 'Instansi Umum'}</Badge>
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs font-semibold">
                {u.phone || '-'}
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-black text-xs text-center">
                {u.managed_events_count || 2} Event
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark text-xs">
                <Badge variant={u.status === 'active' ? 'mint' : 'pink'}>
                  {u.status ? u.status.toUpperCase() : 'ACTIVE'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(u)}
                    title="Edit Panitia"
                    className="p-1.5 bg-white rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-neo-yellow transition-all cursor-pointer"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => openResetPassModal(u)}
                    title="Reset Password"
                    className="p-1.5 bg-white rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-neo-toska transition-all cursor-pointer"
                  >
                    <KeyRound size={15} />
                  </button>
                  <button
                    onClick={() => toggleStatus(u)}
                    title={u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    className="p-1.5 bg-white rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-neo-pink transition-all cursor-pointer"
                  >
                    {u.status === 'active' ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                  </button>
                  <button
                    onClick={() => handleDelete(u.id, u.name)}
                    title="Hapus Permanent"
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

      {/* Modal Tambah Panitia */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Akun Panitia Baru">
        <form onSubmit={handleAddOrganizer} className="space-y-4">
          <Input label="Nama Penanggung Jawab" placeholder="e.g. Siti Rahma" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Resmi Panitia" type="email" placeholder="e.g. siti@soundwave.co.id" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="No. Handphone / WhatsApp" placeholder="e.g. 081234567890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="Organisasi / Nama Instansi" placeholder="e.g. Soundwave Indonesia" value={organization} onChange={(e) => setOrganization(e.target.value)} required />
          <Button type="submit" variant="primary" className="w-full">Simpan & Buat Akun</Button>
        </form>
      </Modal>

      {/* Modal Edit Panitia */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Data Panitia">
        <form onSubmit={handleEditOrganizer} className="space-y-4">
          <Input label="Nama Penanggung Jawab" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Official" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="No. Handphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Nama Instansi" value={organization} onChange={(e) => setOrganization(e.target.value)} />
          <Button type="submit" variant="primary" className="w-full">Update Data Panitia</Button>
        </form>
      </Modal>

      {/* Modal Reset Password */}
      <Modal isOpen={isResetPassModalOpen} onClose={() => setIsResetPassModalOpen(false)} title={`Reset Password (${selectedUser?.name})`}>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="font-jakarta text-xs font-semibold text-gray-600">
            Masukkan password baru untuk akun panitia <strong>{selectedUser?.email}</strong>.
          </p>
          <Input label="Password Baru" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <Button type="submit" variant="secondary" className="w-full">Reset Password Sekarang</Button>
        </form>
      </Modal>
    </div>
  );
};
