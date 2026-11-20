import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon, PageHead, Amount, Btn, Chip, MerchantTile, Th, Table, TRow, DateRow, SearchBox, Select, Drawer, KV, IconBtn, Empty } from '../components/ui';
import { useApp, money } from '../store';
import { transactionsTotals } from '../data/seed';

const exportCsv = (rows: any[]) => {
  const head = ['Date', 'Merchant', 'Type', 'Account', 'Method', 'Status', 'Amount'];
  const body = rows.map((t) => [t.date, t.merchant, t.type, t.account, t.method, t.status, t.amount]);
  const csv = [head, ...body].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'slash-transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
};

export default function TransactionsPage() {
  const { db, toast } = useApp();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [account, setAccount] = useState('All');
  const [method, setMethod] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('Settlement Time');
  const [showFilters, setShowFilters] = useState(false);
  const selectedId = params.get('tx');
  const selected = db.transactions.find((t) => t.id === selectedId) ?? null;

  const rows = useMemo(() => {
    let out = db.transactions.filter((t) => {
      if (q && !(t.merchant.toLowerCase().includes(q.toLowerCase()) || t.type.toLowerCase().includes(q.toLowerCase()))) return false;
      if (account !== 'All' && !t.account.toLowerCase().includes(account.toLowerCase())) return false;
      if (method !== 'All' && t.method !== method) return false;
      if (status !== 'All' && t.status !== status) return false;
      return true;
    });
    if (sort === 'Amount') out = [...out].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    if (sort === 'Description') out = [...out].sort((a, b) => a.merchant.localeCompare(b.merchant));
    return out;
  }, [db.transactions, q, account, method, status, sort]);

  const groups = useMemo(() => {
    const g: { label: string; rows: typeof rows }[] = [];
    rows.forEach((t) => {
      const last = g[g.length - 1];
      if (last && last.label === t.dateLabel) last.rows.push(t);
      else g.push({ label: t.dateLabel, rows: [t] });
    });
    return g;
  }, [rows]);

  const totalIn = rows.filter((r) => r.amount > 0).reduce((a, b) => a + b.amount, 0);
  const totalOut = rows.filter((r) => r.amount < 0).reduce((a, b) => a + b.amount, 0);

  const cols = 'minmax(220px,1.4fr) 120px 96px minmax(170px,1.1fr) 110px 120px';

  return (
    <div className="panel" data-tour="transactions">
      <PageHead icon="List" title="Transactions">
        <Btn icon="FileCsv" onClick={() => { exportCsv(rows); toast('Export ready — slash-transactions.csv'); }}>
          Export .CSV
        </Btn>
      </PageHead>

      <div className="stat-strip" data-tour="tx-stats">
        <strong className="num">{transactionsTotals.count}</strong> Count
        <span className="dot">·</span>
        <strong className="num">{money(transactionsTotals.moneyIn)}</strong> Money In
        <span className="dot">·</span>
        <strong className="num">{money(transactionsTotals.moneyOut)}</strong> Money Out
        <span className="dot">·</span>
        <strong className="num">{money(transactionsTotals.net)}</strong> Net Change
      </div>

      <div className="toolbar" data-tour="tx-filters">
        <button className={`pill-btn${showFilters ? ' on' : ''}`} onClick={() => setShowFilters((v) => !v)}>
          <Icon name="Funnel" size={15} />
          Filters
        </button>
        <SearchBox value={q} onChange={setQ} placeholder="Description" />
        <div className="select">
          <Icon name="Bank" size={14} />
          <select value={account} onChange={(e) => setAccount(e.target.value)}>
            {['All', 'Cash', 'Secured'].map((o) => (
              <option key={o} value={o}>{o === 'All' ? 'Account is' : o}</option>
            ))}
          </select>
          <Icon name="CaretDown" size={14} />
        </div>
        <div className="select">
          <Icon name="ArrowRight" size={14} />
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            {['All', 'Card', 'ACH', 'Wire', 'Internal'].map((o) => (
              <option key={o} value={o}>{o === 'All' ? 'Method is' : o}</option>
            ))}
          </select>
          <Icon name="CaretDown" size={14} />
        </div>
        <div className="select">
          <Icon name="CheckCircle" size={14} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {['All', 'Scheduled', 'Pending', 'Succeeded', 'Failed'].map((o) => (
              <option key={o} value={o}>{o === 'All' ? 'Status is' : o}</option>
            ))}
          </select>
          <Icon name="CaretDown" size={14} />
        </div>
        <div className="right">
          Sort by:
          <Select value={sort} onChange={setSort} options={['Settlement Time', 'Amount', 'Description']} />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {rows.length === 0 ? (
          <Empty icon="MagnifyingGlass" title="No transactions match these filters" text="Try clearing the filters or searching a different description." />
        ) : (
          <Table
            cols={cols}
            head={
              <>
                <Th>Transaction</Th>
                <Th>Account</Th>
                <Th>Method</Th>
                <Th>Virtual Account</Th>
                <Th>Status</Th>
                <Th>Amount</Th>
              </>
            }
          >
            {groups.map((g) => (
              <React.Fragment key={g.label}>
                <DateRow label={g.label} />
                {g.rows.map((t) => (
                  <TRow key={t.id} cols={cols} selected={t.id === selectedId} onClick={() => setParams({ tx: t.id })}>
                    <div className="cell">
                      <MerchantTile name={t.merchant} icon={t.method === 'Wire' ? 'Globe' : t.method === 'ACH' ? 'Bank' : undefined} />
                      <div className="main">
                        <span className="title">{t.merchant}</span>
                        <span className="sub">{t.type}</span>
                      </div>
                      {t.status === 'Failed' && <Icon name="Warning" size={14} style={{ color: 'var(--red-11)' }} />}
                    </div>
                    <div className="cell">
                      <Icon name={t.account === 'cash' ? 'Bank' : 'CreditCard'} size={14} style={{ color: 'var(--ink-4)' }} />
                      <span>{t.account === 'cash' ? 'Cash' : t.account === 'secured' ? 'Secured card' : 'Treasury'}</span>
                    </div>
                    <div className="cell">
                      {t.method === 'Card' ? <span className="tile" style={{ width: 22, height: 15, borderRadius: 2, fontSize: 7 }}>VISA</span> : <Icon name={t.method === 'Wire' ? 'Globe' : 'Bank'} size={14} style={{ color: 'var(--ink-4)' }} />}
                      <span>{t.method}</span>
                    </div>
                    <div className="cell">
                      <Icon name="DiamondsFour" size={14} style={{ color: 'var(--ink-4)' }} />
                      <div className="main">
                        <span className="title trunc">{t.card ? t.card.name : 'Primary Account'}</span>
                        {t.card && <span className="sub">{t.card.group} · {t.card.last4}</span>}
                      </div>
                    </div>
                    <div>
                      <span className={`chip sm ${t.status === 'Failed' ? 'red' : t.status === 'Succeeded' ? 'green' : 'gold'}`}>
                        <Icon name={t.status === 'Succeeded' ? 'CheckCircle' : t.status === 'Failed' ? 'Warning' : 'Clock'} size={12} />
                        {t.status}
                      </span>
                    </div>
                    <div className="right" style={{ justifyContent: 'flex-end' }}>
                      <Amount value={t.amount} signed />
                    </div>
                  </TRow>
                ))}
              </React.Fragment>
            ))}
          </Table>
        )}
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setParams({})}
        title={selected?.merchant ?? ''}
        icon="List"
        footer={
          <>
            <Btn sm onClick={() => toast('Receipt downloaded')} icon="DownloadSimple">Download receipt</Btn>
            <div className="spacer" />
            <Btn sm ghost onClick={() => toast('Dispute started — our team will follow up')} icon="Flag">Dispute</Btn>
          </>
        }
      >
        {selected && (
          <>
            <div className="row" style={{ gap: 12 }}>
              <MerchantTile name={selected.merchant} icon={selected.method === 'ACH' ? 'Bank' : undefined} />
              <div className="stack">
                <span style={{ fontSize: 22, fontWeight: 600 }} className="num">{money(Math.abs(selected.amount))}</span>
                <span className="muted" style={{ fontSize: 12.5 }}>{selected.type} · {selected.status}</span>
              </div>
            </div>
            <div className="divider" />
            <KV
              rows={[
                { label: 'Date', value: selected.date },
                { label: 'Settlement', value: selected.status === 'Scheduled' ? selected.scheduledFor ?? '—' : selected.date },
                { label: 'Account', value: selected.account === 'cash' ? 'Cash account · 2345' : selected.account === 'secured' ? 'Secured card' : 'Treasury account' },
                { label: 'Method', value: selected.method },
                { label: 'Virtual account', value: selected.card?.name ?? 'Primary Account' },
                { label: 'Card group', value: selected.card?.group ?? '—' },
                { label: 'Status', value: <Chip tone={selected.status === 'Succeeded' ? 'green' : selected.status === 'Failed' ? 'red' : 'gold'}>{selected.status}</Chip> },
                { label: 'Transaction ID', value: <span className="mono" style={{ fontSize: 12 }}>{`txn_${selected.id}_9f1c`}</span> },
              ]}
            />
            <div className="divider" />
            <div className="stack" style={{ gap: 6 }}>
              <span className="section-title">Activity</span>
              {[
                ['Initiated', selected.date],
                ['Authorized', selected.date],
                [selected.status === 'Scheduled' ? 'Scheduled' : 'Settled', selected.status === 'Scheduled' ? selected.scheduledFor ?? '—' : selected.date],
              ].map(([a, b]) => (
                <div className="row" key={a} style={{ fontSize: 13 }}>
                  <Icon name="CheckCircle" size={14} style={{ color: 'var(--ink-4)' }} />
                  <span>{a}</span>
                  <span className="muted" style={{ marginLeft: 'auto' }}>{b}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}