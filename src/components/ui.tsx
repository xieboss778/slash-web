import React, { useEffect, useMemo, useRef, useState, createContext, useContext } from 'react';
import * as Phosphor from '@phosphor-icons/react';
import icons from '../data/icons.json';

/* ── Icons ─────────────────────────────────────────────────────────────── */
export function Icon({ name, size = 18, weight = 'regular', color, style }: { name: string; size?: number; weight?: any; color?: string; style?: React.CSSProperties }) {
  const Cmp = (Phosphor as any)[name] || (Phosphor as any).Circle;
  return <Cmp size={size} weight={weight} color={color} style={style} />;
}

const slashIcon = (icons as any)['SlashLogoSymbol'];
export function SlashMark({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg viewBox={slashIcon?.viewBox ?? '0 0 16 16'} width={size} height={size} fill={color} style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: slashIcon?.body ?? '' }} />
  );
}

/* ── Buttons ───────────────────────────────────────────────────────────── */
export function Btn({
  children, onClick, primary, ghost, sm, danger, icon, iconRight, disabled, block, type = 'button', title,
}: any) {
  const cls = ['btn', primary && 'primary', ghost && 'ghost', sm && 'sm', danger && 'danger', block && 'block'].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} title={title}>
      {icon && <Icon name={icon} size={sm ? 14 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sm ? 14 : 16} />}
    </button>
  );
}

export function IconBtn({ name, onClick, label, size = 16, danger }: any) {
  return (
    <button type="button" className="icon-btn" onClick={onClick} aria-label={label} title={label} style={danger ? { color: 'var(--red-11)' } : undefined}>
      <Icon name={name} size={size} />
    </button>
  );
}

export function Pill({ children, icon, onClick, on, title }: any) {
  return (
    <button type="button" className={`pill-btn${on ? ' on' : ''}`} onClick={onClick} title={title}>
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  );
}

export function Chip({ children, tone, icon, sm }: { children?: React.ReactNode; tone?: 'gold' | 'green' | 'red' | 'blue' | 'gold-outline'; icon?: string; sm?: boolean }) {
  return (
    <span className={`chip${tone ? ' ' + tone : ''}${sm ? ' sm' : ''}`}>
      {icon && <Icon name={icon} size={sm ? 12 : 13} />}
      {children}
    </span>
  );
}

/* ── Layout ────────────────────────────────────────────────────────────── */
export function PageHead({ icon, title, children, sub }: any) {
  return (
    <div className="head">
      <h1>
        {icon && <Icon name={icon} size={20} />}
        {title}
        {sub}
      </h1>
      <div className="head-actions">{children}</div>
    </div>
  );
}

export function Tabs({ tabs, value, onChange }: { tabs: { key: string; label: string; count?: number; icon?: string }[]; value: string; onChange: (k: string) => void }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button key={t.key} className={`tab${t.key === value ? ' active' : ''}`} onClick={() => onChange(t.key)}>
          {t.icon && <Icon name={t.icon} size={18} />}
          {t.label}
          {typeof t.count === 'number' && t.count > 0 && <span className="count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = 'Search' }: any) {
  return (
    <div className="search">
      <Icon name="MagnifyingGlass" size={15} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function Select({ value, onChange, options, placeholder }: { value?: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div className="select">
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Icon name="CaretDown" size={14} />
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="row" style={{ gap: 8, cursor: 'pointer' }}>
      <span className={`switch${on ? ' on' : ''}`} onClick={() => onChange(!on)} role="switch" aria-checked={on} />
      {label && <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{label}</span>}
    </label>
  );
}

/* ── Table ─────────────────────────────────────────────────────────────── */
export function Table({ cols, head, children, style }: { cols: string; head: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="table" style={{ ['--cols' as any]: cols, ...style }}>
      <div className="thead" style={{ gridTemplateColumns: cols }}>
        {head}
      </div>
      <div className="tbody">{children}</div>
    </div>
  );
}

export function TRow({ children, onClick, selected, cols, style }: any) {
  return (
    <div className={`trow${selected ? ' selected' : ''}`} style={{ gridTemplateColumns: cols, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

export function DateRow({ label }: { label: string }) {
  return (
    <div className="date-row">
      <span className="date-chip">{label}</span>
    </div>
  );
}

export function Th({ children, sort, onSort, icon }: any) {
  return (
    <div className={onSort ? 'sortable' : ''} onClick={onSort}>
      <span className="trunc">{children}</span>
      {sort && <Icon name={sort === 'asc' ? 'CaretUp' : 'CaretDown'} size={12} />}
      {icon && <Icon name={icon} size={13} />}
    </div>
  );
}

/* ── Money / avatars ───────────────────────────────────────────────────── */
export function Amount({ value, signed, muted, size }: { value: number; signed?: boolean; muted?: boolean; size?: number }) {
  const pos = value > 0;
  const text = `${pos && signed ? '+' : value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return <span className={`num${pos ? ' pos' : ''}`} style={{ color: muted ? 'var(--ink-3)' : pos ? 'var(--green-11)' : 'var(--ink)', fontSize: size }}>{text}</span>;
}

export function Avatar({ label, tone, icon, sq, size = 28 }: { label?: string; tone?: 'gold' | 'green'; icon?: string; sq?: boolean; size?: number }) {
  return (
    <span className={`avatar${sq ? ' sq' : ''}${tone ? ' ' + tone : ''}`} style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {icon ? <Icon name={icon} size={size * 0.52} /> : label}
    </span>
  );
}

export function MerchantTile({ name, icon, tone }: { name: string; icon?: string; tone?: 'gold' | 'green' }) {
  const initials = name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return <span className={`tile merchant${tone ? ' ' + tone : ''}`}>{icon ? <Icon name={icon} size={15} /> : name.startsWith('$') ? name : initials}</span>;
}

/* ── Overlays ──────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, icon, children, footer, wide }: any) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true">
        <div className="modal-head">
          {icon && <span className="tile">{<Icon name={icon} size={16} />}</span>}
          <h2>{title}</h2>
          <IconBtn name="X" label="Close" onClick={onClose} />
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, icon, children, footer, wide }: any) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="backdrop right" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`drawer${wide ? ' wide' : ''}`} role="dialog" aria-modal="true">
        <div className="modal-head">
          {icon && <span className="tile">{<Icon name={icon} size={16} />}</span>}
          <h2>{title}</h2>
          <IconBtn name="X" label="Close" onClick={onClose} />
        </div>
        <div className="modal-body" style={{ flex: 1 }}>{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export type MenuItem = { label?: string; icon?: string; onClick?: () => void; danger?: boolean; sep?: boolean; disabled?: boolean };

export function Menu({ items, children, align = 'right' }: { items: MenuItem[]; children?: React.ReactNode; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <span onClick={() => setOpen((v) => !v)} style={{ display: 'inline-flex' }}>
        {children}
      </span>
      {open && (
        <div className="menu" style={{ top: 'calc(100% + 6px)', [align]: 0 }}>
          {items.map((it, i) =>
            it.sep ? (
              <div className="menu-sep" key={i} />
            ) : it.label && !it.onClick && !it.icon ? (
              <div className="menu-label" key={i}>{it.label}</div>
            ) : (
              <div
                key={i}
                className={`menu-item${it.danger ? ' danger' : ''}`}
                onClick={() => {
                  if (it.disabled) return;
                  setOpen(false);
                  it.onClick?.();
                }}
                style={it.disabled ? { opacity: 0.4, cursor: 'default' } : undefined}
              >
                {it.icon && <Icon name={it.icon} size={16} />}
                {it.label}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export function Empty({ icon = 'Tray', title, text }: { icon?: string; title: string; text?: string }) {
  return (
    <div className="empty">
      <Icon name={icon} size={28} />
      <strong>{title}</strong>
      {text && <span style={{ fontSize: 13 }}>{text}</span>}
    </div>
  );
}

/* ── Chart ─────────────────────────────────────────────────────────────── */
export function AreaChart({
  series, labels, height = 260, format = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`, zeroBaseline = false,
}: {
  series: { values: number[]; color: string; fill: string; stroke: string }[];
  labels: string[];
  height?: number;
  format?: (n: number) => string;
  zeroBaseline?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const W = 1000;
  const H = 260;
  const padT = 12;
  const padB = 26;
  const n = series[0]?.values.length ?? 0;
  const all = series.flatMap((s) => s.values);
  const max = Math.max(...all);
  const min = zeroBaseline ? 0 : Math.min(...all);
  const span = max - min || 1;
  const x = (i: number) => (i / Math.max(1, n - 1)) * W;
  const y = (v: number) => padT + (1 - (v - min) / span) * (H - padT - padB);

  const pathFor = (values: number[], close: boolean) => {
    const line = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
    if (!close) return line;
    return `${line} L${W},${H - padB} L0,${H - padB} Z`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        className="chart"
        ref={ref}
        style={{ height }}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const p = (e.clientX - r.left) / r.width;
          setHover(Math.min(n - 1, Math.max(0, Math.round(p * (n - 1)))));
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            {series.map((s, i) => (
              <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.fill} stopOpacity={0.4} />
                <stop offset="100%" stopColor={s.fill} stopOpacity={0.04} />
              </linearGradient>
            ))}
          </defs>
          {series.map((s, i) => (
            <g key={i}>
              <path d={pathFor(s.values, true)} fill={`url(#grad-${i})`} stroke="none" />
              <path d={pathFor(s.values, false)} fill="none" stroke={s.stroke} strokeWidth={1.8} vectorEffect="non-scaling-stroke" />
            </g>
          ))}
          {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke="var(--line)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />}
          {hover !== null &&
            series.map((s, i) => (
              <circle key={i} cx={x(hover)} cy={y(s.values[hover])} r={3.2} fill={s.stroke} stroke="#fff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            ))}
        </svg>
        {hover !== null && series[0] && (
          <div className="tooltip" style={{ left: `${(hover / Math.max(1, n - 1)) * 100}%`, top: `${(y(series[0].values[hover]) / H) * height}px` }}>
            <div style={{ opacity: 0.7, marginBottom: 2 }}>{labels[hover] ?? ''}</div>
            {series.map((s, i) => (
              <div key={i} className="t-val">
                {format(s.values[hover])}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: 'relative', height: 18, marginTop: 2, fontSize: 12.5, color: 'var(--ink-4)' }}>
        {labels.map((l, i) =>
          l ? (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${(i / Math.max(1, labels.length - 1)) * 100}%`,
                transform: i === 0 ? 'translateX(0)' : i === labels.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                whiteSpace: 'nowrap',
              }}
            >
              {l}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}

export function KV({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="kv">
      {rows.map((r, i) => (
        <React.Fragment key={i}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

export function StatusChip({ status }: { status: string }) {
  const map: Record<string, 'gold' | 'green' | 'red' | 'blue'> = {
    'Needs your approval': 'gold', 'Waiting on approver': 'gold', 'Pending approval': 'gold', Draft: 'gold', 'Needs review': 'gold',
    'Pending': 'gold', Scheduled: 'blue', 'Ready to sync': 'blue', Viewed: 'blue', Invited: 'gold', 'Partially paid': 'gold',
    Paid: 'green', Sent: 'green', Active: 'green', Approved: 'green', 'Payment complete': 'green', Synced: 'green', Qualified: 'green', Succeeded: 'green', Verified: 'green',
    Failed: 'red', Declined: 'red', Rejected: 'red', Overdue: 'red', 'Payment failed': 'red', Suspended: 'red', Cancelled: 'red',
  };
  return <Chip tone={map[status] ?? 'gold'}>{status}</Chip>;
}