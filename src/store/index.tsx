import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as seed from '../data/seed';
import type {
  Account, AchAuth, ActionItem, ActivityEntry, ApiKey, Bill, Card, CardGroup, CardRequest, CryptoAsset, CryptoWallet,
  Doc, Expense, Invoice, Payment, Recipient, Transaction, User, VirtualAccount, PolicyRow, AccountingEntry,
} from '../data/types';

export interface DB {
  accounts: Account[];
  virtualAccounts: VirtualAccount[];
  cards: Card[];
  cardGroups: CardGroup[];
  cardRequests: CardRequest[];
  transactions: Transaction[];
  paymentRequests: Payment[];
  queuedPayments: Payment[];
  upcomingPayments: Payment[];
  sentPayments: Payment[];
  bills: Bill[];
  invoices: Invoice[];
  invoiceSeries: typeof seed.invoiceSeries;
  expenses: Expense[];
  recipients: Recipient[];
  achAuths: AchAuth[];
  documents: Doc[];
  users: User[];
  actionItems: ActionItem[];
  wallets: CryptoWallet[];
  cryptoAssets: CryptoAsset[];
  apiKeys: ApiKey[];
  activityLog: ActivityEntry[];
  cardPolicies: PolicyRow[];
  approvalPolicies: typeof seed.approvalPolicies;
  accountingEntries: AccountingEntry[];
  cashback: number;
  referrals: typeof seed.referrals;
  settings: Record<string, boolean>;
}

const STORAGE_KEY = 'slash-platinum-db-v1';

const freshDB = (): DB => ({
  accounts: seed.accounts.map((a) => ({ ...a })),
  virtualAccounts: seed.virtualAccounts.map((a) => ({ ...a })),
  cards: seed.cards.map((c) => ({ ...c })),
  cardGroups: seed.cardGroups.map((c) => ({ ...c })),
  cardRequests: seed.cardRequests.map((c) => ({ ...c })),
  transactions: seed.transactions.map((t) => ({ ...t })),
  paymentRequests: seed.paymentRequests.map((p) => ({ ...p })),
  queuedPayments: seed.queuedPayments.map((p) => ({ ...p })),
  upcomingPayments: seed.upcomingPayments.map((p) => ({ ...p })),
  sentPayments: seed.sentPayments.map((p) => ({ ...p })),
  bills: seed.bills.map((b) => ({ ...b })),
  invoices: seed.invoices.map((i) => ({ ...i })),
  invoiceSeries: seed.invoiceSeries.map((s) => ({ ...s })),
  expenses: seed.expenses.map((e) => ({ ...e })),
  recipients: seed.recipients.map((r) => ({ ...r })),
  achAuths: seed.achAuthorizations.map((a) => ({ ...a })),
  documents: seed.documents.map((d) => ({ ...d })),
  users: seed.users.map((u) => ({ ...u })),
  actionItems: seed.actionItems.map((a) => ({ ...a })),
  wallets: seed.wallets.map((w) => ({ ...w })),
  cryptoAssets: seed.cryptoAssets.map((c) => ({ ...c })),
  apiKeys: seed.apiKeys.map((k) => ({ ...k })),
  activityLog: seed.activityLog.map((a) => ({ ...a })),
  cardPolicies: seed.cardPolicies.map((p) => ({ ...p })),
  approvalPolicies: seed.approvalPolicies.map((p) => ({ ...p })),
  accountingEntries: seed.accountingEntries.map((a) => ({ ...a })),
  cashback: seed.cashback,
  referrals: JSON.parse(JSON.stringify(seed.referrals)),
  settings: { includeClosed: false, statementsVisible: true, twoFactor: true, emailAlerts: true, pushAlerts: false, autoSync: true, tourDone: false },
});

export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 8)}`;

export const money = (n: number, opts: { sign?: boolean; cents?: boolean } = {}) => {
  const { sign = false, cents = true } = opts;
  const abs = Math.abs(n);
  const s = abs.toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
  const prefix = n < 0 ? '-' : sign ? '+' : '';
  return `${prefix}$${s}`;
};

export const todayLabel = () => {
  const d = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

type Toast = { id: string; msg: string; kind?: 'ok' | 'warn' };

interface Ctx {
  db: DB;
  toasts: Toast[];
  toast: (msg: string, kind?: 'ok' | 'warn') => void;
  update: (fn: (draft: DB) => void) => void;
  reset: () => void;
  actions: any;
}

const AppCtx = createContext<Ctx | null>(null);

function makeActions(setDb: React.Dispatch<React.SetStateAction<DB>>, toast: (m: string, k?: 'ok' | 'warn') => void) {
  const push = (rec: Omit<ActivityEntry, 'id' | 'when' | 'actor'> & { actor?: string }) => {
    setDb((d) => ({
      ...d,
      activityLog: [{ id: uid('al'), when: `${todayLabel()} · just now`, actor: seed.USER.name, ...rec }, ...d.activityLog].slice(0, 40),
    }));
  };
  return {
    createCard(input: { name: string; last4: string; cardholder: string; group: string; virtualAccount: string; limit: string }) {
      setDb((d) => {
        const g = d.cardGroups.find((x) => x.name === input.group);
        const card: Card = {
          id: uid('c'),
          name: input.name,
          last4: input.last4,
          virtualAccount: input.virtualAccount,
          group: input.group,
          groupCount: (g?.count ?? 0) + 1,
          cardholder: input.cardholder || 'No cardholder',
          limit: input.limit || 'No limit',
          allowed: 'All allowed',
          status: 'Active',
          created: '11/20/26',
          spend30: 0,
          type: 'virtual',
        };
        return {
          ...d,
          cards: [card, ...d.cards],
          cardGroups: d.cardGroups.map((x) => (x.name === input.group ? { ...x, count: x.count + 1 } : x)),
        };
      });
      push({ action: 'Created virtual card', target: input.name });
      toast(`Virtual card “${input.name}” created`);
    },
    updateCard(id: string, patch: Partial<Card>, logMsg?: string) {
      setDb((d) => ({ ...d, cards: d.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
      if (logMsg) push({ action: logMsg, target: id });
    },
    closeCard(id: string) {
      setDb((d) => ({ ...d, cards: d.cards.map((c) => (c.id === id ? { ...c, status: 'Closed' } : c)) }));
      push({ action: 'Closed card', target: id });
      toast('Card closed');
    },
    decideCardRequest(id: string, approve: boolean) {
      setDb((d) => {
        const req = d.cardRequests.find((r) => r.id === id);
        if (!req) return d;
        const cards = approve
          ? [
              {
                id: uid('c'), name: req.cardName, last4: String(Math.floor(1000 + Math.random() * 8999)), virtualAccount: 'Primary account',
                group: req.group, groupCount: 1, cardholder: req.requester, limit: 'No limit', allowed: 'All allowed',
                status: 'Active' as const, created: '11/20/26', spend30: 0, type: 'virtual' as const,
              },
              ...d.cards,
            ]
          : d.cards;
        return { ...d, cards, cardRequests: d.cardRequests.filter((r) => r.id !== id) };
      });
      push({ action: approve ? 'Approved card request' : 'Declined card request', target: id });
      toast(approve ? 'Card request approved — card issued' : 'Card request declined');
    },
    decidePayment(id: string, approve: boolean) {
      setDb((d) => {
        const p = d.paymentRequests.find((x) => x.id === id);
        if (!p) return d;
        return {
          ...d,
          paymentRequests: d.paymentRequests.filter((x) => x.id !== id),
          queuedPayments: approve
            ? [{ ...p, status: 'Pending', approvals: 'Approved', dateLabel: 'Scheduled · Immediate', schedule: 'Immediate' }, ...d.queuedPayments]
            : d.queuedPayments,
          sentPayments: approve ? d.sentPayments : [{ ...p, status: 'Declined', approvals: 'Declined' }, ...d.sentPayments],
          actionItems: d.actionItems.map((a) => (a.title === p.vendor && a.status === 'action_required' ? { ...a, status: 'completed' } : a)),
        };
      });
      push({ action: approve ? 'Approved payment' : 'Declined payment', target: id });
      toast(approve ? 'Payment approved and queued' : 'Payment declined');
    },
    approveQueued(id: string) {
      setDb((d) => {
        const p = d.queuedPayments.find((x) => x.id === id);
        if (!p) return d;
        return {
          ...d,
          queuedPayments: d.queuedPayments.filter((x) => x.id !== id),
          sentPayments: [{ ...p, status: 'Sent', approvals: 'Sent', dateLabel: `Sent · ${todayLabel()}` }, ...d.sentPayments],
        };
      });
      toast('Payment sent');
      push({ action: 'Sent payment', target: id });
    },
    sendMoney(input: { vendor: string; amount: number; method: Payment['method']; account: string; memo: string; schedule: 'Immediate' | 'Scheduled'; date?: string; attachments?: number }) {
      const when = input.schedule === 'Immediate' ? `Scheduled · ${todayLabel()}` : `Scheduled · ${input.date ?? todayLabel()}`;
      const p: Payment = {
        id: uid('p'),
        vendor: input.vendor,
        type: input.method === 'Wire' ? 'Wire Transfer' : input.method === 'Check' ? 'Check' : 'ACH Payment',
        owner: seed.USER.name,
        approvals: 'Needs your approval',
        amount: -Math.abs(input.amount),
        schedule: input.schedule === 'Immediate' ? 'Immediate' : input.date ?? todayLabel(),
        dueDate: input.date ?? '—',
        method: input.method,
        account: input.account,
        status: input.schedule === 'Immediate' ? 'Needs your approval' : 'Pending',
        dateLabel: when,
        attachments: input.attachments ?? 0,
        notes: input.memo,
      };
      setDb((d) =>
        input.schedule === 'Immediate'
          ? { ...d, paymentRequests: [p, ...d.paymentRequests] }
          : { ...d, queuedPayments: [{ ...p, approvals: 'Approved', status: 'Pending' }, ...d.queuedPayments] },
      );
      push({ action: input.schedule === 'Immediate' ? 'Requested payment' : 'Scheduled payment', target: `${input.vendor} · ${money(input.amount)}` });
      toast(input.schedule === 'Immediate' ? 'Payment request submitted' : 'Payment scheduled');
    },
    transfer(input: { from: string; to: string; amount: number; memo: string }) {
      setDb((d) => {
        const accounts = d.accounts.map((a) => {
          if (a.id === input.from) return { ...a, balance: a.balance - input.amount };
          if (a.id === input.to) return { ...a, balance: a.balance + input.amount };
          return a;
        });
        const t: Transaction = {
          id: uid('t'), merchant: `Transfer to ${d.accounts.find((a) => a.id === input.to)?.name ?? input.to}`,
          type: 'Internal Transfer', amount: -input.amount, date: new Date().toISOString().slice(0, 10), dateLabel: todayLabel(),
          account: input.from, method: 'Internal', status: 'Succeeded', note: input.memo,
        };
        return { ...d, accounts, transactions: [t, ...d.transactions] };
      });
      push({ action: 'Moved money', target: `${money(input.amount)} ${input.from} → ${input.to}` });
      toast(`Transferred ${money(input.amount)}`);
    },
    deposit(input: { account: string; amount: number }) {
      setDb((d) => ({
        ...d,
        accounts: d.accounts.map((a) => (a.id === input.account ? { ...a, balance: a.balance + input.amount } : a)),
        transactions: [
          { id: uid('t'), merchant: 'Inbound ACH Credit', type: 'Inbound ACH Credit', amount: input.amount, date: new Date().toISOString().slice(0, 10), dateLabel: todayLabel(), account: input.account, method: 'ACH', status: 'Succeeded' },
          ...d.transactions,
        ],
      }));
      toast(`Deposit of ${money(input.amount)} received`);
    },
    createBill(input: { vendor: string; amount: number; dueDate: string; invoiceNo: string; notes: string; status?: Bill['status'] }) {
      const b: Bill = {
        id: uid('b'), vendor: input.vendor, owner: seed.USER.name, status: input.status ?? 'Draft', amount: input.amount,
        dueDate: input.dueDate, dueMeta: '30 days left', invoiceDate: todayLabel(), invoiceNo: input.invoiceNo || `INV-${Math.floor(Math.random() * 9999)}`,
        notes: input.notes || '—', paid: 0,
      };
      setDb((d) => ({ ...d, bills: [b, ...d.bills] }));
      toast('Bill created');
      push({ action: 'Created bill', target: `${input.vendor} · ${money(input.amount)}` });
    },
    setBillStatus(id: string, status: Bill['status']) {
      setDb((d) => ({ ...d, bills: d.bills.map((b) => (b.id === id ? { ...b, status, paid: status === 'Paid' ? b.amount : b.paid } : b)) }));
      toast(`Bill marked ${status.toLowerCase()}`);
    },
    createInvoice(input: { customer: string; amount: number; dueDate: string; memo: string; send: boolean }) {
      const inv: Invoice = {
        id: uid('i'), number: `INV-2026-00${Math.floor(32 + Math.random() * 40)}`, customer: input.customer, amount: input.amount,
        status: input.send ? 'Sent' : 'Draft', dueDate: input.dueDate, issued: todayLabel(), memo: input.memo, 
      };
      setDb((d) => ({ ...d, invoices: [inv, ...d.invoices] }));
      toast(input.send ? 'Invoice created and sent' : 'Invoice draft saved');
      push({ action: input.send ? 'Sent invoice' : 'Created invoice', target: `${input.customer} · ${money(input.amount)}` });
    },
    updateInvoice(id: string, patch: Partial<Invoice>, msg?: string) {
      setDb((d) => ({ ...d, invoices: d.invoices.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
      if (msg) toast(msg);
    },
    decideExpense(id: string, approve: boolean) {
      setDb((d) => ({ ...d, expenses: d.expenses.map((e) => (e.id === id ? { ...e, status: approve ? 'Approved' : 'Rejected' } : e)) }));
      toast(approve ? 'Expense approved' : 'Expense rejected');
      push({ action: approve ? 'Approved expense' : 'Rejected expense', target: id });
    },
    payExpense(id: string) {
      setDb((d) => ({ ...d, expenses: d.expenses.map((e) => (e.id === id ? { ...e, status: 'Payment complete' } : e)) }));
      toast('Reimbursement paid');
    },
    addRecipient(input: { name: string; email: string }) {
      const r: Recipient = { id: uid('r'), name: input.name, email: input.email, taxDoc: 'Missing', lastPayment: '-', totalPaid: 0 };
      setDb((d) => ({ ...d, recipients: [r, ...d.recipients] }));
      toast('Recipient added');
      push({ action: 'Added recipient', target: input.name });
    },
    decideAch(id: string, approve: boolean) {
      setDb((d) => ({ ...d, achAuths: d.achAuths.map((a) => (a.id === id ? { ...a, status: approve ? 'Approved' : 'Declined' } : a)) }));
      toast(approve ? 'ACH debit authorized' : 'ACH debit declined');
    },
    inviteUser(input: { name: string; email: string; role: User['role'] }) {
      const initials = input.name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();
      setDb((d) => ({ ...d, users: [...d.users, { id: uid('us'), name: input.name, email: input.email, role: input.role, status: 'Invited', lastActive: '—', initials }] }));
      toast(`Invite sent to ${input.email}`);
      push({ action: 'Invited user', target: input.email });
    },
    updateUser(id: string, patch: Partial<User>) {
      setDb((d) => ({ ...d, users: d.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
      toast('User updated');
    },
    addApiKey(label: string) {
      const k: ApiKey = { id: uid('k'), label, prefix: `sk_live_${Math.random().toString(36).slice(2, 6)}`, created: todayLabel(), lastUsed: 'Never', scope: 'Read / Write' };
      setDb((d) => ({ ...d, apiKeys: [...d.apiKeys, k] }));
      toast('API key created');
    },
    revokeApiKey(id: string) {
      setDb((d) => ({ ...d, apiKeys: d.apiKeys.filter((k) => k.id !== id) }));
      toast('API key revoked', 'warn');
    },
    addVirtualAccount(name: string) {
      setDb((d) => ({
        ...d,
        virtualAccounts: [
          ...d.virtualAccounts,
          { id: uid('va'), name, balance: 0, takeRate: 0, routing: String(Math.floor(100000000 + Math.random() * 899999999)), number: String(Math.floor(10000000000 + Math.random() * 89999999999)) },
        ],
      }));
      toast(`Virtual account “${name}” opened`);
    },
    decideAction(id: string, approve: boolean) {
      setDb((d) => ({ ...d, actionItems: d.actionItems.map((a) => (a.id === id ? { ...a, status: 'completed' } : a)) }));
      toast(approve ? 'Approved' : 'Declined', approve ? 'ok' : 'warn');
    },
    uploadDoc(name: string, category: Doc['category']) {
      setDb((d) => ({ ...d, documents: [{ id: uid('d'), name, category, kind: 'PDF', size: '128 KB', uploaded: todayLabel() }, ...d.documents] }));
      toast('Document uploaded');
    },
    toggleSetting(key: string) {
      setDb((d) => ({ ...d, settings: { ...d.settings, [key]: !d.settings[key] } }));
    },
    setSetting(key: string, value: boolean) {
      setDb((d) => ({ ...d, settings: { ...d.settings, [key]: value } }));
    },
    syncAccounting() {
      setDb((d) => ({ ...d, accountingEntries: d.accountingEntries.map((e) => (e.status === 'Ready to sync' || e.status === 'Needs review' ? { ...e, status: 'Synced' } : e)) }));
      toast('Synced 4 entries to QuickBooks Online');
      push({ action: 'Synced accounting', target: '4 entries → QuickBooks Online' });
    },
    setAccountingStatus(id: string, status: AccountingEntry['status']) {
      setDb((d) => ({ ...d, accountingEntries: d.accountingEntries.map((e) => (e.id === id ? { ...e, status } : e)) }));
    },
    addWallet(label: string, chain: CryptoWallet['chain']) {
      setDb((d) => ({ ...d, wallets: [...d.wallets, { id: uid('w'), label, chain, address: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`, balance: 0, createdAt: todayLabel() }] }));
      toast('Wallet added');
    },
    convertCrypto(from: string, to: string, amount: number) {
      setDb((d) => ({
        ...d,
        cryptoAssets: d.cryptoAssets.map((a) => (a.id === from ? { ...a, amount: a.amount - amount } : a.id === to ? { ...a, amount: a.amount + amount } : a)),
      }));
      toast('Conversion submitted');
    },
    addPolicy(name: string, scope: string, limit: string) {
      setDb((d) => ({ ...d, cardPolicies: [...d.cardPolicies, { id: uid('pl'), name, scope, limit, merchants: 'All allowed', status: 'Active' }] }));
      toast('Policy created');
    },
    setPolicyStatus(id: string, status: PolicyRow['status']) {
      setDb((d) => ({ ...d, cardPolicies: d.cardPolicies.map((p) => (p.id === id ? { ...p, status } : p)) }));
    },
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.cards && parsed.transactions) return { ...freshDB(), ...parsed };
      }
    } catch (e) {}
    return freshDB();
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, any>>({});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {}
  }, [db]);

  const toast = useCallback((msg: string, kind: 'ok' | 'warn' = 'ok') => {
    const id = uid('toast');
    setToasts((t) => [...t, { id, msg, kind }]);
    timers.current[id] = setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const update = useCallback((fn: (draft: DB) => void) => {
    setDb((d) => {
      const copy: DB = JSON.parse(JSON.stringify(d));
      fn(copy);
      return copy;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDb(freshDB());
  }, []);

  const actions = useMemo(() => makeActions(setDb, toast), [toast]);

  const value = useMemo<Ctx>(() => ({ db, toasts, toast, update, reset, actions }), [db, toasts, toast, update, reset, actions]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export type { Payment, Card, Bill, Invoice, Expense, Transaction, ActionItem, AccountingEntry };