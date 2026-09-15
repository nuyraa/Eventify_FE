import type {
  User,
  EventItem,
  Order,
  DashboardStats,
  SystemConfig,
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

export const INITIAL_MOCK_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Budi Administrator',
    email: 'admin@eventify.id',
    phone: '081299887766',
    role: 'admin',
    created_at: '2025-01-10T08:00:00Z',
    status: 'active',
    organization: 'Eventify HQ',
  },
  {
    id: 'usr-002',
    name: 'Siti Rahma',
    email: 'siti@soundwave.co.id',
    phone: '081344556677',
    role: 'organizer',
    created_at: '2025-02-01T10:30:00Z',
    status: 'active',
    organization: 'Soundwave Indonesia',
    managed_events_count: 3,
  },
  {
    id: 'usr-003',
    name: 'Rian Tech Organizer',
    email: 'rian@devfest.org',
    phone: '085611223344',
    role: 'organizer',
    created_at: '2025-02-15T14:20:00Z',
    status: 'active',
    organization: 'DevFest Guild',
    managed_events_count: 2,
  },
  {
    id: 'usr-004',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@gmail.com',
    phone: '087812345678',
    role: 'customer',
    created_at: '2025-03-01T09:15:00Z',
    status: 'active',
  },
  {
    id: 'usr-005',
    name: 'Dina Permata',
    email: 'dina.permata@yahoo.com',
    phone: '081288990011',
    role: 'customer',
    created_at: '2025-03-05T11:45:00Z',
    status: 'active',
  },
  {
    id: 'usr-006',
    name: 'Kevin Wijaya',
    email: 'kevin.wijaya@outlook.com',
    phone: '081977665544',
    role: 'customer',
    created_at: '2025-03-10T16:00:00Z',
    status: 'active',
  },
  {
    id: 'usr-007',
    name: 'Mega Pratiwi',
    email: 'mega.pratiwi@gmail.com',
    phone: '085733445566',
    role: 'customer',
    created_at: '2025-03-12T13:20:00Z',
    status: 'suspended',
  },
];

export const INITIAL_MOCK_CATEGORIES: EventCategory[] = [
  { id: 'cat-1', name: 'Musik & Konser', slug: 'musik', event_count: 12 },
  { id: 'cat-2', name: 'Teknologi & AI', slug: 'teknologi', event_count: 8 },
  { id: 'cat-3', name: 'Design & UX', slug: 'design', event_count: 5 },
  { id: 'cat-4', name: 'E-Sports & Gaming', slug: 'esports', event_count: 6 },
  { id: 'cat-5', name: 'Kuliner & Festival', slug: 'kuliner', event_count: 10 },
];

export const INITIAL_MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt-001',
    title: 'Nusantara Soundwave Music Fest 2026',
    description: 'Festival musik terbesar menghadirkan 20+ musisi papan atas Indonesia dengan panggung Neobrutalist outdoor interaktif.',
    category: 'Musik & Konser',
    tags: ['Konser', 'Outdoor', 'Festival'],
    organizer_id: 'usr-002',
    organizer_name: 'Soundwave Indonesia',
    poster_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-10-15T15:00:00Z',
    end_date: '2026-10-16T23:00:00Z',
    location: 'Gelora Bung Karno, Jakarta',
    is_online: false,
    status: 'published',
    total_quota: 5000,
    sold_tickets: 3840,
    ticket_tiers: [
      { id: 'tier-101', name: 'Presale 1 (Early)', price: 250000, quota: 1000, sold: 1000, description: 'Akses 2 Hari + Merchandise' },
      { id: 'tier-102', name: 'Regular Festival', price: 350000, quota: 3000, sold: 2340, description: 'Akses 2 Hari Festival Area' },
      { id: 'tier-103', name: 'VIP Frontstage', price: 750000, quota: 1000, sold: 500, description: 'VIP Baris Depan + Lounge' }
    ],
    created_at: '2025-01-15T09:00:00Z',
    approved_by: 'Budi Administrator',
    approved_at: '2025-01-16T10:00:00Z'
  },
  {
    id: 'evt-002',
    title: 'IndoTech Summit & AI Expo 2026',
    description: 'Konferensi teknologi & kecerdasan buatan terbesar di Asia Tenggara mempertemukan founder, investor, dan engineer.',
    category: 'Teknologi & AI',
    tags: ['AI', 'Tech', 'Conference'],
    organizer_id: 'usr-003',
    organizer_name: 'DevFest Guild',
    poster_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-11-05T08:30:00Z',
    end_date: '2026-11-06T17:00:00Z',
    location: 'BSD Grand Ballroom, Tangerang',
    is_online: false,
    status: 'published',
    total_quota: 2000,
    sold_tickets: 1450,
    ticket_tiers: [
      { id: 'tier-201', name: 'Standard Pass', price: 450000, quota: 1500, sold: 1200, description: 'Semua Keynote & Expo' },
      { id: 'tier-202', name: 'Executive VIP', price: 1250000, quota: 500, sold: 250, description: 'Keynote + Networking Dinner' }
    ],
    created_at: '2025-02-01T10:00:00Z',
    approved_by: 'Budi Administrator',
    approved_at: '2025-02-02T11:00:00Z'
  },
  {
    id: 'evt-003',
    title: 'Neobrutalism UI/UX Design Masterclass',
    description: 'Belajar membuat antarmuka web & mobile modern dengan estetika Neobrutalism bersama desainer senior.',
    category: 'Design & UX',
    tags: ['Figma', 'UI/UX', 'Workshop'],
    organizer_id: 'usr-003',
    organizer_name: 'DevFest Guild',
    poster_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-09-25T13:00:00Z',
    end_date: '2026-09-25T17:00:00Z',
    location: 'Zoom Meeting (Online)',
    is_online: true,
    status: 'pending_approval',
    total_quota: 300,
    sold_tickets: 0,
    ticket_tiers: [
      { id: 'tier-301', name: 'Single Pass', price: 150000, quota: 300, sold: 0, description: 'Live Stream + Figma Kit File' }
    ],
    created_at: '2026-09-14T11:00:00Z'
  },
  {
    id: 'evt-004',
    title: 'Indo Gaming Championship Season 4',
    description: 'Turnamen e-sports nasional Valorant, MLBB, & PUBG Mobile dengan total hadiah Rp 250 Juta.',
    category: 'E-Sports & Gaming',
    tags: ['Gaming', 'Esports', 'Tournament'],
    organizer_id: 'usr-002',
    organizer_name: 'Soundwave Indonesia',
    poster_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-12-01T10:00:00Z',
    end_date: '2026-12-03T22:00:00Z',
    location: 'Mall Taman Anggrek, Jakarta',
    is_online: false,
    status: 'draft',
    total_quota: 1500,
    sold_tickets: 0,
    ticket_tiers: [
      { id: 'tier-401', name: 'General Admission', price: 75000, quota: 1200, sold: 0 },
      { id: 'tier-402', name: 'Gamer Pass VIP', price: 200000, quota: 300, sold: 0 }
    ],
    created_at: '2025-03-01T08:00:00Z'
  },
  {
    id: 'evt-005',
    title: 'Jakarta Street Food & Coffee Fest',
    description: 'Ratusan tenant kuliner kekinian dan kompetisi barista kopi terbaik nusantara.',
    category: 'Kuliner & Festival',
    tags: ['Kuliner', 'Coffee', 'Festival'],
    organizer_id: 'usr-002',
    organizer_name: 'Soundwave Indonesia',
    poster_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-08-01T10:00:00Z',
    end_date: '2026-08-03T21:00:00Z',
    location: 'Parkir Timur Senayan, Jakarta',
    is_online: false,
    status: 'ended',
    total_quota: 8000,
    sold_tickets: 7920,
    ticket_tiers: [
      { id: 'tier-501', name: 'Entry Ticket + Food Voucher', price: 50000, quota: 8000, sold: 7920 }
    ],
    created_at: '2025-01-05T09:00:00Z'
  }
];

export const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_code: 'EVT-20260914-001',
    user_id: 'usr-004',
    user_name: 'Ahmad Fauzi',
    user_email: 'ahmad.fauzi@gmail.com',
    event_id: 'evt-001',
    event_title: 'Nusantara Soundwave Music Fest 2026',
    total_amount: 700000,
    payment_method: 'qris',
    status: 'paid',
    created_at: '2026-09-14T11:20:00Z',
    payment_details: {
      qris_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EVT-20260914-001-QRIS',
      expiry_time: '2026-09-14T11:35:00Z'
    },
    items: [
      { ticket_tier_id: 'tier-102', ticket_tier_name: 'Regular Festival', quantity: 2, price_per_item: 350000, subtotal: 700000 }
    ]
  },
  {
    id: 'ord-1002',
    order_code: 'EVT-20260914-002',
    user_id: 'usr-005',
    user_name: 'Dina Permata',
    user_email: 'dina.permata@yahoo.com',
    event_id: 'evt-002',
    event_title: 'IndoTech Summit & AI Expo 2026',
    total_amount: 1250000,
    payment_method: 'bca_va',
    status: 'paid',
    created_at: '2026-09-14T10:05:00Z',
    payment_details: {
      va_number: '880128899001145',
      expiry_time: '2026-09-15T10:05:00Z'
    },
    items: [
      { ticket_tier_id: 'tier-202', ticket_tier_name: 'Executive VIP', quantity: 1, price_per_item: 1250000, subtotal: 1250000 }
    ]
  },
  {
    id: 'ord-1003',
    order_code: 'EVT-20260914-003',
    user_id: 'usr-006',
    user_name: 'Kevin Wijaya',
    user_email: 'kevin.wijaya@outlook.com',
    event_id: 'evt-003',
    event_title: 'Neobrutalism UI/UX Design Masterclass',
    total_amount: 150000,
    payment_method: 'gopay',
    status: 'paid',
    created_at: '2026-09-14T09:40:00Z',
    payment_details: {
      qris_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=EVT-20260914-003-GOPAY',
      expiry_time: '2026-09-14T10:10:00Z'
    },
    items: [
      { ticket_tier_id: 'tier-301', ticket_tier_name: 'Single Pass', quantity: 1, price_per_item: 150000, subtotal: 150000 }
    ]
  },
  {
    id: 'ord-1004',
    order_code: 'EVT-20260914-004',
    user_id: 'usr-007',
    user_name: 'Mega Pratiwi',
    user_email: 'mega.pratiwi@gmail.com',
    event_id: 'evt-001',
    event_title: 'Nusantara Soundwave Music Fest 2026',
    total_amount: 750000,
    payment_method: 'mandiri_va',
    status: 'pending',
    created_at: '2026-09-14T12:15:00Z',
    payment_details: {
      va_number: '890085733445566',
      expiry_time: '2026-09-15T12:15:00Z'
    },
    items: [
      { ticket_tier_id: 'tier-103', ticket_tier_name: 'VIP Frontstage', quantity: 1, price_per_item: 750000, subtotal: 750000 }
    ]
  },
  {
    id: 'ord-1005',
    order_code: 'EVT-20260913-089',
    user_id: 'usr-004',
    user_name: 'Ahmad Fauzi',
    user_email: 'ahmad.fauzi@gmail.com',
    event_id: 'evt-002',
    event_title: 'IndoTech Summit & AI Expo 2026',
    total_amount: 450000,
    payment_method: 'qris',
    status: 'refunded',
    created_at: '2026-09-13T18:00:00Z',
    payment_details: {},
    items: [
      { ticket_tier_id: 'tier-201', ticket_tier_name: 'Standard Pass', quantity: 1, price_per_item: 450000, subtotal: 450000 }
    ]
  }
];

export const INITIAL_MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 'pt-001',
    event_id: 'evt-001',
    event_title: 'Nusantara Soundwave Music Fest 2026',
    user_name: 'Ahmad Fauzi',
    user_email: 'ahmad.fauzi@gmail.com',
    ticket_tier_name: 'Regular Festival',
    registration_status: 'checked_in',
    check_in_time: '2026-10-15T15:30:00Z',
    registered_at: '2026-09-14T11:20:00Z',
  },
  {
    id: 'pt-002',
    event_id: 'evt-001',
    event_title: 'Nusantara Soundwave Music Fest 2026',
    user_name: 'Mega Pratiwi',
    user_email: 'mega.pratiwi@gmail.com',
    ticket_tier_name: 'VIP Frontstage',
    registration_status: 'confirmed',
    registered_at: '2026-09-14T12:15:00Z',
  },
  {
    id: 'pt-003',
    event_id: 'evt-002',
    event_title: 'IndoTech Summit & AI Expo 2026',
    user_name: 'Dina Permata',
    user_email: 'dina.permata@yahoo.com',
    ticket_tier_name: 'Executive VIP',
    registration_status: 'confirmed',
    registered_at: '2026-09-14T10:05:00Z',
  },
];

export const INITIAL_MOCK_APPROVAL_LOGS: ApprovalLog[] = [
  {
    id: 'app-001',
    event_id: 'evt-001',
    event_title: 'Nusantara Soundwave Music Fest 2026',
    organizer_name: 'Soundwave Indonesia',
    action: 'approve',
    admin_name: 'Budi Administrator',
    reason: 'Dokumen kelengkapan izin venue GBK dan lineup artis sudah terverifikasi valid.',
    timestamp: '2025-01-16T10:00:00Z',
  },
  {
    id: 'app-002',
    event_id: 'evt-002',
    event_title: 'IndoTech Summit & AI Expo 2026',
    organizer_name: 'DevFest Guild',
    action: 'approve',
    admin_name: 'Budi Administrator',
    reason: 'Proposal sponsorship & rundown acara konferensi sesuai standar keamanan platform.',
    timestamp: '2025-02-02T11:00:00Z',
  },
];

export const INITIAL_MOCK_REFUNDS: RefundRequest[] = [
  {
    id: 'ref-101',
    order_code: 'EVT-20260913-089',
    user_name: 'Ahmad Fauzi',
    user_email: 'ahmad.fauzi@gmail.com',
    event_title: 'IndoTech Summit & AI Expo 2026',
    amount: 450000,
    reason: 'Salah memilih jadwal hadir dan melakukan double order.',
    status: 'approved',
    requested_at: '2026-09-13T19:00:00Z',
    processed_at: '2026-09-14T08:00:00Z',
  },
  {
    id: 'ref-102',
    order_code: 'EVT-20260914-004',
    user_name: 'Mega Pratiwi',
    user_email: 'mega.pratiwi@gmail.com',
    event_title: 'Nusantara Soundwave Music Fest 2026',
    amount: 750000,
    reason: 'Pembatalan sepihak karena kendala pekerjaan.',
    status: 'pending',
    requested_at: '2026-09-14T14:30:00Z',
  },
];

export const INITIAL_MOCK_PAYOUTS: PayoutRecord[] = [
  {
    id: 'pay-501',
    organizer_id: 'usr-002',
    organizer_name: 'Soundwave Indonesia',
    amount: 1450000000,
    bank_name: 'BCA',
    account_number: '8830192831',
    account_name: 'PT Soundwave Nusantara',
    status: 'transferred',
    requested_at: '2026-08-05T10:00:00Z',
    processed_at: '2026-08-06T14:00:00Z',
  },
  {
    id: 'pay-502',
    organizer_id: 'usr-003',
    organizer_name: 'DevFest Guild',
    amount: 320000000,
    bank_name: 'Bank Mandiri',
    account_number: '1370001928311',
    account_name: 'Yayasan DevFest Indonesia',
    status: 'pending',
    requested_at: '2026-09-10T11:20:00Z',
  },
];

export const INITIAL_MOCK_TICKETS_SUPPORT: SupportTicket[] = [
  {
    id: 'tkt-001',
    ticket_code: 'SUP-2026-001',
    sender_name: 'Ahmad Fauzi',
    sender_email: 'ahmad.fauzi@gmail.com',
    sender_role: 'customer',
    subject: 'E-Tiket QRIS Belum Masuk Email',
    message: 'Saya sudah bayar via QRIS dengan no order EVT-20260914-001 tapi e-ticket belum menerima lampiran PDF.',
    priority: 'high',
    status: 'in_progress',
    created_at: '2026-09-14T12:00:00Z',
    reply: 'Halo Ahmad, tim kami sudah melakukan resend e-ticket ke email Anda. Silakan cek folder Spam.',
  },
  {
    id: 'tkt-002',
    ticket_code: 'SUP-2026-002',
    sender_name: 'Siti Rahma',
    sender_email: 'siti@soundwave.co.id',
    sender_role: 'organizer',
    subject: 'Kendala Payout Dana Penjualan Festival',
    message: 'Mohon info mengenai status pencairan termin ke-2 untuk Soundwave Music Fest.',
    priority: 'medium',
    status: 'open',
    created_at: '2026-09-14T15:00:00Z',
  },
];

export const INITIAL_MOCK_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'brd-001',
    title: 'Pengumuman Maintenance Gate Scanner',
    message: 'Sistem aplikasi QR Scanner Panitia akan mengalami pembaharuan versi pada pukul 01:00 WIB.',
    target_audience: 'all_organizers',
    sent_count: 42,
    created_at: '2026-09-10T08:00:00Z',
  },
];

export const INITIAL_MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-1',
    code: 'EVENT_APPROVED',
    name: 'Persetujuan Event Panitia',
    subject: 'Selamat! Event {{event_title}} Telah Disetujui',
    body: 'Halo {{organizer_name}},\n\nSelamat, pengajuan event {{event_title}} telah disetujui oleh Administrator dan kini sudah tayang di portal publik.\n\nSalam,\nTim Eventify',
    variables: ['{{organizer_name}}', '{{event_title}}'],
  },
  {
    id: 'tpl-2',
    code: 'EVENT_REJECTED',
    name: 'Penolakan Event Panitia',
    subject: 'Pemberitahuan Event {{event_title}} Memerlukan Perbaikan',
    body: 'Halo {{organizer_name}},\n\nPengajuan event {{event_title}} membutuhkan perbaikan dengan catatan: {{reason}}.\n\nSalam,\nTim Eventify',
    variables: ['{{organizer_name}}', '{{event_title}}', '{{reason}}'],
  },
  {
    id: 'tpl-3',
    code: 'TICKET_CONFIRMATION',
    name: 'Konfirmasi Pembelian Tiket',
    subject: 'E-Ticket Eventify: {{event_title}} [{{order_code}}]',
    body: 'Halo {{user_name}},\n\nTerima kasih! Pembayaran order {{order_code}} senilai Rp {{amount}} telah kami terima.\nE-ticket dengan Kode QR siap digunakan pada venue.\n\nSalam,\nTim Eventify',
    variables: ['{{user_name}}', '{{order_code}}', '{{event_title}}', '{{amount}}'],
  },
];

export const INITIAL_MOCK_AUDIT_LOGS: AuditTrailLog[] = [
  {
    id: 'log-001',
    user_name: 'Budi Administrator',
    user_role: 'Super Admin',
    action: 'APPROVE_EVENT',
    target: 'Nusantara Soundwave Music Fest 2026',
    ip_address: '180.252.11.45',
    timestamp: '2026-09-14T10:00:00Z',
    details: 'Menerbitkan status event dari pending_approval menjadi published.',
  },
  {
    id: 'log-002',
    user_name: 'Budi Administrator',
    user_role: 'Super Admin',
    action: 'UPDATE_PAYMENT_CONFIG',
    target: 'Midtrans Production Mode',
    ip_address: '180.252.11.45',
    timestamp: '2026-09-13T16:20:00Z',
    details: 'Memperbarui API key Midtrans & menyalakan sandbox mode.',
  },
];

export const INITIAL_MOCK_SESSIONS: ActiveSession[] = [
  {
    id: 'ses-1',
    user_name: 'Budi Administrator',
    device: 'Windows 11 PC (Chrome 122)',
    browser: 'Chrome 122.0.0',
    ip_address: '180.252.11.45 (Jakarta, ID)',
    last_active: 'Aktif saat ini',
    is_current: true,
  },
  {
    id: 'ses-2',
    user_name: 'Budi Administrator',
    device: 'MacBook Pro M2 (Safari)',
    browser: 'Safari 17.2',
    ip_address: '180.252.88.12 (Bandung, ID)',
    last_active: '2 jam yang lalu',
    is_current: false,
  },
];

export const INITIAL_MOCK_ROLES: SubAdminRole[] = [
  {
    id: 'role-1',
    name: 'Super Administrator',
    description: 'Akses penuh tanpa batas ke semua modul sistem dan konfigurasi keuangan.',
    permissions: ['all_access'],
  },
  {
    id: 'role-2',
    name: 'Finance & Audit Admin',
    description: 'Akses ke laporan keuangan, refund, payout panitia, dan konfigurasi fee.',
    permissions: ['view_finance', 'manage_refunds', 'manage_payouts'],
  },
  {
    id: 'role-3',
    name: 'Event Reviewer & Mod',
    description: 'Akses persetujuan/penolakan event, kelola kategori, dan moderasi konten.',
    permissions: ['view_events', 'approve_events', 'edit_categories'],
  },
];

export const INITIAL_MOCK_PAGES: StaticPage[] = [
  {
    id: 'page-1',
    slug: 'terms-and-conditions',
    title: 'Syarat & Ketentuan Penggunaan Eventify',
    content: 'Syarat & Ketentuan platform Eventify mengatur ketentuan pendaftaran event, pembelian tiket, dan kewajiban penyelenggara event.',
    updated_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'page-2',
    slug: 'privacy-policy',
    title: 'Kebijakan Privasi & Keamanan Data',
    content: 'Kebijakan Privasi menjelaskan bagaimana data pribadi pengguna dikumpulkan, disimpan, dan dilindungi oleh Eventify.',
    updated_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'page-3',
    slug: 'faq',
    title: 'Pertanyaan Umum (FAQ)',
    content: 'Kumpulan jawaban pertanyaan yang sering diajukan mengenai cara pemesanan tiket, refund, dan pendaftaran panitia.',
    updated_at: '2026-02-01T00:00:00Z',
  },
];

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  maintenance_mode: false,
  maintenance_message: 'Sistem Eventify Mobile sedang dalam pemeliharaan berkala untuk peningkatan performa server. Harap kembali beberapa saat lagi.',
  platform_name: 'Eventify Indonesia',
  platform_logo_url: '/eventify-logo.png',
  support_email: 'support@eventify.id',
  support_phone: '+62 812-9988-7766',
  refund_policy_text: 'Pengajuan pengembalian dana (refund) hanya diizinkan maksimal H-3 sebelum event berlangsung dan bergantung pada persetujuan panitia.',
  payment_gateway: {
    midtrans_client_key: 'SB-Mid-client-8Xy9Z123009',
    midtrans_server_key: 'SB-Mid-server-99182377192',
    xendit_secret_key: 'xnd_development_192837192837',
    is_production: false,
  },
  platform_fee: {
    percentage_fee: 4.5,
    flat_fee_per_ticket: 2500,
  },
  smtp: {
    host: 'smtp.sendgrid.net',
    port: 587,
    username: 'apikey',
    from_email: 'no-reply@eventify.id',
    from_name: 'Eventify System',
    is_enabled: true,
  },
};

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  active_events: 3,
  pending_approval_events: 1,
  total_users: 7,
  total_organizers: 2,
  tickets_sold: 13495,
  gate_scans: 9820,
  total_revenue: 1845000000,
  pending_tickets_count: 1,
  pending_refunds_count: 1,
  daily_transactions: [
    { date: 'Senin', revenue: 145000000, orders: 320 },
    { date: 'Selasa', revenue: 210000000, orders: 480 },
    { date: 'Rabu', revenue: 190000000, orders: 410 },
    { date: 'Kamis', revenue: 280000000, orders: 620 },
    { date: 'Jumat', revenue: 350000000, orders: 750 },
    { date: 'Sabtu', revenue: 420000000, orders: 940 },
    { date: 'Minggu', revenue: 250000000, orders: 580 },
  ],
  recent_orders: INITIAL_MOCK_ORDERS,
  recent_events: INITIAL_MOCK_EVENTS,
  recent_activities: INITIAL_MOCK_AUDIT_LOGS,
};
