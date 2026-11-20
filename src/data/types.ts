/* ── Domain types ───────────────────────────────────────────────────────── */

export type ID = string;

export interface Account {
  id: ID;
  name: string;
  kind: 'cash' | 'secured' | 'treasury';
  balance: number;
  routing?: string;
  number?: string;
}

export interface VirtualAccount {
  id: ID;
  name: string;
  balance: number;
  takeRate: number;
  routing?: string;
  number?: string;
}

export interface Card {
  id: ID;
  name: string;
  last4: string;
  virtualAccount: string;
  group: string;
  groupCount: number;
  cardholder: string;
  limit: string;
  allowed: string;
  status: 'Active' | 'Paused' | 'Closed';
  created: string;
  spend30: number;
  type: 'virtual' | 'physical';
}

export interface CardGroup {
  id: ID;
  name: string;
  count: number;
  limit: string;
  color: string;
}

export interface CardRequest {
  id: ID;
  requester: string;
  cardName: string;
  group: string;
  submitted: string;
  reason: string;
}

export type TxType =
  | 'Card Transaction'
  | 'ACH Payment'
  | 'Wire Transfer'
  | 'Inbound ACH Credit'
  | 'Inbound ACH Debit'
  | 'Internal Transfer';

export interface Transaction {
  id: ID;
  merchant: string;
  type: TxType;
  amount: number;
  date: string;
  dateLabel: string;
  account: string;
  method: 'Card' | 'ACH' | 'Wire' | 'Internal';
  card?: { name: string; last4: string; group: string };
  status: 'Succeeded' | 'Pending' | 'Failed' | 'Scheduled';
  scheduledFor?: string;
  note?: string;
  receipt?: boolean;
  logo?: string;
}

export interface Payment {
  id: ID;
  vendor: string;
  type: 'ACH Payment' | 'Wire Transfer' | 'Check';
  owner: string;
  approvals: string;
  amount: number;
  schedule: string;
  dueDate: string;
  method: 'ACH' | 'Wire' | 'Check';
  account: string;
  status: 'Needs your approval' | 'Waiting on approver' | 'Pending' | 'Scheduled' | 'Sent' | 'Paid' | 'Declined';
  dateLabel: string;
  attachments: number;
  notes: string;
  approver?: string;
}

export type BillStatus = 'Draft' | 'Pending approval' | 'Scheduled' | 'Paid' | 'Partially paid' | 'Payment failed';

export interface Bill {
  id: ID;
  vendor: string;
  owner: string;
  status: BillStatus;
  amount: number;
  dueDate: string;
  dueMeta: string;
  invoiceDate: string;
  invoiceNo: string;
  notes: string;
  paid: number;
}

export interface Invoice {
  id: ID;
  number: string;
  customer: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Paid' | 'Overdue';
  dueDate: string;
  issued: string;
  memo: string;
}

export type ExpenseStatus = 'Needs review' | 'Approved' | 'Rejected' | 'Payment complete' | 'Processing payment' | 'Cancelled' | 'Payment failed';

export interface Expense {
  id: ID;
  employee: string;
  merchant: string;
  category: string;
  amount: number;
  submitted: string;
  status: ExpenseStatus;
  receipts: number;
  note: string;
}

export interface Recipient {
  id: ID;
  name: string;
  email: string;
  taxDoc: 'Verified' | 'Pending request' | 'Missing';
  lastPayment: string;
  totalPaid: number;
  archived?: boolean;
}

export interface AchAuth {
  id: ID;
  originator: string;
  amount: number;
  requested: string;
  account: string;
  status: 'Pending' | 'Approved' | 'Declined';
  code: string;
  dueDate: string;
}

export interface Doc {
  id: ID;
  name: string;
  category: 'ENTITY' | 'ACCOUNT' | 'CARD' | 'TAX';
  kind: 'PDF' | 'CSV' | 'PNG';
  size: string;
  uploaded: string;
}

export interface User {
  id: ID;
  name: string;
  email: string;
  role: 'Admin' | 'Controller' | 'Bookkeeper' | 'Cardholder';
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
  initials: string;
}

export interface ActionItem {
  id: ID;
  title: string;
  subtitle: string;
  kind: 'payment' | 'card' | 'expense' | 'ach' | 'invoice' | 'bill';
  amount?: number;
  requestedBy: string;
  when: string;
  status: 'action_required' | 'pending' | 'completed';
  tab: string;
  detail: { label: string; value: string }[];
}

export interface CryptoWallet {
  id: ID;
  label: string;
  chain: 'Ethereum' | 'Solana' | 'Base';
  address: string;
  balance: number;
  createdAt: string;
}

export interface CryptoAsset {
  id: ID;
  token: 'USDC' | 'ETH' | 'SOL' | 'USDT';
  wallet: string;
  amount: number;
  price: number;
  pl: number;
}

export interface ApiKey {
  id: ID;
  label: string;
  prefix: string;
  created: string;
  lastUsed: string;
  scope: string;
}

export interface ActivityEntry {
  id: ID;
  actor: string;
  action: string;
  target: string;
  when: string;
}

export interface PolicyRow {
  id: ID;
  name: string;
  scope: string;
  limit: string;
  merchants: string;
  status: 'Active' | 'Draft';
}

export interface AccountingEntry {
  id: ID;
  date: string;
  description: string;
  account: string;
  category: string;
  amount: number;
  status: 'Needs review' | 'Ready to sync' | 'Synced' | 'Archived' | 'Failed';
  connection: string;
}

/* Re-export the seed data constants so consumers can import types and data
   from the same place. */
export {
  USER, ENTITY, accounts, virtualAccounts, capital, cards, cardGroups, cardRequests,
  transactions, transactionsTotals, paymentRequests, queuedPayments, upcomingPayments,
  sentPayments, bills, invoices, invoiceSeries, expenses, expenseCounts, recipients,
  achAuthorizations, documents, users, actionItems, wallets, cryptoAssets, apiKeys,
  activityLog, cardPolicies, approvalPolicies, accountingEntries, analyticsBreakdown,
  cashback, referrals, balanceSeries,
} from './seed';
