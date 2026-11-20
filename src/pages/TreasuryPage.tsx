import React, { useState } from 'react';
import { Icon, PageHead, Btn, Table, TRow, Th, AreaChart, Modal, KV, Chip, SearchBox, IconBtn } from '../components/ui';
import { useApp, money } from '../store';
import { balanceSeries, capital } from '../data/seed';

export default function TreasuryPage() {
  const { db, actions, toast } = useApp();
  const treasury = db.accounts.find((a) => a.id === 'treasury')!;
  const [transferOpen, setTransferOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<'in' | 'out'>('in');

  const scale = treasury.balance / balanceSeries.cash[balanceSeries.cash.length - 1];
  const values = balanceSeries.cash.map((v) => Math.round(v * scale * 1.4));
  const labels = Array.from({ length: values.length }, (_, i) => (i === 0 ? 'Sep 01' : i === 30 ? 'Oct 01' : i === 61 ? 'Nov 01' : ''));

  const positions = [
    { id: 'tp1', name: 'Treasury bills — 3 month', type: 'T-Bill', yield: '4.82%', value: 402000, maturity: 'Feb 12, 2027' },
    { id: 'tp2', name: 'Treasury bills — 6 month', type: 'T-Bill', yield: '4.61%', value: 255598.08, maturity: 'May 6, 2027' },
    { id: 'tp3', name: 'Government money market', type: 'Money market', yield: '4.35%', value: 180000, maturity: 'Daily liquidity' },
    { id: 'tp4', name: 'Cash sweep', type: 'Sweep', yield: '4.10%', value: 110000, maturity: 'Daily liquidity' },
  ];

  return (
    <div className="panel" data-tour="treasury">
      <PageHead icon="TreasureChest" title="Treasury">
        <Btn icon="FileText" onClick={() => toast('Treasury statements opened')}>Statements</Btn>
        <Btn primary icon="ArrowsLeftRight" onClick={() => setTransferOpen(true)}>Transfer funds</Btn>
      </PageHead>
      <div className="body" style={{ overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(320px,1fr)', gap: 16, alignItems: 'start' }}>
          <div className="card">
            <div className="card-pad" style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <span className="kpi">
                <span className="label">Treasury balance</span>
                <span className="value num">{money(treasury.balance)}</span>
              </span>
              <span className="chip green" style={{ marginLeft: 'auto' }}><Icon name="TrendUp" size={13} />4.62% blended yield</span>
            </div>
            <div className="card-pad" style={{ paddingTop: 0 }}>
              <AreaChart height={220} labels={labels} zeroBaseline format={(n) => money(n, { cents: false })} series={[{ values, color: '#7ccf4f', fill: '#a8e35c', stroke: '#8dd54f' }]} />
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h2>Allocation</h2></div>
            <div className="card-pad stack" style={{ gap: 12 }}>
              {positions.map((p) => (
                <div key={p.id} className="stack" style={{ gap: 4 }}>
                  <div className="row" style={{ fontSize: 13 }}>
                    <span>{p.name}</span>
                    <span className="num" style={{ marginLeft: 'auto' }}>{money(p.value)}</span>
                  </div>
                  <div className="progress"><i style={{ width: `${(p.value / treasury.balance) * 100}%`, background: 'var(--gold-9)' }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h2>Positions</h2><div className="row" style={{ marginLeft: 'auto', gap: 8 }}><SearchBox value="" onChange={() => {}} placeholder="Search positions" /></div></div>
          <Table cols="minmax(240px,1.5fr) 130px 100px 140px 150px 90px" head={<><Th>Position</Th><Th>Type</Th><Th>Yield</Th><Th>Value</Th><Th>Maturity</Th><Th /></>}>
            {positions.map((p) => (
              <TRow key={p.id} cols="minmax(240px,1.5fr) 130px 100px 140px 150px 90px">
                <div className="cell"><Icon name="TreasureChest" size={15} style={{ color: 'var(--ink-4)' }} /><span className="title">{p.name}</span></div>
                <span className="chip sm">{p.type}</span>
                <span className="num">{p.yield}</span>
                <span className="num">{money(p.value)}</span>
                <span className="muted">{p.maturity}</span>
                <IconBtn name="DotsThreeVertical" label="Position actions" onClick={() => toast('Position actions')} />
              </TRow>
            ))}
          </Table>
        </div>
      </div>

      <Modal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title="Transfer treasury funds"
        icon="ArrowsLeftRight"
        footer={
          <>
            <Btn ghost onClick={() => setTransferOpen(false)}>Cancel</Btn>
            <div className="spacer" />
            <Btn primary disabled={!Number(amount)} onClick={() => {
              const amt = Number(amount);
              actions.transfer({ from: direction === 'in' ? 'cash' : 'treasury', to: direction === 'in' ? 'treasury' : 'cash', amount: amt, memo: 'Treasury transfer' });
              setTransferOpen(false);
              setAmount('');
            }}>Confirm transfer</Btn>
          </>
        }
      >
        <div className="row" style={{ gap: 2, background: 'var(--surface-3)', padding: 2, borderRadius: 8, alignSelf: 'flex-start' }}>
          {(['in', 'out'] as const).map((d) => (
            <button key={d} className="btn sm" onClick={() => setDirection(d)}
              style={{ border: d === direction ? '1px solid var(--line-2)' : '1px solid transparent', background: d === direction ? 'var(--surface)' : 'transparent', boxShadow: d === direction ? 'var(--shadow-1)' : 'none' }}>
              {d === 'in' ? 'Into treasury' : 'Out of treasury'}
            </button>
          ))}
        </div>
        <div className="field">
          <label>Amount</label>
          <input className="input" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" autoFocus />
        </div>
        <KV rows={[
          { label: 'From', value: direction === 'in' ? 'Cash account' : 'Treasury account' },
          { label: 'To', value: direction === 'in' ? 'Treasury account' : 'Cash account' },
          { label: 'Available', value: money(direction === 'in' ? db.accounts.find((a) => a.id === 'cash')!.balance : treasury.balance) },
        ]} />
      </Modal>
    </div>
  );
}

export function CapitalPage() {
  const { db, actions, toast } = useApp();
  const [drawOpen, setDrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const cap = capital;
  const usedPct = (cap.used / cap.limit) * 100;

  return (
    <div className="panel" data-tour="capital">
      <PageHead icon="Money" title="Capital">
        <Btn icon="FileText" onClick={() => toast('Capital statements opened')}>Statements</Btn>
        <Btn primary icon="PlusCircle" onClick={() => setDrawOpen(true)}>Draw funds</Btn>
      </PageHead>
      <div className="body" style={{ overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16 }}>
          <div className="card card-pad">
            <span className="kpi">
              <span className="label">Available credit</span>
              <span className="value num">{money(cap.available)}</span>
              <span style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>of {money(cap.limit)} approved</span>
            </span>
          </div>
          <div className="card card-pad">
            <span className="kpi">
              <span className="label">Outstanding balance</span>
              <span className="value num">{money(cap.used)}</span>
              <span style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>APR {cap.apr} · next due {cap.nextDue}</span>
            </span>
          </div>
          <div className="card card-pad">
            <span className="kpi">
              <span className="label">Credit utilization</span>
              <span className="value num">{usedPct.toFixed(1)}%</span>
              <div className="progress" style={{ marginTop: 6 }}><i style={{ width: `${usedPct}%`, background: 'var(--gold-9)' }} /></div>
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h2>Capital activity</h2></div>
          <Table cols="140px minmax(220px,1.5fr) 140px 140px" head={<><Th>Date</Th><Th>Description</Th><Th>Type</Th><Th>Amount</Th></>}>
            {[
              ['Nov 1, 2026', 'Monthly payment — principal + interest', 'Payment', -25000],
              ['Oct 12, 2026', 'Draw to cash account', 'Draw', 100000],
              ['Oct 1, 2026', 'Monthly payment — principal + interest', 'Payment', -25000],
              ['Sep 18, 2026', 'Draw to cash account', 'Draw', 230000],
            ].map(([d, desc, type, amt], i) => (
              <TRow key={i} cols="140px minmax(220px,1.5fr) 140px 140px">
                <span className="muted">{d as string}</span>
                <span>{desc as string}</span>
                <span className={`chip sm ${(amt as number) > 0 ? 'green' : ''}`}>{type as string}</span>
                <span className="num">{money(amt as number)}</span>
              </TRow>
            ))}
          </Table>
        </div>
      </div>

      <Modal
        open={drawOpen}
        onClose={() => setDrawOpen(false)}
        title="Draw capital"
        icon="Money"
        footer={<><Btn ghost onClick={() => setDrawOpen(false)}>Cancel</Btn><div className="spacer" /><Btn primary disabled={!Number(amount)} onClick={() => { actions.deposit({ account: 'cash', amount: Number(amount) }); toast('Capital drawn to cash account'); setDrawOpen(false); setAmount(''); }}>Draw to cash</Btn></>}
      >
        <div className="field">
          <label>Amount</label>
          <input className="input" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" autoFocus />
          <span className="hint">Available credit {money(cap.available)} · APR {cap.apr}</span>
        </div>
        <KV rows={[{ label: 'Destination', value: 'Cash account · 2345' }, { label: 'Repayment', value: 'Monthly, auto-debit' }]} />
      </Modal>
    </div>
  );
}