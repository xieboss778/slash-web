import React, { useState } from 'react';
import { Icon, PageHead, Btn, Table, TRow, Th, Chip, KV, Modal, StatusChip } from '../components/ui';
import { useApp, money } from '../store';

export default function ReferralsPage() {
  const { db, toast } = useApp();
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState('');
  const r = db.referrals;

  const copy = (v: string, what: string) => {
    navigator.clipboard?.writeText(v);
    toast(`${what} copied`);
  };

  return (
    <div className="panel">
      <PageHead icon="ReferToEarn" title="Refer to earn">
        <Btn primary icon="EnvelopeSimple" onClick={() => setInvite(true)}>Invite a company</Btn>
      </PageHead>
      <div className="body" style={{ overflow: 'auto' }}>
        <div className="card card-pad stack" style={{ gap: 12 }}>
          <span className="section-title">Your referral link</span>
          <div className="row" style={{ gap: 8 }}>
            <input className="input mono" readOnly value={r.link} style={{ flex: 1 }} />
            <Btn icon="Copy" onClick={() => copy(r.link, 'Referral link')}>Copy</Btn>
            <Btn icon="ShareNetwork" onClick={() => toast('Share sheet opened')}>Share</Btn>
          </div>
          <span className="hint">You earn $600 for every company that opens an account and spends $5,000 in the first 90 days.</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 16 }}>
          {[
            ['Invited', String(r.invited)],
            ['Qualified', String(r.qualified)],
            ['Earned', money(r.earned)],
            ['Pending', money(r.pending)],
          ].map(([label, value]) => (
            <div className="card card-pad" key={label}>
              <span className="kpi">
                <span className="label">{label}</span>
                <span className="value num">{value}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head"><h2>Referral history</h2></div>
          <Table cols="minmax(240px,1.5fr) 140px 140px 160px" head={<><Th>Company</Th><Th>Status</Th><Th>Reward</Th><Th>Date</Th></>}>
            {r.history.map((h: any) => (
              <TRow key={h.id} cols="minmax(240px,1.5fr) 140px 140px 160px">
                <span className="title">{h.company}</span>
                <div><Chip tone={h.status === 'Qualified' ? 'green' : h.status === 'Pending' ? 'gold' : undefined} sm>{h.status}</Chip></div>
                <span className="num">{h.reward ? money(h.reward) : '—'}</span>
                <span className="muted">{h.when}</span>
              </TRow>
            ))}
          </Table>
        </div>
      </div>

      <Modal open={invite} onClose={() => setInvite(false)} title="Invite a company" icon="EnvelopeSimple"
        footer={<><Btn ghost onClick={() => setInvite(false)}>Cancel</Btn><div className="spacer" /><Btn primary disabled={!email} onClick={() => { setInvite(false); setEmail(''); toast('Invitation sent'); }}>Send invite</Btn></>}>
        <div className="field">
          <label>Work email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="finance@company.com" autoFocus />
        </div>
        <KV rows={[{ label: 'Reward', value: '$600 per qualified company' }, { label: 'Qualification', value: '$5,000 spend in 90 days' }]} />
      </Modal>
    </div>
  );
}