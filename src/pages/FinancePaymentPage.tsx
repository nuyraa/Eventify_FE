import React, { useState, useEffect } from 'react';
import { eventifyApi } from '../services/api';
import type { Order, RefundRequest, PayoutRecord } from '../types';
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const FinancePaymentPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'transactions' | 'refunds' | 'payouts' | 'gateway'>('transactions');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Gateway & Fee Form State
  const [midtransClientKey, setMidtransClientKey] = useState('');
  const [midtransServerKey, setMidtransServerKey] = useState('');
  const [xenditSecretKey, setXenditSecretKey] = useState('');
  const [isProduction, setIsProduction] = useState(false);
  const [percentageFee, setPercentageFee] = useState(4.5);
  const [flatFee, setFlatFee] = useState(2500);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordData, refData, payData, cfgData] = await Promise.all([
        eventifyApi.getOrders(),
        eventifyApi.getRefunds(),
        eventifyApi.getPayouts(),
        eventifyApi.getSystemConfig(),
      ]);
      setOrders(ordData);
      setRefunds(refData);
      setPayouts(payData);
      if (cfgData.payment_gateway) {
        setMidtransClientKey(cfgData.payment_gateway.midtrans_client_key);
        setMidtransServerKey(cfgData.payment_gateway.midtrans_server_key);
        setXenditSecretKey(cfgData.payment_gateway.xendit_secret_key);
        setIsProduction(cfgData.payment_gateway.is_production);
      }
      if (cfgData.platform_fee) {
        setPercentageFee(cfgData.platform_fee.percentage_fee);
        setFlatFee(cfgData.platform_fee.flat_fee_per_ticket);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleApproveRefund = async (id: string) => {
    try {
      await eventifyApi.updateRefundStatus(id, 'approved');
      showNotif('Klaim refund berhasil DI-APPROVE & Dana dikembalikan!');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRejectRefund = async (id: string) => {
    try {
      await eventifyApi.updateRefundStatus(id, 'rejected');
      showNotif('Klaim refund DITOLAK.');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleProcessPayout = async (id: string) => {
    try {
      await eventifyApi.processPayout(id);
      showNotif('Pencairan dana panitia berhasil DITRANSFER!');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveGatewaySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventifyApi.updateSystemConfig({
        payment_gateway: {
          midtrans_client_key: midtransClientKey,
          midtrans_server_key: midtransServerKey,
          xendit_secret_key: xenditSecretKey,
          is_production: isProduction,
        },
        platform_fee: {
          percentage_fee: percentageFee,
          flat_fee_per_ticket: flatFee,
        },
      });
      showNotif('Konfigurasi Payment Gateway & Fee Platform berhasil disimpan!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6 font-jakarta">
      {/* Notification */}
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
            <Wallet size={32} /> Keuangan, Gateway & Payout Panitia
          </h1>
          <p className="font-jakarta font-semibold text-xs md:text-sm text-neo-dark/80 mt-1">
            Monitoring arus kas transaksi tiket, komisi platform, manajemen klaim refund, dan pencairan dana panitia.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b-3 border-neo-dark pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl font-space font-extrabold text-xs uppercase cursor-pointer border-2.5 border-neo-dark ${
            activeTab === 'transactions' ? 'bg-neo-mint shadow-neo' : 'bg-white hover:bg-neo-bg'
          }`}
        >
          Semua Transaksi ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('refunds')}
          className={`px-4 py-2 rounded-xl font-space font-extrabold text-xs uppercase cursor-pointer border-2.5 border-neo-dark ${
            activeTab === 'refunds' ? 'bg-neo-pink shadow-neo' : 'bg-white hover:bg-neo-bg'
          }`}
        >
          Klaim Refund ({refunds.filter((r) => r.status === 'pending').length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2 rounded-xl font-space font-extrabold text-xs uppercase cursor-pointer border-2.5 border-neo-dark ${
            activeTab === 'payouts' ? 'bg-neo-toska shadow-neo' : 'bg-white hover:bg-neo-bg'
          }`}
        >
          Payout Panitia ({payouts.length})
        </button>
        <button
          onClick={() => setActiveTab('gateway')}
          className={`px-4 py-2 rounded-xl font-space font-extrabold text-xs uppercase cursor-pointer border-2.5 border-neo-dark ${
            activeTab === 'gateway' ? 'bg-neo-yellow shadow-neo' : 'bg-white hover:bg-neo-bg'
          }`}
        >
          Setting Gateway & Komisi
        </button>
      </div>

      {/* TAB 1: TRANSAKSI */}
      {activeTab === 'transactions' && (
        <Card className="bg-white border-3">
          <Table headers={['Kode Order', 'Customer', 'Event', 'Metode Bayar', 'Total Pembayaran', 'Status', 'Bukti Invoice']}>
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-neo-yellow/15 transition-colors">
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-extrabold text-xs">{o.order_code}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs">
                  <p className="font-bold">{o.user_name}</p>
                  <p className="text-[11px] text-gray-500">{o.user_email}</p>
                </td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-bold text-xs">{o.event_title}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-bold text-xs uppercase">{o.payment_method}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-black text-xs">{formatRupiah(o.total_amount)}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark text-xs">
                  <Badge variant={o.status === 'paid' ? 'mint' : o.status === 'refunded' ? 'pink' : 'yellow'}>{o.status.toUpperCase()}</Badge>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      setSelectedOrder(o);
                      setIsInvoiceModalOpen(true);
                    }}
                    className="p-1.5 bg-white rounded-lg border-2 border-neo-dark shadow-neo-sm hover:bg-neo-toska transition-all cursor-pointer flex items-center gap-1 font-space text-[11px] font-bold"
                  >
                    <Eye size={14} /> Pratinjau
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* TAB 2: KLAIM REFUND */}
      {activeTab === 'refunds' && (
        <Card className="bg-white border-3">
          <Table headers={['Waktu Pengajuan', 'Kode Order', 'Customer', 'Event', 'Nominal Refund', 'Alasan', 'Status', 'Aksi Admin']}>
            {refunds.map((r) => (
              <tr key={r.id} className="hover:bg-neo-yellow/15 transition-colors">
                <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs">{new Date(r.requested_at).toLocaleDateString('id-ID')}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-extrabold text-xs">{r.order_code}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs">{r.user_name}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-bold text-xs">{r.event_title}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-black text-xs text-red-600">{formatRupiah(r.amount)}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs text-gray-600">{r.reason}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark text-xs">
                  <Badge variant={r.status === 'approved' ? 'mint' : r.status === 'rejected' ? 'pink' : 'yellow'}>{r.status.toUpperCase()}</Badge>
                </td>
                <td className="px-4 py-3">
                  {r.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button onClick={() => handleApproveRefund(r.id)} variant="primary" size="sm">Approve</Button>
                      <Button onClick={() => handleRejectRefund(r.id)} variant="danger" size="sm">Tolak</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* TAB 3: PAYOUT PANITIA */}
      {activeTab === 'payouts' && (
        <Card className="bg-white border-3">
          <Table headers={['Tanggal Pengajuan', 'Panitia / Organisasi', 'Bank & No Rekening', 'Nominal Pencairan', 'Status Payout', 'Aksi Eksekusi']}>
            {payouts.map((p) => (
              <tr key={p.id} className="hover:bg-neo-yellow/15 transition-colors">
                <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs">{new Date(p.requested_at).toLocaleDateString('id-ID')}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-extrabold text-xs">{p.organizer_name}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-jakarta text-xs font-semibold">
                  <p>{p.bank_name} - {p.account_number}</p>
                  <p className="text-[11px] text-gray-500">a.n. {p.account_name}</p>
                </td>
                <td className="px-4 py-3 border-r-2 border-neo-dark font-space font-black text-xs text-emerald-800">{formatRupiah(p.amount)}</td>
                <td className="px-4 py-3 border-r-2 border-neo-dark text-xs">
                  <Badge variant={p.status === 'transferred' ? 'mint' : 'yellow'}>{p.status.toUpperCase()}</Badge>
                </td>
                <td className="px-4 py-3">
                  {p.status === 'pending' && (
                    <Button onClick={() => handleProcessPayout(p.id)} variant="primary" size="sm">
                      Transfer Now
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* TAB 4: SETTING PAYMENT GATEWAY & KOMISI */}
      {activeTab === 'gateway' && (
        <Card className="bg-white border-3 max-w-3xl">
          <h3 className="font-space font-extrabold text-lg text-neo-dark mb-4 flex items-center gap-2">
            <CreditCard size={20} /> Pengaturan API Payment Gateway & Fee Platform
          </h3>
          <form onSubmit={handleSaveGatewaySettings} className="space-y-4">
            <div className="p-3 bg-neo-yellow/30 rounded-xl border-2 border-neo-dark flex items-center justify-between">
              <span className="font-space font-bold text-xs">Environment Mode Gateway:</span>
              <button
                type="button"
                onClick={() => setIsProduction(!isProduction)}
                className={`px-3 py-1 rounded-lg font-space font-black text-xs uppercase cursor-pointer border-2 border-neo-dark ${
                  isProduction ? 'bg-neo-pink text-neo-dark' : 'bg-neo-mint text-neo-dark'
                }`}
              >
                {isProduction ? 'PRODUCTION LIVE' : 'SANDBOX DEVELOPMENT'}
              </button>
            </div>

            <Input label="Midtrans Client Key" value={midtransClientKey} onChange={(e) => setMidtransClientKey(e.target.value)} />
            <Input label="Midtrans Server Key" type="password" value={midtransServerKey} onChange={(e) => setMidtransServerKey(e.target.value)} />
            <Input label="Xendit Secret API Key" type="password" value={xenditSecretKey} onChange={(e) => setXenditSecretKey(e.target.value)} />

            <hr className="border-t-2 border-neo-dark my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Komisi Platform (%)" type="number" step="0.1" value={percentageFee} onChange={(e) => setPercentageFee(Number(e.target.value))} />
              <Input label="Flat Fee Tiket (Rp)" type="number" value={flatFee} onChange={(e) => setFlatFee(Number(e.target.value))} />
            </div>

            <Button type="submit" variant="primary" className="w-full">Simpan Konfigurasi Keuangan</Button>
          </form>
        </Card>
      )}

      {/* MODAL PRATINJAU INVOICE */}
      <Modal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} title={`Invoice: ${selectedOrder?.order_code}`}>
        {selectedOrder && (
          <div className="p-4 bg-white rounded-xl border-2.5 border-neo-dark space-y-4 font-jakarta text-xs">
            <div className="flex justify-between items-center border-b-2 border-neo-dark pb-3">
              <div>
                <h4 className="font-space font-black text-base text-neo-dark">EVENTIFY OFFICIAL INVOICE</h4>
                <p className="text-gray-500">No. Inv: {selectedOrder.order_code}</p>
              </div>
              <Badge variant="mint">LUNAS / PAID</Badge>
            </div>
            <div className="space-y-1">
              <p><strong>Customer:</strong> {selectedOrder.user_name} ({selectedOrder.user_email})</p>
              <p><strong>Event:</strong> {selectedOrder.event_title}</p>
              <p><strong>Metode Bayar:</strong> {selectedOrder.payment_method.toUpperCase()}</p>
              <p><strong>Waktu Bayar:</strong> {new Date(selectedOrder.created_at).toLocaleString('id-ID')}</p>
            </div>
            <div className="p-3 bg-neo-bg rounded-lg border-2 border-neo-dark font-space font-bold flex justify-between">
              <span>TOTAL DIBAYAR:</span>
              <span className="text-sm text-neo-dark">{formatRupiah(selectedOrder.total_amount)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
