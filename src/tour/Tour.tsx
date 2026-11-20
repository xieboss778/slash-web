import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon, SlashMark, Btn } from '../components/ui';
import { useApp } from '../store';

type Step = {
  chapter: string;
  title: string;
  text: string;
  route: string;
  target?: string; // css selector
  placement?: 'right' | 'bottom' | 'left' | 'auto';
  hint?: string;
};

export const STEPS: Step[] = [
  { chapter: 'Operations', title: 'Your operating picture', text: 'See cash, card spend, and scheduled activity together before you decide what to do next.', route: '/platinum', target: '[data-tour="balance-card"]' },
  { chapter: 'Operations', title: 'Find the transaction you need', text: 'Search and filter the full Transactions workspace by account, card, status, amount, date, and more.', route: '/platinum/transactions', target: '[data-tour="tx-filters"]' },
  { chapter: 'Operations', title: 'One queue for decisions', text: 'Swipe or scroll the queue tabs to move between requests that need action, pending work, and completed history.', route: '/platinum/action-center?tab=action_required', target: '[data-tour="action-center"] .tabs' },
  { chapter: 'Operations', title: 'Choose what to review', text: 'Choose a request from the list to see its supporting details and available actions alongside it.', route: '/platinum/action-center?tab=action_required', target: '[data-tour="ac-detail"]', placement: 'left' },
  { chapter: 'Cards & Controls', title: 'Cards for each way your team spends', text: 'Issue virtual or physical cards, create groups, or import cards in bulk from the same workspace.', route: '/platinum/cards?cardPageView=card', target: '[data-tour="cards"] .tabs' },
  { chapter: 'Cards & Controls', title: 'Manage the full card lifecycle', text: 'Review card ownership and limits, and scroll across the table for lifecycle actions such as pause, reassign, replace, or close.', route: '/platinum/cards?cardPageView=card', target: '[data-tour="cards-table"]', placement: 'bottom', hint: 'Inspect highlighted area' },
  { chapter: 'Cards & Controls', title: 'Set controls before spend happens', text: 'Set organization-wide spending and merchant limits, review existing controls, and update them as policies change.', route: '/platinum/settings/policies?settingsTab=card_limits', target: '[data-tour="card-limits"]' },
  { chapter: 'Payments', title: 'Send money with policy controls', text: 'Start a payment or open the approval policies that govern who can authorize it.', route: '/platinum/payments?paymentsTab=requests', target: '[data-tour="payments"] .head-actions' },
  { chapter: 'Payments', title: 'Keep every payment in the right lane', text: 'Swipe or scroll the tabs to move between requests, queued payments, upcoming payments, and sent history.', route: '/platinum/payments?paymentsTab=requests', target: '[data-tour="payments"] .tabs' },
  { chapter: 'Payments', title: 'Find queued payments to review', text: 'Search and filter queued payments, then review each vendor’s bank-detail status before the payment can be sent.', route: '/platinum/payments?paymentsTab=queued', target: '[data-tour="payments-tabs"]' },
  { chapter: 'Payments', title: 'Review incoming ACH debits', text: 'Review pending ACH requests here; scroll the workspace to inspect request details and decision history.', route: '/platinum/payments/ach-authorizations?achTab=pending', target: '[data-tour="ach-workspace"]', hint: 'Inspect highlighted area' },
  { chapter: 'Bills, Invoicing & Reimbursements', title: 'Turn bills into approved payments', text: 'Review captured vendor bills here, then scroll across each row for line items, approvals, and payment details.', route: '/platinum/payments/bills', target: '[data-tour="bills-table"]', hint: 'Inspect highlighted area' },
  { chapter: 'Bills, Invoicing & Reimbursements', title: 'Create repeatable ways to get paid', text: 'Create a new invoice or open invoicing settings from these actions. Switch between one-off and recurring invoices with the tabs below.', route: '/platinum/invoices?invoicesTab=invoices', target: '[data-tour="invoices"] .head-actions' },
  { chapter: 'Bills, Invoicing & Reimbursements', title: 'Track every invoice outcome', text: 'Track invoice outcomes here, and scroll across the table for reminders, payments, reconciliation, and delivery controls.', route: '/platinum/invoices?invoicesTab=invoices', target: '[data-tour="invoices-table"]', hint: 'Inspect highlighted area' },
  { chapter: 'Bills, Invoicing & Reimbursements', title: 'Review expenses with receipts attached', text: 'Review expense reports here, and scroll across the table for receipts, approval status, and reimbursement accounting.', route: '/platinum/reimbursements?expenseView=all', target: '[data-tour="reimbursements-table"]', hint: 'Inspect highlighted area' },
  { chapter: 'Cash, Treasury & Capital', title: 'Track cash and account details', text: 'Review balance activity alongside your account and routing details.', route: '/platinum/account/cash', target: '[data-tour="cash-account"] .body' },
  { chapter: 'Cash, Treasury & Capital', title: 'Move and document treasury funds', text: 'Transfer treasury funds or open treasury statements from the account header.', route: '/platinum/treasury', target: '[data-tour="treasury"] .head-actions' },
  { chapter: 'Cash, Treasury & Capital', title: 'See your capital position', text: 'Review available credit and the outstanding balance at a glance.', route: '/platinum/account/capital', target: '[data-tour="capital"] .body' },
  { chapter: 'Analytics', title: 'Break down spend activity', text: 'Swipe or scroll the categories to compare spend by payment method, merchant, contact, or card group.', route: '/platinum/analytics/reports/general-analytics', target: '[data-tour="analytics"] .toolbar' },
  { chapter: 'Accounting', title: 'Track accounting status', text: 'Swipe or scroll the status tabs to follow entries from review through sync, archive, or failure resolution.', route: '/platinum/accounting', target: '[data-tour="accounting"] .tabs' },
  { chapter: 'Accounting', title: 'Code bills in the same workflow', text: 'Review bill-level accounting here, and scroll across the table to update dimensions or prepare bills for sync.', route: '/platinum/accounting/bills', target: '[data-tour="accounting-bills"]', hint: 'Inspect highlighted area' },
  { chapter: 'Accounting', title: 'Manage the accounting connection', text: 'Review the connected platform and its sync controls here; mapping options are available in the Mapping Settings tab.', route: '/platinum/accounting/settings/general', target: '[data-tour="accounting-settings"] .card' },
  { chapter: 'Accounting', title: 'Map card activity consistently', text: 'Use the Card source category to review and manage the accounting mappings applied to card activity.', route: '/platinum/accounting/settings/mappings', target: '[data-tour="accounting-mappings"]' },
];

type TourState = 'hidden' | 'welcome' | 'active' | 'complete';
interface Ctx {
  state: TourState;
  step: number;
  start: () => void;
  openWelcome: () => void;
  next: () => void;
  back: () => void;
  skip: () => void;
  finish: () => void;
  replay: () => void;
  jump: (i: number) => void;
}
const TourCtx = createContext<Ctx | null>(null);
export const useTour = () => useContext(TourCtx)!;

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TourState>('hidden');
  const [step, setStep] = useState(0);
  const nav = useNavigate();
  const loc = useLocation();
  const { db, actions } = useApp();

  const go = useCallback((i: number) => {
    const s = STEPS[Math.max(0, Math.min(STEPS.length - 1, i))];
    setStep(i);
    if (s.route.split('?')[0] !== loc.pathname) nav(s.route);
  }, [loc.pathname, nav]);

  const start = useCallback(() => { setState('active'); setStep(0); nav(STEPS[0].route); }, [nav]);
  const openWelcome = useCallback(() => setState('welcome'), []);
  const next = useCallback(() => {
    if (step >= STEPS.length - 1) { setState('complete'); return; }
    go(step + 1);
  }, [step, go]);
  const back = useCallback(() => go(step - 1), [step, go]);
  const skip = useCallback(() => { setState('hidden'); actions.setSetting('tourDone', true); }, [actions]);
  const finish = useCallback(() => { setState('complete'); actions.setSetting('tourDone', true); }, [actions]);
  const replay = useCallback(() => { setState('active'); setStep(0); nav(STEPS[0].route); }, [nav]);

  useEffect(() => {
    const h = () => replay();
    window.addEventListener('slash:tour', h);
    return () => window.removeEventListener('slash:tour', h);
  }, [replay]);

  useEffect(() => {
    if (state === 'hidden' && !db.settings.tourDone) setState('welcome');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jump = useCallback((i: number) => { setState('active'); go(i); }, [go]);
  const value = useMemo(() => ({ state, step, start, openWelcome, next, back, skip, finish, replay, jump }), [state, step, start, openWelcome, next, back, skip, finish, replay, jump]);
  return <TourCtx.Provider value={value}>{children}<TourOverlay /></TourCtx.Provider>;
}

function useRect(selector?: string, active?: boolean) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!active || !selector) { setRect(null); return; }
    let raf = 0;
    const measure = () => {
      const el = document.querySelector(selector);
      if (el) setRect(el.getBoundingClientRect());
      raf = requestAnimationFrame(measure);
    };
    const t = setTimeout(measure, 260);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [selector, active]);
  return rect;
}

function ChaptersButton() {
  const tour = useTour();
  const [open, setOpen] = useState(false);
  const chapters = Array.from(new Set(STEPS.map((s) => s.chapter)));
  return (
    <div style={{ marginLeft: 'auto', position: 'relative' }}>
      <button className="btn ghost sm" onClick={() => setOpen((v) => !v)}>Chapters</button>
      {open && (
        <div className="menu" style={{ top: 'calc(100% + 6px)', right: 0, left: 'auto', minWidth: 240 }}>
          {chapters.map((c) => {
            const idx = STEPS.findIndex((s) => s.chapter === c);
            const count = STEPS.filter((s) => s.chapter === c).length;
            return (
              <div key={c} className="menu-item" onClick={() => { setOpen(false); tour.jump(idx); }}>
                <Icon name="BookmarkSimple" size={15} />
                {c}
                <span className="muted" style={{ marginLeft: 'auto', fontSize: 11.5 }}>{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TourOverlay() {
  const tour = useTour();
  const { toast } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const step = STEPS[tour.step];
  const active = tour.state === 'active';
  const rect = useRect(step?.target, active);

  if (tour.state === 'hidden') return null;

  if (tour.state === 'welcome') {
    return (
      <div className="tour-root">
        <div className="tour-dim" style={{ background: 'oklch(0.1905 0.01 97.9 / 0.42)' }} />
        <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          <div className="welcome-card">
            <span className="mark"><SlashMark size={26} /></span>
            <h2>Welcome to Slash</h2>
            <p>Take a 23-step guided tour of how Slash brings approvals, cards, payments, spend workflows, accounts, analytics, and accounting together. It takes about five minutes.</p>
            <input className="input" placeholder="Work email address*" value={email} onChange={(e) => setEmail(e.target.value)} style={{ background: 'var(--surface)' }} />
            <Btn primary block onClick={() => tour.start()}>Start guided tour</Btn>
            <button className="btn ghost sm" onClick={() => tour.skip()}>Skip for now</button>
          </div>
        </div>
      </div>
    );
  }

  if (tour.state === 'complete') {
    return (
      <div className="tour-root">
        <div className="tour-dim" style={{ background: 'oklch(0.1905 0.01 97.9 / 0.42)' }} />
        <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          <div className="welcome-card" style={{ width: 420 }}>
            <span className="mark"><SlashMark size={26} /></span>
            <h2>Product tour complete</h2>
            <p>See how Slash fits your workflows. Talk with our team about your cards, payments, controls, and accounting setup.</p>
            <Btn primary block onClick={() => { tour.skip(); toast('Thanks — our team will reach out'); }}>Talk to sales</Btn>
            <div className="row" style={{ gap: 8 }}>
              <Btn block onClick={() => tour.skip()}>Keep exploring</Btn>
              <Btn block ghost onClick={() => tour.replay()}>Replay tour</Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // active
  const pad = 8;
  const hole = rect
    ? { left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }
    : null;

  let cardStyle: React.CSSProperties = { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' };
  if (hole) {
    const cardW = 372;
    const cardH = 210;
    let left = hole.left + hole.width / 2 - cardW / 2;
    let top = hole.top + hole.height + 16;
    if (top + cardH > window.innerHeight - 12) top = Math.max(12, hole.top - cardH - 16);
    left = Math.max(12, Math.min(window.innerWidth - cardW - 12, left));
    cardStyle = { left, top };
  }

  return (
    <div className="tour-root">
      <div className="tour-dim" style={{ background: hole ? 'transparent' : 'oklch(0.1905 0.01 97.9 / 0.34)' }} onClick={() => {}} />
      {hole && <div style={{ position: 'absolute', ...hole, borderRadius: 12, boxShadow: '0 0 0 9999px oklch(0.1905 0.01 97.9 / 0.34)', pointerEvents: 'none', transition: 'all .25s ease' }} />}
      {hole && <div className="tour-ring" style={{ left: hole.left, top: hole.top, width: hole.width, height: hole.height }} />}
      <div className="tour-card" style={cardStyle} data-tour="tour-card">
        <div className="row" style={{ gap: 8 }}>
          <div className="tour-chapter">
            {step.chapter}
            <span className="sep" />
            Step {STEPS.slice(0, tour.step + 1).filter((x) => x.chapter === step.chapter).length} of{' '}
            {STEPS.filter((x) => x.chapter === step.chapter).length}
          </div>
          <ChaptersButton />
          <button className="icon-btn" aria-label="Close tour" title="Close tour" onClick={() => tour.skip()} style={{ width: 24, height: 24 }}>
            <Icon name="X" size={14} />
          </button>
        </div>
        <div className="tour-title">{step.title}</div>
        <div className="tour-text">{step.text}</div>
        <div className="tour-foot">
          <button className="btn ghost sm" disabled={tour.step === 0} onClick={() => tour.back()}>Back</button>
          <span style={{ marginLeft: 6 }}>{tour.step + 1} of {STEPS.length}</span>
          <Btn sm primary style={{ marginLeft: 'auto' }} onClick={() => tour.next()}>
            {tour.step === STEPS.length - 1 ? 'Finish' : 'Continue'}
          </Btn>
        </div>
        <div className="tour-progress">
          {STEPS.map((_, i) => <i key={i} className={i <= tour.step ? 'done' : ''} />)}
        </div>
      </div>
    </div>
  );
}