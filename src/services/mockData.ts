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

export const INITIAL_MOCK_USERS: User[] = [];

export const INITIAL_MOCK_CATEGORIES: EventCategory[] = [];

export const INITIAL_MOCK_EVENTS: EventItem[] = [];

export const INITIAL_MOCK_ORDERS: Order[] = [];

export const INITIAL_MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 'PT-101',
    event_id: 'EVT-001',
    event_title: 'Soundfest Music Festival 2026',
    user_name: 'Nayla Putri',
    user_email: 'nayla.putri@gmail.com',
    ticket_tier_name: 'VIP Frontstage & Regular Festival',
    registration_status: 'confirmed',
    registered_at: '2026-09-10T14:32:00Z',
    tickets: [
      { id: 'TCK-101-1', ticket_code: 'EVT1-VIP-001', ticket_tier_name: 'VIP FRONTSTAGE', is_checked_in: true, check_in_time: '2026-09-16T18:45:00Z' },
      { id: 'TCK-101-2', ticket_code: 'EVT1-VIP-002', ticket_tier_name: 'VIP FRONTSTAGE', is_checked_in: true, check_in_time: '2026-09-16T18:45:00Z' },
      { id: 'TCK-101-3', ticket_code: 'EVT1-REG-001', ticket_tier_name: 'REGULAR FESTIVAL', is_checked_in: false },
    ],
  },
  {
    id: 'PT-102',
    event_id: 'EVT-001',
    event_title: 'Soundfest Music Festival 2026',
    user_name: 'Budi Santoso',
    user_email: 'budi.santoso@yahoo.com',
    ticket_tier_name: 'VIP Frontstage',
    registration_status: 'checked_in',
    check_in_time: '2026-09-16T17:30:00Z',
    registered_at: '2026-09-11T09:15:00Z',
    tickets: [
      { id: 'TCK-102-1', ticket_code: 'EVT1-VIP-003', ticket_tier_name: 'VIP FRONTSTAGE', is_checked_in: true, check_in_time: '2026-09-16T17:30:00Z' },
      { id: 'TCK-102-2', ticket_code: 'EVT1-VIP-004', ticket_tier_name: 'VIP FRONTSTAGE', is_checked_in: true, check_in_time: '2026-09-16T17:30:00Z' },
    ],
  },
  {
    id: 'PT-103',
    event_id: 'EVT-002',
    event_title: 'Indonesia Tech Summit & Expo 2026',
    user_name: 'Rian Perdana',
    user_email: 'rian.perdana@techmail.id',
    ticket_tier_name: 'Regular Pass',
    registration_status: 'confirmed',
    registered_at: '2026-09-12T11:20:00Z',
    tickets: [
      { id: 'TCK-103-1', ticket_code: 'EVT2-REG-001', ticket_tier_name: 'REGULAR PASS', is_checked_in: false },
    ],
  },
  {
    id: 'PT-104',
    event_id: 'EVT-003',
    event_title: 'Startup Founder Meetup & Pitching',
    user_name: 'Siti Rahma',
    user_email: 'siti.rahma@gmail.com',
    ticket_tier_name: 'VIP Pass',
    registration_status: 'confirmed',
    registered_at: '2026-09-14T16:00:00Z',
    tickets: [
      { id: 'TCK-104-1', ticket_code: 'EVT3-VIP-001', ticket_tier_name: 'VIP PASS', is_checked_in: false },
      { id: 'TCK-104-2', ticket_code: 'EVT3-VIP-002', ticket_tier_name: 'VIP PASS', is_checked_in: false },
      { id: 'TCK-104-3', ticket_code: 'EVT3-VIP-003', ticket_tier_name: 'VIP PASS', is_checked_in: false },
    ],
  },
];

export const INITIAL_MOCK_APPROVAL_LOGS: ApprovalLog[] = [];

export const INITIAL_MOCK_REFUNDS: RefundRequest[] = [];

export const INITIAL_MOCK_PAYOUTS: PayoutRecord[] = [];

export const INITIAL_MOCK_TICKETS_SUPPORT: SupportTicket[] = [];

export const INITIAL_MOCK_BROADCASTS: BroadcastMessage[] = [];

export const INITIAL_MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [];

export const INITIAL_MOCK_AUDIT_LOGS: AuditTrailLog[] = [];

export const INITIAL_MOCK_SESSIONS: ActiveSession[] = [];

export const INITIAL_MOCK_ROLES: SubAdminRole[] = [];

export const INITIAL_MOCK_PAGES: StaticPage[] = [];

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  maintenance_mode: false,
  maintenance_message: '',
  platform_name: 'Eventify Indonesia',
  platform_logo_url: '/eventify-logo.png',
  support_email: '',
  support_phone: '',
  refund_policy_text: '',
  payment_gateway: {
    midtrans_client_key: '',
    midtrans_server_key: '',
    xendit_secret_key: '',
    is_production: false,
  },
  platform_fee: {
    percentage_fee: 0,
    flat_fee_per_ticket: 0,
  },
  smtp: {
    host: '',
    port: 587,
    username: '',
    from_email: '',
    from_name: '',
    is_enabled: false,
  },
};

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  active_events: 0,
  pending_approval_events: 0,
  total_users: 0,
  total_organizers: 0,
  tickets_sold: 0,
  gate_scans: 0,
  total_revenue: 0,
  pending_tickets_count: 0,
  pending_refunds_count: 0,
  daily_transactions: [],
  recent_orders: [],
  recent_events: [],
  recent_activities: [],
};
