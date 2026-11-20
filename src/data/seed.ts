/* ── Domain types ───────────────────────────────────────────────────────── */
import type {
  ID, Account, VirtualAccount, Card, CardGroup, CardRequest, TxType, Transaction,
  Payment, BillStatus, Bill, Invoice, ExpenseStatus, Expense, Recipient, AchAuth, Doc,
  User, ActionItem, CryptoWallet, CryptoAsset, ApiKey, ActivityEntry, PolicyRow, AccountingEntry,
} from './types';

export type {
  ID, Account, VirtualAccount, Card, CardGroup, CardRequest, TxType, Transaction,
  Payment, BillStatus, Bill, Invoice, ExpenseStatus, Expense, Recipient, AchAuth, Doc,
  User, ActionItem, CryptoWallet, CryptoAsset, ApiKey, ActivityEntry, PolicyRow, AccountingEntry,
} from './types';

/* ── Seed ───────────────────────────────────────────────────────────────── */

export const USER = { name: 'Victor Cardenas', first: 'Victor', email: 'victor@acme.com', role: 'Admin', initials: 'VC' };
export const ENTITY = { name: 'Victor Cardenas', slug: 'platinum', type: 'Business', ein: '88-1234567' };

export const accounts: Account[] = [
  { id: 'cash', name: 'Cash account', kind: 'cash', balance: 5828203.07, routing: '123456789', number: '123456789012345' },
  { id: 'secured', name: 'Secured card', kind: 'secured', balance: 0 },
  { id: 'treasury', name: 'Treasury account', kind: 'treasury', balance: 947598.08 },
];

export const virtualAccounts: VirtualAccount[] = [
  { id: 'va_primary', name: 'Primary account', balance: 4993845.1, takeRate: 0, routing: '858640731', number: '066200769267' },
  { id: 'va_slope', name: 'Slope Virtual Account', balance: 0, takeRate: 0 },
  { id: 'va_creative', name: 'Creative Team', balance: 212708.51, takeRate: 0, routing: '348029930', number: '97424553959' },
  { id: 'va_client', name: 'Client Services', balance: 163860.17, takeRate: 0, routing: '221696217', number: '73975166044' },
];

export const capital = {
  limit: 1_000_000,
  used: 305_000,
  available: 1_000_000,
  creditBalance: 0,
  apr: '12.4%',
  nextDue: 'Dec 1, 2026',
  minimum: 25_000,
};

export const cards: Card[] = [
  { id: 'c1', name: 'Amazon Associates', last4: '3240', virtualAccount: 'Primary account', group: 'Affiliate Platform Access', groupCount: 5, cardholder: 'Avery Chen', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 37168.08, type: 'virtual' },
  { id: 'c2', name: 'Etsy Partner Network', last4: '6576', virtualAccount: 'Primary account', group: 'Affiliate Platform Access', groupCount: 5, cardholder: 'Jordan Patel', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 15472.4, type: 'virtual' },
  { id: 'c3', name: 'Shopify Affiliates', last4: '9480', virtualAccount: 'Primary account', group: 'Affiliate Platform Access', groupCount: 5, cardholder: 'Morgan Rivera', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 19349.87, type: 'virtual' },
  { id: 'c4', name: 'eBay Partners', last4: '4228', virtualAccount: 'Primary account', group: 'Affiliate Platform Access', groupCount: 5, cardholder: 'No cardholder', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 31004.56, type: 'virtual' },
  { id: 'c5', name: 'Walmart Affiliates', last4: '9370', virtualAccount: 'Primary account', group: 'Affiliate Platform Access', groupCount: 5, cardholder: 'Casey Nguyen', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 11865.6, type: 'virtual' },
  { id: 'c6', name: 'Team Events', last4: '3682', virtualAccount: 'Primary account', group: 'Team Expenses', groupCount: 4, cardholder: 'Albert Tian', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 2406.76, type: 'virtual' },
  { id: 'c7', name: 'Office Supplies', last4: '3620', virtualAccount: 'Primary account', group: 'Team Expenses', groupCount: 4, cardholder: "Liam O'Connor", limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 2248.09, type: 'virtual' },
  { id: 'c8', name: 'Travel Expenses', last4: '8144', virtualAccount: 'Primary account', group: 'Team Expenses', groupCount: 4, cardholder: 'No cardholder', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 1994.65, type: 'virtual' },
  { id: 'c9', name: 'Client Meetings', last4: '9932', virtualAccount: 'Primary account', group: 'Team Expenses', groupCount: 4, cardholder: 'Jordan Patel', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 1732.89, type: 'virtual' },
  { id: 'c10', name: 'Affiliate Platform Access', last4: '0971', virtualAccount: 'Slope Virtual Account', group: 'Slope Account Cards', groupCount: 2, cardholder: 'Morgan Rivera', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 3003.28, type: 'virtual' },
  { id: 'c11', name: 'Affiliate Marketing 1', last4: '7332', virtualAccount: 'Slope Virtual Account', group: 'Slope Account Cards', groupCount: 2, cardholder: 'Taylor Brooks', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 2846.32, type: 'virtual' },
  { id: 'c12', name: 'Stock Photos', last4: '9510', virtualAccount: 'Creative Team', group: 'Design Resources', groupCount: 3, cardholder: 'No cardholder', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 1905.02, type: 'virtual' },
  { id: 'c13', name: 'Design Assets', last4: '1582', virtualAccount: 'Creative Team', group: 'Design Resources', groupCount: 3, cardholder: 'Albert Tian', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 1788.21, type: 'virtual' },
  { id: 'c14', name: 'Print Services', last4: '0528', virtualAccount: 'Creative Team', group: 'Design Resources', groupCount: 3, cardholder: "Liam O'Connor", limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 2167.02, type: 'virtual' },
  { id: 'c15', name: 'Client Dinners', last4: '4326', virtualAccount: 'Client Services', group: 'Client Entertainment', groupCount: 3, cardholder: 'Avery Chen', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 805.79, type: 'virtual' },
  { id: 'c16', name: 'Event Planning', last4: '7633', virtualAccount: 'Client Services', group: 'Client Entertainment', groupCount: 3, cardholder: 'No cardholder', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 749.04, type: 'virtual' },
  { id: 'c17', name: 'Venue Bookings', last4: '1730', virtualAccount: 'Client Services', group: 'Client Entertainment', groupCount: 3, cardholder: 'Morgan Rivera', limit: 'No limit', allowed: 'All allowed', status: 'Active', created: '10/17/25', spend30: 634.52, type: 'virtual' },
];

export const cardGroups: CardGroup[] = [
  { id: 'g1', name: 'Affiliate Platform Access', count: 5, limit: 'No limit', color: '#2f4f7f' },
  { id: 'g2', name: 'Team Expenses', count: 4, limit: '$25,000 / mo', color: '#4a6b4f' },
  { id: 'g3', name: 'Slope Account Cards', count: 2, limit: 'No limit', color: '#6b4f2f' },
  { id: 'g4', name: 'Design Resources', count: 3, limit: '$5,000 / mo', color: '#5b4a7f' },
  { id: 'g5', name: 'Client Entertainment', count: 3, limit: '$10,000 / mo', color: '#7f2f45' },
];

export const cardRequests: CardRequest[] = [
  { id: 'cr1', requester: 'Avery Chen', cardName: 'Client Offsite 2026', group: 'Client Entertainment', submitted: 'Nov 20, 2026', reason: 'Team offsite in Austin, needs a card with a $4,000 limit.' },
  { id: 'cr2', requester: 'Morgan Rivera', cardName: 'Paid Search Q4', group: 'Affiliate Platform Access', submitted: 'Nov 19, 2026', reason: 'Q4 paid search spend on Google Ads.' },
  { id: 'cr3', requester: 'Jordan Patel', cardName: 'Hardware Refresh', group: 'Team Expenses', submitted: 'Nov 18, 2026', reason: 'Two laptops for new designers.' },
  { id: 'cr4', requester: 'Taylor Brooks', cardName: 'Creator Payouts', group: 'Affiliate Platform Access', submitted: 'Nov 17, 2026', reason: 'Monthly creator bonus payouts.' },
];

const tx = (
  id: string,
  merchant: string,
  type: TxType,
  amount: number,
  dateLabel: string,
  date: string,
  account: string,
  method: Transaction['method'],
  status: Transaction['status'],
  extra: Partial<Transaction> = {},
): Transaction => ({ id, merchant, type, amount, dateLabel, date, account, method, status, ...extra });

export const transactions: Transaction[] = [
  tx('t1', 'TechServ LLC', 'ACH Payment', -2750, 'Scheduled for Dec 4th, 2026', '2026-12-04', 'cash', 'ACH', 'Scheduled', { scheduledFor: 'Dec 4, 2026' }),
  tx('t2', 'Global Supply Co', 'Wire Transfer', -12500, 'Scheduled for Nov 27th, 2026', '2026-11-27', 'cash', 'Wire', 'Scheduled', { scheduledFor: 'Nov 27, 2026' }),
  tx('t3', 'Acme Corp', 'ACH Payment', -4500, 'Scheduled for Nov 23rd, 2026', '2026-11-23', 'cash', 'ACH', 'Scheduled', { scheduledFor: 'Nov 23, 2026' }),
  tx('t4', 'Doordash', 'Card Transaction', -228.52, 'Nov 20th, 2026', '2026-11-20', 'secured', 'Card', 'Pending', { card: { name: 'Office Supplies', last4: '3620', group: 'Team Expenses' }, logo: 'DD', receipt: true }),
  tx('t5', 'Amazon Associates', 'Inbound ACH Credit', 100102.18, 'Nov 20th, 2026', '2026-11-20', 'cash', 'ACH', 'Succeeded'),
  tx('t6', 'Etsy Partner Network', 'Inbound ACH Credit', 215.94, 'Nov 20th, 2026', '2026-11-20', 'cash', 'ACH', 'Succeeded'),
  tx('t7', 'Amazon Associates', 'Card Transaction', -321.17, 'Nov 20th, 2026', '2026-11-20', 'secured', 'Card', 'Succeeded', { card: { name: 'Affiliate Marketing 1', last4: '7332', group: 'Slope Account Cards' } }),
  tx('t8', 'Linkedin', 'Card Transaction', -8.42, 'Nov 20th, 2026', '2026-11-20', 'secured', 'Card', 'Succeeded', { card: { name: 'Client Dinners', last4: '4326', group: 'Client Entertainment' } }),
  tx('t9', 'Upwork', 'Card Transaction', -15.3, 'Nov 20th, 2026', '2026-11-20', 'secured', 'Card', 'Pending', { card: { name: 'Event Planning', last4: '7633', group: 'Client Entertainment' } }),
  tx('t10', 'Office Depot', 'ACH Payment', -895, 'Nov 20th, 2026', '2026-11-20', 'cash', 'ACH', 'Pending'),
  tx('t11', 'Comcast Business', 'Inbound ACH Debit', -425, 'Nov 20th, 2026', '2026-11-20', 'cash', 'ACH', 'Pending'),
  tx('t12', 'Amazon Associates', 'Card Transaction', -3616.47, 'Nov 19th, 2026', '2026-11-19', 'secured', 'Card', 'Succeeded', { card: { name: 'Amazon Associates', last4: '3240', group: 'Affiliate Platform Access' } }),
  tx('t13', 'Etsy Partner Network', 'Card Transaction', -2342.16, 'Nov 19th, 2026', '2026-11-19', 'secured', 'Card', 'Succeeded', { card: { name: 'eBay Partners', last4: '4228', group: 'Affiliate Platform Access' } }),
  tx('t14', 'Chevron', 'Card Transaction', -7.42, 'Nov 19th, 2026', '2026-11-19', 'secured', 'Card', 'Succeeded', { card: { name: 'Travel Expenses', last4: '8144', group: 'Team Expenses' } }),
  tx('t15', 'American Airlines', 'Card Transaction', -16.2, 'Nov 19th, 2026', '2026-11-19', 'secured', 'Card', 'Succeeded', { card: { name: 'Travel Expenses', last4: '8144', group: 'Team Expenses' } }),
  tx('t16', 'Etsy Partner Network', 'Inbound ACH Credit', 1600.94, 'Nov 19th, 2026', '2026-11-19', 'cash', 'ACH', 'Succeeded'),
  tx('t17', 'Amazon Associates', 'Card Transaction', 90.88, 'Nov 19th, 2026', '2026-11-19', 'secured', 'Card', 'Succeeded', { card: { name: 'Affiliate Platform Access', last4: '0971', group: 'Slope Account Cards' } }),
  tx('t18', 'SLOPE', 'Inbound ACH Credit', 4984.33, 'Nov 19th, 2026', '2026-11-19', 'cash', 'ACH', 'Succeeded'),
  tx('t19', 'Linkedin', 'Card Transaction', -200.02, 'Nov 19th, 2026', '2026-11-19', 'secured', 'Card', 'Succeeded', { card: { name: 'Print Services', last4: '0528', group: 'Design Resources' } }),
  tx('t20', 'Upwork', 'Card Transaction', -19.95, 'Nov 19th, 2026', '2026-11-19', 'secured', 'Card', 'Succeeded', { card: { name: 'Client Dinners', last4: '4326', group: 'Client Entertainment' } }),
  tx('t21', 'Amazon Web Services', 'ACH Payment', -3200, 'Nov 19th, 2026', '2026-11-19', 'cash', 'ACH', 'Succeeded'),
  tx('t22', 'Amazon Associates', 'Card Transaction', -1037.03, 'Nov 18th, 2026', '2026-11-18', 'secured', 'Card', 'Succeeded', { card: { name: 'Amazon Associates', last4: '3240', group: 'Affiliate Platform Access' } }),
  tx('t23', 'Google Workspace', 'Card Transaction', -144, 'Nov 18th, 2026', '2026-11-18', 'secured', 'Card', 'Succeeded', { card: { name: 'Team Events', last4: '3682', group: 'Team Expenses' } }),
  tx('t24', 'Figma', 'Card Transaction', -75, 'Nov 18th, 2026', '2026-11-18', 'secured', 'Card', 'Succeeded', { card: { name: 'Design Assets', last4: '1582', group: 'Design Resources' } }),
  tx('t25', 'WeWork', 'ACH Payment', -4500, 'Nov 17th, 2026', '2026-11-17', 'cash', 'ACH', 'Succeeded'),
  tx('t26', 'Stripe', 'Inbound ACH Credit', 86211.4, 'Nov 17th, 2026', '2026-11-17', 'cash', 'ACH', 'Succeeded'),
  tx('t27', 'Notion', 'Card Transaction', -48, 'Nov 17th, 2026', '2026-11-17', 'secured', 'Card', 'Succeeded', { card: { name: 'Stock Photos', last4: '9510', group: 'Design Resources' } }),
  tx('t28', 'Vercel', 'Card Transaction', -200, 'Nov 16th, 2026', '2026-11-16', 'secured', 'Card', 'Failed', { card: { name: 'Print Services', last4: '0528', group: 'Design Resources' } }),
  tx('t29', 'Stripe', 'Card Transaction', -3562, 'Nov 16th, 2026', '2026-11-16', 'secured', 'Card', 'Failed', { card: { name: 'Client Meetings', last4: '9932', group: 'Team Expenses' } }),
  tx('t30', 'Walmart Affiliates', 'Inbound ACH Credit', 15230.55, 'Nov 16th, 2026', '2026-11-16', 'cash', 'ACH', 'Succeeded'),
];

export const transactionsTotals = {
  count: 860,
  moneyIn: 12_572_836.16,
  moneyOut: -6_833_868.71,
  net: 5_738_967.45,
};

export const paymentRequests: Payment[] = [
  { id: 'p1', vendor: 'Office Depot', type: 'ACH Payment', owner: 'Albert Tian', approvals: 'Needs your approval', amount: -895, schedule: 'Immediate', dueDate: '—', method: 'ACH', account: 'Cash', status: 'Needs your approval', dateLabel: 'Yesterday, Nov 20th, 2026', attachments: 0, notes: 'Office restock' },
  { id: 'p2', vendor: 'Amazon Web Services', type: 'ACH Payment', owner: 'Victor Cardenas', approvals: 'Needs your approval', amount: -3200, schedule: 'Immediate', dueDate: '—', method: 'ACH', account: 'Cash', status: 'Needs your approval', dateLabel: 'Nov 19th, 2026', attachments: 0, notes: 'Cloud infrastructure' },
  { id: 'p3', vendor: 'WeWork', type: 'ACH Payment', owner: 'Morgan Rivera', approvals: 'Waiting on Albert Tian', amount: -6500, schedule: 'Immediate', dueDate: '—', method: 'ACH', account: 'Cash', status: 'Waiting on approver', dateLabel: 'Nov 18th, 2026', attachments: 0, notes: 'December desk allocation' },
];

export const queuedPayments: Payment[] = [
  { id: 'q1', vendor: 'TechServ LLC', type: 'ACH Payment', owner: 'Victor Cardenas', approvals: 'Approved', amount: -2750, schedule: 'Scheduled', dueDate: 'Dec 4, 2026', method: 'ACH', account: 'Cash', status: 'Pending', dateLabel: 'Scheduled for Dec 4th, 2026', attachments: 0, notes: 'Recurring IT services' },
  { id: 'q2', vendor: 'Global Supply Co', type: 'Wire Transfer', owner: 'Victor Cardenas', approvals: 'Approved', amount: -12500, schedule: 'Scheduled', dueDate: 'Nov 27, 2026', method: 'Wire', account: 'Cash', status: 'Pending', dateLabel: 'Scheduled for Nov 27th, 2026', attachments: 1, notes: 'Inventory deposit' },
  { id: 'q3', vendor: 'Acme Corp', type: 'ACH Payment', owner: 'Avery Chen', approvals: 'Approved', amount: -4500, schedule: 'Scheduled', dueDate: 'Nov 23, 2026', method: 'ACH', account: 'Cash', status: 'Pending', dateLabel: 'Scheduled for Nov 23rd, 2026', attachments: 0, notes: 'Legal retainer' },
  { id: 'q4', vendor: 'Figma', type: 'ACH Payment', owner: 'Victor Cardenas', approvals: 'Approved', amount: -75, schedule: 'Scheduled', dueDate: 'Dec 19, 2026', method: 'ACH', account: 'Cash', status: 'Pending', dateLabel: 'Scheduled for Dec 19th, 2026', attachments: 0, notes: 'Monthly design tools' },
  { id: 'q5', vendor: 'Google Workspace', type: 'ACH Payment', owner: 'Victor Cardenas', approvals: 'Approved', amount: -144, schedule: 'Scheduled', dueDate: 'Dec 18, 2026', method: 'ACH', account: 'Cash', status: 'Pending', dateLabel: 'Scheduled for Dec 18th, 2026', attachments: 0, notes: '' },
];

export const upcomingPayments: Payment[] = [
  { id: 'u1', vendor: 'WeWork', type: 'ACH Payment', owner: 'Victor Cardenas', approvals: 'Approved', amount: -4500, schedule: 'Nov 30, 2026', dueDate: 'Nov 30, 2026', method: 'ACH', account: 'Cash', status: 'Scheduled', dateLabel: 'Upcoming · Nov 30th, 2026', attachments: 0, notes: 'Q2 office space lease' },
  { id: 'u2', vendor: 'AWS', type: 'ACH Payment', owner: 'Victor Cardenas', approvals: 'Approved', amount: -2875.43, schedule: 'Nov 25, 2026', dueDate: 'Nov 25, 2026', method: 'ACH', account: 'Cash', status: 'Scheduled', dateLabel: 'Upcoming · Nov 25th, 2026', attachments: 0, notes: 'March cloud infrastructure' },
  { id: 'u3', vendor: 'Notion', type: 'ACH Payment', owner: 'Victor Cardenas', approvals: 'Approved', amount: -48, schedule: 'Dec 1, 2026', dueDate: 'Dec 1, 2026', method: 'ACH', account: 'Cash', status: 'Scheduled', dateLabel: 'Upcoming · Dec 1st, 2026', attachments: 0, notes: '' },
];

export const sentPayments: Payment[] = [
  { id: 's1', vendor: 'Notion', type: 'ACH Payment', owner: 'Victor Cardenas', approvals: 'Paid', amount: -48, schedule: 'Nov 5, 2026', dueDate: 'Nov 5, 2026', method: 'ACH', account: 'Cash', status: 'Paid', dateLabel: 'Nov 5th, 2026', attachments: 0, notes: '' },
  { id: 's2', vendor: 'Vercel', type: 'ACH Payment', owner: 'Victor Cardenas', approvals: 'Paid', amount: -200, schedule: 'Oct 31, 2026', dueDate: 'Oct 31, 2026', method: 'ACH', account: 'Cash', status: 'Paid', dateLabel: 'Oct 31st, 2026', attachments: 0, notes: '' },
  { id: 's3', vendor: 'HubSpot', type: 'Wire Transfer', owner: 'Victor Cardenas', approvals: 'Paid', amount: -900, schedule: 'Oct 21, 2026', dueDate: 'Oct 21, 2026', method: 'Wire', account: 'Cash', status: 'Paid', dateLabel: 'Oct 21st, 2026', attachments: 2, notes: 'Q1 CRM subscription - 50% paid' },
  { id: 's4', vendor: 'Stripe', type: 'Wire Transfer', owner: 'Avery Chen', approvals: 'Declined', amount: -3562, schedule: 'Oct 6, 2026', dueDate: 'Oct 6, 2026', method: 'Wire', account: 'Cash', status: 'Declined', dateLabel: 'Oct 6th, 2026', attachments: 1, notes: 'February processing fees' },
];

export const bills: Bill[] = [
  { id: 'b1', vendor: 'Figma', owner: 'Victor Cardenas', status: 'Draft', amount: 75, dueDate: 'Dec 19, 2026', dueMeta: '28 days left', invoiceDate: 'Nov 19, 2026', invoiceNo: 'FIG-2026-0412', notes: 'Monthly design tool subscription', paid: 0 },
  { id: 'b2', vendor: 'Google Workspace', owner: 'Victor Cardenas', status: 'Draft', amount: 144, dueDate: 'Dec 18, 2026', dueMeta: '27 days left', invoiceDate: 'Nov 18, 2026', invoiceNo: 'GWS-2026-04', notes: '—', paid: 0 },
  { id: 'b3', vendor: 'WeWork', owner: 'Victor Cardenas', status: 'Pending approval', amount: 4500, dueDate: 'Nov 30, 2026', dueMeta: '9 days left', invoiceDate: 'Nov 15, 2026', invoiceNo: 'WW-Q2-2026', notes: 'Q2 office space lease', paid: 0 },
  { id: 'b4', vendor: 'AWS', owner: 'Victor Cardenas', status: 'Scheduled', amount: 2875.43, dueDate: 'Nov 25, 2026', dueMeta: '4 days left', invoiceDate: 'Nov 10, 2026', invoiceNo: 'AWS-2026-03', notes: 'March cloud infrastructure', paid: 0 },
  { id: 'b5', vendor: 'Notion', owner: 'Victor Cardenas', status: 'Paid', amount: 48, dueDate: 'Nov 5, 2026', dueMeta: 'Paid', invoiceDate: 'Oct 21, 2026', invoiceNo: 'NOT-2026-03', notes: '—', paid: 48 },
  { id: 'b6', vendor: 'Vercel', owner: 'Victor Cardenas', status: 'Paid', amount: 200, dueDate: 'Oct 31, 2026', dueMeta: 'Paid', invoiceDate: 'Oct 16, 2026', invoiceNo: 'VRC-2026-03', notes: '—', paid: 200 },
  { id: 'b7', vendor: 'Stripe', owner: 'Victor Cardenas', status: 'Payment failed', amount: 3562, dueDate: 'Nov 5, 2026', dueMeta: '15 days overdue', invoiceDate: 'Oct 6, 2026', invoiceNo: 'STR-2026-02', notes: 'February processing fees', paid: 0 },
  { id: 'b8', vendor: 'HubSpot', owner: 'Victor Cardenas', status: 'Partially paid', amount: 1800, dueDate: 'Oct 21, 2026', dueMeta: '30 days overdue', invoiceDate: 'Sep 21, 2026', invoiceNo: 'HS-2026-Q1', notes: 'Q1 CRM subscription - 50% paid', paid: 900 },
];

export const invoices: Invoice[] = [
  { id: 'i1', number: 'INV-2026-0031', customer: 'Northwind Traders', amount: 24500, status: 'Sent', dueDate: 'Dec 12, 2026', issued: 'Nov 12, 2026', memo: 'Q4 platform retainer' },
  { id: 'i2', number: 'INV-2026-0030', customer: 'Globex Corporation', amount: 8600, status: 'Viewed', dueDate: 'Dec 2, 2026', issued: 'Nov 2, 2026', memo: 'Integration work — phase 2' },
  { id: 'i3', number: 'INV-2026-0029', customer: 'Initech', amount: 12400, status: 'Paid', dueDate: 'Nov 18, 2026', issued: 'Oct 19, 2026', memo: 'Managed services — October' },
  { id: 'i4', number: 'INV-2026-0028', customer: 'Umbrella Group', amount: 5320, status: 'Overdue', dueDate: 'Nov 8, 2026', issued: 'Oct 9, 2026', memo: 'Advisory hours' },
  { id: 'i5', number: 'INV-2026-0027', customer: 'Soylent Labs', amount: 19750, status: 'Paid', dueDate: 'Nov 1, 2026', issued: 'Oct 2, 2026', memo: 'Annual license renewal' },
  { id: 'i6', number: 'INV-2026-0026', customer: 'Hooli', amount: 3400, status: 'Draft', dueDate: 'Dec 20, 2026', issued: 'Nov 20, 2026', memo: 'Design sprint' },
  { id: 'i7', number: 'INV-2026-0025', customer: 'Vehement Capital', amount: 9900, status: 'Sent', dueDate: 'Nov 28, 2026', issued: 'Oct 29, 2026', memo: 'Data room setup' },
  { id: 'i8', number: 'INV-2026-0024', customer: 'Massive Dynamic', amount: 44000, status: 'Viewed', dueDate: 'Dec 15, 2026', issued: 'Nov 15, 2026', memo: 'Enterprise onboarding' },
];

export const invoiceSeries = [
  { id: 'ser1', name: 'Northwind monthly retainer', customer: 'Northwind Traders', cadence: 'Monthly', next: 'Dec 12, 2026', amount: 24500, status: 'Active' },
  { id: 'ser2', name: 'Globex milestone billing', customer: 'Globex Corporation', cadence: 'On completion', next: '—', amount: 8600, status: 'Active' },
  { id: 'ser3', name: 'Initech managed services', customer: 'Initech', cadence: 'Monthly', next: 'Dec 18, 2026', amount: 12400, status: 'Paused' },
];

export const expenses: Expense[] = [
  { id: 'e1', employee: 'Avery Chen', merchant: 'Delta Air Lines', category: 'Travel', amount: 642.4, submitted: 'Nov 20, 2026', status: 'Needs review', receipts: 1, note: 'Client visit — Austin' },
  { id: 'e2', employee: 'Jordan Patel', merchant: 'Hyatt Place', category: 'Lodging', amount: 388.12, submitted: 'Nov 20, 2026', status: 'Needs review', receipts: 1, note: 'Two nights' },
  { id: 'e3', employee: 'Morgan Rivera', merchant: 'Uber', category: 'Transport', amount: 74.3, submitted: 'Nov 19, 2026', status: 'Approved', receipts: 1, note: 'Airport transfer' },
  { id: 'e4', employee: 'Albert Tian', merchant: 'Blue Bottle Coffee', category: 'Meals', amount: 42.18, submitted: 'Nov 19, 2026', status: 'Approved', receipts: 1, note: 'Team sync' },
  { id: 'e5', employee: "Liam O'Connor", merchant: 'Apple Store', category: 'Equipment', amount: 2199, submitted: 'Nov 18, 2026', status: 'Payment complete', receipts: 2, note: 'MacBook Pro 14"' },
  { id: 'e6', employee: 'Taylor Brooks', merchant: 'Canva', category: 'Software', amount: 149.99, submitted: 'Nov 18, 2026', status: 'Processing payment', receipts: 1, note: 'Team plan' },
  { id: 'e7', employee: 'Casey Nguyen', merchant: 'Staples', category: 'Office', amount: 87.44, submitted: 'Nov 17, 2026', status: 'Payment complete', receipts: 1, note: 'Supplies' },
  { id: 'e8', employee: 'Avery Chen', merchant: 'Figma', category: 'Software', amount: 45, submitted: 'Nov 17, 2026', status: 'Payment complete', receipts: 0, note: 'Missing receipt' },
  { id: 'e9', employee: 'Jordan Patel', merchant: 'DoorDash', category: 'Meals', amount: 63.2, submitted: 'Nov 16, 2026', status: 'Rejected', receipts: 1, note: 'Personal meal' },
  { id: 'e10', employee: 'Morgan Rivera', merchant: 'Amazon', category: 'Office', amount: 321.17, submitted: 'Nov 16, 2026', status: 'Payment complete', receipts: 1, note: 'Desk accessories' },
  { id: 'e11', employee: 'Albert Tian', merchant: 'United Airlines', category: 'Travel', amount: 980.5, submitted: 'Nov 15, 2026', status: 'Cancelled', receipts: 1, note: 'Cancelled trip' },
  { id: 'e12', employee: 'Taylor Brooks', merchant: 'Notion', category: 'Software', amount: 24, submitted: 'Nov 14, 2026', status: 'Payment complete', receipts: 1, note: '' },
];

export const expenseCounts = { pendingReview: 4, cancelled: 1, rejected: 1, processing: 1, complete: 5, failed: 0 };

export const recipients: Recipient[] = [
  { id: 'r1', name: 'Amazon Associates', email: 'payments-us@amazon.com', taxDoc: 'Pending request', lastPayment: '-', totalPaid: 0 },
  { id: 'r2', name: 'Etsy Partner Network', email: 'affiliates@etsy.com', taxDoc: 'Missing', lastPayment: '-', totalPaid: 0 },
  { id: 'r3', name: 'Shopify Affiliates', email: 'partners@shopify.com', taxDoc: 'Missing', lastPayment: '-', totalPaid: 0 },
  { id: 'r4', name: 'eBay Partner Network', email: 'epn@ebay.com', taxDoc: 'Missing', lastPayment: '-', totalPaid: 0 },
  { id: 'r5', name: 'Walmart Affiliate Program', email: 'affiliates@walmart.com', taxDoc: 'Missing', lastPayment: '-', totalPaid: 0 },
  { id: 'r6', name: 'London Creative Partners Ltd', email: 'accounts@londoncreativepartners.co.uk', taxDoc: 'Verified', lastPayment: 'Nov 12, 2026', totalPaid: 18400 },
  { id: 'r7', name: 'Adobe Inc.', email: 'billing@adobe.com', taxDoc: 'Verified', lastPayment: 'Nov 8, 2026', totalPaid: 2412.6 },
  { id: 'r8', name: 'Figma', email: 'billing@figma.com', taxDoc: 'Verified', lastPayment: 'Nov 19, 2026', totalPaid: 900 },
  { id: 'r9', name: 'Google Workspace', email: 'billing@googleworkspace.com', taxDoc: 'Verified', lastPayment: 'Nov 18, 2026', totalPaid: 1728 },
  { id: 'r10', name: 'WeWork', email: 'billing@wework.com', taxDoc: 'Verified', lastPayment: 'Nov 17, 2026', totalPaid: 54000 },
  { id: 'r11', name: 'AWS', email: 'billing@aws.com', taxDoc: 'Verified', lastPayment: 'Nov 19, 2026', totalPaid: 34505.16 },
  { id: 'r12', name: 'Notion', email: 'billing@notion.com', taxDoc: 'Verified', lastPayment: 'Nov 5, 2026', totalPaid: 576 },
  { id: 'r13', name: 'Vercel', email: 'billing@vercel.com', taxDoc: 'Verified', lastPayment: 'Oct 31, 2026', totalPaid: 2400 },
  { id: 'r14', name: 'Stripe', email: 'billing@stripe.com', taxDoc: 'Verified', lastPayment: 'Oct 6, 2026', totalPaid: 42744 },
  { id: 'r15', name: 'HubSpot', email: 'billing@hubspot.com', taxDoc: 'Verified', lastPayment: 'Oct 21, 2026', totalPaid: 10800 },
];

export const achAuthorizations: AchAuth[] = [
  { id: 'a1', originator: 'Comcast Business', amount: -425, requested: 'Nov 20, 2026', account: 'Cash account · 2345', status: 'Pending', code: 'WEB', dueDate: 'Nov 22, 2026' },
  { id: 'a2', originator: 'ADP Payroll', amount: -18420.55, requested: 'Nov 20, 2026', account: 'Cash account · 2345', status: 'Pending', code: 'CCD', dueDate: 'Nov 24, 2026' },
  { id: 'a3', originator: 'Verizon Wireless', amount: -312.4, requested: 'Nov 18, 2026', account: 'Cash account · 2345', status: 'Approved', code: 'WEB', dueDate: 'Nov 20, 2026' },
  { id: 'a4', originator: 'City of Austin', amount: -1280, requested: 'Nov 15, 2026', account: 'Cash account · 2345', status: 'Approved', code: 'CTX', dueDate: 'Nov 18, 2026' },
];

export const documents: Doc[] = [
  { id: 'd1', name: 'Articles of Incorporation', category: 'ENTITY', kind: 'PDF', size: '412 KB', uploaded: 'Sep 12, 2026' },
  { id: 'd2', name: 'EIN Confirmation Letter (CP 575)', category: 'ENTITY', kind: 'PDF', size: '88 KB', uploaded: 'Sep 12, 2026' },
  { id: 'd3', name: 'Operating Agreement', category: 'ENTITY', kind: 'PDF', size: '1.2 MB', uploaded: 'Sep 14, 2026' },
  { id: 'd4', name: 'Bank Letter — Acme Operating', category: 'ENTITY', kind: 'PDF', size: '96 KB', uploaded: 'Oct 2, 2026' },
  { id: 'd5', name: 'Cash account statement — Oct 2026', category: 'ACCOUNT', kind: 'PDF', size: '284 KB', uploaded: 'Nov 1, 2026' },
  { id: 'd6', name: 'Cash account statement — Sep 2026', category: 'ACCOUNT', kind: 'PDF', size: '271 KB', uploaded: 'Oct 1, 2026' },
  { id: 'd7', name: 'Treasury statement — Q3 2026', category: 'ACCOUNT', kind: 'PDF', size: '198 KB', uploaded: 'Oct 4, 2026' },
  { id: 'd8', name: 'Card transactions — Oct 2026', category: 'CARD', kind: 'CSV', size: '1.4 MB', uploaded: 'Nov 1, 2026' },
  { id: 'd9', name: 'Card transactions — Sep 2026', category: 'CARD', kind: 'CSV', size: '1.1 MB', uploaded: 'Oct 1, 2026' },
  { id: 'd10', name: '1099-K — 2025', category: 'TAX', kind: 'PDF', size: '76 KB', uploaded: 'Jan 28, 2026' },
  { id: 'd11', name: 'W-9 — Victor Cardenas LLC', category: 'TAX', kind: 'PDF', size: '64 KB', uploaded: 'Sep 12, 2026' },
];

export const users: User[] = [
  { id: 'us1', name: 'Victor Cardenas', email: 'victor@acme.com', role: 'Admin', status: 'Active', lastActive: 'Now', initials: 'VC' },
  { id: 'us2', name: 'Avery Chen', email: 'avery@acme.com', role: 'Controller', status: 'Active', lastActive: '12 minutes ago', initials: 'AC' },
  { id: 'us3', name: 'Jordan Patel', email: 'jordan@acme.com', role: 'Bookkeeper', status: 'Active', lastActive: '2 hours ago', initials: 'JP' },
  { id: 'us4', name: 'Morgan Rivera', email: 'morgan@acme.com', role: 'Cardholder', status: 'Active', lastActive: 'Yesterday', initials: 'MR' },
  { id: 'us5', name: 'Albert Tian', email: 'albert@acme.com', role: 'Cardholder', status: 'Active', lastActive: '2 days ago', initials: 'AT' },
  { id: 'us6', name: "Liam O'Connor", email: 'liam@acme.com', role: 'Cardholder', status: 'Invited', lastActive: '—', initials: 'LO' },
  { id: 'us7', name: 'Taylor Brooks', email: 'taylor@acme.com', role: 'Cardholder', status: 'Suspended', lastActive: 'Oct 2, 2026', initials: 'TB' },
];

export const actionItems: ActionItem[] = [
  {
    id: 'ac1', title: 'Office Depot', subtitle: 'ACH Payment · requested by Albert Tian', kind: 'payment', amount: -895, requestedBy: 'Albert Tian', when: 'Yesterday, Nov 20th, 2026', status: 'action_required', tab: 'Payments',
    detail: [ { label: 'Amount', value: '-$895.00' }, { label: 'Method', value: 'ACH' }, { label: 'Account', value: 'Cash account · 2345' }, { label: 'Schedule', value: 'Immediate' }, { label: 'Memo', value: 'Office restock' } ],
  },
  {
    id: 'ac2', title: 'Amazon Web Services', subtitle: 'ACH Payment · requested by Victor Cardenas', kind: 'payment', amount: -3200, requestedBy: 'Victor Cardenas', when: 'Nov 19th, 2026', status: 'action_required', tab: 'Payments',
    detail: [ { label: 'Amount', value: '-$3,200.00' }, { label: 'Method', value: 'ACH' }, { label: 'Account', value: 'Cash account · 2345' }, { label: 'Schedule', value: 'Immediate' }, { label: 'Memo', value: 'Cloud infrastructure' } ],
  },
  {
    id: 'ac3', title: 'WeWork', subtitle: 'ACH Payment · waiting on Albert Tian', kind: 'payment', amount: -6500, requestedBy: 'Morgan Rivera', when: 'Nov 18th, 2026', status: 'action_required', tab: 'Payments',
    detail: [ { label: 'Amount', value: '-$6,500.00' }, { label: 'Method', value: 'ACH' }, { label: 'Account', value: 'Cash account · 2345' }, { label: 'Approver', value: 'Albert Tian' } ],
  },
  {
    id: 'ac4', title: 'Avery Chen', subtitle: 'Expense report · 1 receipt attached', kind: 'expense', amount: -642.4, requestedBy: 'Avery Chen', when: 'Nov 20th, 2026', status: 'action_required', tab: 'Reimbursements',
    detail: [ { label: 'Amount', value: '-$642.40' }, { label: 'Merchant', value: 'Delta Air Lines' }, { label: 'Category', value: 'Travel' }, { label: 'Receipts', value: '1' } ],
  },
  {
    id: 'ac5', title: 'Jordan Patel', subtitle: 'Expense report · 1 receipt attached', kind: 'expense', amount: -388.12, requestedBy: 'Jordan Patel', when: 'Nov 20th, 2026', status: 'action_required', tab: 'Reimbursements',
    detail: [ { label: 'Amount', value: '-$388.12' }, { label: 'Merchant', value: 'Hyatt Place' }, { label: 'Category', value: 'Lodging' }, { label: 'Receipts', value: '1' } ],
  },
  {
    id: 'ac6', title: 'Client Offsite 2026', subtitle: 'Card request · requested by Avery Chen', kind: 'card', requestedBy: 'Avery Chen', when: 'Nov 20th, 2026', status: 'action_required', tab: 'Cards',
    detail: [ { label: 'Group', value: 'Client Entertainment' }, { label: 'Requested limit', value: '$4,000 / mo' }, { label: 'Reason', value: 'Team offsite in Austin' } ],
  },
  {
    id: 'ac7', title: 'Comcast Business', subtitle: 'ACH debit · authorization required', kind: 'ach', amount: -425, requestedBy: 'Comcast Business', when: 'Nov 20th, 2026', status: 'action_required', tab: 'ACH Debits',
    detail: [ { label: 'Amount', value: '-$425.00' }, { label: 'SEC code', value: 'WEB' }, { label: 'Account', value: 'Cash account · 2345' } ],
  },
  {
    id: 'ac8', title: 'WeWork', subtitle: 'ACH Payment · waiting on Albert Tian', kind: 'payment', amount: -6500, requestedBy: 'Morgan Rivera', when: 'Nov 18th, 2026', status: 'pending', tab: 'Payments',
    detail: [ { label: 'Approver', value: 'Albert Tian' }, { label: 'Amount', value: '-$6,500.00' } ],
  },
  {
    id: 'ac9', title: 'Taylor Brooks', subtitle: 'Card replacement · processing', kind: 'card', requestedBy: 'Taylor Brooks', when: 'Nov 17th, 2026', status: 'pending', tab: 'Cards',
    detail: [ { label: 'Card', value: 'Affiliate Marketing 1 · 7332' }, { label: 'Reason', value: 'Damaged' } ],
  },
  {
    id: 'ac10', title: 'Verizon Wireless', subtitle: 'ACH debit · approved', kind: 'ach', amount: -312.4, requestedBy: 'Verizon Wireless', when: 'Nov 18th, 2026', status: 'completed', tab: 'ACH Debits',
    detail: [ { label: 'Amount', value: '-$312.40' }, { label: 'Decision', value: 'Approved by Victor Cardenas' } ],
  },
  {
    id: 'ac11', title: 'City of Austin', subtitle: 'ACH debit · approved', kind: 'ach', amount: -1280, requestedBy: 'City of Austin', when: 'Nov 15th, 2026', status: 'completed', tab: 'ACH Debits',
    detail: [ { label: 'Amount', value: '-$1,280.00' }, { label: 'Decision', value: 'Approved by Victor Cardenas' } ],
  },
  {
    id: 'ac12', title: 'Morgan Rivera', subtitle: 'Expense report · approved', kind: 'expense', amount: -74.3, requestedBy: 'Morgan Rivera', when: 'Nov 19th, 2026', status: 'completed', tab: 'Reimbursements',
    detail: [ { label: 'Amount', value: '-$74.30' }, { label: 'Decision', value: 'Approved' } ],
  },
  {
    id: 'ac13', title: 'Albert Tian', subtitle: 'Expense report · approved', kind: 'expense', amount: -42.18, requestedBy: 'Albert Tian', when: 'Nov 19th, 2026', status: 'completed', tab: 'Reimbursements',
    detail: [ { label: 'Amount', value: '-$42.18' }, { label: 'Decision', value: 'Approved' } ],
  },
];

export const wallets: CryptoWallet[] = [
  { id: 'w1', label: 'Operating wallet', chain: 'Ethereum', address: '0x8f3a...4c21', balance: 128450.22, createdAt: 'Aug 4, 2026' },
  { id: 'w2', label: 'Creator payouts', chain: 'Base', address: '0x2d7b...91ae', balance: 32180.6, createdAt: 'Sep 22, 2026' },
];

export const cryptoAssets: CryptoAsset[] = [
  { id: 'ca1', token: 'USDC', wallet: 'Operating wallet', amount: 96420.5, price: 1, pl: 0 },
  { id: 'ca2', token: 'ETH', wallet: 'Operating wallet', amount: 12.84, price: 2491.4, pl: 4120.18 },
  { id: 'ca3', token: 'USDC', wallet: 'Creator payouts', amount: 32180.6, price: 1, pl: 0 },
  { id: 'ca4', token: 'SOL', wallet: 'Creator payouts', amount: 0, price: 148.2, pl: 0 },
];

export const apiKeys: ApiKey[] = [
  { id: 'k1', label: 'Production — accounting sync', prefix: 'sk_live_4a91', created: 'Aug 12, 2026', lastUsed: '3 minutes ago', scope: 'Read / Write' },
  { id: 'k2', label: 'Sandbox', prefix: 'sk_test_88bd', created: 'Sep 1, 2026', lastUsed: 'Yesterday', scope: 'Read only' },
];

export const activityLog: ActivityEntry[] = [
  { id: 'al1', actor: 'Victor Cardenas', action: 'Approved payment', target: 'Amazon Web Services · $3,200.00', when: 'Nov 20, 2026 · 4:12 PM' },
  { id: 'al2', actor: 'Avery Chen', action: 'Created virtual card', target: 'Client Offsite 2026', when: 'Nov 20, 2026 · 2:48 PM' },
  { id: 'al3', actor: 'Victor Cardenas', action: 'Invited user', target: 'liam@acme.com', when: 'Nov 19, 2026 · 11:02 AM' },
  { id: 'al4', actor: 'Jordan Patel', action: 'Submitted expense', target: 'Delta Air Lines · $642.40', when: 'Nov 20, 2026 · 9:31 AM' },
  { id: 'al5', actor: 'Victor Cardenas', action: 'Updated card limit', target: 'Team Expenses · $25,000 / mo', when: 'Nov 18, 2026 · 5:20 PM' },
  { id: 'al6', actor: 'System', action: 'Synced to QuickBooks', target: '142 entries', when: 'Nov 18, 2026 · 3:00 AM' },
];

export const cardPolicies: PolicyRow[] = [
  { id: 'pl1', name: 'Default card limit', scope: 'All cards', limit: '$25,000 / mo', merchants: 'All allowed', status: 'Active' },
  { id: 'pl2', name: 'Affiliate platform spend', scope: 'Affiliate Platform Access', limit: 'No limit', merchants: 'Ad platforms only', status: 'Active' },
  { id: 'pl3', name: 'Travel & entertainment', scope: 'Client Entertainment', limit: '$10,000 / mo', merchants: 'Travel, dining', status: 'Active' },
  { id: 'pl4', name: 'Design tooling', scope: 'Design Resources', limit: '$5,000 / mo', merchants: 'Software only', status: 'Active' },
  { id: 'pl5', name: 'ATM withdrawals', scope: 'Physical cards', limit: '$500 / day', merchants: 'ATM', status: 'Draft' },
];

export const approvalPolicies = [
  { id: 'ap1', name: 'Payments over $5,000', rule: 'Requires 2 approvals', scope: 'All payments', status: 'Active' },
  { id: 'ap2', name: 'Payments over $25,000', rule: 'Requires Admin + Controller', scope: 'All payments', status: 'Active' },
  { id: 'ap3', name: 'New recipients', rule: 'Requires Admin approval', scope: 'Recipients', status: 'Active' },
  { id: 'ap4', name: 'Expense reports under $100', rule: 'Auto-approve', scope: 'Reimbursements', status: 'Active' },
];

export const accountingEntries: AccountingEntry[] = [
  { id: 'ae1', date: 'Nov 20, 2026', description: 'Office Depot — ACH Payment', account: 'Office Supplies', category: 'Operating expense', amount: -895, status: 'Needs review', connection: 'QuickBooks Online' },
  { id: 'ae2', date: 'Nov 20, 2026', description: 'Doordash — Card Transaction', account: 'Meals & entertainment', category: 'Team Expenses', amount: -228.52, status: 'Ready to sync', connection: 'QuickBooks Online' },
  { id: 'ae3', date: 'Nov 19, 2026', description: 'Amazon Associates — Inbound ACH Credit', account: 'Affiliate revenue', category: 'Income', amount: 100102.18, status: 'Ready to sync', connection: 'QuickBooks Online' },
  { id: 'ae4', date: 'Nov 19, 2026', description: 'Amazon Web Services — ACH Payment', account: 'Cloud hosting', category: 'Operating expense', amount: -3200, status: 'Synced', connection: 'QuickBooks Online' },
  { id: 'ae5', date: 'Nov 18, 2026', description: 'Figma — Card Transaction', account: 'Design tooling', category: 'Design Resources', amount: -75, status: 'Synced', connection: 'QuickBooks Online' },
  { id: 'ae6', date: 'Nov 18, 2026', description: 'WeWork — ACH Payment', account: 'Rent', category: 'Facilities', amount: -4500, status: 'Needs review', connection: 'QuickBooks Online' },
  { id: 'ae7', date: 'Nov 17, 2026', description: 'Stripe — Inbound ACH Credit', account: 'Sales revenue', category: 'Income', amount: 86211.4, status: 'Archived', connection: 'QuickBooks Online' },
  { id: 'ae8', date: 'Nov 16, 2026', description: 'Vercel — Card Transaction', account: 'Cloud hosting', category: 'Design Resources', amount: -200, status: 'Failed', connection: 'QuickBooks Online' },
  { id: 'ae9', date: 'Nov 16, 2026', description: 'Stripe — Card Transaction', account: 'Processing fees', category: 'Operating expense', amount: -3562, status: 'Needs review', connection: 'QuickBooks Online' },
  { id: 'ae10', date: 'Nov 15, 2026', description: 'ADP Payroll — ACH Debit', account: 'Payroll', category: 'Payroll', amount: -18420.55, status: 'Synced', connection: 'QuickBooks Online' },
];

export const analyticsBreakdown = {
  byMethod: [
    { label: 'Card', amount: 128_400.42, pct: 0.62 },
    { label: 'ACH', amount: 54_120.18, pct: 0.26 },
    { label: 'Wire', amount: 21_300.0, pct: 0.1 },
    { label: 'Internal', amount: 4_090.2, pct: 0.02 },
  ],
  byMerchant: [
    { label: 'Amazon Associates', amount: 37168.08, pct: 0.34 },
    { label: 'eBay Partners', amount: 31004.56, pct: 0.28 },
    { label: 'Shopify Affiliates', amount: 19349.87, pct: 0.18 },
    { label: 'Etsy Partner Network', amount: 15472.4, pct: 0.14 },
    { label: 'Walmart Affiliates', amount: 3865.6, pct: 0.06 },
  ],
  byContact: [
    { label: 'Avery Chen', amount: 43_210.12, pct: 0.36 },
    { label: 'Morgan Rivera', amount: 32_180.4, pct: 0.27 },
    { label: 'Jordan Patel', amount: 28_740.11, pct: 0.24 },
    { label: 'Albert Tian', amount: 9_420.3, pct: 0.08 },
    { label: "Liam O'Connor", amount: 6_009.87, pct: 0.05 },
  ],
  byGroup: [
    { label: 'Affiliate Platform Access', amount: 96_175.67, pct: 0.46 },
    { label: 'Team Expenses', amount: 56_384.29, pct: 0.27 },
    { label: 'Design Resources', amount: 33_562.4, pct: 0.16 },
    { label: 'Client Entertainment', amount: 16_182.2, pct: 0.08 },
    { label: 'Slope Account Cards', amount: 6_113.8, pct: 0.03 },
  ],
};

export const cashback = 3361.92;

export const referrals = {
  code: 'VICTOR-ACME',
  link: 'https://app.joinslash.com/r/VICTOR-ACME',
  invited: 6,
  qualified: 4,
  earned: 2400,
  pending: 600,
  history: [
    { id: 'rf1', company: 'Northwind Traders', status: 'Qualified', reward: 600, when: 'Nov 12, 2026' },
    { id: 'rf2', company: 'Globex Corporation', status: 'Qualified', reward: 600, when: 'Oct 28, 2026' },
    { id: 'rf3', company: 'Initech', status: 'Qualified', reward: 600, when: 'Oct 4, 2026' },
    { id: 'rf4', company: 'Soylent Labs', status: 'Qualified', reward: 600, when: 'Sep 19, 2026' },
    { id: 'rf5', company: 'Hooli', status: 'Pending', reward: 600, when: 'Nov 18, 2026' },
    { id: 'rf6', company: 'Umbrella Group', status: 'Signed up', reward: 0, when: 'Nov 20, 2026' },
  ],
};

/* 3-month balance series (daily-ish, 92 points) — deterministic pseudo-random walk */
export const balanceSeries: { cash: number[]; spend: number[] } = (() => {
  const cash: number[] = [];
  const spend: number[] = [];
  let v = 5_480_000;
  let seed = 42;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 92; i++) {
    v += (rnd() - 0.42) * 90000;
    cash.push(Math.round(v));
    spend.push(Math.round(200 + rnd() * 880));
  }
  return { cash, spend };
})();