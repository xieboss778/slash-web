import React, { useState } from 'react';
import { Icon, PageHead, Btn, Table, TRow, Th, Tabs, Chip, SearchBox } from '../components/ui';
import { useApp, money } from '../store';
import { analyticsBreakdown } from '../data/seed';

const tabs = [
  { key: 'method', label: 'Payment method' },
  { key: 'merchant', label: 'Merchant' },
  { key: 'contact', label: 'Contact' },
  { key: 'group', label: 'Card group' },
];

export default function AnalyticsPage() {
  const { toast } = useApp();
  const [tab, setTab] = useState('method');
  const [range, setRange] = useState('3 Months');
  const rows = (analyticsBreakdown as any)['by' + tab.charAt(0).toUpperCase() + tab.slice(1)] as { label: string; amount: number; pct: number }[];
  const total = rows.reduce((a, b) => a + b.amount, 0);
  const max = Math.max(...rows.map((r) => r.amount));

  return (
    <div className="panel" data-tour="analytics">
      <PageHead icon="ChartLineUp" title="Analytics">
        <select className="select" value={range} onChange={(e) => setRange(e.target.value)}>
          {['3 Months', '6 Months', '12 Months', 'YTD'].map((r) => <option key={r}>{r}</option>)}
        </select>
        <Btn icon="DownloadSimple" onClick={() => toast('Report exported')}>Export</Btn>
      </PageHead>
      <div className="toolbar">
        <div className="row" style={{ gap: 2, background: 'var(--surface-3)', padding: 2, borderRadius: 8 }}>
          {tabs.map((t) => (
            <button key={t.key} className="btn sm" onClick={() => setTab(t.key)}
              style={{ border: t.key === tab ? '1px solid var(--line-2)' : '1px solid transparent', background: t.key === tab ? 'var(--surface)' : 'transparent', boxShadow: t.key === tab ? 'var(--shadow-1)' : 'none' }}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="right">
          Total spend <strong className="num" style={{ color: 'var(--ink)' }}>{money(total)}</strong>
        </div>
      </div>
      <div className="body" style={{ overflow: 'auto' }}>
        <div className="card">
          <div className="card-head"><h2>Spend by {tabs.find((t) => t.key === tab)?.label.toLowerCase()}</h2></div>
          <div className="card-pad">
            <div className="stack" style={{ gap: 14 }}>
              {rows.map((r) => (
                <div key={r.label} className="stack" style={{ gap: 5 }}>
                  <div className="row" style={{ fontSize: 13 }}>
                    <span>{r.label}</span>
                    <span className="num" style={{ marginLeft: 'auto' }}>{money(r.amount)}</span>
                    <span className="muted" style={{ width: 48, textAlign: 'right' }}>{(r.pct * 100).toFixed(1)}%</span>
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <i style={{ width: `${(r.amount / max) * 100}%`, background: 'var(--gold-9)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h2>Breakdown</h2><div className="row" style={{ marginLeft: 'auto' }}><SearchBox value="" onChange={() => {}} placeholder="Search" /></div></div>
          <Table cols="minmax(240px,1.5fr) 140px 120px 120px" head={<><Th>Category</Th><Th>Amount</Th><Th>Share</Th><Th>Transactions</Th></>}>
            {rows.map((r) => (
              <TRow key={r.label} cols="minmax(240px,1.5fr) 140px 120px 120px">
                <div className="cell"><Icon name="Tag" size={14} style={{ color: 'var(--ink-4)' }} /><span className="title">{r.label}</span></div>
                <span className="num">{money(r.amount)}</span>
                <span>{(r.pct * 100).toFixed(1)}%</span>
                <span className="muted num">{Math.round(r.pct * 860)}</span>
              </TRow>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}