import React, { useState, useEffect } from 'react';
import { eventifyApi } from '../services/api';
import type { Participant, EventItem } from '../types';
import {
  Ticket,
  Search,
  Download,
  QrCode,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';

export const ParticipantTicketPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ptData, evtData] = await Promise.all([
        eventifyApi.getParticipants(),
        eventifyApi.getEvents(),
      ]);
      setParticipants(ptData);
      setEvents(evtData);
    } catch (err) {
      console.error(err);
    }
  };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleManualCheckIn = async (pt: Participant) => {
    try {
      await eventifyApi.updateCheckIn(pt.id);
      showNotif(`Manual Check-in berhasil untuk peserta ${pt.user_name}!`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const exportParticipantsCSV = () => {
    const headers = ['ID', 'Nama Peserta', 'Email', 'Event', 'Tier Tiket', 'Status', 'Waktu Check-in'];
    const rows = filteredParticipants.map((p) => [
      p.id,
      `"${p.user_name}"`,
      p.user_email,
      `"${p.event_title}"`,
      `"${p.ticket_tier_name}"`,
      p.registration_status,
      p.check_in_time ? new Date(p.check_in_time).toLocaleString('id-ID') : '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Eventify_Participants_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.event_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEventId === 'all' || p.event_id === selectedEventId;
    const matchesStatus = statusFilter === 'all' || p.registration_status === statusFilter;
    return matchesSearch && matchesEvent && matchesStatus;
  });

  const checkedInCount = filteredParticipants.filter((p) => p.registration_status === 'checked_in').length;
  const totalCount = filteredParticipants.length || 1;
  const checkInRate = Math.round((checkedInCount / totalCount) * 100);

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
      <div className="p-6 bg-neo-toska rounded-2xl border-3 border-neo-dark shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-extrabold text-2xl md:text-3xl text-neo-dark flex items-center gap-3">
            <Ticket size={32} /> Pendaftaran & Monitoring Tiket
          </h1>
          <p className="font-jakarta font-semibold text-xs md:text-sm text-neo-dark/80 mt-1">
            Monitoring pendaftaran peserta lintas event, gate check-in venue real-time, dan ekspor data peserta.
          </p>
        </div>

        <Button onClick={exportParticipantsCSV} variant="secondary" icon={<Download size={18} />} className="shrink-0">
          Export Peserta CSV
        </Button>
      </div>

      {/* Realtime Check-in Widget */}
      <Card className="bg-neo-yellow/30 border-3 border-neo-dark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neo-yellow rounded-xl border-2.5 border-neo-dark shadow-neo-sm">
              <QrCode size={28} className="text-neo-dark" />
            </div>
            <div>
              <h3 className="font-space font-extrabold text-base text-neo-dark">
                Monitoring Gate Check-in Real-time
              </h3>
              <p className="font-jakarta text-xs font-semibold text-gray-600">
                {checkedInCount} dari {totalCount} Peserta Sudah Check-in di Venue ({checkInRate}%)
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64 bg-white p-2.5 rounded-xl border-2 border-neo-dark shadow-neo-sm">
            <div className="flex justify-between font-space font-extrabold text-xs mb-1">
              <span>Kehadiran Venue</span>
              <span>{checkInRate}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full border border-neo-dark overflow-hidden">
              <div className="h-full bg-neo-mint transition-all" style={{ width: `${checkInRate}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Filters & Directory Table */}
      <Card className="bg-white border-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Cari nama peserta, email, atau event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
          />

          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="p-2.5 bg-white rounded-xl border-2.5 border-neo-dark font-space font-bold text-xs shadow-neo-sm focus:outline-none"
          >
            <option value="all">Semua Event</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 bg-white rounded-xl border-2.5 border-neo-dark font-space font-bold text-xs shadow-neo-sm focus:outline-none"
          >
            <option value="all">Semua Status Check-in</option>
            <option value="checked_in">Checked-in (Sudah Masuk)</option>
            <option value="confirmed">Confirmed (Belum Scan)</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Directory Table */}
        <Table headers={['Nama Peserta', 'Event Terdaftar', 'Kategori Tier Tiket', 'Tanggal Daftar', 'Status Check-in', 'Aksi Gate']}>
          {filteredParticipants.map((p) => (
            <tr key={p.id} className="hover:bg-neo-yellow/15 transition-colors">
              <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-bold text-xs">
                <p className="text-neo-dark font-extrabold">{p.user_name}</p>
                <p className="font-jakarta text-[11px] text-gray-500 font-semibold">{p.user_email}</p>
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-bold text-xs">
                {p.event_title}
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark text-xs">
                <Badge variant="yellow">{p.ticket_tier_name}</Badge>
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs font-semibold">
                {new Date(p.registered_at).toLocaleDateString('id-ID')}
              </td>
              <td className="px-4 py-3 border-r-2 border-neo-dark text-xs">
                <Badge variant={p.registration_status === 'checked_in' ? 'mint' : 'pink'}>
                  {p.registration_status.toUpperCase()}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {p.registration_status !== 'checked_in' ? (
                  <Button onClick={() => handleManualCheckIn(p)} variant="primary" size="sm">
                    Scan Manual
                  </Button>
                ) : (
                  <span className="font-jakarta text-[11px] font-extrabold text-emerald-800">
                    Masuk: {new Date(p.check_in_time || '').toLocaleTimeString('id-ID')}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};
