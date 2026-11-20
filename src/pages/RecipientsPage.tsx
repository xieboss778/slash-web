import React, { useState } from 'react';
import { Icon, PageHead, Btn, Table, TRow, Th, SearchBox, Modal, Chip, Empty, Toggle, Menu, IconBtn, MerchantTile, PageHead as Head } from '../components/ui';
import { useApp, money } from '../store';
import { SendMoneyModal } from './PaymentsPage';

export default function RecipientsPage() {
  const { db, actions, toast } = useApp();
  const [q, setQ] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ name: '', email: '' });
  const [sending, setSending] = useState(false);

  const rows = db.recipients.filter((r) => (showArchived ? true : !r.archived) && (!q || `${r.name} ${r.email}`.toLowerCase().includes(q.toLowerCase())));
  const cols = 'minmax(230px,1.4fr) 170px minmax(200px,1.2fr) 130px 110px 110px 90px';

  return (
    <div className="panel">
      <PageHead icon="UsersThree" title="Recipients">
        <Btn primary icon="PlusCircle" onClick={() => setCreating(true)}>New recipient</Btn>
      </PageHead>
      <div className="toolbar">
        <span className="chip" style={{ height: 30 }}>Recipients <strong style={{ marginLeft: 4 }}>{rows.length}</strong></span>
        <SearchBox value={q} onChange={setQ} placeholder="Search" />
        <div className="right">
          See archived recipients <Toggle on={showArchived} onChange={setShowArchived} />
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {rows.length === 0 ? (
          <Empty icon="UsersThree" title="No recipients" text="Add a vendor or recipient to send money." />
        ) : (
          <Table
            cols={cols}
            head={<><Th>Recipient</Th><Th>Tax documents</Th><Th>Email</Th><Th>Last payment date</Th><Th>Last payment</Th><Th>Total paid</Th><Th>Actions</Th></>}
          >
            {rows.map((r) => (
              <TRow key={r.id} cols={cols}>
                <div className="cell">
                  <MerchantTile name={r.name} icon="Buildings" />
                  <div className="main">
                    <span className="title">{r.name}</span>
                    {r.taxDoc === 'Pending request' && <span className="sub">Pending request</span>}
                  </div>
                </div>
                <div className="cell">
                  <Chip tone={r.taxDoc === 'Verified' ? 'green' : r.taxDoc === 'Pending request' ? 'gold' : undefined} sm>
                    {r.taxDoc === 'Verified' ? 'W-9 on file' : r.taxDoc}
                  </Chip>
                  {r.taxDoc !== 'Verified' && <button className="link" style={{ fontSize: 12 }} onClick={() => toast(`Upload request sent to ${r.email}`)}>Upload</button>}
                </div>
                <span className="trunc muted">{r.email}</span>
                <span className="muted">{r.lastPayment}</span>
                <span className="num muted">{r.lastPayment === '-' ? '-' : money(0)}</span>
                <span className="num">{money(r.totalPaid)}</span>
                <div className="right" style={{ gap: 4 }}>
                  <Menu
                    items={[
                      { label: 'Send money', icon: 'PaperPlaneTilt', onClick: () => setSending(true) },
                      { label: 'Request W-9', icon: 'EnvelopeSimple', onClick: () => toast(`W-9 request sent to ${r.email}`) },
                      { label: 'Copy email', icon: 'Copy', onClick: () => { navigator.clipboard?.writeText(r.email); toast('Email copied'); } },
                      { sep: true },
                      { label: 'Archive recipient', icon: 'Archive', danger: true, onClick: () => { actions.update((d) => { const x = d.recipients.find((y) => y.id === r.id); if (x) x.archived = true; }); toast('Recipient archived', 'warn'); } },
                    ]}
                  >
                    <IconBtn name="DotsThree" label="Recipient actions" />
                  </Menu>
                </div>
              </TRow>
            ))}
          </Table>
        )}
      </div>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New recipient"
        icon="UsersThree"
        footer={<><Btn ghost onClick={() => setCreating(false)}>Cancel</Btn><div className="spacer" /><Btn primary disabled={!draft.name || !draft.email} onClick={() => { actions.addRecipient(draft); setCreating(false); setDraft({ name: '', email: '' }); }}>Add recipient</Btn></>}
      >
        <div className="field">
          <label>Legal name</label>
          <input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Vendor legal name" autoFocus />
        </div>
        <div className="field">
          <label>Email</label>
          <input className="input" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="billing@vendor.com" />
        </div>
        <span className="hint">New recipients require admin approval before the first payment.</span>
      </Modal>
      <SendMoneyModal open={sending} onClose={() => setSending(false)} />
    </div>
  );
}