import React, { useState } from 'react';
import { Icon, PageHead, Btn, Table, TRow, Th, SearchBox, Chip, Empty, StatusChip, Drawer, KV, MerchantTile } from '../components/ui';
import { useApp, money } from '../store';
import { expenseCounts } from '../data/seed';
import type { Expense } from '../data/types';

const views = ['all', 'pending', 'cancelled', 'rejected', 'processing', 'complete', 'failed'] as const;

export default function ReimbursementsPage() {
  const { db, actions, toast } = useApp();
  const [view, setView] = useState<string>('all');
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState<Expense | null>(null);

  const statusFor = (v: string) => {
    switch (v) {
      case 'pending': return ['Needs review'];
      case 'cancelled': return ['Cancelled'];
      case 'rejected': return ['Rejected'];
      case 'processing': return ['Processing payment'];
      case 'complete': return ['Payment complete'];
      case 'failed': return ['Payment failed'];
      default: return null;
    }
  };

  const rows = db.expenses.filter((e) => {
    const st = statusFor(view);
    if (st && !st.includes(e.status)) return false;
    if (q && !`${e.employee} ${e.merchant} ${e.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const cols = 'minmax(220px,1.3fr) minmax(150px,1fr) 130px 110px 130px 90px 140px';

  return (
    <div className="panel" data-tour="reimbursements">
      <PageHead icon="ReceiptX" title="Reimbursements">
        <Btn icon="Gear" onClick={() => toast('Reimbursement settings')}>Settings</Btn>
      </PageHead>
      <div className="toolbar">
        <select className="select" value={view} onChange={(e) => setView(e.target.value)}>
          {views.map((v) => (
            <option key={v} value={v}>
              {v === 'all' ? 'All expenses' : v === 'pending' ? `Needs review (${expenseCounts.pendingReview})` : v === 'complete' ? `Payment complete (${expenseCounts.complete})` : v}
            </option>
          ))}
        </select>
        <button className="pill-btn" onClick={() => toast('Filter by employee, merchant or card')}><Icon name="Funnel" size={15} />Filters</button>
        <SearchBox value={q} onChange={setQ} placeholder="Search expense reports" />
        <div className="right">Total <strong className="num" style={{ color: 'var(--ink)' }}>{money(rows.reduce((a, b) => a + b.amount, 0))}</strong></div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }} data-tour="reimbursements-table">
        {rows.length === 0 ? (
          <Empty icon="ReceiptX" title="No expense reports in this view" />
        ) : (
          <Table
            cols={cols}
            head={<><Th>Employee</Th><Th>Merchant</Th><Th>Category</Th><Th>Amount</Th><Th>Submitted</Th><Th>Receipts</Th><Th>Status</Th></>}
          >
            {rows.map((e) => (
              <TRow key={e.id} cols={cols} onClick={() => setDetail(e)}>
                <div className="cell">
                  <span className="avatar">{e.employee.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
                  <div className="main">
                    <span className="title">{e.employee}</span>
                    <span className="sub">{e.note}</span>
                  </div>
                </div>
                <div className="cell"><MerchantTile name={e.merchant} icon="Receipt" /><span className="trunc">{e.merchant}</span></div>
                <span className="chip sm">{e.category}</span>
                <span className="num">{money(e.amount)}</span>
                <span className="muted">{e.submitted}</span>
                <div className="cell">
                  {e.receipts > 0 ? <Chip tone="green" sm icon="Paperclip">{e.receipts}</Chip> : <Chip tone="red" sm icon="Warning">None</Chip>}
                </div>
                <div><StatusChip status={e.status === 'Needs review' ? 'Needs review' : e.status} /></div>
              </TRow>
            ))}
          </Table>
        )}
      </div>

      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail?.merchant ?? ''} icon="ReceiptX"
        footer={detail && (
          <>
            {detail.status === 'Needs review' && (
              <>
                <Btn sm primary icon="Check" onClick={() => { actions.decideExpense(detail.id, true); setDetail(null); }}>Approve</Btn>
                <Btn sm icon="X" onClick={() => { actions.decideExpense(detail.id, false); setDetail(null); }}>Reject</Btn>
              </>
            )}
            {detail.status === 'Approved' && <Btn sm primary icon="PaperPlaneTilt" onClick={() => { actions.payExpense(detail.id); setDetail(null); }}>Pay reimbursement</Btn>}
            <div className="spacer" />
            <Btn sm ghost icon="DownloadSimple" onClick={() => toast('Receipt downloaded')}>Receipt</Btn>
          </>
        )}
      >
        {detail && (
          <>
            <div className="row" style={{ gap: 10 }}>
              <span className="avatar" style={{ width: 34, height: 34 }}>{detail.employee.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
              <div className="stack">
                <span className="num" style={{ fontSize: 20, fontWeight: 600 }}>{money(detail.amount)}</span>
                <span className="muted" style={{ fontSize: 12.5 }}>{detail.employee} · {detail.category}</span>
              </div>
              <StatusChip status={detail.status} />
            </div>
            <div className="divider" />
            <KV
              rows={[
                { label: 'Merchant', value: detail.merchant },
                { label: 'Submitted', value: detail.submitted },
                { label: 'Category', value: detail.category },
                { label: 'Receipts', value: detail.receipts ? `${detail.receipts} attached` : 'Missing' },
                { label: 'Note', value: detail.note || '—' },
                { label: 'Accounting', value: 'Coded to Meals & entertainment' },
              ]}
            />
          </>
        )}
      </Drawer>
    </div>
  );
}