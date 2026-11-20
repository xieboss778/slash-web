import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon, PageHead, Btn, Table, TRow, Th, Tabs, SearchBox, Menu, IconBtn, StatusChip, Modal, Drawer, KV, Empty, MerchantTile } from '../components/ui';
import { useApp, money } from '../store';
import type { Invoice } from '../data/types';

export default function InvoicesPage() {
  const { db, actions, toast } = useApp();
  const [params, setParams] = useSearchParams();
  const tab = params.get('invoicesTab') ?? 'invoices';
  const setTab = (t: string) => setParams({ invoicesTab: t });
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);
  const [detail, setDetail] = useState<Invoice | null>(null);
  const [draft, setDraft] = useState({ customer: '', amount: '', dueDate: '2026-12-20', memo: '', send: true });

  const rows = db.invoices.filter((i) => !q || `${i.number} ${i.customer}`.toLowerCase().includes(q.toLowerCase()));
  const cols = 'minmax(200px,1.2fr) minmax(200px,1.2fr) 120px 120px 130px 130px minmax(160px,1fr) 90px';

  return (
    <div className="panel" data-tour="invoices">
      <PageHead icon="FileText" title="Invoicing">
        <Menu
          items={[
            { label: 'Invoicing settings' },
            { label: 'General', icon: 'Gear', onClick: () => toast('Invoice general settings') },
            { label: 'Branding', icon: 'Palette', onClick: () => toast('Invoice branding') },
            { label: 'Catalog', icon: 'Books', onClick: () => toast('Invoice catalog') },
            { label: 'Defaults', icon: 'Sliders', onClick: () => toast('Invoice defaults') },
          ]}
        >
          <Btn icon="Sliders" iconRight="CaretDown">Settings</Btn>
        </Menu>
        <Btn primary icon="PlusCircle" onClick={() => setCreating(true)}>Create invoice</Btn>
      </PageHead>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'invoices', label: 'Invoices', count: db.invoices.length },
          { key: 'series', label: 'Recurring', count: db.invoiceSeries.length },
        ]}
      />

      {tab === 'invoices' && (
        <>
          <div className="toolbar">
            <SearchBox value={q} onChange={setQ} placeholder="Search invoices" />
            <button className="pill-btn" onClick={() => toast('Filter invoices by status, customer, or due date')}><Icon name="Funnel" size={15} />Filters</button>
            <div className="right">Outstanding <strong className="num" style={{ color: 'var(--ink)' }}>{money(rows.filter((r) => r.status !== 'Paid' && r.status !== 'Draft').reduce((a, b) => a + b.amount, 0))}</strong></div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }} data-tour="invoices-table">
            {rows.length === 0 ? (
              <Empty icon="FileText" title="No invoices" text="Create your first invoice." />
            ) : (
              <Table
                cols={cols}
                head={<><Th>Invoice</Th><Th>Customer</Th><Th>Amount</Th><Th>Status</Th><Th>Due date</Th><Th>Issued</Th><Th>Memo</Th><Th>Actions</Th></>}
              >
                {rows.map((i) => (
                  <TRow key={i.id} cols={cols} onClick={() => setDetail(i)}>
                    <div className="cell">
                      <MerchantTile name={i.customer} icon="FileText" />
                      <div className="main">
                        <span className="title mono" style={{ fontSize: 12.5 }}>{i.number}</span>
                        <span className="sub">{i.status === 'Draft' ? 'Not sent' : 'Sent to customer'}</span>
                      </div>
                    </div>
                    <span className="trunc">{i.customer}</span>
                    <span className="num">{money(i.amount)}</span>
                    <div><StatusChip status={i.status} /></div>
                    <span className="muted">{i.dueDate}</span>
                    <span className="muted">{i.issued}</span>
                    <span className="trunc muted">{i.memo}</span>
                    <div className="right" onClick={(e) => e.stopPropagation()}>
                      <Menu
                        items={[
                          { label: 'View invoice', icon: 'MagnifyingGlass', onClick: () => setDetail(i) },
                          { label: 'Send invoice', icon: 'PaperPlaneTilt', onClick: () => actions.updateInvoice(i.id, { status: 'Sent' }, 'Invoice sent') },
                          { label: 'Send reminder', icon: 'BellRinging', onClick: () => toast('Reminder sent to ' + i.customer) },
                          { label: 'Mark as paid', icon: 'CheckCircle', onClick: () => actions.updateInvoice(i.id, { status: 'Paid' }, 'Invoice marked paid') },
                          { label: 'Copy payment link', icon: 'Copy', onClick: () => { navigator.clipboard?.writeText(`https://pay.joinslash.com/${i.number}`); toast('Payment link copied'); } },
                          { sep: true },
                          { label: 'Delete draft', icon: 'Trash', danger: true, onClick: () => toast('Draft deleted', 'warn') },
                        ]}
                      >
                        <IconBtn name="DotsThree" label="Invoice actions" />
                      </Menu>
                    </div>
                  </TRow>
                ))}
              </Table>
            )}
          </div>
        </>
      )}

      {tab === 'series' && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Table cols="minmax(240px,1.5fr) 200px 140px 150px 120px 120px" head={<><Th>Series</Th><Th>Customer</Th><Th>Cadence</Th><Th>Next invoice</Th><Th>Amount</Th><Th>Status</Th></>}>
            {db.invoiceSeries.map((s) => (
              <TRow key={s.id} cols="minmax(240px,1.5fr) 200px 140px 150px 120px 120px">
                <span className="title">{s.name}</span>
                <span>{s.customer}</span>
                <span className="muted">{s.cadence}</span>
                <span>{s.next}</span>
                <span className="num">{money(s.amount)}</span>
                <div><StatusChip status={s.status === 'Active' ? 'Active' : 'Draft'} /></div>
              </TRow>
            ))}
          </Table>
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Create invoice"
        icon="FileText"
        footer={
          <>
            <Btn ghost onClick={() => setCreating(false)}>Cancel</Btn>
            <div className="spacer" />
            <Btn onClick={() => { actions.createInvoice({ customer: draft.customer, amount: Number(draft.amount), dueDate: draft.dueDate, memo: draft.memo, send: false }); setCreating(false); }}>Save draft</Btn>
            <Btn primary disabled={!draft.customer || !Number(draft.amount)} onClick={() => { actions.createInvoice({ customer: draft.customer, amount: Number(draft.amount), dueDate: draft.dueDate, memo: draft.memo, send: true }); setCreating(false); setDraft({ ...draft, customer: '', amount: '', memo: '' }); }}>Create & send</Btn>
          </>
        }
      >
        <div className="field">
          <label>Customer</label>
          <input className="input" value={draft.customer} onChange={(e) => setDraft({ ...draft, customer: e.target.value })} placeholder="Customer name" autoFocus />
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Amount</label>
            <input className="input" inputMode="decimal" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} placeholder="0.00" />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Due date</label>
            <input className="input" type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Memo</label>
          <textarea className="textarea" value={draft.memo} onChange={(e) => setDraft({ ...draft, memo: e.target.value })} placeholder="What are you billing for?" />
        </div>
      </Modal>

      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail?.number ?? ''} icon="FileText"
        footer={detail && <><Btn sm icon="PaperPlaneTilt" onClick={() => actions.updateInvoice(detail.id, { status: 'Sent' }, 'Invoice sent')}>Send</Btn><Btn sm icon="Copy" onClick={() => { navigator.clipboard?.writeText(`https://pay.joinslash.com/${detail.number}`); toast('Payment link copied'); }}>Payment link</Btn><div className="spacer" />{detail.status !== 'Paid' && <Btn sm primary onClick={() => actions.updateInvoice(detail.id, { status: 'Paid' }, 'Invoice marked paid')}>Mark paid</Btn>}</>}>
        {detail && (
          <>
            <div className="row" style={{ gap: 10 }}>
              <MerchantTile name={detail.customer} icon="FileText" />
              <div className="stack">
                <span className="num" style={{ fontSize: 20, fontWeight: 600 }}>{money(detail.amount)}</span>
                <span className="muted" style={{ fontSize: 12.5 }}>{detail.customer}</span>
              </div>
              <StatusChip status={detail.status} />
            </div>
            <div className="divider" />
            <KV
              rows={[
                { label: 'Invoice number', value: detail.number },
                { label: 'Issued', value: detail.issued },
                { label: 'Due', value: detail.dueDate },
                { label: 'Memo', value: detail.memo },
                { label: 'Payment terms', value: 'Net 30' },
                { label: 'Reminders', value: detail.status === 'Overdue' ? 'Sent 2 reminders' : 'None' },
              ]}
            />
          </>
        )}
      </Drawer>
    </div>
  );
}