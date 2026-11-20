import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon, SlashMark, Menu, IconBtn, Avatar, Amount } from './ui';
import { useApp, money } from '../store';
import { USER, capital } from '../data/seed';

type NavEntry = { label: string; to: string; icon: string; badge?: number; amount?: string; match?: string };

export function Sidebar() {
  const { db, actions, reset } = useApp();
  const loc = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'));
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ payables: true, accounts: true, accounting: false });

  const actionRequired = db.actionItems.filter((a) => a.status === 'action_required').length;
  const cash = db.accounts.find((a) => a.id === 'cash');
  const secured = db.accounts.find((a) => a.id === 'secured');
  const treasury = db.accounts.find((a) => a.id === 'treasury');

  const toggle = (k: string) => setOpenGroups((g) => ({ ...g, [k]: !g[k] }));
  const isPayables = loc.pathname.startsWith('/platinum/payments');
  const isAccounts = loc.pathname.startsWith('/platinum/account') || loc.pathname.startsWith('/platinum/treasury');
  const isAccounting = loc.pathname.startsWith('/platinum/accounting');

  const item = (e: NavEntry, key?: string) => {
    const active = e.match ? loc.pathname.startsWith(e.match) : loc.pathname === e.to;
    return (
      <NavLink key={key ?? e.to} to={e.to} className={`nav-item${active ? ' active' : ''}`} data-tour={e.to === '/platinum/cards' ? 'nav-cards' : e.to === '/platinum/transactions' ? 'nav-transactions' : undefined}>
        <Icon name={e.icon} size={18} />
        <span className="nav-label">{e.label}</span>
        {typeof e.badge === 'number' && e.badge > 0 && <span className="nav-badge">{e.badge}</span>}
        {e.amount && <span className="nav-amount">{e.amount}</span>}
      </NavLink>
    );
  };

  const group = (key: string, label: string, icon: string, badge: number | undefined, active: boolean, children: React.ReactNode) => (
    <div className="stack">
      <button className={`nav-item${active && !openGroups[key] ? ' active' : ''}`} onClick={() => toggle(key)} data-tour={key === 'payables' ? 'nav-payables' : undefined}>
        <Icon name={icon} size={18} />
        <span className="nav-label">{label}</span>
        {typeof badge === 'number' && badge > 0 && <span className="nav-badge">{badge}</span>}
        <Icon name="CaretDown" size={14} style={{ marginLeft: 'auto' }} />
      </button>
      {openGroups[key] && <div className="nav-sub">{children}</div>}
    </div>
  );

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} data-tour="sidebar">
      <div className="entity">
        <Menu
          align="left"
          items={[
            { label: 'Accounts' },
            { label: 'Victor Cardenas · Platinum', icon: 'Check', onClick: () => navigate('/platinum') },
            { label: 'Acme Studio LLC', icon: 'Buildings', onClick: () => navigate('/platinum') },
            { sep: true },
            { label: 'Entity settings', icon: 'Sliders', onClick: () => navigate('/platinum/settings/business-details') },
            { label: 'Users', icon: 'Users', onClick: () => navigate('/platinum/settings/users') },
            { sep: true },
            { label: 'Replay product tour', icon: 'PlayCircle', onClick: () => window.dispatchEvent(new CustomEvent('slash:tour')) },
            { label: theme === 'dark' ? 'Light mode' : 'Dark mode', icon: theme === 'dark' ? 'Sun' : 'Moon', onClick: () => {
                const root = document.documentElement;
                const next = theme === 'dark' ? 'light' : 'dark';
                root.classList.remove('light', 'dark');
                root.classList.add(next);
                root.style.colorScheme = next;
                localStorage.setItem('user-color-theme', next);
                setTheme(next);
              } },
            { sep: true },
            { label: 'Reset demo data', icon: 'ArrowCounterClockwise', danger: true, onClick: () => reset() },
          ]}
        >
          <button className="entity-btn" data-tour="entity-switcher">
            <span className="entity-mark"><SlashMark size={16} /></span>
            <span className="entity-name">Victor Cardenas</span>
            <Icon name="CaretUpDown" size={14} style={{ color: 'var(--ink-4)' }} />
          </button>
        </Menu>
        <button className="collapse-btn" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
          <Icon name="SidebarSimple" size={18} />
        </button>
      </div>

      <nav className="nav">
        {item({ label: 'Home', to: '/platinum', icon: 'House' })}
        {item({ label: 'Action Center', to: '/platinum/action-center', icon: 'Tray', badge: actionRequired })}
        {item({ label: 'Cards', to: '/platinum/cards', icon: 'Cards' })}
        {item({ label: 'Transactions', to: '/platinum/transactions', icon: 'List' })}
        {group(
          'payables',
          'Payables',
          'ArrowsDownUp',
          db.paymentRequests.length,
          isPayables,
          <>
            {item({ label: 'Payments', to: '/platinum/payments', icon: 'PaperPlaneTilt', badge: db.paymentRequests.length })}
            {item({ label: 'Bills', to: '/platinum/payments/bills', icon: 'Receipt', match: '/platinum/payments/bills' })}
            {item({ label: 'Recipients', to: '/platinum/payments/recipients', icon: 'UsersThree', match: '/platinum/payments/recipients' })}
            {item({ label: 'ACH Debits', to: '/platinum/payments/ach-authorizations', icon: 'Bank', badge: db.achAuths.filter((a) => a.status === 'Pending').length, match: '/platinum/payments/ach' })}
          </>,
        )}
        {group(
          'accounts',
          'Accounts',
          'UserCircle',
          undefined,
          isAccounts,
          <>
            {item({ label: 'Cash account', to: '/platinum/account/cash', icon: 'Bank', amount: cash ? money(cash.balance) : '', match: '/platinum/account/cash' })}
            {item({ label: 'Secured card', to: '/platinum/account/secured', icon: 'CreditCard', amount: money(secured?.balance ?? 0), match: '/platinum/account/secured' })}
            {item({ label: 'Treasury account', to: '/platinum/treasury', icon: 'TreasureChest', amount: money(treasury?.balance ?? 0), match: '/platinum/treasury' })}
          </>,
        )}

        <div className="nav-group">Addons</div>
        {item({ label: 'Invoicing', to: '/platinum/invoices', icon: 'FileText' })}
        {item({ label: 'Reimbursements', to: '/platinum/reimbursements', icon: 'Receipt' })}
        {item({ label: 'Analytics', to: '/platinum/analytics/reports/general-analytics', icon: 'ChartLine', match: '/platinum/analytics' })}
        {group(
          'accounting',
          'Accounting',
          'BookOpen',
          undefined,
          isAccounting,
          <>
            {item({ label: 'Transactions', to: '/platinum/accounting', icon: 'List', match: '/platinum/accounting' })}
            {item({ label: 'Bills', to: '/platinum/accounting/bills', icon: 'Receipt', match: '/platinum/accounting/bills' })}
            {item({ label: 'Settings', to: '/platinum/accounting/settings/general', icon: 'Gear', match: '/platinum/accounting/settings' })}
          </>,
        )}
        {item({ label: 'Capital', to: '/platinum/account/capital', icon: 'Money', amount: money(capital.used, { cents: false }), match: '/platinum/account/capital' })}

        <div className="spacer" />
        {item({ label: 'Refer to earn', to: '/platinum/referrals', icon: 'Gift' })}
        {item({ label: 'Entity documents', to: '/platinum/documents', icon: 'File' })}
        {item({ label: 'Entity settings', to: '/platinum/settings/business-details', icon: 'Sliders', match: '/platinum/settings' })}
      </nav>
    </aside>
  );
}

export function AccountSwitcherBar() {
  const { db } = useApp();
  const navigate = useNavigate();
  return (
    <div className="row" style={{ gap: 8 }}>
      <div className="head-pill">
        <Icon name="CurrencyCircleDollar" size={16} />
        Cashback
        <strong className="num">{money(db.cashback)}</strong>
      </div>
      <button className="btn primary" onClick={() => navigate('/platinum/move-money')}>
        <Icon name="ArrowsDownUp" size={16} />
        Move Money
      </button>
    </div>
  );
}

export function ToastHost() {
  const { toasts } = useApp();
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <Icon name={t.kind === 'warn' ? 'Warning' : 'CheckCircle'} size={16} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

export function SidebarFooterHint() {
  return null;
}
const settingsLinks = [
  { to: '/platinum/settings/business-details', label: 'Business details', icon: 'Buildings' },
  { to: '/platinum/settings/users', label: 'Users', icon: 'Users' },
  { to: '/platinum/settings/security', label: 'Security', icon: 'Lock' },
  { to: '/platinum/settings/policies', label: 'Policies', icon: 'ShieldCheck' },
  { to: '/platinum/settings/api-management', label: 'API management', icon: 'Code' },
  { to: '/platinum/settings/activity-log', label: 'Activity log', icon: 'ClockCounterClockwise' },
];

export function SettingsNav() {
  const loc = useLocation();
  return (
    <div className="row" style={{ gap: 4, padding: '10px 20px', borderBottom: '1px solid var(--line-3)', overflowX: 'auto' }}>
      {settingsLinks.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className="pill-btn"
          style={loc.pathname === l.to ? { background: 'var(--surface-3)', borderColor: 'var(--line)', color: 'var(--ink)' } : undefined}
        >
          <Icon name={l.icon} size={14} />
          {l.label}
        </NavLink>
      ))}
    </div>
  );
}
