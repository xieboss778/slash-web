import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon, PageHead, Btn, Table, TRow, Th, Tabs, Chip, Empty, StatusChip, KV, Drawer, MerchantTile } from '../components/ui';
import { useApp, money } from '../store';
import type { AchAuth } from '../data/types';

export default function AchAuthorizationsPage() {
  const { db, actions, toast } = useApp();
  const [params, setParams] = useSearchParams();
  const tab = params.get('achTab') ?? 'pending';
  const setTab = (t: string) => setParams({ achTab: t });
  const [detail, setDetail] = useState<AchAuth | null>(null);

  const pending = db.achAuths.filter((a) => a.status === 'Pending');
  const decided = db.achAuths.filter((a) => a.status !== 'Pending');
  const rows = tab === 'pending' ? pending : decided;
  const cols = 'minmax(240px,1.4fr) 130px 150px 200px 110px 130px 170px';

  return (
    <div className="panel">
      <PageHead icon="Bank" title="ACH Debits">
        <Btn icon="ShieldWarning" onClick={() => toast('ACH authorization policy: approve debits over $5,000')}>Policy</Btn>
      </PageHead>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'pending', label: 'Pending', count: pending.length },
          { key: 'history', label: 'Decision history', count: decided.length },
        ]}
      />
      <div style={{ flex: 1, overflow: 'auto' }} data-tour="ach-workspace">
        {rows.length === 0 ? (
          <Empty icon="Bank" title="No pending ACH debits" text="Debits that need authorization appear here." />
        ) : (
          <Table
            cols={cols}
            head={<><Th>Originator</Th><Th>Amount</Th><Th>Requested</Th><Th>Account</Th><Th>SEC code</Th><Th>Decision</Th><Th>Actions</Th></>}
          >
            {rows.map((a) => (
              <TRow key={a.id} cols={cols} onClick={() => setDetail(a)}>
                <div className="cell">
                  <MerchantTile name={a.originator} icon="Bank" />
                  <div className="main">
                    <span className="title">{a.originator}</span>
                    <span className="sub">Incoming ACH debit</span>
                  </div>
                </div>
                <span className="num">{money(a.amount)}</span>
                <span className="muted">{a.requested}</span>
                <span className="trunc">{a.account}</span>
                <span className="mono" style={{ fontSize: 12 }}>{a.code}</span>
                <div><StatusChip status={a.status === 'Pending' ? 'Pending' : a.status === 'Approved' ? 'Approved' : 'Declined'} /></div>
                <div className="right" style={{ gap: 6 }} onClick={(e) => e.stopPropagation()}>
                  {a.status === 'Pending' ? (
                    <>
                      <Btn sm primary onClick={() => actions.decideAch(a.id, true)}>Approve</Btn>
                      <Btn sm ghost onClick={() => actions.decideAch(a.id, false)}>Decline</Btn>
                    </>
                  ) : (
                    <span className="muted" style={{ fontSize: 12.5 }}>{a.status} · {a.dueDate}</span>
                  )}
                </div>
              </TRow>
            ))}
          </Table>
        )}
      </div>

      <Drawer open={!!detail} onClose={() => setDetail(null)} title={detail?.originator ?? ''} icon="Bank">
        {detail && (
          <>
            <div className="row" style={{ gap: 10 }}>
              <MerchantTile name={detail.originator} icon="Bank" />
              <div className="stack">
                <span className="num" style={{ fontSize: 20, fontWeight: 600 }}>{money(detail.amount)}</span>
                <span className="muted" style={{ fontSize: 12.5 }}>ACH debit authorization</span>
              </div>
              <StatusChip status={detail.status === 'Pending' ? 'Pending' : detail.status === 'Approved' ? 'Approved' : 'Declined'} />
            </div>
            <div className="divider" />
            <KV
              rows={[
                { label: 'Originator', value: detail.originator },
                { label: 'SEC code', value: detail.code },
                { label: 'Account', value: detail.account },
                { label: 'Requested', value: detail.requested },
                { label: 'Effective date', value: detail.dueDate },
                { label: 'Amount', value: money(detail.amount) },
              ]}
            />
            <div className="divider" />
            <div className="stack" style={{ gap: 6 }}>
              <span className="section-title">Decision history</span>
              <div className="row" style={{ fontSize: 13 }}><Icon name="Clock" size={14} /> Authorization requested<span className="muted" style={{ marginLeft: 'auto' }}>{detail.requested}</span></div>
              {detail.status !== 'Pending' && <div className="row" style={{ fontSize: 13 }}><Icon name="CheckCircle" size={14} /> {detail.status} by Victor Cardenas<span className="muted" style={{ marginLeft: 'auto' }}>just now</span></div>}
            </div>
            {detail.status === 'Pending' && (
              <div className="row" style={{ gap: 8 }}>
                <Btn primary onClick={() => { actions.decideAch(detail.id, true); setDetail(null); }}>Approve debit</Btn>
                <Btn onClick={() => { actions.decideAch(detail.id, false); setDetail(null); }}>Decline</Btn>
              </div>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
}