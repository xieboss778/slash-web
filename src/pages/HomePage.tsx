import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, PageHead, Amount, AreaChart, Btn, Chip, MerchantTile, Th, Table, TRow, DateRow } from '../components/ui';
import { AccountSwitcherBar } from '../components/shell';
import { useApp, money } from '../store';
import { balanceSeries, capital } from '../data/seed';

const monthLabels = (n: number) => {
  const out: Record<number, string> = { 0: 'Sep 01', 30: 'Oct 01', 61: 'Nov 01' };
  return Array.from({ length: n }, (_, i) => out[i] ?? '');
};

export default function HomePage() {
  const { db } = useApp();
  const nav = useNavigate();
  const [view, setView] = useState<'cash' | 'spend'>('cash');
  const [range, setRange] = useState('3 Months');

  const cashScale = 5775801.15 / balanceSeries.cash[balanceSeries.cash.length - 1];
  const cashValues = useMemo(() => balanceSeries.cash.map((v) => Math.round(v * cashScale)), [cashScale]);
  const spendValues = useMemo(() => balanceSeries.spend.map((v) => Math.round(v * 12)), []);

  const values = view === 'cash' ? cashValues : spendValues;
  const headline = view === 'cash' ? cashValues[cashValues.length - 1] : spendValues.reduce((a, b) => a + b, 0);
  const labels = monthLabels(values.length);

  const scheduled = db.transactions.filter((t) => t.status === 'Scheduled');
  const recent = db.transactions.filter((t) => t.status !== 'Scheduled').slice(0, 11);
  const txGroups = useMemo(() => {
    const groups: { label: string; rows: typeof recent }[] = [];
    const all = [...scheduled, ...recent];
    all.forEach((t) => {
      const label = t.dateLabel;
      const last = groups[groups.length - 1];
      if (last && last.label === label) last.rows.push(t);
      else groups.push({ label, rows: [t] });
    });
    return groups;
  }, [scheduled, recent]);

  const totalCards = db.cards.filter((c) => c.status !== 'Closed').length;

  return (
    <div className="panel" data-tour="home">
      <PageHead icon="House" title={`Good morning, ${'Victor'}`}>
        <AccountSwitcherBar />
      </PageHead>
      <div className="body" style={{ overflow: 'auto' }}>
        <div className="home-grid">
          {/* Balance card */}
          <div className="card" data-tour="balance-card">
            <div className="card-pad" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Nov 21, 2026</span>
              <div className="row" style={{ marginLeft: 'auto', gap: 2, background: 'var(--surface-3)', padding: 2, borderRadius: 8 }}>
                {(['cash', 'spend'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="btn sm"
                    style={{
                      border: v === view ? '1px solid var(--line-2)' : '1px solid transparent',
                      background: v === view ? 'var(--surface)' : 'transparent',
                      boxShadow: v === view ? 'var(--shadow-1)' : 'none',
                    }}
                  >
                    {v === 'cash' ? 'Cash Balance' : 'Card Spend'}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-pad" style={{ paddingTop: 0, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--ink)' }} className="num">
                {money(headline)}
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <select className="select" value={range} onChange={(e) => setRange(e.target.value)} style={{ height: 34 }}>
                  {['3 Months', '6 Months', '12 Months', 'YTD'].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card-pad" style={{ paddingTop: 0 }}>
              <AreaChart
                height={236}
                labels={labels}
                zeroBaseline
                format={(n) => money(n, { cents: false })}
                series={[
                  view === 'cash'
                    ? { values, color: '#7ccf4f', fill: '#a8e35c', stroke: '#8dd54f' }
                    : { values, color: '#c9a24a', fill: '#e6d27a', stroke: '#c9a24a' },
                ]}
              />
            </div>
            <div className="card-pad" style={{ borderTop: '1px solid var(--line-3)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <button className="btn ghost sm" style={{ paddingLeft: 0 }} onClick={() => nav('/platinum/account/capital')}>
                <Icon name="CaretRight" size={14} />
                Available to spend
                <Icon name="Info" size={14} />
              </button>
              <span className="num" style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 600 }}>{money(capital.available)}</span>
            </div>
            <div style={{ padding: '0 18px 16px', fontSize: 12.5, color: 'var(--ink-4)' }}>
              Credit Balance / Maximum Credit
              <span className="num" style={{ float: 'right', color: 'var(--ink-3)' }}>
                {money(capital.creditBalance)} / {money(capital.limit)}
              </span>
            </div>
          </div>

          {/* Transactions */}
          <div className="card" data-tour="home-transactions">
            <div className="card-head">
              <Icon name="List" size={16} style={{ color: 'var(--ink-3)' }} />
              <h2>Transactions</h2>
              <button className="btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => nav('/platinum/transactions')}>
                See all <Icon name="CaretRight" size={14} />
              </button>
            </div>
            <div style={{ padding: '0 16px 12px', maxHeight: 560, overflow: 'auto' }}>
              {txGroups.map((g) => (
                <div key={g.label}>
                  <div style={{ padding: '10px 0 6px' }}>
                    <span className="date-chip">{g.label}</span>
                  </div>
                  {g.rows.map((t) => (
                    <div className="tx-row" key={t.id} onClick={() => nav(`/platinum/transactions?tx=${t.id}`)}>
                      <MerchantTile name={t.merchant} icon={t.method === 'Wire' ? 'Globe' : t.method === 'ACH' ? 'Bank' : undefined} />
                      <div style={{ minWidth: 0 }}>
                        <div className="cell" style={{ gap: 4 }}>
                          <span className="title trunc">{t.merchant}</span>
                          {t.status === 'Failed' && <Icon name="Warning" size={14} style={{ color: 'var(--red-11)', flex: '0 0 auto' }} />}
                        </div>
                        <div className="sub">{t.type}</div>
                      </div>
                      <div className="amt">
                        <Amount value={t.amount} signed />
                        <span className="meta-line">
                          {t.card ? `${t.card.group} · ${t.card.last4}` : t.method}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="card" data-tour="home-cards">
          <div className="card-head">
            <Icon name="Cards" size={16} style={{ color: 'var(--ink-3)' }} />
            <h2>Cards</h2>
            <span className="chip sm">{totalCards} / 500</span>
            <div className="row" style={{ marginLeft: 'auto', gap: 8 }}>
              <Btn sm icon="PlusCircle" onClick={() => nav('/platinum/cards?new=1')}>
                Create virtual card
              </Btn>
              <Btn sm ghost onClick={() => nav('/platinum/cards')}>
                See all cards <Icon name="CaretRight" size={14} />
              </Btn>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <Table
              cols="minmax(230px,1.6fr) 132px minmax(96px,1fr) 130px 96px 74px 82px 108px"
              head={
                <>
                  <Th>Card name</Th>
                  <Th>Virtual Account</Th>
                  <Th>Group</Th>
                  <Th>Cardholder</Th>
                  <Th>Spend Limits</Th>
                  <Th>Status</Th>
                  <Th>Created At</Th>
                  <Th>Spend 30 Days</Th>
                </>
              }
            >
              {db.cards
                .filter((c) => c.status !== 'Closed')
                .slice(0, 12)
                .map((c) => (
                  <TRow key={c.id} cols="minmax(230px,1.6fr) 132px minmax(96px,1fr) 130px 96px 74px 82px 108px" onClick={() => nav(`/platinum/cards?card=${c.id}`)}>
                    <div className="cell">
                      <span className="tile" style={{ width: 26, height: 18, borderRadius: 3, fontSize: 8, fontWeight: 700, letterSpacing: '-0.02em' }}>
                        VISA
                      </span>
                      <div className="main">
                        <span className="title">
                          {c.name} <span className="muted" style={{ fontSize: 12 }}>· {c.last4}</span>
                        </span>
                      </div>
                    </div>
                    <div className="cell">
                      <Icon name="DiamondsFour" size={14} style={{ color: 'var(--ink-4)' }} />
                      <span className="trunc">{c.virtualAccount}</span>
                    </div>
                    <div className="cell">
                      <Icon name="FolderSimple" size={14} style={{ color: 'var(--ink-4)' }} />
                      <span className="trunc">{c.group}</span>
                      <span className="chip count">{c.groupCount}</span>
                    </div>
                    <div className="cell">
                      {c.cardholder === 'No cardholder' ? (
                        <span className="muted">No cardholder</span>
                      ) : (
                        <>
                          <Icon name="UserCircle" size={15} style={{ color: 'var(--ink-4)' }} />
                          <span className="trunc">{c.cardholder}</span>
                        </>
                      )}
                    </div>
                    <div className="cell">
                      <span className="trunc">{c.limit}</span>
                      <Icon name="PlusCircle" size={13} style={{ color: 'var(--ink-4)' }} />
                      <Icon name="MapPin" size={13} style={{ color: 'var(--ink-4)' }} />
                    </div>
                    <div>
                      <span className="chip green sm">{c.status}</span>
                    </div>
                    <span className="muted">{c.created}</span>
                    <span className="num">{money(c.spend30)}</span>
                  </TRow>
                ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}