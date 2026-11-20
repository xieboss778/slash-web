import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, PageHead, Btn, Icon as Ic, KV, Chip, MerchantTile } from '../components/ui';
import { useApp, money } from '../store';

const modes = [
  { key: 'transfer', label: 'Between accounts', icon: 'ArrowsLeftRight' },
  { key: 'deposit', label: 'Deposit', icon: 'ArrowDown' },
  { key: 'withdraw', label: 'Withdraw', icon: 'ArrowUp' },
  { key: 'send', label: 'Send money', icon: 'PaperPlaneTilt' },
] as const;

export default function MoveMoneyPage() {
  const { db, actions, toast } = useApp();
  const nav = useNavigate();
  const [mode, setMode] = useState<(typeof modes)[number]['key']>('transfer');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [from, setFrom] = useState('cash');
  const [to, setTo] = useState('treasury');
  const [recipient, setRecipient] = useState('');
  const [done, setDone] = useState(false);

  const numeric = Number(amount.replace(/[^0-9.]/g, '')) || 0;
  const fromAccount = db.accounts.find((a) => a.id === from)!;

  const submit = () => {
    if (!numeric) return;
    if (mode === 'transfer') actions.transfer({ from, to, amount: numeric, memo });
    else if (mode === 'deposit') actions.deposit({ account: to, amount: numeric });
    else if (mode === 'withdraw') actions.transfer({ from: to, to: 'cash', amount: numeric, memo: memo || 'Withdrawal' });
    else actions.sendMoney({ vendor: recipient || 'New recipient', amount: numeric, method: 'ACH', account: 'Cash account', memo, schedule: 'Immediate' });
    setDone(true);
  };

  if (done) {
    return (
      <div className="panel">
        <PageHead icon="ArrowsDownUp" title="Move Money" />
        <div className="body" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="card card-pad stack" style={{ gap: 12, alignItems: 'center', maxWidth: 420, textAlign: 'center', marginTop: 60 }}>
            <span className="avatar green" style={{ width: 48, height: 48 }}><Icon name="Check" size={24} /></span>
            <span style={{ fontSize: 18, fontWeight: 600 }}>{money(numeric)} {mode === 'send' ? 'sent' : 'moved'}</span>
            <span className="muted" style={{ fontSize: 13 }}>
              {mode === 'transfer' ? 'Transfer initiated between your accounts.' : mode === 'deposit' ? 'Deposit initiated — funds appear within 1 business day.' : mode === 'withdraw' ? 'Withdrawal initiated to your external account.' : 'Payment submitted for approval.'}
            </span>
            <div className="row" style={{ gap: 8, marginTop: 8 }}>
              <Btn onClick={() => { setDone(false); setAmount(''); setMemo(''); }}>Make another</Btn>
              <Btn primary onClick={() => nav('/platinum/transactions')}>View transactions</Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <PageHead icon="ArrowsDownUp" title="Move Money" />
      <div className="body" style={{ overflow: 'auto' }}>
        <div className="row" style={{ gap: 2, background: 'var(--surface-3)', padding: 3, borderRadius: 10, alignSelf: 'flex-start' }}>
          {modes.map((m) => (
            <button key={m.key} className="btn" onClick={() => setMode(m.key)}
              style={{ border: m.key === mode ? '1px solid var(--line-2)' : '1px solid transparent', background: m.key === mode ? 'var(--surface)' : 'transparent', boxShadow: m.key === mode ? 'var(--shadow-1)' : 'none', height: 34 }}>
              <Icon name={m.icon} size={15} />
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(300px,1fr)', gap: 16, alignItems: 'start' }}>
          <div className="card card-pad stack" style={{ gap: 14 }}>
            {mode === 'send' && (
              <div className="field">
                <label>Recipient</label>
                <input className="input" list="mm-recipients" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Search recipients" />
                <datalist id="mm-recipients">{db.recipients.map((r) => <option key={r.id} value={r.name} />)}</datalist>
              </div>
            )}
            {mode !== 'deposit' && (
              <div className="field">
                <label>{mode === 'transfer' ? 'From account' : 'From'}</label>
                <select className="input" value={mode === 'transfer' ? from : to} onChange={(e) => (mode === 'transfer' ? setFrom(e.target.value) : setTo(e.target.value))}>
                  {db.accounts.map((a) => <option key={a.id} value={a.id}>{a.name} · {money(a.balance)}</option>)}
                </select>
              </div>
            )}
            {(mode === 'transfer' || mode === 'deposit') && (
              <div className="field">
                <label>{mode === 'transfer' ? 'To account' : 'Deposit into'}</label>
                <select className="input" value={to} onChange={(e) => setTo(e.target.value)}>
                  {db.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            )}
            <div className="field">
              <label>Amount</label>
              <input className="input num" style={{ fontSize: 22, height: 52, fontWeight: 600 }} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="$0.00" autoFocus />
              <div className="row" style={{ gap: 6, marginTop: 4 }}>
                {[1000, 5000, 25000, 100000].map((v) => (
                  <button className="pill-btn" key={v} onClick={() => setAmount(String(v))}>{money(v, { cents: false })}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Memo</label>
              <input className="input" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Optional note" />
            </div>
            <div className="row"><Btn primary disabled={!numeric} onClick={submit} icon="Check">Continue</Btn><Btn ghost onClick={() => nav('/platinum')}>Cancel</Btn></div>
          </div>

          <div className="stack" style={{ gap: 16 }}>
            <div className="card card-pad stack" style={{ gap: 10 }}>
              <span className="section-title">Summary</span>
              <KV
                rows={[
                  { label: 'Mode', value: modes.find((m) => m.key === mode)!.label },
                  { label: 'Amount', value: <span className="num">{money(numeric)}</span> },
                  ...(mode === 'send'
                    ? [{ label: 'Recipient', value: recipient || '—' }, { label: 'Method', value: 'ACH' }]
                    : [{ label: 'From', value: mode === 'deposit' ? 'External bank' : db.accounts.find((a) => a.id === from)?.name ?? '—' }, { label: 'To', value: mode === 'withdraw' ? 'External bank' : db.accounts.find((a) => a.id === to)?.name ?? '—' }]),
                  { label: 'Available', value: mode === 'deposit' ? '—' : money(fromAccount.balance) },
                ]}
              />
            </div>
            <div className="card">
              <div className="card-head"><h2>Recent activity</h2></div>
              <div style={{ padding: '4px 14px 12px' }}>
                {db.transactions.slice(0, 5).map((t) => (
                  <div className="tx-row" key={t.id}>
                    <MerchantTile name={t.merchant} icon={t.method === 'ACH' ? 'Bank' : undefined} />
                    <div className="main">
                      <span className="title trunc">{t.merchant}</span>
                      <span className="sub">{t.type}</span>
                    </div>
                    <div className="amt">
                      <span className={`num${t.amount > 0 ? ' pos' : ''}`} style={{ color: t.amount > 0 ? 'var(--green-11)' : undefined }}>{money(t.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}