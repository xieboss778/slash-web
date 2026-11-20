import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon, PageHead, Btn, Chip, Table, TRow, Th, Tabs, SearchBox, Menu, IconBtn, Drawer, Modal, KV, Empty, Toggle, MerchantTile } from '../components/ui';
import { useApp, money, uid } from '../store';
import type { Card } from '../data/types';

const visa = (
  <span className="tile" style={{ width: 28, height: 19, borderRadius: 3, fontSize: 8, fontWeight: 700 }}>
    VISA
  </span>
);

export default function CardsPage() {
  const { db, actions, update, toast } = useApp();
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState('cards');
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('All');
  const [status, setStatus] = useState('All');
  const [includeClosed, setIncludeClosed] = useState(false);
  const [creating, setCreating] = useState(params.get('new') === '1');
  const [draft, setDraft] = useState({ name: '', cardholder: '', group: db.cardGroups[0]?.name ?? 'Team Expenses', virtualAccount: 'Primary account', limit: 'No limit', last4: String(Math.floor(1000 + Math.random() * 8999)) });
  const selectedId = params.get('card');
  const selected = db.cards.find((c) => c.id === selectedId) ?? null;
  const [editingLimit, setEditingLimit] = useState(false);
  const [limitDraft, setLimitDraft] = useState(selected?.limit ?? 'No limit');

  const visible = useMemo(
    () =>
      db.cards.filter((c) => {
        if (!includeClosed && c.status === 'Closed') return false;
        if (q && !`${c.name} ${c.last4} ${c.cardholder}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (group !== 'All' && c.group !== group) return false;
        if (status !== 'All' && c.status !== status) return false;
        return true;
      }),
    [db.cards, q, group, status, includeClosed],
  );

  const cols = 'minmax(170px,1.3fr) 128px minmax(100px,1fr) 118px 98px 74px 80px 112px 64px';

  const openCard = (id: string) => setParams({ card: id });

  return (
    <div className="panel" data-tour="cards">
      <PageHead icon="Cards" title="Cards">
        <Menu
          items={[
            { label: 'Create', onClick: () => setCreating(true), icon: 'PlusCircle' },
            { label: 'Create virtual card', icon: 'CreditCard', onClick: () => setCreating(true) },
            { label: 'Request physical card', icon: 'EnvelopeSimple', onClick: () => { setCreating(true); toast('Physical cards ship in 5–7 business days'); } },
            { label: 'Import cards (CSV)', icon: 'UploadSimple', onClick: () => toast('Card import queued') },
            { sep: true },
            { label: 'Create card group', icon: 'FolderSimplePlus', onClick: () => setTab('groups') },
          ]}
        >
          <Btn primary icon="Plus" iconRight="CaretDown">Add</Btn>
        </Menu>
        <Menu
          items={[
            { label: 'Card limits', icon: 'Sliders', onClick: () => window.location.assign('/platinum/settings/policies') },
            { label: 'Approval policies', icon: 'ShieldCheck', onClick: () => window.location.assign('/platinum/settings/policies') },
            { label: 'Merchant controls', icon: 'Storefront', onClick: () => window.location.assign('/platinum/settings/policies') },
          ]}
        >
          <Btn icon="Sliders" iconRight="CaretDown">Controls</Btn>
        </Menu>
      </PageHead>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'cards', label: 'Cards', icon: 'Cards' },
          { key: 'groups', label: 'Groups', icon: 'FolderSimple' },
          { key: 'requests', label: 'Card Requests', count: db.cardRequests.length, icon: 'EnvelopeSimple' },
        ]}
      />

      {tab === 'cards' && (
        <>
          <div className="stat-strip">
            <span className="chip sm gold">{visible.length} / 500</span> Total cards
            <span className="dot">·</span>
            <strong className="num">{visible.length}</strong> Cards
            <span className="dot">·</span>
            <strong className="num">0</strong> Physical cards
          </div>
          <div className="toolbar">
            <SearchBox value={q} onChange={setQ} placeholder="Search" />
            <div className="select">
              <Icon name="CheckCircle" size={14} />
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {['All', 'Active', 'Paused', 'Closed'].map((o) => (
                  <option key={o} value={o}>{o === 'All' ? 'Status is' : o}</option>
                ))}
              </select>
              <Icon name="CaretDown" size={14} />
            </div>
            <div className="select">
              <Icon name="CreditCard" size={14} />
              <span>Card Type</span>
              <Icon name="CaretDown" size={14} />
            </div>
            <div className="select">
              <Icon name="FolderSimple" size={14} />
              <select value={group} onChange={(e) => setGroup(e.target.value)}>
                {['All', ...db.cardGroups.map((g) => g.name)].map((o) => (
                  <option key={o} value={o}>{o === 'All' ? 'Card Group is' : o}</option>
                ))}
              </select>
              <Icon name="CaretDown" size={14} />
            </div>
            <div className="select">
              <Icon name="DiamondsFour" size={14} />
              <span>Virtual Accounts is</span>
              <Icon name="CaretDown" size={14} />
            </div>
            <div className="right">
              Include Closed Cards
              <Toggle on={includeClosed} onChange={setIncludeClosed} />
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }} data-tour="cards-table">
            {visible.length === 0 ? (
              <Empty icon="CreditCard" title="No cards match these filters" />
            ) : (
              <Table
                cols={cols}
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
                    <Th>Actions</Th>
                  </>
                }
              >
                {visible.map((c) => (
                  <TRow key={c.id} cols={cols} onClick={() => openCard(c.id)}>
                    <div className="cell">
                      {visa}
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
                      {c.cardholder === 'No cardholder' ? <span className="muted">No cardholder</span> : <><Icon name="UserCircle" size={15} style={{ color: 'var(--ink-4)' }} /><span className="trunc">{c.cardholder}</span></>}
                    </div>
                    <div className="cell">
                      <span className="trunc">{c.limit}</span>
                      <Icon name="PlusCircle" size={13} style={{ color: 'var(--ink-4)' }} />
                      <Icon name="MapPin" size={13} style={{ color: 'var(--ink-4)' }} />
                    </div>
                    <div>
                      <span className={`chip sm ${c.status === 'Active' ? 'green' : c.status === 'Paused' ? 'gold' : 'red'}`}>{c.status}</span>
                    </div>
                    <span className="muted">{c.created}</span>
                    <span className="num">{money(c.spend30)}</span>
                    <div className="right" onClick={(e) => e.stopPropagation()}>
                      <Menu
                        items={[
                          { label: 'Card details', icon: 'MagnifyingGlass', onClick: () => openCard(c.id) },
                          { sep: true },
                          { label: c.status === 'Paused' ? 'Resume card' : 'Pause card', icon: c.status === 'Paused' ? 'Play' : 'Pause', onClick: () => { actions.updateCard(c.id, { status: c.status === 'Paused' ? 'Active' : 'Paused' }, 'Updated card status'); toast(c.status === 'Paused' ? 'Card resumed' : 'Card paused'); } },
                          { label: 'Set spend limit', icon: 'Sliders', onClick: () => { openCard(c.id); setEditingLimit(true); } },
                          { label: 'Reassign cardholder', icon: 'UserCirclePlus', onClick: () => { actions.updateCard(c.id, { cardholder: 'Avery Chen' }, 'Reassigned card'); toast('Card reassigned to Avery Chen'); } },
                          { label: 'Replace card', icon: 'ArrowsClockwise', onClick: () => { actions.updateCard(c.id, { last4: String(Math.floor(1000 + Math.random() * 8999)) }, 'Replaced card'); toast('Replacement card issued'); } },
                          { sep: true },
                          { label: 'Close card', icon: 'Prohibit', danger: true, onClick: () => actions.closeCard(c.id) },
                        ]}
                      >
                        <IconBtn name="DotsThree" label="Card actions" />
                      </Menu>
                    </div>
                  </TRow>
                ))}
              </Table>
            )}
          </div>
        </>
      )}

      {tab === 'groups' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Table cols="minmax(240px,1.5fr) 120px 160px 180px 120px" head={<><Th>Group</Th><Th>Cards</Th><Th>Spend limit</Th><Th>Merchants</Th><Th /></>}>
            {db.cardGroups.map((g) => (
              <TRow key={g.id} cols="minmax(240px,1.5fr) 120px 160px 180px 120px">
                <div className="cell">
                  <span className="avatar sq" style={{ background: g.color, borderColor: g.color, color: '#fff' }}>
                    <Icon name="FolderSimple" size={14} />
                  </span>
                  <span className="title">{g.name}</span>
                </div>
                <span className="chip count">{g.count}</span>
                <span>{g.limit}</span>
                <span className="muted">All allowed</span>
                <div className="right">
                  <Btn sm ghost onClick={() => { setTab('cards'); setGroup(g.name); }}>View cards</Btn>
                </div>
              </TRow>
            ))}
          </Table>
        </div>
      )}

      {tab === 'requests' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          {db.cardRequests.length === 0 ? (
            <Empty icon="CheckCircle" title="No pending card requests" text="Requests from your team will show up here." />
          ) : (
            <Table cols="minmax(220px,1.4fr) 200px 140px 160px 170px" head={<><Th>Request</Th><Th>Requester</Th><Th>Group</Th><Th>Submitted</Th><Th>Actions</Th></>}>
              {db.cardRequests.map((r) => (
                <TRow key={r.id} cols="minmax(220px,1.4fr) 200px 140px 160px 170px">
                  <div className="cell">
                    <MerchantTile name={r.cardName} icon="CreditCard" />
                    <div className="main">
                      <span className="title">{r.cardName}</span>
                      <span className="sub">{r.reason}</span>
                    </div>
                  </div>
                  <div className="cell"><Icon name="UserCircle" size={15} style={{ color: 'var(--ink-4)' }} />{r.requester}</div>
                  <span className="trunc">{r.group}</span>
                  <span className="muted">{r.submitted}</span>
                  <div className="right" style={{ gap: 6 }}>
                    <Btn sm primary onClick={() => actions.decideCardRequest(r.id, true)}>Approve</Btn>
                    <Btn sm ghost onClick={() => actions.decideCardRequest(r.id, false)}>Deny</Btn>
                  </div>
                </TRow>
              ))}
            </Table>
          )}
        </div>
      )}

      {/* create modal */}
      <Modal
        open={creating}
        onClose={() => { setCreating(false); setParams({}); }}
        title="Create virtual card"
        icon="CreditCard"
        footer={
          <>
            <Btn ghost onClick={() => setCreating(false)}>Cancel</Btn>
            <div className="spacer" />
            <Btn primary disabled={!draft.name} onClick={() => { actions.createCard(draft); setCreating(false); setParams({}); setDraft({ ...draft, name: '', last4: String(Math.floor(1000 + Math.random() * 8999)) }); }}>
              Create card
            </Btn>
          </>
        }
      >
        <div className="field">
          <label>Card name</label>
          <input className="input" placeholder="e.g. Paid Search Q4" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} autoFocus />
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Cardholder</label>
            <input className="input" placeholder="No cardholder" list="holders" value={draft.cardholder} onChange={(e) => setDraft({ ...draft, cardholder: e.target.value })} />
            <datalist id="holders">
              {db.users.map((u) => <option key={u.id} value={u.name} />)}
            </datalist>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Card group</label>
            <select className="input" value={draft.group} onChange={(e) => setDraft({ ...draft, group: e.target.value })}>
              {db.cardGroups.map((g) => <option key={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Virtual account</label>
            <select className="input" value={draft.virtualAccount} onChange={(e) => setDraft({ ...draft, virtualAccount: e.target.value })}>
              {db.virtualAccounts.map((v) => <option key={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Spend limit</label>
            <select className="input" value={draft.limit} onChange={(e) => setDraft({ ...draft, limit: e.target.value })}>
              {['No limit', '$1,000 / mo', '$5,000 / mo', '$10,000 / mo', '$25,000 / mo'].map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Last four digits</label>
          <input className="input" value={draft.last4} onChange={(e) => setDraft({ ...draft, last4: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
          <span className="hint">Cards are issued instantly and can be paused at any time.</span>
        </div>
      </Modal>

      {/* card drawer */}
      <Drawer
        open={!!selected}
        onClose={() => { setParams({}); setEditingLimit(false); }}
        title={selected?.name ?? 'Card'}
        icon="CreditCard"
        footer={
          selected && (
            <>
              <Btn sm onClick={() => { actions.updateCard(selected.id, { status: selected.status === 'Paused' ? 'Active' : 'Paused' }, 'Updated card status'); toast(selected.status === 'Paused' ? 'Card resumed' : 'Card paused'); }}>
                <Icon name={selected.status === 'Paused' ? 'Play' : 'Pause'} size={14} />
                {selected.status === 'Paused' ? 'Resume' : 'Freeze'}
              </Btn>
              <Btn sm onClick={() => { actions.updateCard(selected.id, { last4: String(Math.floor(1000 + Math.random() * 8999)) }, 'Replaced card'); toast('Replacement issued'); }} icon="ArrowsClockwise">Replace</Btn>
              <div className="spacer" />
              <Btn sm ghost danger onClick={() => { actions.closeCard(selected.id); setParams({}); }} icon="Prohibit">Close card</Btn>
            </>
          )
        }
      >
        {selected && (
          <>
            <div className={`card-visual${selected.status === 'Paused' ? ' frozen' : ''}`}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7 }}>SLASH</span>
                <span style={{ fontWeight: 700, fontStyle: 'italic', letterSpacing: 1 }}>VISA</span>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 15, letterSpacing: 1.5 }}>•••• •••• •••• {selected.last4}</div>
                <div className="row" style={{ justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, opacity: 0.8 }}>
                  <span>{selected.cardholder}</span>
                  <span>09/29</span>
                </div>
              </div>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <Chip tone={selected.status === 'Active' ? 'green' : selected.status === 'Paused' ? 'gold' : 'red'}>{selected.status}</Chip>
              <Chip>{selected.type === 'virtual' ? 'Virtual' : 'Physical'}</Chip>
              <span className="muted" style={{ fontSize: 12.5 }}>Created {selected.created}</span>
            </div>
            <div className="divider" />
            {editingLimit ? (
              <div className="field">
                <label>Spend limit</label>
                <div className="row" style={{ gap: 8 }}>
                  <select className="input" value={limitDraft} onChange={(e) => setLimitDraft(e.target.value)}>
                    {['No limit', '$500 / mo', '$1,000 / mo', '$5,000 / mo', '$10,000 / mo', '$25,000 / mo'].map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <Btn primary onClick={() => { actions.updateCard(selected.id, { limit: limitDraft }, 'Updated card limit'); setEditingLimit(false); toast('Spend limit updated'); }}>Save</Btn>
                  <Btn ghost onClick={() => setEditingLimit(false)}>Cancel</Btn>
                </div>
              </div>
            ) : (
              <KV
                rows={[
                  { label: 'Virtual account', value: selected.virtualAccount },
                  { label: 'Card group', value: <span className="row" style={{ gap: 6 }}>{selected.group} <span className="chip count">{selected.groupCount}</span></span> },
                  { label: 'Cardholder', value: selected.cardholder },
                  { label: 'Spend limits', value: <span className="row" style={{ gap: 6 }}>{selected.limit}<button className="link" style={{ fontSize: 12 }} onClick={() => { setLimitDraft(selected.limit); setEditingLimit(true); }}>Edit</button></span> },
                  { label: 'Merchant controls', value: selected.allowed },
                  { label: 'Spend 30 days', value: <span className="num">{money(selected.spend30)}</span> },
                ]}
              />
            )}
            <div className="divider" />
            <div className="stack" style={{ gap: 6 }}>
              <span className="section-title">Recent activity on this card</span>
              {db.transactions.filter((t) => t.card?.last4 === selected.last4).slice(0, 5).map((t) => (
                <div className="row" key={t.id} style={{ fontSize: 13 }}>
                  <MerchantTile name={t.merchant} />
                  <span>{t.merchant}</span>
                  <span className="num" style={{ marginLeft: 'auto' }}>{money(t.amount)}</span>
                </div>
              ))}
              {db.transactions.filter((t) => t.card?.last4 === selected.last4).length === 0 && <span className="muted" style={{ fontSize: 13 }}>No transactions yet.</span>}
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}