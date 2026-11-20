import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon, PageHead, Btn, Chip, Tabs, Empty, KV } from '../components/ui';
import { useApp, money } from '../store';
import type { ActionItem } from '../data/types';

const statusOf = (s: string) => (s === 'action_required' ? 'Needs your action' : s === 'pending' ? 'Pending' : 'Completed');

export default function ActionCenterPage() {
  const { db, actions } = useApp();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') ?? 'action_required';
  const setTab = (t: string) => setParams({ tab: t });
  const list = db.actionItems.filter((a) => a.status === tab);
  const selectedId = params.get('item');
  const selected = list.find((a) => a.id === selectedId) ?? list[0] ?? null;

  const counts = {
    action_required: db.actionItems.filter((a) => a.status === 'action_required').length,
    pending: db.actionItems.filter((a) => a.status === 'pending').length,
    completed: db.actionItems.filter((a) => a.status === 'completed').length,
  };

  return (
    <div className="panel" data-tour="action-center">
      <PageHead icon="Tray" title="Action Center" />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'action_required', label: 'Action required', count: counts.action_required },
          { key: 'pending', label: 'Pending', count: counts.pending },
          { key: 'completed', label: 'Completed', count: counts.completed },
        ]}
      />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ width: 420, borderRight: '1px solid var(--line-3)', overflow: 'auto' }} data-tour="ac-list">
          {list.length === 0 && <Empty icon="CheckCircle" title="Nothing here" text="You are all caught up." />}
          {list.map((a) => (
            <div
              key={a.id}
              onClick={() => setParams({ tab, item: a.id })}
              style={{
                display: 'flex',
                gap: 10,
                padding: '12px 16px',
                borderBottom: '1px solid var(--line-3)',
                cursor: 'pointer',
                background: a.id === selected?.id ? 'var(--surface-3)' : undefined,
              }}
            >
              <span className="tile">{<Icon name={a.kind === 'payment' ? 'PaperPlaneTilt' : a.kind === 'card' ? 'CreditCard' : a.kind === 'expense' ? 'ReceiptX' : a.kind === 'ach' ? 'Bank' : 'FileText'} size={15} />}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="row" style={{ gap: 6 }}>
                  <span className="title trunc" style={{ fontWeight: 525 }}>{a.title}</span>
                  {typeof a.amount === 'number' && <span className="num" style={{ marginLeft: 'auto', fontSize: 13 }}>{money(a.amount)}</span>}
                </div>
                <div className="sub trunc" style={{ fontSize: 12, color: 'var(--ink-4)' }}>{a.subtitle}</div>
                <div className="row" style={{ marginTop: 6, gap: 6 }}>
                  <Chip sm tone={a.status === 'action_required' ? 'gold' : a.status === 'pending' ? 'blue' : 'green'}>{statusOf(a.status)}</Chip>
                  <span className="muted" style={{ fontSize: 11.5, marginLeft: 'auto' }}>{a.when}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }} data-tour="ac-detail">
          {!selected ? (
            <Empty icon="CursorClick" title="Select a request" text="Choose an item on the left to review its details." />
          ) : (
            <div className="stack" style={{ gap: 16 }}>
              <div className="row" style={{ gap: 12 }}>
                <span className="tile" style={{ width: 36, height: 36 }}>{<Icon name="Tray" size={18} />}</span>
                <div className="stack">
                  <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>{selected.title}</span>
                  <span className="muted" style={{ fontSize: 12.5 }}>{selected.subtitle}</span>
                </div>
                {typeof selected.amount === 'number' && <span className="num" style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 600 }}>{money(selected.amount)}</span>}
              </div>
              <div className="divider" />
              <KV rows={selected.detail.map((d) => ({ label: d.label, value: d.value }))} />
              <div className="divider" />
              <div className="stack" style={{ gap: 4 }}>
                <span className="section-title">Decision history</span>
                <div className="row" style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                  <Icon name="Clock" size={14} /> Requested by {selected.requestedBy}
                  <span style={{ marginLeft: 'auto' }}>{selected.when}</span>
                </div>
                {selected.status === 'completed' && (
                  <div className="row" style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                    <Icon name="CheckCircle" size={14} /> Decision recorded
                    <span style={{ marginLeft: 'auto' }}>just now</span>
                  </div>
                )}
              </div>
              {selected.status !== 'completed' && (
                <div className="row" style={{ gap: 8, paddingTop: 6 }}>
                  <Btn primary onClick={() => actions.decideAction(selected.id, true)} icon="Check">Approve</Btn>
                  <Btn onClick={() => actions.decideAction(selected.id, false)} icon="X">Decline</Btn>
                  <Btn ghost onClick={() => window.location.assign(`/platinum/${selected.tab === 'Payments' ? 'payments' : selected.tab === 'Reimbursements' ? 'reimbursements' : selected.tab === 'Cards' ? 'cards' : 'payments/ach-authorizations'}`)}>
                    Open workspace
                  </Btn>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}