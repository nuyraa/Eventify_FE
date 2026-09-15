import React, { useState, useEffect } from 'react';
import { eventifyApi } from '../services/api';
import type { DashboardStats } from '../types';
import {
  Calendar,
  Users,
  DollarSign,
  Ticket,
  Activity,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const DashboardOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await eventifyApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-4 bg-neo-yellow border-3 border-neo-dark rounded-xl shadow-neo font-space font-extrabold flex items-center gap-3 animate-pulse">
          <Activity className="animate-spin" size={24} />
          <span>Memuat Dashboard Overview...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-neo-yellow rounded-2xl border-3 border-neo-dark shadow-neo flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-md border-2 border-neo-dark font-space font-extrabold text-xs uppercase tracking-wider mb-2">
            <Sparkles size={14} className="text-neo-dark" /> PUSAT KONTROL UTAMA
          </div>
          <h1 className="font-space font-extrabold text-2xl md:text-3xl text-neo-dark">
            Dashboard System Overview
          </h1>
          <p className="font-jakarta font-semibold text-xs md:text-sm text-neo-dark/80 mt-1">
            Monitoring performa platform, persetujuan event panitia, transaksi tiket, dan log aktivitas real-time.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-white text-neo-dark rounded-xl border-2.5 border-neo-dark shadow-neo-sm font-space font-extrabold text-xs uppercase hover:bg-neo-mint transition-all flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer"
        >
          <Activity size={16} /> Refresh Data
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Event Aktif"
          value={stats.active_events.toString()}
          subtitle={`${stats.pending_approval_events} Butuh Approval Admin`}
          icon={<Calendar size={24} />}
          badgeText="PUBLISHED"
          color="mint"
        />
        <StatCard
          title="Total Pendapatan Platform"
          value={formatRupiah(stats.total_revenue)}
          subtitle="Gross GMV Transaksi Tiket"
          icon={<DollarSign size={24} />}
          badgeText="+14.2%"
          color="yellow"
        />
        <StatCard
          title="Tiket Terjual"
          value={stats.tickets_sold.toLocaleString('id-ID')}
          subtitle={`${stats.gate_scans.toLocaleString('id-ID')} Gate Check-in`}
          icon={<Ticket size={24} />}
          badgeText="TIKET"
          color="toska"
        />
        <StatCard
          title="Pengguna & Panitia"
          value={stats.total_users.toString()}
          subtitle={`${stats.total_organizers} Akun Instansi Panitia`}
          icon={<Users size={24} />}
          badgeText="AKUN"
          color="pink"
        />
      </div>

      {/* Widget Perlu Tindakan (Action Required) */}
      <Card className="bg-neo-pink/20 border-3 border-neo-dark">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={20} className="text-neo-dark" />
          <h2 className="font-space font-extrabold text-lg text-neo-dark uppercase">
            Widget Perlu Tindakan Immediate (Action Required)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-white rounded-xl border-2.5 border-neo-dark shadow-neo-sm flex items-center justify-between">
            <div>
              <p className="font-space font-extrabold text-xs text-gray-600">Event Pending Approval</p>
              <p className="font-space font-black text-xl text-neo-dark">{stats.pending_approval_events} Event</p>
            </div>
            <Badge variant="yellow">MODERASI</Badge>
          </div>
          <div className="p-3.5 bg-white rounded-xl border-2.5 border-neo-dark shadow-neo-sm flex items-center justify-between">
            <div>
              <p className="font-space font-extrabold text-xs text-gray-600">Tiket Support Belum Ditangani</p>
              <p className="font-space font-black text-xl text-neo-dark">{stats.pending_tickets_count} Tiket</p>
            </div>
            <Badge variant="pink">SUPPORT</Badge>
          </div>
          <div className="p-3.5 bg-white rounded-xl border-2.5 border-neo-dark shadow-neo-sm flex items-center justify-between">
            <div>
              <p className="font-space font-extrabold text-xs text-gray-600">Pengajuan Refund Pending</p>
              <p className="font-space font-black text-xl text-neo-dark">{stats.pending_refunds_count} Klaim</p>
            </div>
            <Badge variant="toska">REFUND</Badge>
          </div>
        </div>
      </Card>

      {/* Transaction & Registration Trend Chart */}
      <Card className="bg-white border-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-space font-extrabold text-lg text-neo-dark">
              Tren Pendapatan & Pendaftaran Transaksi
            </h3>
            <p className="font-jakarta text-xs font-semibold text-gray-600">
              Visualisasi grafik transaksi penjualan tiket event harian & mingguan.
            </p>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-neo-bg rounded-xl border-2 border-neo-dark">
            {(['daily', 'weekly', 'monthly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg font-space font-extrabold text-xs uppercase transition-all cursor-pointer ${
                  period === p
                    ? 'bg-neo-yellow text-neo-dark shadow-neo-sm border-1.5 border-neo-dark'
                    : 'text-gray-600 hover:text-neo-dark'
                }`}
              >
                {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          {stats.daily_transactions && stats.daily_transactions.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.daily_transactions}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#30E3B2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#30E3B2" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#2B2630" fontSize={12} tickLine={false} />
                <YAxis stroke="#2B2630" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [formatRupiah(Number(val)), 'Pendapatan']}
                  contentStyle={{
                    backgroundColor: '#FFFDF5',
                    borderColor: '#2B2630',
                    borderWidth: '2px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2B2630"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-neo-bg/50 rounded-xl border-2 border-dashed border-neo-dark/40 text-center p-6">
              <p className="font-space font-extrabold text-sm text-neo-dark uppercase">Belum Ada Data Transaksi Grafik</p>
              <p className="font-jakarta text-xs text-gray-500 font-semibold mt-1">Grafik tren akan otomatis muncul ketika ada transaksi penjualan tiket riil dari API.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Grid: Recent Orders & Recent Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pesanan Tiket Terbaru */}
        <Card className="bg-white border-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-space font-extrabold text-base text-neo-dark flex items-center gap-2">
              <Ticket size={18} /> Order Tiket Terbaru
            </h3>
            <Badge variant="mint">REALTIME</Badge>
          </div>
          <div className="space-y-3">
            {stats.recent_orders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 bg-neo-bg rounded-xl border-2 border-neo-dark flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-space font-extrabold text-neo-dark">{ord.order_code}</p>
                  <p className="font-jakarta font-semibold text-gray-600 truncate max-w-[200px]">
                    {ord.user_name} • {ord.event_title}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-space font-bold text-neo-dark">{formatRupiah(ord.total_amount)}</p>
                  <Badge variant={ord.status === 'paid' ? 'mint' : 'pink'}>{ord.status.toUpperCase()}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Log Aktivitas */}
        <Card className="bg-white border-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-space font-extrabold text-base text-neo-dark flex items-center gap-2">
              <Activity size={18} /> Audit Log Aktivitas Sistem
            </h3>
            <Badge variant="yellow">AUDIT</Badge>
          </div>
          <div className="space-y-3">
            {stats.recent_activities.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-neo-yellow/20 rounded-xl border-2 border-neo-dark text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-space font-bold">
                  <span className="text-neo-dark">{log.user_name}</span>
                  <span className="text-gray-500 font-jakarta text-[10px]">
                    {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                  </span>
                </div>
                <p className="font-jakarta font-semibold text-neo-dark">
                  <strong className="uppercase">{log.action}:</strong> {log.target}
                </p>
                <p className="font-jakarta text-[11px] text-gray-600 truncate">{log.details}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};