import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, NavLink } from 'react-router-dom';
import { AppProvider } from './store';
import { Sidebar, ToastHost } from './components/shell';
import { TourProvider } from './tour/Tour';
import { Icon } from './components/ui';
import HomePage from './pages/HomePage';
import TransactionsPage from './pages/TransactionsPage';
import ActionCenterPage from './pages/ActionCenterPage';
import CardsPage from './pages/CardsPage';
import PaymentsPage from './pages/PaymentsPage';
import BillsPage from './pages/BillsPage';
import RecipientsPage from './pages/RecipientsPage';
import AchAuthorizationsPage from './pages/AchPage';
import InvoicesPage from './pages/InvoicesPage';
import ReimbursementsPage from './pages/ReimbursementsPage';
import CashAccountPage, { SecuredCardPage } from './pages/CashAccountPage';
import TreasuryPage, { CapitalPage } from './pages/TreasuryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AccountingPage, { AccountingBillsPage, AccountingSettingsPage } from './pages/AccountingPage';
import WalletsPage from './pages/WalletsPage';
import DocumentsPage from './pages/DocumentsPage';
import ReferralsPage from './pages/ReferralsPage';
import MoveMoneyPage from './pages/MoveMoneyPage';
import { PoliciesPage, BusinessDetailsPage, UsersPage, SecurityPage, ApiManagementPage, ActivityLogPage } from './pages/settings';

const settingsLinks = [
  { to: '/platinum/settings/business-details', label: 'Business details', icon: 'Buildings' },
  { to: '/platinum/settings/users', label: 'Users', icon: 'Users' },
  { to: '/platinum/settings/security', label: 'Security', icon: 'Lock' },
  { to: '/platinum/settings/policies', label: 'Policies', icon: 'ShieldCheck' },
  { to: '/platinum/settings/api-management', label: 'API management', icon: 'Code' },
  { to: '/platinum/settings/activity-log', label: 'Activity log', icon: 'ClockCounterClockwise' },
];

function SettingsNav() {
  const loc = useLocation();
  return (
    <div className="row" style={{ gap: 4, padding: '10px 20px', borderBottom: '1px solid var(--line-3)', overflowX: 'auto' }}>
      {settingsLinks.map((l) => (
        <NavLink key={l.to} to={l.to} className="pill-btn" style={loc.pathname === l.to ? { background: 'var(--surface-3)', borderColor: 'var(--line)', color: 'var(--ink)' } : undefined}>
          <Icon name={l.icon} size={14} />
          {l.label}
        </NavLink>
      ))}
    </div>
  );
}

function Shell() {
  const loc = useLocation();
  const isSettings = loc.pathname.startsWith('/platinum/settings');
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/platinum" replace />} />
          <Route path="/platinum" element={<HomePage />} />
          <Route path="/platinum/home" element={<HomePage />} />
          <Route path="/platinum/action-center" element={<ActionCenterPage />} />
          <Route path="/platinum/cards" element={<CardsPage />} />
          <Route path="/platinum/transactions" element={<TransactionsPage />} />
          <Route path="/platinum/payments" element={<PaymentsPage />} />
          <Route path="/platinum/payments/bills" element={<BillsPage />} />
          <Route path="/platinum/payments/recipients" element={<RecipientsPage />} />
          <Route path="/platinum/payments/ach-authorizations" element={<AchAuthorizationsPage />} />
          <Route path="/platinum/invoices" element={<InvoicesPage />} />
          <Route path="/platinum/reimbursements" element={<ReimbursementsPage />} />
          <Route path="/platinum/account/cash" element={<CashAccountPage />} />
          <Route path="/platinum/account/secured" element={<SecuredCardPage />} />
          <Route path="/platinum/treasury" element={<TreasuryPage />} />
          <Route path="/platinum/account/capital" element={<CapitalPage />} />
          <Route path="/platinum/analytics/reports/general-analytics" element={<AnalyticsPage />} />
          <Route path="/platinum/accounting" element={<AccountingPage />} />
          <Route path="/platinum/accounting/bills" element={<AccountingBillsPage />} />
          <Route path="/platinum/accounting/settings/general" element={<AccountingSettingsPage />} />
          <Route path="/platinum/accounting/settings/mappings" element={<AccountingSettingsPage />} />
          <Route path="/platinum/accounting/settings/fields" element={<AccountingSettingsPage />} />
          <Route path="/platinum/wallets" element={<WalletsPage />} />
          <Route path="/platinum/documents" element={<DocumentsPage />} />
          <Route path="/platinum/referrals" element={<ReferralsPage />} />
          <Route path="/platinum/move-money" element={<MoveMoneyPage />} />
          <Route path="/platinum/settings/policies" element={<><PoliciesPage /></>} />
          <Route path="/platinum/settings/business-details" element={<BusinessDetailsPage />} />
          <Route path="/platinum/settings/users" element={<UsersPage />} />
          <Route path="/platinum/settings/security" element={<SecurityPage />} />
          <Route path="/platinum/settings/api-management" element={<ApiManagementPage />} />
          <Route path="/platinum/settings/activity-log" element={<ActivityLogPage />} />
          <Route path="*" element={<Navigate to="/platinum" replace />} />
        </Routes>
      </div>
      <ToastHost />
    </div>
  );
}

function SettingsStrip() {
  const loc = useLocation();
  if (!loc.pathname.startsWith('/platinum/settings')) return null;
  return <SettingsNav />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <TourProvider>
          <Shell />
        </TourProvider>
      </AppProvider>
    </BrowserRouter>
  );
}