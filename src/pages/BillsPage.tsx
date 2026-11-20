import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, PageHead, Btn, Chip, Table, TRow, Th, SearchBox, Modal, Drawer, KV, Empty, StatusChip, MerchantTile } from '../components/ui';
import { useApp, money, todayLabel } from '../store';
import type { Bill } from '../data/types';

export default function BillsPage() {
  const { db, actions, toast } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [creating, setCreating] = useState(false);
  const [detail, setDetail] = useState<Bill | null>(null);
  const [draft, setDraft] = useState({ vendor: '', amount: '', dueDate: '2026-12-15', invoiceNo: '', notes: '', status: 'Draft' as Bill['status'], sendForApproval: false });

  const rows = useMemo(
    () => db.bills.filter((b) => (status === 'All' || b.status === status) && (!q || `${b.vendor} ${b.invoiceNo}`.toLowerCase().includes(q.toLowerCase()))),
    [db.bills, q, status],
  );

  const cols = 'minmax(180px,1.3fr) 150px 110px 104px 100px 120px minmax(110px,1fr) 104px';

  return (
    <div className="panel" data-tour="bills">
      <PageHead icon="Receipt" title="Bills">
        <Btn primary icon="PlusCircle" onClick={() => setCreating(true)}>New bill</Btn>
      </PageHead>
      <div className="toolbar">
        <button className="pill-btn" onClick={() => toast('Filter bills by vendor, status or date range')}><Icon name="Funnel" size={15} />Filters</button>
        <SearchBox value={q} onChange={setQ} placeholder="Search bills" />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          {['All', 'Draft', 'Pending approval', 'Scheduled', 'Paid', 'Partially paid', 'Payment failed'].map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'Status is' : s}</option>
          ))}
        </select>
        <div className="right">Total <strong className="num" style={{ color: 'var(--ink)' }}>{money(rows.reduce((a, b) => a + b.amount, 0))}</strong></div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }} data-tour="bills-table">
        {rows.length === 0 ? (
          <Empty icon="Receipt" title="No bills yet" text="Capture a vendor bill to start the approval flow." />
        ) : (
          <Table
            cols={cols}
            head={
              <>
                <Th>Vendor / Owner</Th>
                <Th>Status</Th>
                <Th>Amount</Th>
                <Th>Due date</Th>
                <Th>Invoice date</Th>
                <Th>Invoice #</Th>
                <Th>Notes</Th>
                <Th>Actions</Th>
              </>
            }
          >
            {rows.map((b) => (
              <TRow key={b.id} cols={cols} onClick={() => setDetail(b)}>
                <div className="cell">
                  <MerchantTile name={b.vendor} icon="Receipt" />
                  <div className="main">
                    <span className="title">{b.vendor}</span>
                    <span className="sub">{b.owner}</span>
                  </div>
                </div>
                <div><StatusChip status={b.status} /></div>
                <span className="num">{money(b.amount)}</span>
                <div className="stack" style={{ gap: 0 }}>
                  <span>{b.dueDate}</span>
                  <span className="sub" style={{ color: b.dueMeta.includes('overdue') ? 'var(--red-11)' : 'var(--ink-4)', fontSize: 11.5 }}>{b.dueMeta}</span>
                </div>
                <span className="muted">{b.invoiceDate}</span>
                <span className="mono" style={{ fontSize: 12 }}>{b.invoiceNo}</span>
                <span className="trunc muted">{b.notes}</span>
                <div className="right" style={{ gap: 4 }} onClick={(e) => e.stopPropagation()}>
                  {b.status === 'Pending approval' && <Btn sm primary onClick={() => actions.setBillStatus(b.id, 'Scheduled')}>Approve</Btn>}
                  {(b.status === 'Draft') && <Btn sm onClick={() => actions.setBillStatus(b.id, 'Pending approval')}>Submit</Btn>}
                  {(b.status === 'Scheduled') && <Btn sm onClick={() => actions.setBillStatus(b.id, 'Paid')}>Pay now</Btn>}
                  {(b.status === 'Payment failed' || b.status === 'Partially paid') && <Btn sm onClick={() => actions.setBillStatus(b.id, 'Paid')}>Retry</Btn>}
                  {(b.status === 'Paid') && <span className="chip green sm"><Icon name="Check" size={12} />Paid</span>}
                </div>
              </TRow>
            ))}
          </Table>
        )}
      </div>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New bill"
        icon="Receipt"
        footer={
          <>
            <Btn ghost onClick={() => setCreating(false)}>Cancel</Btn>
            <div className="spacer" />
            <Btn primary disabled={!draft.vendor || !Number(draft.amount)} onClick={() => { actions.createBill({ vendor: draft.vendor, amount: Number(draft.amount), dueDate: draft.dueDate, invoiceNo: draft.invoiceNo, notes: draft.notes, status: draft.sendForApproval ? 'Pending approval' : 'Draft' }); setCreating(false); setDraft({ ...draft, vendor: '', amount: '', invoiceNo: '', notes: '' }); }}>
              Save bill
            </Btn>
          </>
        }
      >
        <div className="field">
          <label>Vendor</label>
          <input className="input" list="vendors" value={draft.vendor} onChange={(e) => setDraft({ ...draft, vendor: e.target.value })} placeholder="Vendor name" autoFocus />
          <datalist id="vendors">{db.recipients.map((r) => <option key={r.id} value={r.name} />)}</datalist>
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Amount</label>
            <input className="input" inputMode="decimal" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} placeholder="0.00" />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Due date</label>
            <input className="input" type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Invoice number</label>
          <input className="input" value={draft.invoiceNo} onChange={(e) => setDraft({ ...draft, invoiceNo: e.target.value })} placeholder="INV-2026-1234" />
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea className="textarea" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Line items, PO number, memo" />
        </div>
        <label className="row" style={{ gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={draft.sendForApproval} onChange={(e) => setDraft({ ...draft, sendForApproval: e.target.checked })} />
          Send for approval immediately
        </label>
      </Modal>

      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail?.vendor ?? ''} icon="Receipt" footer={detail && <><Btn sm ghost onClick={() => nav('/platinum/payments')}>View in Payables</Btn><div className="spacer" />{detail.status !== 'Paid' && <Btn sm primary onClick={() => { actions.setBillStatus(detail.id, 'Paid'); setDetail(null); }}>Pay bill</Btn>}</>}>
        {detail && (
          <>
            <div className="row" style={{ gap: 10 }}>
              <MerchantTile name={detail.vendor} icon="Receipt" />
              <div className="stack">
                <span className="num" style={{ fontSize: 20, fontWeight: 600 }}>{money(detail.amount)}</span>
                <span className="muted" style={{ fontSize: 12.5 }}>{detail.invoiceNo}</span>
              </div>
              <StatusChip status={detail.status} />
            </div>
            <div className="divider" />
            <KV
              rows={[
                { label: 'Owner', value: detail.owner },
                { label: 'Due date', value: `${detail.dueDate} · ${detail.dueMeta}` },
                { label: 'Invoice date', value: detail.invoiceDate },
                { label: 'Invoice number', value: detail.invoiceNo },
                { label: 'Notes', value: detail.notes },
                { label: 'Amount paid', value: money(detail.paid) },
                { label: 'Captured', value: todayLabel() },
              ]}
            />
            <div className="divider" />
            <div className="stack" style={{ gap: 6 }}>
              <span className="section-title">Approvals & payment</span>
              {['Captured', 'Coded to accounting', 'Approval requested'].map((s, i) => (
                <div className="row" key={s} style={{ fontSize: 13 }}>
                  <Icon name={i < 2 ? 'CheckCircle' : 'Clock'} size={14} style={{ color: i < 2 ? 'var(--green-11)' : 'var(--ink-4)' }} />
                  {s}
                  <span className="muted" style={{ marginLeft: 'auto' }}>{i < 2 ? detail.invoiceDate : '—'}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}