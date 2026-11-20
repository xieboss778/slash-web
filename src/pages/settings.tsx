import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon, PageHead, Btn, Table, TRow, Th, Tabs, Chip, SearchBox, Modal, KV, Toggle, IconBtn, StatusChip, Empty, Menu } from '../components/ui';
import { useApp, money, todayLabel } from '../store';
import { ENTITY } from '../data/seed';
import { SettingsNav } from '../components/shell';

export function PoliciesPage() {
  const { db, actions, toast } = useApp();
  const [params, setParams] = useSearchParams();
  const tab = params.get('settingsTab') ?? 'card_limits';
  const setTab = (t: string) => setParams({ settingsTab: t });
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ name: '', scope: 'All cards', limit: '$5,000 / mo' });

  return (
    <div className="panel" data-tour="policies">
      <PageHead icon="ShieldCheck" title="Policies &amp; controls">
        <Btn primary icon="PlusCircle" onClick={() => setCreating(true)}>New policy</Btn>
      </PageHead>
      <SettingsNav />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'card_limits', label: 'Card limits' },
          { key: 'approvals', label: 'Payment approvals' },
          { key: 'ach', label: 'ACH authorization' },
        ]}
      />
      {tab === 'card_limits' && (
        <div style={{ flex: 1, overflow: 'auto' }} data-tour="card-limits">
          <div className="toolbar">
            <span className="chip gold-outline" style={{ height: 30 }}><Icon name="ShieldCheck" size={13} />Organization-wide</span>
            <SearchBox value="" onChange={() => {}} placeholder="Search policies" />
            <div className="right">Applies to every card unless overridden</div>
          </div>
          <Table cols="minmax(240px,1.5fr) 200px 150px 180px 120px 90px" head={<><Th>Policy</Th><Th>Scope</Th><Th>Limit</Th><Th>Merchants</Th><Th>Status</Th><Th /></>}>
            {db.cardPolicies.map((p) => (
              <TRow key={p.id} cols="minmax(240px,1.5fr) 200px 150px 180px 120px 90px">
                <div className="cell"><Icon name="ShieldCheck" size={15} style={{ color: 'var(--ink-4)' }} /><span className="title">{p.name}</span></div>
                <span className="trunc">{p.scope}</span>
                <span className="num">{p.limit}</span>
                <span className="trunc muted">{p.merchants}</span>
                <div><span className={`chip sm ${p.status === 'Active' ? 'green' : ''}`}>{p.status}</span></div>
                <Menu items={[{ label: 'Activate', icon: 'Check', onClick: () => { actions.setPolicyStatus(p.id, 'Active'); toast('Policy activated'); } }, { label: 'Move to draft', icon: 'PencilSimple', onClick: () => actions.setPolicyStatus(p.id, 'Draft') }, { sep: true }, { label: 'Delete', icon: 'Trash', danger: true, onClick: () => toast('Policy deleted', 'warn') }]}>
                  <IconBtn name="DotsThree" label="Policy actions" />
                </Menu>
              </TRow>
            ))}
          </Table>
        </div>
      )}
      {tab === 'approvals' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Table cols="minmax(240px,1.5fr) 240px 180px 120px" head={<><Th>Policy</Th><Th>Rule</Th><Th>Scope</Th><Th>Status</Th></>}>
            {db.approvalPolicies.map((p) => (
              <TRow key={p.id} cols="minmax(240px,1.5fr) 240px 180px 120px">
                <span className="title">{p.name}</span>
                <span>{p.rule}</span>
                <span className="muted">{p.scope}</span>
                <div><span className="chip green sm">{p.status}</span></div>
              </TRow>
            ))}
          </Table>
        </div>
      )}
      {tab === 'ach' && (
        <div className="body" style={{ overflow: 'auto' }}>
          <div className="card card-pad stack" style={{ gap: 14 }}>
            <span className="section-title">ACH authorization policy</span>
            {[
              ['Require approval for debits over $1,000', true],
              ['Block first-time originators automatically', true],
              ['Notify finance on every debit request', true],
              ['Auto-approve recurring originators', false],
            ].map(([label, on]) => (
              <div className="row" key={label as string}>
                <span style={{ fontSize: 13.5 }}>{label as string}</span>
                <div style={{ marginLeft: 'auto' }}><Toggle on={on as boolean} onChange={() => toast('ACH policy updated')} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="New card policy" icon="ShieldCheck"
        footer={<><Btn ghost onClick={() => setCreating(false)}>Cancel</Btn><div className="spacer" /><Btn primary disabled={!draft.name} onClick={() => { actions.addPolicy(draft.name, draft.scope, draft.limit); setCreating(false); setDraft({ ...draft, name: '' }); }}>Create policy</Btn></>}>
        <div className="field">
          <label>Policy name</label>
          <input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Software subscriptions" autoFocus />
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Scope</label>
            <select className="input" value={draft.scope} onChange={(e) => setDraft({ ...draft, scope: e.target.value })}>
              {['All cards', ...db.cardGroups.map((g) => g.name)].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Limit</label>
            <select className="input" value={draft.limit} onChange={(e) => setDraft({ ...draft, limit: e.target.value })}>
              {['No limit', '$1,000 / mo', '$5,000 / mo', '$10,000 / mo', '$25,000 / mo'].map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function BusinessDetailsPage() {
  const { toast } = useApp();
  const [form, setForm] = useState({
    legalName: 'Victor Cardenas LLC', dba: 'Acme Studio', ein: ENTITY.ein, type: 'LLC',
    address: '1201 Congress Ave, Suite 400', city: 'Austin', state: 'TX', zip: '78701',
    phone: '+1 (512) 555-0134', website: 'https://acmestudio.com', industry: 'Marketing & advertising',
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="panel">
      <PageHead icon="Sliders" title="Entity settings">
        <Btn primary icon="Check" onClick={() => toast('Entity details saved')}>Save changes</Btn>
      </PageHead>
      <SettingsNav />
      <div className="body" style={{ overflow: 'auto', maxWidth: 720 }}>
        <div className="card card-pad stack" style={{ gap: 14 }}>
          <span className="section-title">Business details</span>
          <div className="row" style={{ gap: 12 }}>
            <div className="field" style={{ flex: 1 }}><label>Legal name</label><input className="input" value={form.legalName} onChange={(e) => set('legalName', e.target.value)} /></div>
            <div className="field" style={{ flex: 1 }}><label>DBA</label><input className="input" value={form.dba} onChange={(e) => set('dba', e.target.value)} /></div>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="field" style={{ flex: 1 }}><label>EIN</label><input className="input mono" value={form.ein} onChange={(e) => set('ein', e.target.value)} /></div>
            <div className="field" style={{ flex: 1 }}><label>Entity type</label>
              <select className="input" value={form.type} onChange={(e) => set('type', e.target.value)}>{['LLC', 'S-Corp', 'C-Corp', 'Sole proprietor'].map((t) => <option key={t}>{t}</option>)}</select>
            </div>
          </div>
          <div className="field"><label>Street address</label><input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} /></div>
          <div className="row" style={{ gap: 12 }}>
            <div className="field" style={{ flex: 2 }}><label>City</label><input className="input" value={form.city} onChange={(e) => set('city', e.target.value)} /></div>
            <div className="field" style={{ flex: 1 }}><label>State</label><input className="input" value={form.state} onChange={(e) => set('state', e.target.value)} /></div>
            <div className="field" style={{ flex: 1 }}><label>ZIP</label><input className="input" value={form.zip} onChange={(e) => set('zip', e.target.value)} /></div>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="field" style={{ flex: 1 }}><label>Phone</label><input className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
            <div className="field" style={{ flex: 1 }}><label>Website</label><input className="input" value={form.website} onChange={(e) => set('website', e.target.value)} /></div>
          </div>
          <div className="field"><label>Industry</label><input className="input" value={form.industry} onChange={(e) => set('industry', e.target.value)} /></div>
        </div>
        <div className="card card-pad stack" style={{ gap: 10 }}>
          <span className="section-title">Verification</span>
          <div className="row" style={{ fontSize: 13 }}><Icon name="CheckCircle" size={15} style={{ color: 'var(--green-11)' }} />Business verified<span className="muted" style={{ marginLeft: 'auto' }}>Sep 12, 2026</span></div>
          <div className="row" style={{ fontSize: 13 }}><Icon name="CheckCircle" size={15} style={{ color: 'var(--green-11)' }} />EIN matched<span className="muted" style={{ marginLeft: 'auto' }}>Sep 12, 2026</span></div>
          <div className="row" style={{ fontSize: 13 }}><Icon name="CheckCircle" size={15} style={{ color: 'var(--green-11)' }} />Ownership verified<span className="muted" style={{ marginLeft: 'auto' }}>Sep 14, 2026</span></div>
        </div>
      </div>
    </div>
  );
}

export function UsersPage() {
  const { db, actions, toast } = useApp();
  const [invite, setInvite] = useState(false);
  const [draft, setDraft] = useState({ name: '', email: '', role: 'Cardholder' as any });
  const [q, setQ] = useState('');

  const rows = db.users.filter((u) => !q || `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="panel">
      <PageHead icon="Users" title="Users">
        <Btn icon="Gear" onClick={() => toast('Role permissions opened')}>Roles</Btn>
        <Btn primary icon="UserCirclePlus" onClick={() => setInvite(true)}>Invite user</Btn>
      </PageHead>
      <SettingsNav />
      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Search users" />
        <span className="chip sm">{db.users.length} users</span>
        <div className="right">Admins can manage cards, payments and settings</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table cols="minmax(240px,1.5fr) minmax(220px,1.2fr) 160px 120px 140px 90px" head={<><Th>User</Th><Th>Email</Th><Th>Role</Th><Th>Status</Th><Th>Last active</Th><Th /></>}>
          {rows.map((u) => (
            <TRow key={u.id} cols="minmax(240px,1.5fr) minmax(220px,1.2fr) 160px 120px 140px 90px">
              <div className="cell">
                <span className="avatar">{u.initials}</span>
                <span className="title">{u.name}</span>
              </div>
              <span className="trunc muted">{u.email}</span>
              <div>
                <select className="input" style={{ height: 30 }} value={u.role} onChange={(e) => actions.updateUser(u.id, { role: e.target.value as any })}>
                  {['Admin', 'Controller', 'Bookkeeper', 'Cardholder'].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div><span className={`chip sm ${u.status === 'Active' ? 'green' : u.status === 'Invited' ? 'gold' : 'red'}`}>{u.status}</span></div>
              <span className="muted">{u.lastActive}</span>
              <Menu items={[
                { label: 'Resend invite', icon: 'EnvelopeSimple', onClick: () => toast('Invite resent') },
                { label: u.status === 'Suspended' ? 'Reactivate' : 'Suspend user', icon: 'Prohibit', danger: u.status !== 'Suspended', onClick: () => actions.updateUser(u.id, { status: u.status === 'Suspended' ? 'Active' : 'Suspended' }) },
                { sep: true },
                { label: 'Remove user', icon: 'Trash', danger: true, onClick: () => toast('User removed', 'warn') },
              ]}>
                <IconBtn name="DotsThree" label="User actions" />
              </Menu>
            </TRow>
          ))}
        </Table>
      </div>
      <Modal open={invite} onClose={() => setInvite(false)} title="Invite user" icon="UserCirclePlus"
        footer={<><Btn ghost onClick={() => setInvite(false)}>Cancel</Btn><div className="spacer" /><Btn primary disabled={!draft.name || !draft.email} onClick={() => { actions.inviteUser(draft); setInvite(false); setDraft({ name: '', email: '', role: 'Cardholder' }); }}>Send invite</Btn></>}>
        <div className="field"><label>Full name</label><input className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Jane Doe" autoFocus /></div>
        <div className="field"><label>Work email</label><input className="input" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="jane@company.com" /></div>
        <div className="field"><label>Role</label>
          <select className="input" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value as any })}>
            {['Admin', 'Controller', 'Bookkeeper', 'Cardholder'].map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </Modal>
    </div>
  );
}

export function SecurityPage() {
  const { db, actions, toast } = useApp();
  return (
    <div className="panel">
      <PageHead icon="Lock" title="Security" />
      <SettingsNav />
      <div className="body" style={{ overflow: 'auto', maxWidth: 760 }}>
        <div className="card card-pad stack" style={{ gap: 14 }}>
          <span className="section-title">Authentication</span>
          <div className="row">
            <div className="stack" style={{ gap: 2 }}>
              <span style={{ fontSize: 13.5, fontWeight: 525 }}>Two-factor authentication</span>
              <span className="muted" style={{ fontSize: 12.5 }}>Require a one-time code from an authenticator app at sign-in.</span>
            </div>
            <div style={{ marginLeft: 'auto' }}><Toggle on={db.settings.twoFactor} onChange={() => actions.toggleSetting('twoFactor')} /></div>
          </div>
          <div className="row">
            <div className="stack" style={{ gap: 2 }}>
              <span style={{ fontSize: 13.5, fontWeight: 525 }}>Device approval for new sign-ins</span>
              <span className="muted" style={{ fontSize: 12.5 }}>Send an email to confirm unrecognized devices.</span>
            </div>
            <div style={{ marginLeft: 'auto' }}><Toggle on onChange={() => toast('Device approval updated')} /></div>
          </div>
          <div className="divider" />
          <span className="section-title">Active sessions</span>
          {[
            ['MacBook Pro · Chrome', 'Austin, TX · 192.168.1.24', 'Current session'],
            ['iPhone 16 Pro · Slash app', 'Austin, TX · 192.168.1.31', '2 hours ago'],
            ['iPad Air · Safari', 'Dallas, TX · 10.0.0.14', 'Yesterday'],
          ].map(([device, meta, when]) => (
            <div className="row" key={device as string} style={{ gap: 10 }}>
              <span className="tile"><Icon name="DeviceMobile" size={15} /></span>
              <div className="stack" style={{ gap: 0 }}>
                <span style={{ fontSize: 13.5 }}>{device as string}</span>
                <span className="muted" style={{ fontSize: 12 }}>{meta as string}</span>
              </div>
              <span className="muted" style={{ marginLeft: 'auto', fontSize: 12.5 }}>{when as string}</span>
              {when !== 'Current session' && <Btn sm ghost danger onClick={() => toast('Session revoked', 'warn')}>Revoke</Btn>}
            </div>
          ))}
        </div>
        <div className="card card-pad stack" style={{ gap: 14 }}>
          <span className="section-title">Alerts</span>
          <div className="row"><span style={{ fontSize: 13.5 }}>Email alerts for payments over $5,000</span><div style={{ marginLeft: 'auto' }}><Toggle on={db.settings.emailAlerts} onChange={() => actions.toggleSetting('emailAlerts')} /></div></div>
          <div className="row"><span style={{ fontSize: 13.5 }}>Push alerts for card authorizations</span><div style={{ marginLeft: 'auto' }}><Toggle on={db.settings.pushAlerts} onChange={() => actions.toggleSetting('pushAlerts')} /></div></div>
        </div>
      </div>
    </div>
  );
}

export function ApiManagementPage() {
  const { db, actions, toast } = useApp();
  const [label, setLabel] = useState('');
  return (
    <div className="panel">
      <PageHead icon="Code" title="API management">
        <Btn icon="BookOpen" onClick={() => toast('API docs opened')}>Docs</Btn>
        <Btn primary icon="PlusCircle" onClick={() => { if (!label) { toast('Name the key first', 'warn'); return; } actions.addApiKey(label); setLabel(''); }}>Create key</Btn>
      </PageHead>
      <SettingsNav />
      <div className="body" style={{ overflow: 'auto' }}>
        <div className="card card-pad stack" style={{ gap: 10 }}>
          <span className="section-title">Create an API key</span>
          <div className="row" style={{ gap: 8 }}>
            <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Key label, e.g. Accounting sync" style={{ flex: 1 }} />
            <Btn onClick={() => { if (!label) { toast('Name the key first', 'warn'); return; } actions.addApiKey(label); setLabel(''); }}>Create</Btn>
          </div>
          <span className="hint">Keys are shown once at creation. Store them in your secret manager.</span>
        </div>
        <div className="card">
          <div className="card-head"><h2>Active keys</h2></div>
          <Table cols="minmax(240px,1.5fr) 160px 140px 140px 120px 90px" head={<><Th>Label</Th><Th>Prefix</Th><Th>Created</Th><Th>Last used</Th><Th>Scope</Th><Th /></>}>
            {db.apiKeys.map((k) => (
              <TRow key={k.id} cols="minmax(240px,1.5fr) 160px 140px 140px 120px 90px">
                <span className="title">{k.label}</span>
                <span className="mono muted" style={{ fontSize: 12 }}>{k.prefix}••••</span>
                <span className="muted">{k.created}</span>
                <span className="muted">{k.lastUsed}</span>
                <span className="chip sm">{k.scope}</span>
                <Btn sm ghost danger onClick={() => actions.revokeApiKey(k.id)}>Revoke</Btn>
              </TRow>
            ))}
          </Table>
        </div>
        <div className="card card-pad stack" style={{ gap: 8 }}>
          <span className="section-title">Webhooks</span>
          <div className="row" style={{ fontSize: 13 }}><Icon name="WebhooksLogo" size={15} style={{ color: 'var(--ink-4)' }} />transaction.created<span className="chip green sm" style={{ marginLeft: 'auto' }}>Active</span></div>
          <div className="row" style={{ fontSize: 13 }}><Icon name="WebhooksLogo" size={15} style={{ color: 'var(--ink-4)' }} />payment.approved<span className="chip green sm" style={{ marginLeft: 'auto' }}>Active</span></div>
          <div className="row" style={{ fontSize: 13 }}><Icon name="WebhooksLogo" size={15} style={{ color: 'var(--ink-4)' }} />card.created<span className="chip sm" style={{ marginLeft: 'auto' }}>Paused</span></div>
        </div>
      </div>
    </div>
  );
}

export function ActivityLogPage() {
  const { db } = useApp();
  return (
    <div className="panel">
      <PageHead icon="ClockCounterClockwise" title="Activity log" />
      <SettingsNav />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table cols="180px minmax(160px,1fr) minmax(240px,1.5fr) 190px" head={<><Th>Actor</Th><Th>Action</Th><Th>Target</Th><Th>When</Th></>}>
          {db.activityLog.map((a) => (
            <TRow key={a.id} cols="180px minmax(160px,1fr) minmax(240px,1.5fr) 190px">
              <span className="title">{a.actor}</span>
              <span>{a.action}</span>
              <span className="trunc muted">{a.target}</span>
              <span className="muted">{a.when}</span>
            </TRow>
          ))}
        </Table>
      </div>
    </div>
  );
}