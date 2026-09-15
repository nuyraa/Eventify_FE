import React, { useState, useEffect } from 'react';
import { eventifyApi } from '../services/api';
import type { EventItem, User } from '../types';
import {
  BarChart3,
  Printer,
  PieChart as PieIcon,
  Award,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const ReportsAnalyticsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [organizers, setOrganizers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [evtData, userData] = await Promise.all([
        eventifyApi.getEvents(),
        eventifyApi.getUsers(),
      ]);
      setEvents(evtData);
      setOrganizers(userData.filter((u) => u.role === 'organizer'));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const exportReportCSV = () => {
    const headers = ['Judul Event', 'Penyelenggara', 'Kategori', 'Tiket Terjual', 'Total Quota', 'Omset Event'];
    const rows = events.map((e) => [
      `"${e.title}"`,
      `"${e.organizer_name}"`,
      e.category,
      e.sold_tickets,
      e.total_quota,
      e.sold_tickets * 150000,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Eventify_Laporan_Analitik_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categoryChartData = [
    { name: 'Musik', value: 45 },
    { name: 'Teknologi', value: 25 },
    { name: 'Design', value: 15 },
    { name: 'E-Sports', value: 15 },
  ];

  const COLORS = ['#30E3B2', '#FFDC00', '#FF80BF', '#4D96FF'];

  return (
    <div className="space-y-6 font-jakarta">
      {/* Header Banner */}
      <div className="p-6 bg-neo-toska rounded-2xl border-3 border-neo-dark shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-extrabold text-2xl md:text-3xl text-neo-dark flex items-center gap-3">
            <BarChart3 size={32} /> Laporan & Analitik Performa
          </h1>
          <p className="font-jakarta font-semibold text-xs md:text-sm text-neo-dark/80 mt-1">
            Laporan tingkat pendaftaran event, performa instansi panitia, demografi peserta, dan ekspor dokumen.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handlePrintPDF} variant="secondary" icon={<Printer size={16} />}>
            Cetak PDF
          </Button>
          <Button onClick={exportReportCSV} variant="primary" icon={<FileSpreadsheet size={16} />}>
            Export Excel / CSV
          </Button>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Performa Penjualan Tiket Per Event */}
        <Card className="bg-white border-3">
          <h3 className="font-space font-extrabold text-base text-neo-dark mb-4 flex items-center gap-2">
            <TrendingUp size={18} /> Penjualan Tiket Per Event
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={events.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" fontSize={10} tickLine={false} />
                <YAxis fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="sold_tickets" fill="#FFDC00" stroke="#2B2630" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart Demografi Kategori */}
        <Card className="bg-white border-3">
          <h3 className="font-space font-extrabold text-base text-neo-dark mb-4 flex items-center gap-2">
            <PieIcon size={18} /> Distribusi Kategori Event
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {categoryChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#2B2630" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Leaderboard Panitia Terlaris */}
      <Card className="bg-white border-3">
        <h3 className="font-space font-extrabold text-base text-neo-dark mb-4 flex items-center gap-2">
          <Award size={20} className="text-neo-dark" /> Leaderboard Panitia / Organizer Terbaik
        </h3>
        <Table headers={['Peringkat', 'Nama Instansi Panitia', 'Penanggung Jawab', 'Total Event Dikelola', 'Tingkat Kehadiran']}>
          {organizers.map((o, idx) => (
            <tr key={o.id} className="hover:bg-neo-yellow/15 transition-colors">
              <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-black text-xs text-center">#{idx + 1}</td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-extrabold text-xs">{o.organization || 'Instansi Panitia'}</td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs">{o.name}</td>
              <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-bold text-xs">{o.managed_events_count || 3} Event</td>
              <td className="px-4 py-3 text-xs">
                <Badge variant="mint">96.4% OK</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
};
