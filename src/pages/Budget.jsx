import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { ArrowLeft, ExternalLink, IndianRupee, Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/Modal';
import {
  budgetAllocated,
  budgetCategoryTotal,
  designPlanEstimate,
} from '@/lib/budget';
import { formatINR, cn } from '@/lib/utils';
import { t } from '@/lib/i18n';

const DEFAULT_CATEGORIES = [
  { name: 'Flowers', amount: '' },
  { name: 'Lighting', amount: '' },
  { name: 'Setup & labor', amount: '' },
];

function emptyDraft() {
  return {
    id: null,
    name: '',
    currency: 'INR',
    totalBudget: '',
    moodboardId: '',
    designIds: [],
    categories: DEFAULT_CATEGORIES.map((item) => ({ id: uuid(), ...item })),
    notes: '',
  };
}

function toDraft(budget) {
  return {
    id: budget.id,
    name: budget.name ?? '',
    currency: budget.currency || 'INR',
    totalBudget: budget.totalBudget === 0 || budget.totalBudget ? budget.totalBudget : '',
    moodboardId: budget.moodboardId ?? '',
    designIds: [...(budget.designIds ?? [])],
    categories: (budget.categories?.length
      ? budget.categories
      : DEFAULT_CATEGORIES.map((item) => ({ id: uuid(), ...item }))
    ).map((item) => ({
      id: item.id || uuid(),
      name: item.name ?? '',
      amount: item.amount === 0 || item.amount ? item.amount : '',
    })),
    notes: budget.notes ?? '',
  };
}

function formatMoney(amount, currency = 'INR') {
  if (currency === 'INR') return formatINR(amount);
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function Budget() {
  const {
    budgets,
    designs,
    moodboards,
    saveBudget,
    deleteBudget,
    canSaveData,
    locale,
  } = useApp();
  const { toast } = useToast();
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const sorted = useMemo(
    () => [...budgets].sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0) - new Date(a.updatedAt ?? a.createdAt ?? 0)),
    [budgets],
  );

  const openCreate = () => setEditing(emptyDraft());
  const openEdit = (budget) => setEditing(toDraft(budget));

  const applyMoodboard = (draft, moodboardId) => {
    const board = moodboards.find((item) => item.id === moodboardId);
    if (!board) {
      return { ...draft, moodboardId: '' };
    }
    const next = {
      ...draft,
      moodboardId,
      designIds: [...new Set([...(draft.designIds ?? []), ...(board.designIds ?? [])])],
    };
    if ((draft.totalBudget === '' || draft.totalBudget == null) && board.budget) {
      next.totalBudget = Number(board.budget) || '';
    }
    if (!draft.name.trim()) {
      next.name = `${board.name || board.title || 'Event'} budget`;
    }
    return next;
  };

  const saveDraft = (event) => {
    event.preventDefault();
    if (!editing) return;
    const name = editing.name.trim();
    if (!name) {
      toast('Give this budget a name', 'error');
      return;
    }
    const now = new Date().toISOString();
    const existing = editing.id ? budgets.find((item) => item.id === editing.id) : null;
    const totalRaw = editing.totalBudget;
    saveBudget({
      id: existing?.id ?? uuid(),
      name,
      currency: editing.currency || 'INR',
      totalBudget: totalRaw === '' ? '' : Math.max(0, Number(totalRaw) || 0),
      moodboardId: editing.moodboardId || null,
      designIds: [...new Set(editing.designIds)],
      categories: editing.categories
        .filter((item) => item.name.trim() || item.amount !== '')
        .map((item) => ({
          id: item.id || uuid(),
          name: item.name.trim() || 'Category',
          amount: item.amount === '' ? '' : Math.max(0, Number(item.amount) || 0),
        })),
      notes: editing.notes.trim(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
    setEditing(null);
    toast(canSaveData ? 'Budget saved to your account' : 'Budget saved for this session', canSaveData ? 'success' : 'info');
  };

  if (editing) {
    return (
      <BudgetEditor
        draft={editing}
        setDraft={setEditing}
        designs={designs}
        moodboards={moodboards}
        locale={locale}
        onCancel={() => setEditing(null)}
        onSave={saveDraft}
        onMoodboardChange={(moodboardId) => setEditing((current) => applyMoodboard(current, moodboardId))}
      />
    );
  }

  return (
    <div className="p-5 md:p-10 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Plan your spend</p>
          <h1 className="font-display text-4xl text-forest tracking-tight">{t(locale, 'budget')}</h1>
          <p className="text-sm text-charcoal/60 mt-1 max-w-xl">
            Set a total, add category lines, and roll up illustrative estimates from linked design build plans.
          </p>
        </div>
        <Button variant="gold" onClick={openCreate}><Plus className="h-4 w-4"/>New budget</Button>
      </div>

      <div className="mt-6 rounded-2xl border border-champagne/30 bg-champagne/10 p-4 text-sm text-charcoal/75">
        <strong className="text-forest">Illustrative planning only.</strong> Amounts you enter — and costs from build plans — are planning figures, not supplier quotes or payments.
      </div>

      {sorted.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No budgets yet"
            description="Create a budget to track an event total against category lines and design material estimates."
            action={<Button onClick={openCreate}><Plus className="h-4 w-4"/>Create budget</Button>}
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {sorted.map((budget) => {
            const total = Number(budget.totalBudget) || 0;
            const allocated = budgetAllocated(budget, designs);
            const remaining = total - allocated;
            const pct = total > 0 ? Math.min(100, Math.round((allocated / total) * 100)) : 0;
            const currency = budget.currency || 'INR';
            const board = moodboards.find((item) => item.id === budget.moodboardId);
            return (
              <article key={budget.id} className="rounded-2xl border border-sage/30 bg-white/75 p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl text-forest">{budget.name}</h2>
                    <p className="text-xs text-charcoal/55 mt-1">
                      {budget.designIds?.length || 0} linked design{(budget.designIds?.length || 0) === 1 ? '' : 's'}
                      {board ? ` · ${board.name || board.title}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(budget)}>Edit</Button>
                    <Button size="sm" variant="ghost" aria-label={`Delete ${budget.name}`} onClick={() => setDeleteId(budget.id)}>
                      <Trash2 className="h-4 w-4 text-charcoal/50"/>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 grid sm:grid-cols-3 gap-3">
                  <SummaryStat label="Total" value={total > 0 ? formatMoney(total, currency) : '—'} />
                  <SummaryStat label="Allocated" value={formatMoney(allocated, currency)} />
                  <SummaryStat
                    label="Remaining"
                    value={total > 0 ? formatMoney(remaining, currency) : '—'}
                    tone={total > 0 && remaining < 0 ? 'over' : 'default'}
                  />
                </div>
                {total > 0 && (
                  <div className="mt-4">
                    <div className="h-2 rounded-full bg-sage/15 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', remaining < 0 ? 'bg-red-600' : 'bg-forest')}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-charcoal/50 mt-1.5">{pct}% of total allocated</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this budget?"
        message={t(locale, 'confirmDelete')}
        confirmLabel={t(locale, 'delete')}
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteBudget(deleteId);
          setDeleteId(null);
          toast('Budget deleted', 'info');
        }}
      />
    </div>
  );
}

function SummaryStat({ label, value, tone = 'default' }) {
  return (
    <div className="rounded-xl bg-sage/8 border border-sage/20 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/45">{label}</p>
      <p className={cn('mt-1 text-lg font-semibold tabular-nums', tone === 'over' ? 'text-red-700' : 'text-forest')}>{value}</p>
    </div>
  );
}

function BudgetEditor({ draft, setDraft, designs, moodboards, locale, onCancel, onSave, onMoodboardChange }) {
  const manualTotal = budgetCategoryTotal(draft.categories);
  const designBreakdown = (draft.designIds ?? []).map((id) => {
    const design = designs.find((item) => item.id === id);
    return {
      id,
      name: design?.name || 'Missing design',
      estimate: designPlanEstimate(design),
      exists: !!design,
    };
  });
  const designTotal = designBreakdown.reduce((sum, item) => sum + item.estimate, 0);
  const allocated = manualTotal + designTotal;
  const total = Number(draft.totalBudget) || 0;
  const remaining = total - allocated;
  const pct = total > 0 ? Math.min(100, Math.round((allocated / total) * 100)) : 0;
  const currency = draft.currency || 'INR';

  const toggleDesign = (id) => {
    setDraft((current) => {
      const has = current.designIds.includes(id);
      return {
        ...current,
        designIds: has ? current.designIds.filter((entry) => entry !== id) : [...current.designIds, id],
      };
    });
  };

  const updateCategory = (id, patch) => {
    setDraft((current) => ({
      ...current,
      categories: current.categories.map((item) => item.id === id ? { ...item, ...patch } : item),
    }));
  };

  return (
    <div className="p-5 md:p-10 animate-fade-in max-w-5xl mx-auto">
      <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 text-xs font-semibold text-forest hover:text-champagne">
        <ArrowLeft className="h-4 w-4"/> Back to budgets
      </button>

      <form onSubmit={onSave} className="mt-5 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Event budget</p>
            <h1 className="font-display text-4xl text-forest tracking-tight">{draft.id ? 'Edit budget' : 'New budget'}</h1>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>{t(locale, 'cancel')}</Button>
            <Button type="submit" variant="gold">{t(locale, 'save')}</Button>
          </div>
        </div>

        <section className="rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-6 shadow-sm space-y-4">
          <div className="grid md:grid-cols-[1.4fr_140px_1fr] gap-3">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/45">Name</span>
              <Input className="mt-1.5" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Meera wedding décor" required />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/45">Currency</span>
              <select
                className="mt-1.5 w-full h-10 rounded-xl border border-sage/35 bg-white px-3 text-sm outline-none focus:border-champagne"
                value={draft.currency}
                onChange={(event) => setDraft((current) => ({ ...current, currency: event.target.value }))}
              >
                <option value="INR">INR · ₹</option>
                <option value="USD">USD · $</option>
                <option value="EUR">EUR · €</option>
                <option value="GBP">GBP · £</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/45">Total budget</span>
              <Input
                className="mt-1.5"
                type="number"
                min="0"
                step="1"
                value={draft.totalBudget}
                onChange={(event) => setDraft((current) => ({ ...current, totalBudget: event.target.value === '' ? '' : Math.max(0, Number(event.target.value)) }))}
                placeholder="Optional"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/45">Link moodboard</span>
            <select
              className="mt-1.5 w-full h-10 rounded-xl border border-sage/35 bg-white px-3 text-sm outline-none focus:border-champagne"
              value={draft.moodboardId}
              onChange={(event) => onMoodboardChange(event.target.value)}
            >
              <option value="">None</option>
              {moodboards.map((board) => (
                <option key={board.id} value={board.id}>{board.name || board.title || 'Untitled moodboard'}</option>
              ))}
            </select>
            <span className="mt-1 block text-[11px] text-charcoal/50">Choosing a moodboard adds its linked designs and can seed the total from the moodboard estimate.</span>
          </label>
        </section>

        <section className="rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <p className="section-kicker">Summary</p>
              <h2 className="font-display text-2xl text-forest">{t(locale, 'illustrativeEstimate')}</h2>
            </div>
            <IndianRupee className="h-5 w-5 text-champagne"/>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <SummaryStat label="Total" value={total > 0 ? formatMoney(total, currency) : '—'} />
            <SummaryStat label="Allocated" value={formatMoney(allocated, currency)} />
            <SummaryStat
              label="Remaining"
              value={total > 0 ? formatMoney(remaining, currency) : '—'}
              tone={total > 0 && remaining < 0 ? 'over' : 'default'}
            />
          </div>
          {total > 0 && (
            <div className="mt-4">
              <div className="h-2 rounded-full bg-sage/15 overflow-hidden">
                <div className={cn('h-full rounded-full transition-all', remaining < 0 ? 'bg-red-600' : 'bg-forest')} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[11px] text-charcoal/50 mt-1.5">
                Manual {formatMoney(manualTotal, currency)} · Designs {formatMoney(designTotal, currency)}
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="section-kicker">Manual lines</p>
              <h2 className="font-display text-2xl text-forest">Categories</h2>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setDraft((current) => ({
                ...current,
                categories: [...current.categories, { id: uuid(), name: '', amount: '' }],
              }))}
            >
              <Plus className="h-3.5 w-3.5"/>Add line
            </Button>
          </div>
          <div className="space-y-3">
            {draft.categories.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_140px_auto] gap-2 items-center">
                <Input
                  aria-label="Category name"
                  placeholder="Category"
                  value={item.name}
                  onChange={(event) => updateCategory(item.id, { name: event.target.value })}
                />
                <Input
                  aria-label={`Amount for ${item.name || 'category'}`}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(event) => updateCategory(item.id, { amount: event.target.value === '' ? '' : Math.max(0, Number(event.target.value)) })}
                />
                <button
                  type="button"
                  aria-label={`Remove ${item.name || 'category'}`}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-charcoal/40 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setDraft((current) => ({ ...current, categories: current.categories.filter((entry) => entry.id !== item.id) }))}
                >
                  <Trash2 className="h-4 w-4"/>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-6 shadow-sm">
          <div className="mb-4">
            <p className="section-kicker">From build plans</p>
            <h2 className="font-display text-2xl text-forest">Linked designs</h2>
            <p className="text-xs text-charcoal/55 mt-1">Rolls up unit costs × quantities from each design’s build plan.</p>
          </div>
          {designs.length === 0 ? (
            <p className="text-sm text-charcoal/55">Save a design first, then add unit costs on its build plan.</p>
          ) : (
            <div className="space-y-2">
              {designs.map((design) => {
                const estimate = designPlanEstimate(design);
                const checked = draft.designIds.includes(design.id);
                return (
                  <label key={design.id} className={cn('flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors', checked ? 'border-champagne/50 bg-champagne/10' : 'border-sage/20 bg-sage/5 hover:bg-sage/10')}>
                    <input type="checkbox" checked={checked} onChange={() => toggleDesign(design.id)} className="accent-forest"/>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-forest truncate">{design.name}</span>
                      <span className="block text-[11px] text-charcoal/50">
                        {estimate > 0 ? `${t(locale, 'illustrativeEstimate')} · ${formatMoney(estimate, currency)}` : 'No costs on build plan yet'}
                      </span>
                    </span>
                    <Link
                      to={`/designs/${encodeURIComponent(design.id)}/plan`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:text-champagne"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Plan <ExternalLink className="h-3 w-3"/>
                    </Link>
                  </label>
                );
              })}
            </div>
          )}

          {designBreakdown.length > 0 && (
            <ul className="mt-4 space-y-1.5 border-t border-sage/20 pt-4">
              {designBreakdown.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className={cn('truncate', item.exists ? 'text-charcoal/75' : 'text-charcoal/40 line-through')}>{item.name}</span>
                  <span className="tabular-nums font-medium text-forest">{item.estimate > 0 ? formatMoney(item.estimate, currency) : '—'}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-6 shadow-sm">
          <h2 className="font-display text-xl text-forest mb-3">Notes</h2>
          <textarea
            className="w-full min-h-28 rounded-xl border border-sage/35 bg-white px-3 py-2 text-sm outline-none focus:border-champagne"
            placeholder="Vendor conversations, payment milestones, contingency…"
            value={draft.notes}
            onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
          />
        </section>
      </form>
    </div>
  );
}
