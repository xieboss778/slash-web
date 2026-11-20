import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon, PageHead, Btn, Table, TRow, Th, Tabs, Chip, SearchBox, StatusChip, KV, Toggle, IconBtn, Empty, MerchantTile, Drawer } from '../components/ui';
import { useApp, money } from '../store';
import type { AccountingEntry } from '../data/types';

export default function AccountingPage() {
  const { db, actions, toast } = useApp();
  const [params, setParams] = useSearchParams();
  const tab = params.get('status') ?? 'review';
  const setTab = (t: string) => setParams({ status: t });
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState<AccountingEntry | null>(null);

  const map: Record<string, AccountingEntry['status'][]> = {
    review: ['Needs review'], ready: ['Ready to sync'], synced: ['Synced'], archived: ['Archived'], failed: ['Failed'],
  };
  const rows = db.accountingEntries.filter((e) => map[tab]?.includes(e.status) && (!q || e.description.toLowerCase().includes(q.toLowerCase())));

  const cols = '120px minmax(260px,1.6fr) minmax(150px,1fr) 140px 130px 140px 80px';

  return (
    <div className="panel" data-tour="accounting">
      <PageHead icon="BookOpen" title="Accounting">
        <Btn icon="Gear" onClick={() => window.location.assign('/platinum/accounting/settings/general')}>Settings</Btn>
        <Btn primary icon="ArrowsClockwise" onClick={() => actions.syncAccounting()}>Sync now</Btn>
      </PageHead>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'review', label: 'Needs review', count: db.accountingEntries.filter((e) => e.status === 'Needs review').length },
          { key: 'ready', label: 'Ready to sync', count: db.accountingEntries.filter((e) => e.status === 'Ready to sync').length },
          { key: 'synced', label: 'Synced', count: db.accountingEntries.filter((e) => e.status === 'Synced').length },
          { key: 'archived', label: 'Archived', count: db.accountingEntries.filter((e) => e.status === 'Archived').length },
          { key: 'failed', label: 'Failed', count: db.accountingEntries.filter((e) => e.status === 'Failed').length },
        ]}
      />
      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Search entries" />
        <span className="chip sm">QuickBooks Online</span>
        <div className="right">Last sync <strong style={{ color: 'var(--ink)' }}>Nov 18, 2026 · 3:00 AM</strong></div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {rows.length === 0 ? (
          <Empty icon="BookOpen" title="Nothing in this status" text="Entries move here as they are reviewed and synced." />
        ) : (
          <Table
            cols={cols}
            head={<><Th>Date</Th><Th>Description</Th><Th>Account</Th><Th>Category</Th><Th>Amount</Th><Th>Status</Th><Th /></>}
          >
            {rows.map((e) => (
              <TRow key={e.id} cols={cols} onClick={() => setDetail(e)}>
                <span className="muted">{e.date}</span>
                <div className="cell"><MerchantTile name={e.description} icon="BookOpen" /><span className="trunc title">{e.description}</span></div>
                <span className="trunc">{e.account}</span>
                <span className="chip sm">{e.category}</span>
                <span className="num">{money(e.amount)}</span>
                <div><StatusChip status={e.status} /></div>
                <IconBtn name="DotsThree" label="Entry actions" onClick={() => setDetail(e)} />
              </TRow>
            ))}
          </Table>
        )}
      </div>

      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail?.description ?? ''} icon="BookOpen"
        footer={detail && (
          <>
            <Btn sm onClick={() => { actions.setAccountingStatus(detail.id, 'Ready to sync'); setDetail(null); toast('Marked ready to sync'); }}>Mark ready</Btn>
            <Btn sm primary onClick={() => { actions.setAccountingStatus(detail.id, 'Synced'); setDetail(null); toast('Entry synced'); }}>Sync entry</Btn>
            <div className="spacer" />
            <Btn sm ghost onClick={() => { actions.setAccountingStatus(detail.id, 'Archived'); setDetail(null); }}>Archive</Btn>
          </>
        )}
      >
        {detail && (
          <>
            <KV
              rows={[
                { label: 'Date', value: detail.date },
                { label: 'Description', value: detail.description },
                { label: 'GL account', value: detail.account },
                { label: 'Source category', value: detail.category },
                { label: 'Amount', value: money(detail.amount) },
                { label: 'Status', value: <StatusChip status={detail.status} /> },
                { label: 'Connection', value: detail.connection },
              ]}
            />
            <div className="divider" />
            <div className="field">
              <label>Update mapping</label>
              <select className="input" defaultValue={detail.account} onChange={(ev) => toast(`Mapped to ${ev.target.value}`)}>
                {['Office Supplies', 'Meals & entertainment', 'Cloud hosting', 'Design tooling', 'Rent', 'Processing fees', 'Payroll', 'Sales revenue'].map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}

export function AccountingBillsPage() {
  const { db, actions, toast } = useApp();
  return (
    <div className="panel">
      <PageHead icon="Receipt" title="Accounting · Bills">
        <Btn primary icon="ArrowsClockwise" onClick={() => actions.syncAccounting()}>Sync bills</Btn>
      </PageHead>
      <div className="toolbar">
        <span className="chip sm">QuickBooks Online</span>
        <span className="chip sm">Bill source category</span>
        <div className="right">{db.bills.length} bills coded</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }} data-tour="accounting-bills">
        <Table cols="minmax(220px,1.4fr) 140px 130px minmax(180px,1fr) 120px 130px 90px" head={<><Th>Bill</Th><Th>Invoice #</Th><Th>Amount</Th><Th>Dimension</Th><Th>Due</Th><Th>Status</Th><Th /></>}>
          {db.bills.map((b) => (
            <TRow key={b.id} cols="minmax(220px,1.4fr) 140px 130px minmax(180px,1fr) 120px 130px 90px">
              <div className="cell"><MerchantTile name={b.vendor} icon="Receipt" /><span className="title">{b.vendor}</span></div>
              <span className="mono muted" style={{ fontSize: 12 }}>{b.invoiceNo}</span>
              <span className="num">{money(b.amount)}</span>
              <span className="chip sm">Operating expense</span>
              <span className="muted">{b.dueDate}</span>
              <StatusChip status={b.status === 'Paid' ? 'Synced' : b.status === 'Draft' ? 'Needs review' : 'Ready to sync'} />
              <IconBtn name="PencilSimple" label="Edit coding" onClick={() => toast('Coding updated')} />
            </TRow>
          ))}
        </Table>
      </div>
    </div>
  );
}

export function AccountingSettingsPage() {
  const { db, actions, toast } = useApp();
  const [params, setParams] = useSearchParams();
  const tab = params.get('settingsTab') ?? 'general';
  const setTab = (t: string) => setParams({ settingsTab: t });
  const nav = useNavigate();

  const mappings = [
    { id: 'm1', source: 'Card transactions', category: 'Operating expense', account: 'Office Supplies', count: 214 },
    { id: 'm2', source: 'Card transactions', category: 'Design Resources', account: 'Design tooling', count: 96 },
    { id: 'm3', source: 'ACH payments', category: 'Facilities', account: 'Rent', count: 12 },
    { id: 'm4', source: 'ACH payments', category: 'Payroll', account: 'Payroll', count: 8 },
    { id: 'm5', source: 'Inbound ACH', category: 'Income', account: 'Sales revenue', count: 64 },
    { id: 'm6', source: 'Reimbursements', category: 'Meals & entertainment', account: 'Meals & entertainment', count: 22 },
  ];

  return (
    <div className="panel" data-tour="accounting-settings">
      <PageHead icon="Gear" title="Accounting settings" />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'general', label: 'General' },
          { key: 'mappings', label: 'Mapping Settings' },
          { key: 'fields', label: 'Fields' },
          { key: 'imported', label: 'Imported data' },
          { key: 'intelligence', label: 'Intelligence' },
        ]}
      />
      {tab === 'general' && (
        <div className="body" style={{ overflow: 'auto' }}>
          <div className="card">
            <div className="card-head">
              <span className="tile accent" style={{ background: '#2ca01c', borderColor: '#2ca01c', color: '#fff', fontWeight: 700 }}>qb</span>
              <div className="stack" style={{ gap: 0 }}>
                <h2>QuickBooks Online</h2>
                <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Connected · Synced 142 entries</span>
              </div>
              <div className="row" style={{ marginLeft: 'auto', gap: 8 }}>
                <Btn sm onClick={() => toast('Reconnect started')}>Reconnect</Btn>
                <Btn sm ghost danger onClick={() => toast('Disconnected (demo)', 'warn')}>Disconnect</Btn>
              </div>
            </div>
            <div className="card-pad stack" style={{ gap: 14 }}>
              {[
                ['Auto sync daily', 'autoSync', 'Push reviewed entries to QuickBooks every night at 3:00 AM.'],
                ['Sync card transactions', 'syncCards', 'Include card activity in the sync run.'],
                ['Sync bills', 'syncBills', 'Include vendor bills and their line items.'],
                ['Attach receipts', 'attachReceipts', 'Upload receipt images alongside each entry.'],
              ].map(([label, key, hint]) => (
                <div className="row" key={key as string} style={{ gap: 12 }}>
                  <div className="stack" style={{ gap: 2 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 525 }}>{label as string}</span>
                    <span className="muted" style={{ fontSize: 12.5 }}>{hint as string}</span>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <Toggle on={db.settings[key as string] ?? true} onChange={() => actions.toggleSetting(key as string)} />
                  </div>
                </div>
              ))}
              <div className="divider" />
              <div className="row">
                <span className="muted" style={{ fontSize: 12.5 }}>Last sync Nov 18, 2026 · 3:00 AM</span>
                <Btn sm primary style={{ marginLeft: 'auto' }} onClick={() => actions.syncAccounting()}>Sync now</Btn>
              </div>
            </div>
          </div>
          <div className="card card-pad">
            <span className="section-title">Chart of accounts</span>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {['Office Supplies', 'Meals & entertainment', 'Cloud hosting', 'Design tooling', 'Rent', 'Payroll', 'Sales revenue', 'Processing fees'].map((a) => <span className="chip" key={a}>{a}</span>)}
            </div>
          </div>
        </div>
      )}
      {tab === 'mappings' && (
        <div style={{ flex: 1, overflow: 'auto' }} data-tour="accounting-mappings">
          <div className="toolbar">
            <span className="chip gold-outline" style={{ height: 30 }}><Icon name="Tag" size={13} />Card source category</span>
            <SearchBox value="" onChange={() => {}} placeholder="Search mappings" />
            <div className="right"><Btn sm icon="PlusCircle" onClick={() => toast('New mapping created')}>New mapping</Btn></div>
          </div>
          <Table cols="160px minmax(200px,1.3fr) 200px 120px 90px" head={<><Th>Source</Th><Th>Source category</Th><Th>GL account</Th><Th>Entries</Th><Th /></>}>
            {mappings.map((m) => (
              <TRow key={m.id} cols="160px minmax(200px,1.3fr) 200px 120px 90px">
                <span className="chip sm">{m.source}</span>
                <span>{m.category}</span>
                <div className="cell">
                  <Icon name="ArrowElbowDownRight" size={14} style={{ color: 'var(--ink-4)' }} />
                  <select className="input" style={{ height: 30 }} defaultValue={m.account} onChange={(e) => toast(`Mapped to ${e.target.value}`)}>
                    {[m.account, 'Office Supplies', 'Meals & entertainment', 'Cloud hosting', 'Design tooling', 'Rent', 'Payroll'].filter((v, i, a) => a.indexOf(v) === i).map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <span className="num muted">{m.count}</span>
                <IconBtn name="PencilSimple" label="Edit mapping" onClick={() => toast('Mapping saved')} />
              </TRow>
            ))}
          </Table>
        </div>
      )}
      {tab === 'fields' && (
        <div className="body" style={{ overflow: 'auto' }}>
          <div className="card card-pad stack" style={{ gap: 12 }}>
            <span className="section-title">Synced fields</span>
            {['Class', 'Location', 'Department', 'Customer', 'Vendor', 'Memo'].map((f) => (
              <div className="row" key={f}><span style={{ fontSize: 13.5 }}>{f}</span><div style={{ marginLeft: 'auto' }}><Toggle on={f !== 'Class'} onChange={() => toast('Field preference saved')} /></div></div>
            ))}
          </div>
        </div>
      )}
      {tab === 'imported' && (
        <div className="body" style={{ overflow: 'auto' }}>
          <div className="card">
            <div className="card-head"><h2>Imported data</h2><Btn sm style={{ marginLeft: 'auto' }} icon="UploadSimple" onClick={() => toast('Import queued')}>Import</Btn></div>
            <Table cols="minmax(220px,1.4fr) 140px 140px 140px" head={<><Th>File</Th><Th>Rows</Th><Th>Imported</Th><Th>Status</Th></>}>
              {[['chart-of-accounts.csv', 128, 'Nov 2, 2026', 'Synced'], ['vendors.csv', 64, 'Nov 2, 2026', 'Synced'], ['opening-balances.csv', 12, 'Oct 28, 2026', 'Synced']].map(([f, r, d, s], i) => (
                <TRow key={i} cols="minmax(220px,1.4fr) 140px 140px 140px">
                  <div className="cell"><Icon name="FileCsv" size={15} style={{ color: 'var(--ink-4)' }} /><span className="title">{f as string}</span></div>
                  <span className="num muted">{r as number}</span>
                  <span className="muted">{d as string}</span>
                  <StatusChip status={s as string} />
                </TRow>
              ))}
            </Table>
          </div>
        </div>
      )}
      {tab === 'intelligence' && (
        <div className="body" style={{ overflow: 'auto' }}>
          <div className="card card-pad stack" style={{ gap: 14 }}>
            <span className="section-title">Coding suggestions</span>
            <span className="muted" style={{ fontSize: 13 }}>Slash suggests a GL account for every new transaction based on your history. Review suggestions before syncing.</span>
            {[['Amazon Web Services', 'Cloud hosting', 0.98], ['Figma', 'Design tooling', 0.96], ['DoorDash', 'Meals & entertainment', 0.91]].map(([m, a, c]) => (
              <div className="row" key={m as string} style={{ gap: 10 }}>
                <MerchantTile name={m as string} />
                <span style={{ fontSize: 13.5 }}>{m as string}</span>
                <span className="chip sm">{a as string}</span>
                <span className="chip green sm" style={{ marginLeft: 'auto' }}>{Math.round((c as number) * 100)}% match</span>
                <Btn sm onClick={() => toast('Suggestion applied')}>Apply</Btn>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}