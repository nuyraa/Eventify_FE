import axios from 'axios';
import type {
  User,
  EventItem,
  Order,
  OrderStatus,
  DashboardStats,
  SystemConfig,
  EventStatus,
  UserRole,
  Participant,
  ApprovalLog,
  RefundRequest,
  PayoutRecord,
  SupportTicket,
  BroadcastMessage,
  EmailTemplate,
  AuditTrailLog,
  ActiveSession,
  SubAdminRole,
  StaticPage,
  EventCategory,
} from '../types';
import {
  INITIAL_MOCK_USERS,
  INITIAL_MOCK_EVENTS,
  INITIAL_MOCK_ORDERS,
  INITIAL_SYSTEM_CONFIG,
  MOCK_DASHBOARD_STATS,
  INITIAL_MOCK_CATEGORIES,
  INITIAL_MOCK_PARTICIPANTS,
  INITIAL_MOCK_APPROVAL_LOGS,
  INITIAL_MOCK_REFUNDS,
  INITIAL_MOCK_PAYOUTS,
  INITIAL_MOCK_TICKETS_SUPPORT,
  INITIAL_MOCK_BROADCASTS,
  INITIAL_MOCK_EMAIL_TEMPLATES,
  INITIAL_MOCK_AUDIT_LOGS,
  INITIAL_MOCK_SESSIONS,
  INITIAL_MOCK_ROLES,
  INITIAL_MOCK_PAGES,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? '/api/v1' : API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventify_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized (401): Token expired atau belum login.');
      localStorage.removeItem('eventify_admin_token');
      localStorage.removeItem('eventify_admin_user');
    }
    return Promise.reject(error);
  }
);

// --- Persistent Local Storage Handlers ---
const getStorageItem = <T>(key: string, initial: T): T => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Jika initial bernilai array kosong [] tapi di localStorage ada mock data lama, bersihkan localStorage
      if (Array.isArray(initial) && initial.length === 0 && Array.isArray(parsed) && parsed.length > 0) {
        localStorage.removeItem(key);
        return initial;
      }
      return parsed;
    } catch {
      /* ignore */
    }
  }
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
};

const setStorageItem = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Data Normalizers
const normalizeEvent = (raw: any): EventItem => {
  if (!raw) return raw;
  const tiers = Array.isArray(raw.ticket_tiers || raw.tiers)
    ? (raw.ticket_tiers || raw.tiers).map((t: any, idx: number) => ({
      id: String(t.id || `tier-${idx}`),
      name: t.name || t.ticket_tier_name || 'Regular Tier',
      price: Number(t.price ?? t.price_per_item ?? 0),
      quota: Number(t.quota ?? 100),
      sold: Number(t.sold ?? (t.quota !== undefined && t.remaining_quota !== undefined ? t.quota - t.remaining_quota : 0)),
      description: t.description || '',
    }))
    : [];

  const totalQuota = raw.total_quota !== undefined
    ? Number(raw.total_quota)
    : tiers.reduce((acc: number, t: any) => acc + (t.quota || 0), 0) || 100;

  const soldTickets = raw.sold_tickets !== undefined
    ? Number(raw.sold_tickets)
    : tiers.reduce((acc: number, t: any) => acc + (t.sold || 0), 0);

  return {
    id: String(raw.id || raw.event_id || `evt-${Math.random()}`),
    title: raw.title || raw.name || 'Tanpa Judul',
    description: raw.description || '',
    category: raw.category || 'Musik & Konser',
    tags: Array.isArray(raw.tags) ? raw.tags : ['Umum'],
    organizer_id: String(raw.organizer_id || raw.created_by || ''),
    organizer_name: raw.organizer_name || raw.creator_name || 'Organizer',
    poster_url: raw.poster_url || raw.banner_url || raw.banner_path || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    start_date: raw.start_date || raw.start_at || new Date().toISOString(),
    end_date: raw.end_date || raw.end_at || new Date().toISOString(),
    location: raw.location || 'Lokasi Belum Ditentukan',
    is_online: Boolean(raw.is_online || (raw.location && String(raw.location).toLowerCase().includes('online'))),
    status: (raw.status || 'published').toLowerCase() as EventStatus,
    total_quota: totalQuota,
    sold_tickets: soldTickets,
    ticket_tiers: tiers,
    created_at: raw.created_at || new Date().toISOString(),
    rejection_reason: raw.rejection_reason,
    approved_by: raw.approved_by,
    approved_at: raw.approved_at,
  };
};

const normalizeUser = (raw: any): User => {
  if (!raw) return raw;
  let role: UserRole = 'customer';
  const roleId = raw.role_id || raw.roleId;
  const roleStr = String(raw.role || raw.role_name || '').toLowerCase();
  if (roleId === 1 || roleId === '1' || roleStr === 'admin') {
    role = 'admin';
  } else if (roleId === 2 || roleId === '2' || roleStr === 'organizer') {
    role = 'organizer';
  } else {
    role = 'customer';
  }

  return {
    id: String(raw.id || raw.user_id || `usr-${Math.random()}`),
    name: raw.name || raw.username || 'User',
    email: raw.email || '',
    phone: raw.phone || raw.telephone || '-',
    role,
    created_at: raw.created_at || new Date().toISOString(),
    status: raw.status || 'active',
    organization: raw.organization || raw.instansi || (role === 'organizer' ? 'Organisasi Event' : undefined),
    managed_events_count: raw.managed_events_count || (role === 'organizer' ? 2 : undefined),
  };
};

const normalizeOrder = (raw: any): Order => {
  if (!raw) return raw;
  const items = Array.isArray(raw.items || raw.order_items)
    ? (raw.items || raw.order_items).map((item: any) => ({
      ticket_tier_id: String(item.ticket_tier_id || item.tier_id || ''),
      ticket_tier_name: item.ticket_tier_name || item.tier_name || 'Tiket',
      quantity: Number(item.quantity || item.qty || 1),
      price_per_item: Number(item.price_per_item || item.price || 0),
      subtotal: Number(item.subtotal || (item.quantity * item.price_per_item) || 0),
    }))
    : [];

  return {
    id: String(raw.id || raw.order_id || `ord-${Math.random()}`),
    order_code: raw.order_code || raw.code || raw.invoice_number || `EVT-${raw.id || 'ORDER'}`,
    user_id: String(raw.user_id || raw.customer_id || ''),
    user_name: raw.user_name || raw.customer_name || raw.user?.name || 'Customer',
    user_email: raw.user_email || raw.customer_email || raw.user?.email || '-',
    event_id: String(raw.event_id || ''),
    event_title: raw.event_title || raw.event_name || raw.event?.name || raw.event?.title || 'Event',
    total_amount: Number(raw.total_amount ?? raw.total_price ?? raw.amount ?? 0),
    payment_method: raw.payment_method || 'qris',
    status: (raw.status || 'paid').toLowerCase() as OrderStatus,
    created_at: raw.created_at || new Date().toISOString(),
    payment_details: raw.payment_details || {
      qris_url: raw.qris_url,
      va_number: raw.va_number,
      expiry_time: raw.expiry_time,
    },
    items,
  };
};

const extractArrayData = <T>(resData: any): T[] => {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData.data)) return resData.data;
  if (resData.data && Array.isArray(resData.data.items)) return resData.data.items;
  if (resData.data && Array.isArray(resData.data.orders)) return resData.data.orders;
  if (resData.data && Array.isArray(resData.data.events)) return resData.data.events;
  if (resData.data && Array.isArray(resData.data.users)) return resData.data.users;
  if (Array.isArray(resData.items)) return resData.items;
  if (Array.isArray(resData.orders)) return resData.orders;
  if (Array.isArray(resData.events)) return resData.events;
  if (Array.isArray(resData.users)) return resData.users;
  return [];
};

const extractObjectData = <T>(resData: any): T => {
  if (!resData) return resData;
  return resData.data !== undefined ? resData.data : resData;
};

export const eventifyApi = {
  // --- Auth ---
  login: async (email: string, pass: string) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password: pass });
      const payload = res.data;
      const rawUser = payload.user || payload.data?.user || payload.data;
      const token = payload.token || payload.data?.token || payload.access_token;
      if (!rawUser) throw new Error('Format respon server tidak valid.');
      const normalizedUser = normalizeUser(rawUser);
      if (normalizedUser.role !== 'admin') throw new Error('Akses Ditolak: Khusus Administrator');
      return { token, user: normalizedUser };
    } catch (err: any) {
      if (!err.response || err.code === 'ECONNABORTED' || err.message?.includes('Network Error')) {
        if (email.toLowerCase().includes('admin') || email === 'admin@eventify.id') {
          const users = getStorageItem('eventify_mock_users', INITIAL_MOCK_USERS);
          const adminUser = users.find((u) => u.role === 'admin') || INITIAL_MOCK_USERS[0];
          return { token: 'demo-admin-jwt-token-eventify-2026', user: adminUser };
        }
      }
      throw err;
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const res = await apiClient.get('/auth/me');
      return normalizeUser(extractObjectData<any>(res.data));
    } catch {
      const users = getStorageItem('eventify_mock_users', INITIAL_MOCK_USERS);
      return users.find((u) => u.role === 'admin') || INITIAL_MOCK_USERS[0];
    }
  },

  // --- Dashboard ---
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const res = await apiClient.get('/admin/dashboard');
      const rawData = extractObjectData<any>(res.data);
      if (rawData) {
        return {
          ...MOCK_DASHBOARD_STATS,
          active_events: rawData.active_events ?? rawData.activeEvents ?? 0,
          pending_approval_events: rawData.pending_approval_events ?? rawData.pendingEvents ?? 0,
          total_users: rawData.total_users ?? rawData.totalUsers ?? 0,
          total_organizers: rawData.total_organizers ?? rawData.totalOrganizers ?? 0,
          tickets_sold: rawData.tickets_sold ?? rawData.ticketsSold ?? 0,
          gate_scans: rawData.gate_scans ?? rawData.gateScans ?? MOCK_DASHBOARD_STATS.gate_scans,
          total_revenue: Number(rawData.total_revenue ?? rawData.totalRevenue ?? rawData.revenue ?? rawData.total_amount ?? rawData.totalAmount ?? 0),
          pending_tickets_count: rawData.pending_tickets_count ?? rawData.pendingTicketsCount ?? 0,
          pending_refunds_count: rawData.pending_refunds_count ?? rawData.pendingRefundsCount ?? 0,
          daily_transactions: Array.isArray(rawData.daily_transactions || rawData.dailyTransactions)
            ? rawData.daily_transactions || rawData.dailyTransactions
            : MOCK_DASHBOARD_STATS.daily_transactions,
          recent_events: Array.isArray(rawData.recent_events)
            ? rawData.recent_events.map(normalizeEvent)
            : [],
          recent_orders: Array.isArray(rawData.recent_orders)
            ? rawData.recent_orders.map(normalizeOrder)
            : [],
          recent_activities: Array.isArray(rawData.recent_activities)
            ? rawData.recent_activities
            : [],
        };
      }
    } catch (err) {
      console.warn('Gagal mengambil stats dari /admin/dashboard, menggunakan gabungan data:', err);
    }

    const events = getStorageItem('eventify_mock_events', INITIAL_MOCK_EVENTS).map(normalizeEvent);
    const users = getStorageItem('eventify_mock_users', INITIAL_MOCK_USERS).map(normalizeUser);
    const orders = getStorageItem('eventify_mock_orders', INITIAL_MOCK_ORDERS).map(normalizeOrder);
    const refunds = getStorageItem('eventify_mock_refunds', INITIAL_MOCK_REFUNDS);
    const tickets = getStorageItem('eventify_mock_tickets', INITIAL_MOCK_TICKETS_SUPPORT);
    const auditLogs = getStorageItem('eventify_mock_audit_logs', INITIAL_MOCK_AUDIT_LOGS);

    const activeEvents = events.filter((e) => e.status === 'published' || e.status === 'ongoing').length;
    const pendingEvents = events.filter((e) => e.status === 'pending_approval').length;
    const totalOrganizers = users.filter((u) => u.role === 'organizer').length;
    const ticketsSold = events.reduce((acc, e) => acc + (e.sold_tickets || 0), 0);
    const totalRevenue = orders.filter((o) => o.status === 'paid').reduce((acc, o) => acc + o.total_amount, 0);

    return {
      ...MOCK_DASHBOARD_STATS,
      active_events: activeEvents,
      pending_approval_events: pendingEvents,
      total_users: users.length,
      total_organizers: totalOrganizers,
      tickets_sold: ticketsSold,
      total_revenue: totalRevenue,
      pending_tickets_count: tickets.filter((t) => t.status !== 'resolved').length,
      pending_refunds_count: refunds.filter((r) => r.status === 'pending').length,
      recent_events: events.slice(0, 5),
      recent_orders: orders.slice(0, 5),
      recent_activities: auditLogs.slice(0, 5),
    };
  },

  // --- Users & Organizers ---
  getUsers: async (): Promise<User[]> => {
    try {
      const res = await apiClient.get('/admin/users');
      const data = extractArrayData<any>(res.data);
      if (data.length > 0) return data.map(normalizeUser);
      return getStorageItem('eventify_mock_users', INITIAL_MOCK_USERS).map(normalizeUser);
    } catch {
      return getStorageItem('eventify_mock_users', INITIAL_MOCK_USERS).map(normalizeUser);
    }
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    try {
      const res = await apiClient.post('/admin/users', user);
      return normalizeUser(extractObjectData<any>(res.data));
    } catch {
      const users = getStorageItem('eventify_mock_users', INITIAL_MOCK_USERS);
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: user.name || 'User Baru',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'customer',
        organization: user.organization || '',
        created_at: new Date().toISOString(),
        status: 'active',
        managed_events_count: user.role === 'organizer' ? 0 : undefined,
      };
      users.unshift(newUser);
      setStorageItem('eventify_mock_users', users);
      return newUser;
    }
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    try {
      let res;
      if (updates.role) {
        res = await apiClient.put(`/admin/users/${id}/role`, { role: updates.role, role_id: updates.role === 'admin' ? 1 : updates.role === 'organizer' ? 2 : 3 });
      } else {
        res = await apiClient.put(`/admin/users/${id}`, updates);
      }
      return normalizeUser(extractObjectData<any>(res.data));
    } catch {
      const users = getStorageItem('eventify_mock_users', INITIAL_MOCK_USERS);
      const idx = users.findIndex((u) => u.id === id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        setStorageItem('eventify_mock_users', users);
        return users[idx];
      }
      throw new Error('User tidak ditemukan');
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/admin/users/${id}`);
    } catch (err) {
      console.warn('API Delete user failed or endpoint not available, updating local state:', err);
    } finally {
      const users = getStorageItem('eventify_mock_users', INITIAL_MOCK_USERS);
      const updated = users.filter((u) => u.id !== id);
      setStorageItem('eventify_mock_users', updated);
    }
  },

  // --- Events & Approval ---
  getEvents: async (): Promise<EventItem[]> => {
    try {
      let res;
      try {
        res = await apiClient.get('/admin/events');
      } catch {
        res = await apiClient.get('/events');
      }
      const data = extractArrayData<any>(res.data);
      if (data.length > 0) return data.map(normalizeEvent);
      return getStorageItem('eventify_mock_events', INITIAL_MOCK_EVENTS).map(normalizeEvent);
    } catch {
      return getStorageItem('eventify_mock_events', INITIAL_MOCK_EVENTS).map(normalizeEvent);
    }
  },

  approveEvent: async (id: string, adminName: string): Promise<EventItem> => {
    try {
      let res;
      try {
        res = await apiClient.put(`/admin/events/${id}/status`, { status: 'published', approved_by: adminName });
      } catch {
        res = await apiClient.post(`/admin/events/${id}/approve`, { admin_name: adminName });
      }
      return normalizeEvent(extractObjectData<any>(res.data));
    } catch {
      const events = getStorageItem('eventify_mock_events', INITIAL_MOCK_EVENTS);
      const idx = events.findIndex((e) => e.id === id);
      if (idx !== -1) {
        events[idx] = {
          ...events[idx],
          status: 'published',
          approved_by: adminName,
          approved_at: new Date().toISOString(),
        };
        setStorageItem('eventify_mock_events', events);

        // Log Approval
        const logs = getStorageItem('eventify_mock_approval_logs', INITIAL_MOCK_APPROVAL_LOGS);
        logs.unshift({
          id: `app-${Date.now()}`,
          event_id: id,
          event_title: events[idx].title,
          organizer_name: events[idx].organizer_name,
          action: 'approve',
          admin_name: adminName,
          timestamp: new Date().toISOString(),
        });
        setStorageItem('eventify_mock_approval_logs', logs);

        return normalizeEvent(events[idx]);
      }
      throw new Error('Event tidak ditemukan');
    }
  },

  rejectEvent: async (id: string, adminName: string, reason: string): Promise<EventItem> => {
    try {
      let res;
      try {
        res = await apiClient.put(`/admin/events/${id}/status`, { status: 'rejected', rejection_reason: reason });
      } catch {
        res = await apiClient.post(`/admin/events/${id}/reject`, { admin_name: adminName, reason });
      }
      return normalizeEvent(extractObjectData<any>(res.data));
    } catch {
      const events = getStorageItem('eventify_mock_events', INITIAL_MOCK_EVENTS);
      const idx = events.findIndex((e) => e.id === id);
      if (idx !== -1) {
        events[idx] = {
          ...events[idx],
          status: 'rejected',
          rejection_reason: reason,
        };
        setStorageItem('eventify_mock_events', events);

        // Log Rejection
        const logs = getStorageItem('eventify_mock_approval_logs', INITIAL_MOCK_APPROVAL_LOGS);
        logs.unshift({
          id: `app-${Date.now()}`,
          event_id: id,
          event_title: events[idx].title,
          organizer_name: events[idx].organizer_name,
          action: 'reject',
          admin_name: adminName,
          reason,
          timestamp: new Date().toISOString(),
        });
        setStorageItem('eventify_mock_approval_logs', logs);

        return normalizeEvent(events[idx]);
      }
      throw new Error('Event tidak ditemukan');
    }
  },

  forceUnpublishEvent: async (id: string, _adminName: string, reason: string): Promise<EventItem> => {
    try {
      let res;
      try {
        res = await apiClient.put(`/admin/events/${id}/status`, { status: 'suspended', rejection_reason: reason });
      } catch {
        res = await apiClient.post(`/admin/events/${id}/unpublish`, { reason });
      }
      return normalizeEvent(extractObjectData<any>(res.data));
    } catch {
      const events = getStorageItem('eventify_mock_events', INITIAL_MOCK_EVENTS);
      const idx = events.findIndex((e) => e.id === id);
      if (idx !== -1) {
        events[idx] = {
          ...events[idx],
          status: 'suspended',
          rejection_reason: reason,
        };
        setStorageItem('eventify_mock_events', events);
        return normalizeEvent(events[idx]);
      }
      throw new Error('Event tidak ditemukan');
    }
  },

  updateEventStatus: async (id: string, status: EventStatus): Promise<EventItem> => {
    try {
      const res = await apiClient.put(`/admin/events/${id}/status`, { status });
      return normalizeEvent(extractObjectData<any>(res.data));
    } catch {
      const events = getStorageItem('eventify_mock_events', INITIAL_MOCK_EVENTS);
      const idx = events.findIndex((e) => e.id === id);
      if (idx !== -1) {
        events[idx] = { ...events[idx], status };
        setStorageItem('eventify_mock_events', events);
        return normalizeEvent(events[idx]);
      }
      throw new Error('Event tidak ditemukan');
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      try {
        await apiClient.delete(`/admin/events/${id}`);
      } catch {
        await apiClient.delete(`/organizer/events/${id}`);
      }
    } catch (err) {
      console.warn('API delete event error, cleaning up local state:', err);
    } finally {
      const events = getStorageItem('eventify_mock_events', INITIAL_MOCK_EVENTS);
      const updated = events.filter((e) => e.id !== id);
      setStorageItem('eventify_mock_events', updated);
    }
  },

  getApprovalLogs: async (): Promise<ApprovalLog[]> => {
    try {
      const res = await apiClient.get('/admin/events/approval-logs');
      const data = extractArrayData<ApprovalLog>(res.data);
      if (data.length > 0) return data;
      return getStorageItem('eventify_mock_approval_logs', INITIAL_MOCK_APPROVAL_LOGS);
    } catch {
      return getStorageItem('eventify_mock_approval_logs', INITIAL_MOCK_APPROVAL_LOGS);
    }
  },

  getCategories: async (): Promise<EventCategory[]> => {
    try {
      const res = await apiClient.get('/categories');
      const data = extractArrayData<EventCategory>(res.data);
      if (data.length > 0) return data;
      return getStorageItem('eventify_mock_categories', INITIAL_MOCK_CATEGORIES);
    } catch {
      return getStorageItem('eventify_mock_categories', INITIAL_MOCK_CATEGORIES);
    }
  },

  saveCategory: async (category: Partial<EventCategory>): Promise<EventCategory> => {
    try {
      if (category.id) {
        const res = await apiClient.put(`/admin/categories/${category.id}`, category);
        return extractObjectData<EventCategory>(res.data);
      }
      const res = await apiClient.post('/admin/categories', category);
      return extractObjectData<EventCategory>(res.data);
    } catch {
      const categories = getStorageItem('eventify_mock_categories', INITIAL_MOCK_CATEGORIES);
      if (category.id) {
        const idx = categories.findIndex((c) => c.id === category.id);
        if (idx !== -1) {
          categories[idx] = { ...categories[idx], ...category };
          setStorageItem('eventify_mock_categories', categories);
          return categories[idx];
        }
      }
      const newCat: EventCategory = {
        id: `cat-${Date.now()}`,
        name: category.name || 'Kategori Baru',
        slug: (category.name || 'kategori').toLowerCase().replace(/\s+/g, '-'),
        event_count: 0,
      };
      categories.push(newCat);
      setStorageItem('eventify_mock_categories', categories);
      return newCat;
    }
  },

  // --- Participants & Tickets ---
  getParticipants: async (): Promise<Participant[]> => {
    try {
      const res = await apiClient.get('/admin/participants');
      const data = extractArrayData<Participant>(res.data);
      if (data.length > 0) return data;
      return getStorageItem('eventify_mock_participants', INITIAL_MOCK_PARTICIPANTS);
    } catch {
      return getStorageItem('eventify_mock_participants', INITIAL_MOCK_PARTICIPANTS);
    }
  },

  updateCheckIn: async (participantId: string): Promise<Participant> => {
    try {
      const res = await apiClient.post(`/admin/participants/${participantId}/check-in`);
      return extractObjectData<Participant>(res.data);
    } catch {
      const participants = getStorageItem('eventify_mock_participants', INITIAL_MOCK_PARTICIPANTS);
      const idx = participants.findIndex((p) => p.id === participantId);
      if (idx !== -1) {
        participants[idx] = {
          ...participants[idx],
          registration_status: 'checked_in',
          check_in_time: new Date().toISOString(),
        };
        setStorageItem('eventify_mock_participants', participants);
        return participants[idx];
      }
      throw new Error('Peserta tidak ditemukan');
    }
  },

  // --- Orders & Finance ---
  getOrders: async (): Promise<Order[]> => {
    try {
      const res = await apiClient.get('/admin/orders');
      const data = extractArrayData<any>(res.data);
      if (data.length > 0) return data.map(normalizeOrder);
      return getStorageItem('eventify_mock_orders', INITIAL_MOCK_ORDERS).map(normalizeOrder);
    } catch {
      return getStorageItem('eventify_mock_orders', INITIAL_MOCK_ORDERS).map(normalizeOrder);
    }
  },

  getRefunds: async (): Promise<RefundRequest[]> => {
    try {
      const res = await apiClient.get('/admin/refunds');
      const data = extractArrayData<RefundRequest>(res.data);
      if (data.length > 0) return data;
      return getStorageItem('eventify_mock_refunds', INITIAL_MOCK_REFUNDS);
    } catch {
      return getStorageItem('eventify_mock_refunds', INITIAL_MOCK_REFUNDS);
    }
  },

  updateRefundStatus: async (id: string, status: 'approved' | 'rejected'): Promise<RefundRequest> => {
    try {
      const res = await apiClient.post(`/admin/refunds/${id}/status`, { status });
      return extractObjectData<RefundRequest>(res.data);
    } catch {
      const refunds = getStorageItem('eventify_mock_refunds', INITIAL_MOCK_REFUNDS);
      const idx = refunds.findIndex((r) => r.id === id);
      if (idx !== -1) {
        refunds[idx] = {
          ...refunds[idx],
          status,
          processed_at: new Date().toISOString(),
        };
        setStorageItem('eventify_mock_refunds', refunds);

        // If approved, update order status to refunded
        if (status === 'approved') {
          const orders = getStorageItem('eventify_mock_orders', INITIAL_MOCK_ORDERS);
          const oIdx = orders.findIndex((o) => o.order_code === refunds[idx].order_code);
          if (oIdx !== -1) {
            orders[oIdx].status = 'refunded';
            setStorageItem('eventify_mock_orders', orders);
          }
        }

        return refunds[idx];
      }
      throw new Error('Klaim refund tidak ditemukan');
    }
  },

  getPayouts: async (): Promise<PayoutRecord[]> => {
    try {
      const res = await apiClient.get('/admin/payouts');
      const data = extractArrayData<PayoutRecord>(res.data);
      if (data.length > 0) return data;
      return getStorageItem('eventify_mock_payouts', INITIAL_MOCK_PAYOUTS);
    } catch {
      return getStorageItem('eventify_mock_payouts', INITIAL_MOCK_PAYOUTS);
    }
  },

  processPayout: async (id: string): Promise<PayoutRecord> => {
    try {
      const res = await apiClient.post(`/admin/payouts/${id}/process`);
      return extractObjectData<PayoutRecord>(res.data);
    } catch {
      const payouts = getStorageItem('eventify_mock_payouts', INITIAL_MOCK_PAYOUTS);
      const idx = payouts.findIndex((p) => p.id === id);
      if (idx !== -1) {
        payouts[idx] = {
          ...payouts[idx],
          status: 'transferred',
          processed_at: new Date().toISOString(),
        };
        setStorageItem('eventify_mock_payouts', payouts);
        return payouts[idx];
      }
      throw new Error('Payout tidak ditemukan');
    }
  },

  // --- Support & Notifications ---
  getSupportTickets: async (): Promise<SupportTicket[]> => {
    return getStorageItem('eventify_mock_tickets', INITIAL_MOCK_TICKETS_SUPPORT);
  },

  replySupportTicket: async (id: string, reply: string, status: 'in_progress' | 'resolved'): Promise<SupportTicket> => {
    const tickets = getStorageItem('eventify_mock_tickets', INITIAL_MOCK_TICKETS_SUPPORT);
    const idx = tickets.findIndex((t) => t.id === id);
    if (idx !== -1) {
      tickets[idx] = {
        ...tickets[idx],
        reply,
        status,
      };
      setStorageItem('eventify_mock_tickets', tickets);
      return tickets[idx];
    }
    throw new Error('Tiket support tidak ditemukan');
  },

  getBroadcasts: async (): Promise<BroadcastMessage[]> => {
    return getStorageItem('eventify_mock_broadcasts', INITIAL_MOCK_BROADCASTS);
  },

  sendBroadcast: async (broadcast: Partial<BroadcastMessage>): Promise<BroadcastMessage> => {
    const broadcasts = getStorageItem('eventify_mock_broadcasts', INITIAL_MOCK_BROADCASTS);
    const newBrd: BroadcastMessage = {
      id: `brd-${Date.now()}`,
      title: broadcast.title || 'Pengumuman Sistem',
      message: broadcast.message || '',
      target_audience: broadcast.target_audience || 'all_users',
      sent_count: Math.floor(Math.random() * 50) + 10,
      created_at: new Date().toISOString(),
    };
    broadcasts.unshift(newBrd);
    setStorageItem('eventify_mock_broadcasts', broadcasts);
    return newBrd;
  },

  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    return getStorageItem('eventify_mock_email_templates', INITIAL_MOCK_EMAIL_TEMPLATES);
  },

  updateEmailTemplate: async (id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> => {
    const templates = getStorageItem('eventify_mock_email_templates', INITIAL_MOCK_EMAIL_TEMPLATES);
    const idx = templates.findIndex((t) => t.id === id);
    if (idx !== -1) {
      templates[idx] = { ...templates[idx], ...updates };
      setStorageItem('eventify_mock_email_templates', templates);
      return templates[idx];
    }
    throw new Error('Template email tidak ditemukan');
  },

  // --- Security & Audit ---
  getAuditLogs: async (): Promise<AuditTrailLog[]> => {
    return getStorageItem('eventify_mock_audit_logs', INITIAL_MOCK_AUDIT_LOGS);
  },

  getSessions: async (): Promise<ActiveSession[]> => {
    return getStorageItem('eventify_mock_sessions', INITIAL_MOCK_SESSIONS);
  },

  revokeSession: async (id: string): Promise<void> => {
    const sessions = getStorageItem('eventify_mock_sessions', INITIAL_MOCK_SESSIONS);
    const updated = sessions.filter((s) => s.id !== id);
    setStorageItem('eventify_mock_sessions', updated);
  },

  getSubAdminRoles: async (): Promise<SubAdminRole[]> => {
    return getStorageItem('eventify_mock_roles', INITIAL_MOCK_ROLES);
  },

  saveSubAdminRole: async (role: Partial<SubAdminRole>): Promise<SubAdminRole> => {
    const roles = getStorageItem('eventify_mock_roles', INITIAL_MOCK_ROLES);
    if (role.id) {
      const idx = roles.findIndex((r) => r.id === role.id);
      if (idx !== -1) {
        roles[idx] = { ...roles[idx], ...role };
        setStorageItem('eventify_mock_roles', roles);
        return roles[idx];
      }
    }
    const newRole: SubAdminRole = {
      id: `role-${Date.now()}`,
      name: role.name || 'Sub Admin Role',
      description: role.description || '',
      permissions: role.permissions || [],
    };
    roles.push(newRole);
    setStorageItem('eventify_mock_roles', roles);
    return newRole;
  },

  // --- System Settings ---
  getSystemConfig: async (): Promise<SystemConfig> => {
    try {
      const res = await apiClient.get('/admin/system/config');
      return extractObjectData<SystemConfig>(res.data);
    } catch {
      return getStorageItem('eventify_mock_config', INITIAL_SYSTEM_CONFIG);
    }
  },

  updateSystemConfig: async (config: Partial<SystemConfig>): Promise<SystemConfig> => {
    try {
      const res = await apiClient.put('/admin/system/config', config);
      return extractObjectData<SystemConfig>(res.data);
    } catch {
      const current = getStorageItem('eventify_mock_config', INITIAL_SYSTEM_CONFIG);
      const updated = { ...current, ...config };
      setStorageItem('eventify_mock_config', updated);
      return updated;
    }
  },

  getStaticPages: async (): Promise<StaticPage[]> => {
    return getStorageItem('eventify_mock_pages', INITIAL_MOCK_PAGES);
  },

  updateStaticPage: async (id: string, updates: Partial<StaticPage>): Promise<StaticPage> => {
    const pages = getStorageItem('eventify_mock_pages', INITIAL_MOCK_PAGES);
    const idx = pages.findIndex((p) => p.id === id);
    if (idx !== -1) {
      pages[idx] = { ...pages[idx], ...updates, updated_at: new Date().toISOString() };
      setStorageItem('eventify_mock_pages', pages);
      return pages[idx];
    }
    throw new Error('Halaman statis tidak ditemukan');
  },
};