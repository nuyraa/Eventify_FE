import React, { useState, useEffect } from 'react';
import { eventifyApi } from '../services/api';
import type { EventItem, ApprovalLog, EventCategory } from '../types';
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  AlertTriangle,
  History,
  FolderPlus,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const EventManagementPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [approvalLogs, setApprovalLogs] = useState<ApprovalLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'logs' | 'categories'>('events');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const [rejectionReason, setRejectionReason] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [evtData, catData, logData] = await Promise.all([
        eventifyApi.getEvents(),
        eventifyApi.getCategories(),
        eventifyApi.getApprovalLogs(),
      ]);
      setEvents(evtData);
      setCategories(catData);
      setApprovalLogs(logData);
    } catch (err) {
      console.error(err);
    }
  };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleApprove = async (evt: EventItem) => {
    try {
      await eventifyApi.approveEvent(evt.id, 'Budi Administrator');
      showNotif(`Event "${evt.title}" berhasil DI-APPROVE & Tayang!`);
      setIsPreviewOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal approve event');
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !rejectionReason) return;
    try {
      await eventifyApi.rejectEvent(selectedEvent.id, 'Budi Administrator', rejectionReason);
      showNotif(`Event "${selectedEvent.title}" DITOLAK dengan alasan dicatat.`);
      setIsRejectModalOpen(false);
      setIsPreviewOpen(false);
      setRejectionReason('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal menolak event');
    }
  };

  const handleForceUnpublish = async (evt: EventItem) => {
    const reason = window.prompt(`Alasan Unpublish Paksa event "${evt.title}":`);
    if (!reason) return;
    try {
      await eventifyApi.forceUnpublishEvent(evt.id, 'Budi Administrator', reason);
      showNotif(`Event "${evt.title}" telah di-UNPUBLISH paksa.`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus permanen event "${title}"?`)) return;
    try {
      await eventifyApi.deleteEvent(id);
    } catch (err) {
      console.error(err);
    } finally {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      showNotif(`Event "${title}" telah dihapus.`);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      await eventifyApi.saveCategory({ name: newCategoryName });
      showNotif(`Kategori "${newCategoryName}" berhasil ditambahkan!`);
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.organizer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || evt.status === statusFilter;
    return matchesSearch && matchesStatus;
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

      {/* Banner Header */}
      <div className="p-6 bg-neo-yellow rounded-2xl border-3 border-neo-dark shadow-neo flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-extrabold text-2xl md:text-3xl text-neo-dark flex items-center gap-3">
            <CalendarCheck size={32} /> Manajemen Event & Approval
          </h1>
          <p className="font-jakarta font-semibold text-xs md:text-sm text-neo-dark/80 mt-1">
            Moderasi pengajuan event panitia, tinjau tiket & lokasi, serta kelola tag/kategori platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCategoryModalOpen(true)} variant="secondary" icon={<FolderPlus size={16} />}>
            Kelola Kategori
          </Button>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex items-center gap-2 border-b-3 border-neo-dark pb-2">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl font-space font-extrabold text-xs uppercase transition-all cursor-pointer border-2.5 border-neo-dark ${
            activeTab === 'events' ? 'bg-neo-mint shadow-neo' : 'bg-white hover:bg-neo-bg'
          }`}
        >
          Daftar Event ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl font-space font-extrabold text-xs uppercase transition-all cursor-pointer border-2.5 border-neo-dark ${
            activeTab === 'logs' ? 'bg-neo-toska shadow-neo' : 'bg-white hover:bg-neo-bg'
          }`}
        >
          Riwayat Approval ({approvalLogs.length})
        </button>
      </div>

      {/* TAB 1: LIST EVENT */}
      {activeTab === 'events' && (
        <Card className="bg-white border-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <Input
              placeholder="Cari judul event atau nama penyelenggara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              className="max-w-md"
            />

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { label: 'Semua Status', value: 'all' },
                { label: 'Pending Approval', value: 'pending_approval' },
                { label: 'Published', value: 'published' },
                { label: 'Rejected', value: 'rejected' },
                { label: 'Draft', value: 'draft' },
                { label: 'Ended', value: 'ended' },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatusFilter(s.value)}
                  className={`px-3 py-1.5 rounded-lg border-2 border-neo-dark font-space font-extrabold text-[11px] whitespace-nowrap cursor-pointer transition-all ${
                    statusFilter === s.value ? 'bg-neo-yellow shadow-neo-sm' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Table headers={['Event & Poster', 'Penyelenggara', 'Kategori', 'Jadwal & Lokasi', 'Status Approval', 'Aksi Moderasi']}>
            {filteredEvents.map((evt, idx) => (
              <tr key={evt.id || `evt-${idx}`} className="hover:bg-neo-yellow/15 transition-colors">
                <td className="px-4 py-3 border-r-2 border-neo-dark max-w-[220px]">
                  <div className="flex items-center gap-3">
                    <img
                      src={evt.poster_url}
                      alt={evt.title}
                      className="w-12 h-12 rounded-lg border-2 border-neo-dark object-cover shrink-0 shadow-neo-sm"
                    />
                    <div>
                      <h4 className="font-space font-bold text-xs text-neo-dark line-clamp-1">{evt.title}</h4>
                      <span className="font-jakarta text-[10px] text-gray-500 font-semibold">ID: {evt.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs font-extrabold">
                  {evt.organizer_name}
                </td>
                <td className="px-4 py-3 border-r-2 border-neo-dark text-xs">
                  <Badge variant="toska">{evt.category}</Badge>
                </td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-[11px] font-semibold">
                  <p>{new Date(evt.start_date).toLocaleDateString('id-ID')}</p>
                  <p className="text-gray-500 truncate max-w-[150px]">{evt.location}</p>
                </td>
                <td className="px-4 py-3 border-r-2 border-neo-dark text-xs">
                  <Badge
                    variant={
                      evt.status === 'published'
                        ? 'mint'
                        : evt.status === 'pending_approval'
                        ? 'yellow'
                        : evt.status === 'rejected'
                        ? 'pink'
                        : 'gray'
                    }
                  >
                    {evt.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedEvent(evt);
                        setIsPreviewOpen(true);
                      }}
                      title="Pratinjau & Review"
                      className="p-1.5 bg-white rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-neo-toska transition-all cursor-pointer"
                    >
                      <Eye size={15} />
                    </button>
                    {evt.status === 'pending_approval' && (
                      <>
                        <button
                          onClick={() => handleApprove(evt)}
                          title="Approve & Publish"
                          className="p-1.5 bg-neo-mint text-neo-dark rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-emerald-300 transition-all cursor-pointer"
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEvent(evt);
                            setIsRejectModalOpen(true);
                          }}
                          title="Tolak Event"
                          className="p-1.5 bg-neo-pink text-neo-dark rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-red-300 transition-all cursor-pointer"
                        >
                          <XCircle size={15} />
                        </button>
                      </>
                    )}
                    {evt.status === 'published' && (
                      <button
                        onClick={() => handleForceUnpublish(evt)}
                        title="Force Unpublish"
                        className="p-1.5 bg-neo-yellow text-neo-dark rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-yellow-300 transition-all cursor-pointer"
                      >
                        <AlertTriangle size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(evt.id, evt.title)}
                      title="Hapus Event"
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
      )}

      {/* TAB 2: RIWAYAT APPROVAL */}
      {activeTab === 'logs' && (
        <Card className="bg-white border-3">
          <h3 className="font-space font-extrabold text-base text-neo-dark mb-4 flex items-center gap-2">
            <History size={18} /> Audit Log Keputusan Approval Admin
          </h3>
          <Table headers={['Waktu', 'Event', 'Penyelenggara', 'Keputusan Action', 'Admin Penanggung Jawab', 'Catatan / Alasan']}>
            {approvalLogs.map((log) => (
              <tr key={log.id} className="hover:bg-neo-yellow/15 transition-colors">
                <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs font-semibold">
                  {new Date(log.timestamp).toLocaleString('id-ID')}
                </td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-bold text-xs">{log.event_title}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs">{log.organizer_name}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark text-xs">
                  <Badge variant={log.action === 'approve' ? 'mint' : 'pink'}>{log.action.toUpperCase()}</Badge>
                </td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-extrabold text-xs">{log.admin_name}</td>
                <td className="px-4 py-3 font-jakarta text-xs text-gray-600">{log.reason || 'Tidak ada catatan'}</td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* MODAL REVIEW DETAIL EVENT */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title={`Review Event: ${selectedEvent?.title}`}>
        {selectedEvent && (
          <div className="space-y-4">
            <img src={selectedEvent.poster_url} alt={selectedEvent.title} className="w-full h-48 object-cover rounded-xl border-2.5 border-neo-dark" />
            <div className="p-4 bg-neo-bg rounded-xl border-2.5 border-neo-dark space-y-2 text-xs">
              <p><strong>Deskripsi:</strong> {selectedEvent.description}</p>
              <p><strong>Penyelenggara:</strong> {selectedEvent.organizer_name}</p>
              <p><strong>Jadwal:</strong> {new Date(selectedEvent.start_date).toLocaleString('id-ID')} - {new Date(selectedEvent.end_date).toLocaleString('id-ID')}</p>
              <p><strong>Lokasi:</strong> {selectedEvent.location}</p>
              <p><strong>Status Saati ini:</strong> {selectedEvent.status.toUpperCase()}</p>
            </div>

            {selectedEvent.status === 'pending_approval' && (
              <div className="flex gap-3 pt-2">
                <Button onClick={() => handleApprove(selectedEvent)} variant="primary" className="flex-1">
                  Approve & Terbitkan Sekarang
                </Button>
                <Button onClick={() => setIsRejectModalOpen(true)} variant="danger" className="flex-1">
                  Tolak Event Ini
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* MODAL ALASAN PENOLAKAN */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Form Catatan Penolakan Event">
        <form onSubmit={handleReject} className="space-y-4">
          <p className="font-jakarta text-xs font-semibold text-gray-600">
            Berikan alasan penolakan untuk dikirimkan ke panitia penyelenggara:
          </p>
          <textarea
            required
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Dokumen izin lokasi belum melampirkan surat rekomendasi kepolisian."
            className="w-full p-3 bg-white border-2.5 border-neo-dark rounded-xl font-jakarta text-xs focus:outline-none"
          />
          <Button type="submit" variant="danger" className="w-full">
            Kirim Penolakan Event
          </Button>
        </form>
      </Modal>

      {/* MODAL KELOLA KATEGORI */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Kelola Kategori Event">
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input label="Nama Kategori Baru" placeholder="e.g. Workshop Tech" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required />
          <Button type="submit" variant="primary" className="w-full">Tambah Kategori</Button>
          <div className="pt-3 border-t-2 border-neo-dark space-y-2">
            <h5 className="font-space font-extrabold text-xs text-neo-dark">Kategori Terdaftar:</h5>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <Badge key={c.id} variant="yellow">{c.name}</Badge>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};