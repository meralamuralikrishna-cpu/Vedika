import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { CANVAS_H, CANVAS_W } from '@/components/studio/DesignCanvas';
import { ArrowLeft, Check, ClipboardList, Download, Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const STARTER_TASKS = [
  'Confirm venue measurements and placement with the venue',
  'Source or borrow the listed materials',
  'Prepare a setup timeline and assign helpers',
  'Set up the large structures and backdrop first',
  'Add flowers, lighting, fabrics, and finishing details',
  'Check stability, cables, walkways, and fire safety before the event',
  'Photograph the finished setup and pack reusable items after the event',
];

function makePlan(design) {
  const grouped = new Map();
  for (const element of design?.elements ?? []) {
    const key = element.libraryId || `${element.category}-${element.name}`;
    const item = grouped.get(key);
    if (item) { item.designCount += 1; item.quantity += 1; }
    else grouped.set(key, { id: key, name: element.name, category: element.category, quantity: 1, designCount: 1, unit: 'pieces', sourced: false, notes: '' });
  }
  return {
    materials: [...grouped.values()],
    tasks: STARTER_TASKS.map((title, index) => ({ id: `task-${index}`, title, done: false })),
    notes: '',
  };
}

function downloadBuildSheet(design, plan) {
  const venuePlan = design.venuePlan;
  const useFeet = venuePlan?.enabled;
  const widthFt = Math.max(1, Number(venuePlan?.widthFt) || 40);
  const depthFt = Math.max(1, Number(venuePlan?.depthFt) || 28);
  const placements = (design.elements ?? []).map((item, index) => {
    const x = useFeet ? (item.x / CANVAS_W * widthFt).toFixed(1) : Math.round(item.x);
    const y = useFeet ? (item.y / CANVAS_H * depthFt).toFixed(1) : Math.round(item.y);
    const w = useFeet ? (item.width / CANVAS_W * widthFt).toFixed(1) : Math.round(item.width);
    const h = useFeet ? (item.height / CANVAS_H * depthFt).toFixed(1) : Math.round(item.height);
    const unit = useFeet ? 'ft' : 'canvas units';
    return `${index + 1}. ${item.name}: left ${x}, top ${y}, approx. ${w} × ${h} ${unit}`;
  });
  const lines = [
    `VEDIKA EVENT BUILD SHEET`,
    `Design: ${design.name}`,
    `Created: ${new Date().toLocaleDateString()}`,
    '',
    'MATERIALS',
    ...(plan.materials.length ? plan.materials.map((item) => `${item.sourced ? '[x]' : '[ ]'} ${item.quantity} ${item.unit} — ${item.name} (${item.category})${item.notes ? ` | ${item.notes}` : ''}`) : ['No materials listed.']),
    '',
    'PLACEMENT GUIDE (coordinates start at the top-left)',
    ...(placements.length ? placements : ['No elements in the design.']),
    useFeet ? `Hall reference: ${widthFt} × ${depthFt} ft. Element sizes are approximate visual references.` : 'Coordinates use the 800 × 480 illustration canvas; they are not real-world measurements.',
    '',
    'SETUP CHECKLIST',
    ...plan.tasks.map((task) => `${task.done ? '[x]' : '[ ]'} ${task.title}`),
    '',
    'NOTES',
    plan.notes || 'None',
    '',
    'Planning aid only. Verify real measurements, materials, rigging, electrical work, venue rules, and safety requirements before setup.',
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${design.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'vedika'}-build-sheet.txt`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ImplementationPlan() {
  const { designId } = useParams();
  const { designs, saveDesign, canSaveData } = useApp();
  const { toast } = useToast();
  const design = designs.find((item) => item.id === designId);
  const planDesignId = useRef(design?.id);
  const [plan, setPlan] = useState(() => design ? (design.implementationPlan || makePlan(design)) : null);
  const [newMaterial, setNewMaterial] = useState('');
  const [dirty, setDirty] = useState(() => !!design && !design.implementationPlan);

  useEffect(() => {
    if (!design) { setPlan(null); setDirty(false); return; }
    const generated = makePlan(design);
    if (planDesignId.current !== design.id) {
      planDesignId.current = design.id;
      setPlan(design.implementationPlan || generated);
      setDirty(!design.implementationPlan);
      return;
    }
    setPlan((current) => {
      if (!current) return design.implementationPlan || generated;
      const priorById = new Map(current.materials.map((item) => [item.id, item]));
      const materials = generated.materials.map((item) => {
        const prior = priorById.get(item.id);
        if (!prior) return item;
        priorById.delete(item.id);
        const previousCount = prior.designCount || 0;
        return { ...item, ...prior, designCount: item.designCount, quantity: Math.max(0, Number(prior.quantity || 0) + item.designCount - previousCount) };
      });
      // Keep user-added supplies; remove materials no longer present on canvas.
      return { ...current, materials: [...materials, ...[...priorById.values()].filter((item) => item.id.startsWith('custom-'))] };
    });
    setDirty(true);
  }, [design?.id, design?.elements, design?.venuePlan]);

  useEffect(() => {
    if (!dirty) return;
    const warnBeforeLeave = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warnBeforeLeave);
    return () => window.removeEventListener('beforeunload', warnBeforeLeave);
  }, [dirty]);

  const completedTasks = useMemo(() => (plan?.tasks ?? []).filter((task) => task.done).length, [plan]);
  const progress = plan?.tasks.length ? Math.round(completedTasks / plan.tasks.length * 100) : 0;

  if (!design || !plan) return <main className="p-8 max-w-2xl mx-auto text-center"><h1 className="font-display text-3xl text-forest">Design not found</h1><p className="text-sm text-charcoal/60 mt-2">Save a design in My Designs before creating its build sheet.</p><Link to="/designs"><Button className="mt-5">Go to My Designs</Button></Link></main>;

  const changePlan = (updater) => {
    setPlan((current) => updater(current));
    setDirty(true);
  };
  const savePlan = () => {
    saveDesign({ ...design, implementationPlan: plan, updatedAt: new Date().toISOString() });
    setDirty(false);
    toast(canSaveData ? 'Build plan saved to your account' : 'Build plan saved for this session', canSaveData ? 'success' : 'info');
  };
  const addMaterial = (event) => {
    event.preventDefault();
    const name = newMaterial.trim();
    if (!name) return;
    changePlan((current) => ({ ...current, materials: [...current.materials, { id: `custom-${uuid()}`, name, category: 'custom', quantity: 1, unit: 'pieces', sourced: false, notes: '' }] }));
    setNewMaterial('');
  };

  return <div className="p-5 md:p-10 animate-fade-in max-w-5xl mx-auto">
    <Link to="/designs" className="inline-flex items-center gap-2 text-xs font-semibold text-forest hover:text-champagne"><ArrowLeft className="h-4 w-4"/> My Designs</Link>
    <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
      <div><p className="section-kicker">From concept to setup</p><h1 className="font-display text-4xl text-forest tracking-tight">Build plan</h1><p className="text-sm text-charcoal/60 mt-1">{design.name}</p></div>
      <div className="flex gap-2"><Link to={`/studio?design=${encodeURIComponent(design.id)}`}><Button variant="secondary">Edit design</Button></Link><Button variant="secondary" onClick={() => downloadBuildSheet(design, plan)}><Download className="h-4 w-4"/>Download sheet</Button><Button variant="gold" onClick={savePlan} disabled={!dirty}><Check className="h-4 w-4"/>{dirty ? 'Save plan' : 'Saved'}</Button></div>
    </div>

    <div className="mt-6 rounded-2xl border border-champagne/30 bg-champagne/10 p-4 text-sm text-charcoal/75"><strong className="text-forest">Use this plan to organize your own setup.</strong> Material counts start from the number of matching elements in the illustration. Adjust quantities to match the real venue and your needs. This is not a supplier quote or a construction plan.</div>

    <section className="mt-6 rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4"><div><p className="section-kicker">Shopping and sourcing</p><h2 className="font-display text-2xl text-forest">Materials</h2></div><span className="text-xs text-charcoal/55">{plan.materials.filter((item) => item.sourced).length} of {plan.materials.length} sourced</span></div>
      {plan.materials.length === 0 ? <p className="text-sm text-charcoal/55 mb-4">No canvas elements yet. Add décor in Studio or add supplies below.</p> : <><div className="hidden md:grid md:grid-cols-[1fr_100px_125px_1fr_auto] gap-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-charcoal/45"><span>Design element</span><span>Quantity</span><span>Unit</span><span>Notes</span><span>Status</span></div><div className="space-y-3 mb-5">
        {plan.materials.map((item) => <div key={item.id} className="grid md:grid-cols-[1fr_100px_125px_1fr_auto] gap-2 items-center rounded-xl bg-sage/8 border border-sage/20 p-3">
          <div className="min-w-0"><p className="text-sm font-semibold text-forest truncate">{item.name}</p><p className="text-[11px] text-charcoal/50 capitalize">{item.category}{item.designCount > 1 ? ` · ${item.designCount} shown in design` : ''}</p></div>
          <Input aria-label={`Quantity for ${item.name}`} placeholder="Qty" type="number" min="0" value={item.quantity} onChange={(event) => changePlan((current) => ({ ...current, materials: current.materials.map((entry) => entry.id === item.id ? { ...entry, quantity: Math.max(0, Number(event.target.value)) } : entry) }))}/>
          <Input aria-label={`Unit for ${item.name}`} placeholder="Unit" value={item.unit} onChange={(event) => changePlan((current) => ({ ...current, materials: current.materials.map((entry) => entry.id === item.id ? { ...entry, unit: event.target.value } : entry) }))}/>
          <Input aria-label={`Notes for ${item.name}`} placeholder="Color, source, size…" value={item.notes} onChange={(event) => changePlan((current) => ({ ...current, materials: current.materials.map((entry) => entry.id === item.id ? { ...entry, notes: event.target.value } : entry) }))}/>
          <label className="inline-flex items-center justify-center gap-1.5 text-xs text-forest"><input type="checkbox" checked={item.sourced} onChange={(event) => changePlan((current) => ({ ...current, materials: current.materials.map((entry) => entry.id === item.id ? { ...entry, sourced: event.target.checked } : entry) }))}/> Sourced</label>
        </div>)}
      </div></>}
      <form onSubmit={addMaterial} className="flex gap-2"><Input aria-label="Add a material" placeholder="Add another material or supply" value={newMaterial} onChange={(event) => setNewMaterial(event.target.value)}/><Button type="submit" variant="secondary" disabled={!newMaterial.trim()}><Plus className="h-4 w-4"/>Add</Button></form>
    </section>

    <section className="mt-5 rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-6 shadow-sm"><p className="section-kicker">From the canvas</p><h2 className="font-display text-2xl text-forest mb-3">Placement guide</h2><p className="text-xs text-charcoal/55 mb-3">Positions start from the top-left. {design.venuePlan?.enabled ? `The floor plan is ${design.venuePlan.widthFt} × ${design.venuePlan.depthFt} ft; sizes shown are approximate.` : 'Canvas coordinates are for reference only and do not represent real-world measurements.'}</p><ul className="grid sm:grid-cols-2 gap-2">{design.elements.map((element, index) => <li key={element.id} className="rounded-lg bg-sage/8 px-3 py-2 text-xs text-charcoal/75"><strong className="text-forest">{index + 1}. {element.name}</strong><br/>{design.venuePlan?.enabled ? `${(element.x / CANVAS_W * (design.venuePlan.widthFt || 40)).toFixed(1)} ft from left · ${(element.y / CANVAS_H * (design.venuePlan.depthFt || 28)).toFixed(1)} ft from top` : `Canvas x ${Math.round(element.x)} · y ${Math.round(element.y)}`}</li>)}</ul>{design.elements.length === 0 && <p className="text-sm text-charcoal/55">Add elements to your design to create a placement guide.</p>}</section>

    <section className="mt-5 rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4"><div><p className="section-kicker">Setup steps</p><h2 className="font-display text-2xl text-forest">Checklist</h2></div><span className="text-sm font-semibold text-forest">{progress}%</span></div>
      <div className="h-2 rounded-full bg-sage/15 mb-4 overflow-hidden"><div className="h-full rounded-full bg-forest transition-all" style={{ width: `${progress}%` }}/></div>
      <ul className="space-y-2">{plan.tasks.map((task) => <li key={task.id} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-sage/8"><input className="mt-1 accent-forest" type="checkbox" checked={task.done} onChange={(event) => changePlan((current) => ({ ...current, tasks: current.tasks.map((entry) => entry.id === task.id ? { ...entry, done: event.target.checked } : entry) }))}/><input className={`flex-1 bg-transparent text-sm outline-none ${task.done ? 'line-through text-charcoal/45' : 'text-charcoal'}`} aria-label="Checklist task" value={task.title} onChange={(event) => changePlan((current) => ({ ...current, tasks: current.tasks.map((entry) => entry.id === task.id ? { ...entry, title: event.target.value } : entry) }))}/><button type="button" aria-label={`Remove ${task.title}`} className="text-charcoal/35 hover:text-red-700" onClick={() => changePlan((current) => ({ ...current, tasks: current.tasks.filter((entry) => entry.id !== task.id) }))}><Trash2 className="h-4 w-4"/></button></li>)}</ul>
      <AddTask onAdd={(title) => changePlan((current) => ({ ...current, tasks: [...current.tasks, { id: `task-${uuid()}`, title, done: false }] }))}/>
    </section>

    <section className="mt-5 rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-6 shadow-sm"><div className="flex items-center gap-2 mb-3"><ClipboardList className="h-4 w-4 text-champagne"/><h2 className="font-display text-xl text-forest">Event notes</h2></div><textarea className="w-full min-h-28 rounded-xl border border-sage/35 bg-white px-3 py-2 text-sm outline-none focus:border-champagne" placeholder="Venue access, setup timing, people helping, storage, reminders…" value={plan.notes} onChange={(event) => changePlan((current) => ({ ...current, notes: event.target.value }))}/></section>
    <p className="text-[11px] leading-relaxed text-charcoal/45 mt-5">Verify measurements, load limits, electrical work, flame use, accessibility, and venue rules with qualified people before setup.</p>
  </div>;
}

function AddTask({ onAdd }) {
  const [title, setTitle] = useState('');
  return <form className="flex gap-2 mt-4" onSubmit={(event) => { event.preventDefault(); if (title.trim()) { onAdd(title.trim()); setTitle(''); } }}><Input aria-label="Add a checklist task" placeholder="Add a setup task" value={title} onChange={(event) => setTitle(event.target.value)}/><Button type="submit" variant="secondary" disabled={!title.trim()}><Plus className="h-4 w-4"/>Task</Button></form>;
}
