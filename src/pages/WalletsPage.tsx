import React, { useState } from 'react';
import { Icon, PageHead, Btn, Table, TRow, Th, Modal, Chip, KV, Empty, IconBtn, MerchantTile } from '../components/ui';
import { useApp, money } from '../store';

export default function WalletsPage() {
  const { db, actions, toast } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [chain, setChain] = useState<'Ethereum' | 'Solana' | 'Base'>('Ethereum');
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState(db.cryptoAssets[0]?.id ?? '');
  const [to, setTo] = useState(db.cryptoAssets[1]?.id ?? '');

  const total = db.cryptoAssets.reduce((a, b) => a + b.amount * b.price, 0);

  return (
    <div className="panel">
      <PageHead icon="CurrencyBtc" title="Wallets">
        <Btn icon="ArrowsLeftRight" onClick={() => setMoveOpen(true)}>Move Crypto</Btn>
        <Btn primary icon="PlusCircle" onClick={() => setAddOpen(true)}>Add wallet</Btn>
      </PageHead>
      <div className="body" style={{ overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
          {db.wallets.map((w) => (
            <div className="card card-pad stack" key={w.id} style={{ gap: 8 }}>
              <div className="row">
                <span className="tile"><Icon name="CurrencyCircleDollar" size={15} /></span>
                <div className="stack" style={{ gap: 0 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 525 }}>{w.label}</span>
                  <span className="muted" style={{ fontSize: 12 }}>{w.chain} · {w.address}</span>
                </div>
                <Chip sm>{w.chain}</Chip>
              </div>
              <span className="num" style={{ fontSize: 22, fontWeight: 600 }}>{money(w.balance)}</span>
              <span className="muted" style={{ fontSize: 12 }}>Created {w.createdAt}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Assets</h2>
            <div className="row" style={{ marginLeft: 'auto', gap: 8 }}>
              <select className="select" style={{ height: 32 }}><option>All Wallets</option>{db.wallets.map((w) => <option key={w.id}>{w.label}</option>)}</select>
            </div>
          </div>
          <Table cols="minmax(160px,1fr) 160px 120px 120px 140px 120px" head={<><Th>Token</Th><Th>Wallet</Th><Th>Amount</Th><Th>Price</Th><Th>USD</Th><Th>P/L</Th></>}>
            {db.cryptoAssets.map((a) => (
              <TRow key={a.id} cols="minmax(160px,1fr) 160px 120px 120px 140px 120px">
                <div className="cell"><span className="tile" style={{ borderRadius: '50%', background: 'var(--gold-3)', borderColor: 'var(--gold-4)', fontSize: 9, fontWeight: 700 }}>{a.token}</span><span className="title">{a.token}</span></div>
                <span className="muted">{a.wallet}</span>
                <span className="num">{a.amount.toLocaleString('en-US', { maximumFractionDigits: 4 })}</span>
                <span className="num muted">{money(a.price)}</span>
                <span className="num">{money(a.amount * a.price)}</span>
                <span className="num" style={{ color: a.pl >= 0 ? 'var(--green-11)' : 'var(--red-11)' }}>{a.pl ? money(a.pl) : '—'}</span>
              </TRow>
            ))}
          </Table>
          <div className="card-pad row" style={{ borderTop: '1px solid var(--line-3)', fontSize: 13 }}>
            <span className="muted">Total crypto</span>
            <span className="num" style={{ marginLeft: 'auto', fontWeight: 600 }}>{money(total)}</span>
          </div>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add wallet" icon="CurrencyBtc"
        footer={<><Btn ghost onClick={() => setAddOpen(false)}>Cancel</Btn><div className="spacer" /><Btn primary disabled={!label} onClick={() => { actions.addWallet(label, chain); setLabel(''); setAddOpen(false); }}>Create wallet</Btn></>}>
        <div className="field">
          <label>Wallet label</label>
          <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Treasury cold wallet" autoFocus />
        </div>
        <div className="field">
          <label>Chain</label>
          <select className="input" value={chain} onChange={(e) => setChain(e.target.value as any)}>
            {['Ethereum', 'Solana', 'Base'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <span className="hint">Wallets are created in a sandbox network for this demo environment.</span>
      </Modal>

      <Modal open={moveOpen} onClose={() => setMoveOpen(false)} title="Move crypto" icon="ArrowsLeftRight"
        footer={<><Btn ghost onClick={() => setMoveOpen(false)}>Cancel</Btn><div className="spacer" /><Btn primary disabled={!Number(amount)} onClick={() => { actions.convertCrypto(from, to, Number(amount)); setMoveOpen(false); setAmount(''); }}>Convert</Btn></>}>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>From asset</label>
            <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
              {db.cryptoAssets.filter((a) => a.amount > 0).map((a) => <option key={a.id} value={a.id}>{a.token} · {a.wallet}</option>)}
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>To asset</label>
            <select className="input" value={to} onChange={(e) => setTo(e.target.value)}>
              {db.cryptoAssets.map((a) => <option key={a.id} value={a.id}>{a.token} · {a.wallet}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Amount</label>
          <input className="input" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" autoFocus />
        </div>
        <KV rows={[{ label: 'Network fee', value: 'Est. $0.42' }, { label: 'Settlement', value: 'Instant (sandbox)' }]} />
      </Modal>
    </div>
  );
}