import React, { useState } from 'react';
import { Icon, PageHead, Btn, Table, TRow, Th, SearchBox, Chip, Empty, IconBtn } from '../components/ui';
import { useApp, money } from '../store';
import type { Doc } from '../data/types';

export default function DocumentsPage() {
  const { db, actions, toast } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'ALL' | Doc['category']>('ALL');

  const rows = db.documents.filter((d) => (cat === 'ALL' || d.category === cat) && (!q || d.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="panel">
      <PageHead icon="File" title="Entity documents">
        <Btn icon="DownloadSimple" onClick={() => toast('Archive prepared — documents.zip')}>Download all</Btn>
        <Btn primary icon="UploadSimple" onClick={() => actions.uploadDoc(`Uploaded document ${db.documents.length + 1}.pdf`, 'ENTITY')}>Upload</Btn>
      </PageHead>
      <div className="toolbar">
        <div className="row" style={{ gap: 2, background: 'var(--surface-3)', padding: 2, borderRadius: 8 }}>
          {(['ALL', 'ENTITY', 'ACCOUNT', 'CARD', 'TAX'] as const).map((c) => (
            <button key={c} className="btn sm" onClick={() => setCat(c)}
              style={{ border: c === cat ? '1px solid var(--line-2)' : '1px solid transparent', background: c === cat ? 'var(--surface)' : 'transparent', boxShadow: c === cat ? 'var(--shadow-1)' : 'none' }}>
              {c === 'ALL' ? 'All documents' : c === 'ENTITY' ? 'Entity' : c === 'ACCOUNT' ? 'Account statements' : c === 'CARD' ? 'Card exports' : 'Tax'}
            </button>
          ))}
        </div>
        <SearchBox value={q} onChange={setQ} placeholder="Search documents" />
        <div className="right">{rows.length} documents</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {rows.length === 0 ? (
          <Empty icon="File" title="No documents" text="Upload entity documents to keep them in one place." />
        ) : (
          <Table cols="minmax(280px,1.6fr) 150px 100px 100px 140px 90px" head={<><Th>Name</Th><Th>Category</Th><Th>Type</Th><Th>Size</Th><Th>Uploaded</Th><Th /></>}>
            {rows.map((d) => (
              <TRow key={d.id} cols="minmax(280px,1.6fr) 150px 100px 100px 140px 90px">
                <div className="cell">
                  <span className="tile"><Icon name={d.kind === 'CSV' ? 'FileCsv' : 'FilePdf'} size={15} /></span>
                  <span className="title trunc">{d.name}</span>
                </div>
                <span className="chip sm">{d.category === 'ENTITY' ? 'Entity' : d.category === 'ACCOUNT' ? 'Account' : d.category === 'CARD' ? 'Card' : 'Tax'}</span>
                <span className="muted">{d.kind}</span>
                <span className="muted">{d.size}</span>
                <span className="muted">{d.uploaded}</span>
                <div className="right" style={{ gap: 4 }}>
                  <IconBtn name="DownloadSimple" label="Download" onClick={() => toast(`Downloading ${d.name}`)} />
                  <IconBtn name="Eye" label="Preview" onClick={() => toast(`Preview: ${d.name}`)} />
                </div>
              </TRow>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}