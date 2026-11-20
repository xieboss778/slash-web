import React, { useState } from 'react';
import { Icon, PageHead, Btn, Table, TRow, Th, AreaChart, Chip, Modal, KV, SearchBox, IconBtn, Empty, MerchantTile } from '../components/ui';
import { useApp, money } from '../store';
import { balanceSeries } from '../data/seed';

export default function CashAccountPage() {
  const { db, actions, toast } = useApp();
  const [range, setRange] = useState('3 Months');
  const [q, setQ] = useState('');
  const [newVa, setNewVa] = useState(false);
  const [vaName, setVaName] = useState('');
  const cash = db.accounts.find((a) => a.id === 'cash')!;
  const deposits = cash.balance;
  const collateral = 1_000_000;

  const scale = deposits / balanceSeries.cash[balanceSeries.cash.length - 1];
  const values = balanceSeries.cash.map((v) => Math.round(v * scale));
  const labels = Array.from({ length: values.length }, (_, i) => (i === 0 ? 'Sep 01' : i === 30 ? 'Oct 01' : i === 61 ? 'Nov 01' : ''));

  const copy = (v: string, what: string) => {
    navigator.clipboard?.writeText(v);
    toast(`${what} copied`);
  };

  const accounts = db.virtualAccounts.filter((v) => !q || v.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="panel" data-tour="cash-account">
      <PageHead icon="Bank" title="Cash account" sub={<span className="chip" style={{ height: 26, marginLeft: 6 }}><Icon name="List" size={13} />Overview</span>}>
        <IconBtn name="Info" label="About this account" onClick={() => toast('Cash account holds your operating balance')} />
        <Btn icon="FileText" onClick={() => window.location.assign('/platinum/documents')}>View Statements</Btn>
      </PageHead>
      <div className="body" style={{ overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(320px,1fr)', gap: 16, alignItems: 'start' }}>
          <div className="card">
            <div className="card-head">
              <h2>Balance activity</h2>
              <select className="select" style={{ marginLeft: 'auto', height: 32 }} value={range} onChange={(e) => setRange(e.target.value)}>
                {['3 Months', '6 Months', '12 Months'].map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="card-pad">
              <AreaChart height={230} labels={labels} zeroBaseline format={(n) => money(n, { cents: false })} series={[{ values, color: '#7ccf4f', fill: '#a8e35c', stroke: '#8dd54f' }]} />
            </div>
          </div>

          <div className="stack" style={{ gap: 16 }}>
            <div className="card">
              <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="kpi">
                  <span className="label">Total deposits</span>
                  <span className="value num">{money(deposits)}</span>
                </span>
                <div className="progress">
                  <i style={{ width: `${(collateral / deposits) * 100}%`, background: 'var(--gold-9)' }} />
                  <i style={{ width: `${100 - (collateral / deposits) * 100}%`, background: '#9ed36a' }} />
                </div>
                <div className="row" style={{ gap: 16, fontSize: 12.5 }}>
                  <div className="stack" style={{ gap: 2 }}>
                    <span className="row" style={{ gap: 5 }}><i style={{ width: 2, height: 14, background: 'var(--gold-9)', borderRadius: 1 }} />Collateral account</span>
                    <span className="num prominent">{money(collateral)}</span>
                  </div>
                  <div className="stack" style={{ gap: 2, borderLeft: '1px solid var(--line-3)', paddingLeft: 16 }}>
                    <span className="row" style={{ gap: 5 }}><i style={{ width: 2, height: 14, background: '#9ed36a', borderRadius: 1 }} />Checking account</span>
                    <span className="num prominent">{money(deposits - collateral)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-head" style={{ cursor: 'pointer' }} onClick={() => toast('ACH details: routing 123456789 · account 123456789012345')}>
                <span className="tile"><Icon name="Bank" size={15} /></span>
                <div className="stack" style={{ gap: 0 }}>
                  <h2>Account &amp; routing details</h2>
                  <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Bank details for incoming transfers</span>
                </div>
                <Icon name="CaretRight" size={16} style={{ marginLeft: 'auto', color: 'var(--ink-4)' }} />
              </div>
              <div className="card-pad" style={{ display: 'flex', gap: 24 }}>
                <div className="stack" style={{ gap: 2 }}>
                  <span className="mini-caps">Account number</span>
                  <span className="row" style={{ gap: 6 }}>
                    <span className="mono">{cash.number}</span>
                    <IconBtn name="Copy" label="Copy account number" onClick={() => copy(cash.number!, 'Account number')} />
                  </span>
                </div>
                <div className="stack" style={{ gap: 2 }}>
                  <span className="mini-caps">Routing number</span>
                  <span className="row" style={{ gap: 6 }}>
                    <span className="mono">{cash.routing}</span>
                    <IconBtn name="Copy" label="Copy routing number" onClick={() => copy(cash.routing!, 'Routing number')} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Virtual Accounts</h2>
            <span className="chip sm">{accounts.length}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <SearchBox value={q} onChange={setQ} placeholder="Search by virtual account name" />
              <Btn sm onClick={() => toast('Overview collapsed')} icon="ArrowsIn">Hide overview</Btn>
              <Btn sm primary icon="PlusCircle" onClick={() => setNewVa(true)}>New virtual account</Btn>
            </div>
          </div>
          <Table cols="minmax(220px,1.4fr) 100px 130px 160px 160px 60px" head={<><Th>Name</Th><Th>Take Rate</Th><Th>Balance</Th><Th>Routing Number</Th><Th>Account Number</Th><Th /></>}>
            {accounts.map((v) => (
              <TRow key={v.id} cols="minmax(220px,1.4fr) 100px 130px 160px 160px 60px">
                <div className="cell">
                  <Icon name="DiamondsFour" size={15} style={{ color: 'var(--ink-4)' }} />
                  <span className="title">{v.name}</span>
                </div>
                <span className="chip sm">{(v.takeRate || 0).toFixed(2)}%</span>
                <span className="num">{v.balance ? money(v.balance) : '-'}</span>
                <div className="cell">
                  <span className="mono" style={{ fontSize: 12 }}>{v.routing ?? '-'}</span>
                  {v.routing && <IconBtn name="Copy" label="Copy routing" onClick={() => copy(v.routing!, 'Routing number')} />}
                </div>
                <div className="cell">
                  <span className="mono" style={{ fontSize: 12 }}>{v.number ?? '-'}</span>
                  {v.number && <IconBtn name="Copy" label="Copy account" onClick={() => copy(v.number!, 'Account number')} />}
                </div>
                <IconBtn name="DotsThreeVertical" label="Account actions" onClick={() => toast('Virtual account actions')} />
              </TRow>
            ))}
          </Table>
        </div>
      </div>

      <Modal
        open={newVa}
        onClose={() => setNewVa(false)}
        title="New virtual account"
        icon="DiamondsFour"
        footer={<><Btn ghost onClick={() => setNewVa(false)}>Cancel</Btn><div className="spacer" /><Btn primary disabled={!vaName} onClick={() => { actions.addVirtualAccount(vaName); setVaName(''); setNewVa(false); }}>Open account</Btn></>}
      >
        <div className="field">
          <label>Virtual account name</label>
          <input className="input" value={vaName} onChange={(e) => setVaName(e.target.value)} placeholder="e.g. Marketing spend" autoFocus />
        </div>
        <span className="hint">Virtual accounts get their own routing and account numbers and share your cash balance.</span>
      </Modal>
    </div>
  );
}

export function SecuredCardPage() {
  const { db, actions, toast } = useApp();
  const secured = db.accounts.find((a) => a.id === 'secured')!;
  const [amount, setAmount] = useState('1000');
  return (
    <div className="panel">
      <PageHead icon="CreditCard" title="Secured card">
        <Btn icon="FileText" onClick={() => window.location.assign('/platinum/documents')}>Statements</Btn>
      </PageHead>
      <div className="body">
        <div className="card card-pad" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span className="kpi">
            <span className="label">Collateral balance</span>
            <span className="value num">{money(secured.balance)}</span>
          </span>
          <div className="divider" style={{ width: 1, height: 44, background: 'var(--line-3)' }} />
          <div className="stack" style={{ gap: 2 }}>
            <span className="mini-caps">Credit limit</span>
            <span className="num" style={{ fontSize: 15 }}>{money(secured.balance)}</span>
          </div>
          <div style={{ marginLeft: 'auto' }} className="row">
            <Btn primary icon="PlusCircle" onClick={() => { actions.deposit({ account: 'secured', amount: Number(amount) || 0 }); toast('Collateral deposit received'); }}>Add collateral</Btn>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h2>Deposits &amp; draws</h2></div>
          <Table cols="140px minmax(200px,1fr) 120px 120px" head={<><Th>Date</Th><Th>Description</Th><Th>Type</Th><Th>Amount</Th></>}>
            {[
              ['Sep 12, 2026', 'Initial collateral deposit', 'Deposit', 0],
              ['Oct 4, 2026', 'Statement cycle', 'Statement', 0],
            ].map(([d, desc, type, amt], i) => (
              <TRow key={i} cols="140px minmax(200px,1fr) 120px 120px">
                <span className="muted">{d as string}</span>
                <span>{desc as string}</span>
                <span className="chip sm">{type as string}</span>
                <span className="num">{money(amt as number)}</span>
              </TRow>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}