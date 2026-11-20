import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon, PageHead, Btn, Chip, Tabs, Table, TRow, Th, SearchBox, IconBtn, Drawer, KV, Modal, Empty, DateRow, MerchantTile } from '../components/ui';
import { useApp, money } from '../store';
import type { Payment } from '../data/types';

const approvalTone = (s: string) => (s === 'Needs your approval' ? 'gold-outline' : s === 'Approved' || s === 'Paid' || s === 'Sent' ? 'green' : s === 'Declined' ? 'red' : 'gold');

export function SendMoneyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { db, actions } = useApp();
  const [step, setStep] = useState(1);
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<Payment['method']>('ACH');
  const [account, setAccount] = useState('Cash account');
  const [schedule, setSchedule] = useState<'Immediate' | 'Scheduled'>('Immediate');
  const [date, setDate] = useState('2026-12-01');
  const [memo, setMemo] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);

  const reset = () => { setStep(1); setVendor(''); setAmount(''); setMemo(''); setAttachment(null); };
  const close = () => { onClose(); setTimeout(reset, 200); };

  const numeric = Number(amount.replace(/[^0-9.]/g, '')) || 0;

  return (
    <Modal
      open={open}
      onClose={close}
      title={step === 3 ? 'Payment submitted' : 'Send money'}
      icon="PaperPlaneTilt"
      wide
      footer={
        step === 1 ? (
          <>
            <Btn ghost onClick={close}>Cancel</Btn>
            <div className="spacer" />
            <Btn primary disabled={!vendor || numeric <= 0} onClick={() => setStep(2)}>Review payment</Btn>
          </>
        ) : step === 2 ? (
          <>
            <Btn ghost onClick={() => setStep(1)}>Back</Btn>
            <div className="spacer" />
            <Btn primary onClick={() => { actions.sendMoney({ vendor, amount: numeric, method, account, memo, schedule, date: schedule === 'Scheduled' ? date : undefined, attachments: attachment ? 1 : 0 }); setStep(3); }}>Submit payment</Btn>
          </>
        ) : (
          <><div className="spacer" /><Btn primary onClick={() => { close(); }}>Done</Btn></>
        )
      }
    >
      {step === 1 && (
        <>
          <div className="field">
            <label>Vendor or recipient</label>
            <input className="input" list="recipients" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Search recipients" autoFocus />
            <datalist id="recipients">
              {db.recipients.map((r) => <option key={r.id} value={r.name}>{r.email}</option>)}
            </datalist>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Amount (USD)</label>
              <input className="input" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Payment method</label>
              <select className="input" value={method} onChange={(e) => setMethod(e.target.value as any)}>
                {['ACH', 'Wire', 'Check'].map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>From account</label>
              <select className="input" value={account} onChange={(e) => setAccount(e.target.value)}>
                {db.accounts.map((a) => <option key={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Schedule</label>
              <select className="input" value={schedule} onChange={(e) => setSchedule(e.target.value as any)}>
                <option>Immediate</option>
                <option>Scheduled</option>
              </select>
            </div>
          </div>
          {schedule === 'Scheduled' && (
            <div className="field">
              <label>Payment date</label>
              <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          )}
          <div className="field">
            <label>Memo</label>
            <input className="input" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="What is this payment for?" />
          </div>
          <div className="row" style={{ gap: 8 }}>
            <Btn sm icon="Paperclip" onClick={() => setAttachment('invoice.pdf')}>{attachment ? attachment : 'Attach document'}</Btn>
            {method === 'Wire' && <span className="hint">Wire transfers settle same day before 3:00 PM ET.</span>}
          </div>
        </>
      )}
      {step === 2 && (
        <KV
          rows={[
            { label: 'Vendor', value: vendor },
            { label: 'Amount', value: <span className="num" style={{ fontSize: 16, fontWeight: 600 }}>{money(numeric)}</span> },
            { label: 'Method', value: method },
            { label: 'From', value: `${account}` },
            { label: 'Schedule', value: schedule === 'Immediate' ? 'Immediate' : date },
            { label: 'Memo', value: memo || '—' },
            { label: 'Attachment', value: attachment ?? '—' },
            { label: 'Approvals', value: numeric > 5000 ? 'Requires 2 approvals' : 'Requires 1 approval' },
          ]}
        />
      )}
      {step === 3 && (
        <div className="stack" style={{ gap: 10, alignItems: 'center', padding: '12px 0' }}>
          <span className="avatar green" style={{ width: 44, height: 44 }}><Icon name="Check" size={22} /></span>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{money(numeric)} to {vendor}</span>
          <span className="muted" style={{ fontSize: 13, textAlign: 'center' }}>
            {numeric > 5000 ? 'A second approver has been notified.' : 'Payment queued for approval in the Payments workspace.'}
          </span>
        </div>
      )}
    </Modal>
  );
}

export default function PaymentsPage() {
  const { db, actions, toast } = useApp();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get('paymentsTab') ?? 'requests';
  const setTab = (t: string) => setParams({ paymentsTab: t });
  const [q, setQ] = useState('');
  const [sending, setSending] = useState(false);
  const selectedId = params.get('payment');
  const [detail, setDetail] = useState<Payment | null>(null);

  const all = useMemo(() => {
    const map: Record<string, Payment[]> = { requests: db.paymentRequests, queued: db.queuedPayments, upcoming: db.upcomingPayments, sent: db.sentPayments };
    return map[tab] ?? [];
  }, [db, tab]);

  const rows = all.filter((p) => !q || `${p.vendor} ${p.owner} ${p.notes}`.toLowerCase().includes(q.toLowerCase()));

  const cols = 'minmax(190px,1.3fr) 160px 96px 92px 92px 96px 78px minmax(80px,1fr) 92px';

  const actionsCell = (p: Payment) => (
    <div className="right" style={{ gap: 4 }} onClick={(e) => e.stopPropagation()}>
      {p.status === 'Needs your approval' && (
        <>
          <IconBtn name="CheckCircle" label="Approve" onClick={() => actions.decidePayment(p.id, true)} />
          <IconBtn name="XCircle" label="Decline" onClick={() => actions.decidePayment(p.id, false)} danger />
        </>
      )}
      {p.status === 'Pending' && <IconBtn name="PaperPlaneTilt" label="Send now" onClick={() => actions.approveQueued(p.id)} />}
      {(p.status === 'Waiting on approver' || p.status === 'Scheduled') && <IconBtn name="Clock" label="Waiting" onClick={() => toast('Reminder sent to approver')} />}
      {(p.status === 'Paid' || p.status === 'Sent') && <IconBtn name="Check" label="Sent" onClick={() => toast('Already sent')} />}
      {p.status === 'Declined' && <IconBtn name="Prohibit" label="Declined" onClick={() => toast('This payment was declined')} danger />}
      <IconBtn name="Paperclip" label="Attachments" onClick={() => toast(p.attachments ? `${p.attachments} attachment(s)` : 'No attachments')} />
    </div>
  );

  return (
    <div className="panel" data-tour="payments">
      <PageHead icon="PaperPlaneTilt" title="Payments">
        <Btn onClick={() => nav('/platinum/settings/policies')} icon="ShieldWarning">Policies</Btn>
        <Btn primary onClick={() => setSending(true)} icon="PaperPlaneTilt">Send money</Btn>
      </PageHead>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'requests', label: 'Payment requests', count: db.paymentRequests.length },
          { key: 'queued', label: 'Queued payments', count: db.queuedPayments.length },
          { key: 'upcoming', label: 'Upcoming payments', count: db.upcomingPayments.length },
          { key: 'sent', label: 'Sent payments' },
        ]}
      />
      <div className="toolbar" data-tour="payments-tabs">
        {tab === 'requests' && <span className="chip gold-outline" style={{ height: 30 }}>Needs your response</span>}
        <button className="pill-btn" onClick={() => toast('Filters coming from the same workspace')}><Icon name="Funnel" size={15} />Filters</button>
        <SearchBox value={q} onChange={setQ} placeholder={tab === 'queued' ? 'Search queued payments' : 'Search requests'} />
        {tab === 'requests' ? (
          <div className="right">Approve or decline requests inline</div>
        ) : (
          <div className="right">Totals <strong className="num" style={{ color: 'var(--ink)' }}>{money(rows.reduce((a, b) => a + Math.abs(b.amount), 0))}</strong></div>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {rows.length === 0 ? (
          <Empty icon="PaperPlaneTilt" title="No payments here" text="Create a payment with Send money." />
        ) : (
          <Table
            cols={cols}
            head={
              <>
                <Th>Vendor / Owner</Th>
                <Th>Approvals</Th>
                <Th>Amount</Th>
                <Th>Schedule</Th>
                <Th>Due date</Th>
                <Th>Payment method</Th>
                <Th>Attachments</Th>
                <Th>Notes</Th>
                <Th>Actions</Th>
              </>
            }
          >
            {rows.map((p) => (
              <React.Fragment key={p.id}>
                {tab === 'requests' && <DateRow label={p.dateLabel} />}
                <TRow cols={cols} onClick={() => setDetail(p)}>
                  <div className="cell">
                    <MerchantTile name={p.vendor} icon="Bank" />
                    <div className="main">
                      <span className="title">{p.vendor}</span>
                      <span className="sub">{p.type}</span>
                    </div>
                  </div>
                  <div>
                    <Chip tone={approvalTone(p.approvals) as any} icon={p.approvals === 'Needs your approval' ? 'ShieldWarning' : p.approvals === 'Declined' ? 'XCircle' : 'CheckCircle'}>
                      {p.approvals}
                    </Chip>
                  </div>
                  <span className="num">{money(p.amount)}</span>
                  <span className="trunc"><span className="chip sm">{p.schedule}</span></span>
                  <span className="trunc">{p.dueDate}</span>
                  <div className="cell">
                    <Icon name={p.method === 'Wire' ? 'Globe' : 'Bank'} size={14} style={{ color: 'var(--ink-4)' }} />
                    {p.method}
                  </div>
                  <span className="muted">{p.attachments ? `${p.attachments} file` : '—'}</span>
                  <span className="trunc muted">{p.notes || '—'}</span>
                  {actionsCell(p)}
                </TRow>
              </React.Fragment>
            ))}
          </Table>
        )}
      </div>

      <SendMoneyModal open={sending} onClose={() => setSending(false)} />

      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail?.vendor ?? ''} icon="PaperPlaneTilt">
        {detail && (
          <>
            <div className="row" style={{ gap: 10 }}>
              <MerchantTile name={detail.vendor} icon="Bank" />
              <div className="stack">
                <span className="num" style={{ fontSize: 20, fontWeight: 600 }}>{money(Math.abs(detail.amount))}</span>
                <span className="muted" style={{ fontSize: 12.5 }}>{detail.type}</span>
              </div>
              <Chip tone={approvalTone(detail.approvals) as any} >{detail.approvals}</Chip>
            </div>
            <div className="divider" />
            <KV
              rows={[
                { label: 'Owner', value: detail.owner },
                { label: 'Method', value: detail.method },
                { label: 'From account', value: detail.account },
                { label: 'Schedule', value: detail.schedule },
                { label: 'Due date', value: detail.dueDate },
                { label: 'Attachments', value: detail.attachments ? `${detail.attachments} file` : '—' },
                { label: 'Notes', value: detail.notes || '—' },
              ]}
            />
            <div className="divider" />
            <div className="row" style={{ gap: 8 }}>
              {detail.status === 'Needs your approval' && (
                <>
                  <Btn primary icon="Check" onClick={() => { actions.decidePayment(detail.id, true); setDetail(null); }}>Approve</Btn>
                  <Btn icon="X" onClick={() => { actions.decidePayment(detail.id, false); setDetail(null); }}>Decline</Btn>
                </>
              )}
              {detail.status === 'Pending' && <Btn primary icon="PaperPlaneTilt" onClick={() => { actions.approveQueued(detail.id); setDetail(null); }}>Send now</Btn>}
              <Btn ghost icon="Paperclip" onClick={() => toast('No attachments to upload here')}>Add attachment</Btn>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}