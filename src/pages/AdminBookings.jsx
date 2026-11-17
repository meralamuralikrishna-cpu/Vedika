import { useMemo, useState } from 'react';
import { Download, Eye, MessageSquareText, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { DesignCanvas } from '@/components/studio/DesignCanvas';
import SceneView from '@/studio/SceneView';
import { formatDate, cn } from '@/lib/utils';

const STATUS_LABEL = { pending: 'Pending', under_review: 'Under Review', changes_requested: 'Changes Requested', approved: 'Approved', rejected: 'Rejected' };
const STATUS_STYLE = { pending: 'bg-champagne/25 text-charcoal', under_review: 'bg-blue-100 text-blue-900', changes_requested: 'bg-amber-100 text-amber-900', approved: 'bg-sage/40 text-forest', rejected: 'bg-red-100 text-red-800' };
const STATUS_FILTERS = ['all', 'pending', 'under_review', 'changes_requested', 'approved', 'rejected'];

function ReviewSection({ title, children }) {
  return <section className="rounded-xl border border-sage/25 bg-white/75 p-4 md:p-5"><h3 className="mb-3 font-display text-lg text-forest">{title}</h3>{children}</section>;
}
function DetailLine({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return <div className="min-w-0"><dt className="text-[9px] font-semibold uppercase tracking-wider text-charcoal/45">{label}</dt><dd className="mt-1 break-words text-xs leading-relaxed text-charcoal/80">{value}</dd></div>;
}
function DetailGrid({ children }) { return <dl className="grid gap-x-5 gap-y-3 sm:grid-cols-2">{children}</dl>; }

function downloadBrief(booking) {
  const details = booking.eventDetails ?? {};
  const snapshot = booking.designSnapshot ?? {};
  const lines = [
    'EVENT BRIEF', `Request ID: ${booking.id}`, `Customer: ${booking.requesterName || 'Not provided'}`,
    `Email: ${booking.requesterEmail || 'Not provided'}`, `Occasion: ${booking.eventType || 'Not provided'}`,
    `Date: ${booking.eventDate || 'Not provided'}`, `Time: ${details.eventTime || 'Not provided'}`,
    `Venue / city: ${booking.venue || 'Not provided'}`, `Guests: ${details.guestCount || 'Not provided'}`,
    `Setting: ${details.setting || 'Not provided'}`, '', 'SELECTED DESIGN',
    `Name: ${snapshot.name || booking.designName || 'None'}`, `Design ID: ${snapshot.designId || booking.designId || 'None'}`,
    `Categories: ${(snapshot.decorationCategories ?? []).join(', ') || 'Not provided'}`,
    `Design colors: ${(snapshot.colors ?? []).join(', ') || 'Not provided'}`, `Design style: ${snapshot.style || 'Not provided'}`,
    '', 'DECORATION PREFERENCES', `Services: ${(details.services ?? []).join(', ') || 'Not provided'}`,
    `Preferred style: ${details.style || 'Not provided'}`, `Preferred colors: ${(details.colors ?? []).join(', ') || 'Not provided'}`,
    '', 'BUDGET', `Amount: ${details.budgetAmount ? `${details.budgetCurrency || 'INR'} ${details.budgetAmount}` : 'Not provided'}`,
    `Includes: ${details.budgetScope || 'Not provided'}`, '', 'VENUE REQUIREMENTS',
    `Access / setup: ${details.accessTime || 'Not provided'}`, `Restrictions: ${details.venueRestrictions || 'Not provided'}`,
    `Accessibility: ${details.accessibility || 'Not provided'}`, `Contact preference: ${details.contactPreference || 'Not provided'}`,
    `Contact details: ${details.contactDetails || 'Not provided'}`, '', 'ADDITIONAL REQUIREMENTS', details.requirements || booking.notes || 'None',
  ];
  const brief = lines.join('\n');
  const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${(booking.eventType || 'event').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${booking.id.slice(0, 8)}-brief.txt`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function AdminBookings() {
  const { isAdmin, bookings, setBookingStatus } = useApp();
  const { toast } = useToast();
  const [decisionNotes, setDecisionNotes] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showFullDesign, setShowFullDesign] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const selectedBooking = bookings.find((booking) => booking.id === selectedId) ?? null;
  const visibleBookings = useMemo(() => bookings.filter((booking) => {
    if (filter !== 'all' && booking.status !== filter) return false;
    const search = query.trim().toLowerCase();
    if (!search) return true;
    return `${booking.requesterName ?? ''} ${booking.requesterEmail ?? ''} ${booking.eventType ?? ''} ${booking.venue ?? ''} ${booking.designName ?? ''}`.toLowerCase().includes(search);
  }), [bookings, filter, query]);

  if (!isAdmin) return <div className="p-6 md:p-10 max-w-3xl mx-auto"><p className="section-kicker mb-2">Administration</p><h1 className="font-display text-4xl text-forest tracking-tight">Admin access required</h1><p className="mt-3 text-sm text-charcoal/65">This account does not have the trusted admin role. Set <code>app_metadata.role</code> to <code>admin</code> in Supabase, then sign out and sign back in.</p><Link to="/" className="mt-5 inline-flex text-sm font-semibold text-forest underline decoration-champagne/70">Return to workspace</Link></div>;

  const decide = async (booking, status) => {
    const note = decisionNotes[booking.id]?.trim() || '';
    if (status === 'changes_requested' && !note) { toast('Add a message explaining what needs clarification.', 'error'); return; }
    setSavingId(booking.id);
    try {
      await setBookingStatus(booking.id, status, note);
      toast(status === 'changes_requested' ? 'Change request sent to the customer' : `Request marked ${STATUS_LABEL[status].toLowerCase()}`, 'success');
    } catch (error) { toast(error instanceof Error ? error.message : 'Could not update this request.', 'error'); }
    finally { setSavingId(null); }
  };

  const details = selectedBooking?.eventDetails ?? {};
  const snapshot = selectedBooking?.designSnapshot;
  const designName = snapshot?.name ?? selectedBooking?.designName;
  const designId = snapshot?.designId ?? selectedBooking?.designId;
  const showSnapshot = Boolean(snapshot?.scene || snapshot?.elements?.length);

  return <div className="mx-auto max-w-6xl animate-fade-in p-6 md:p-10">
    <header className="mb-7"><p className="section-kicker mb-2">Administration</p><h1 className="font-display text-4xl tracking-tight text-forest">Event requests</h1><p className="mt-2 text-sm text-charcoal/60">Review customer event briefs and the exact decoration design snapshot they submitted.</p></header>
    <div className="mb-5 flex flex-wrap items-end gap-3">
      <label className="relative min-w-[220px] flex-1"><span className="sr-only">Search requests</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" /><Input className="pl-9" placeholder="Search customer, event, venue, design…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <label className="grid gap-1 text-[10px] font-semibold text-charcoal/60">Status<select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-xl border border-sage/40 bg-white px-3 text-xs text-forest">{STATUS_FILTERS.map((status) => <option key={status} value={status}>{status === 'all' ? 'All requests' : STATUS_LABEL[status]}</option>)}</select></label>
    </div>
    {visibleBookings.length === 0 ? <EmptyState title={bookings.length ? 'No matching requests' : 'No event requests yet'} description={bookings.length ? 'Try another search or status.' : 'Customer event briefs will appear here.'} /> : <ul className="grid gap-3">
      {visibleBookings.map((booking) => <li key={booking.id}><Card><CardBody className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex min-w-0 items-center gap-3">{booking.designSnapshot?.scene ? <div className="h-[62px] w-[92px] shrink-0 overflow-hidden rounded-lg border border-sage/25 bg-ivory"><SceneView scene={booking.designSnapshot.scene} uid={`admin-card-${booking.id}`} className="h-full w-full" aria-hidden="true" /></div> : null}<div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-lg text-forest">{booking.eventType}</h2><Badge className={cn(STATUS_STYLE[booking.status] ?? STATUS_STYLE.pending)}>{STATUS_LABEL[booking.status] ?? booking.status}</Badge></div><p className="mt-1 truncate text-xs text-charcoal/65">{formatDate(booking.eventDate)}{booking.venue ? ` · ${booking.venue}` : ''}{booking.requesterName ? ` · ${booking.requesterName}` : ''}</p>{designName && <p className="mt-1 truncate text-xs font-medium text-forest">Design: {designName}</p>}</div></div>
        <div className="flex items-center gap-2"><span className="hidden text-[10px] text-charcoal/40 md:inline">{formatDate(booking.createdAt)}</span><Button size="sm" variant="secondary" onClick={() => setSelectedId(booking.id)}><Eye size={14} />Request details</Button></div>
      </CardBody></Card></li>)}
    </ul>}

    <Modal open={Boolean(selectedBooking)} onClose={() => { setSelectedId(null); setShowFullDesign(false); }} title={selectedBooking ? `${selectedBooking.eventType} request` : 'Request details'} size="lg" footer={selectedBooking && <div className="flex w-full flex-wrap justify-between gap-2"><Button variant="secondary" onClick={() => downloadBrief(selectedBooking)}><Download size={14} />Download Event Brief</Button><div className="flex flex-wrap gap-2">{selectedBooking.status !== 'under_review' && <Button size="sm" variant="secondary" disabled={savingId === selectedBooking.id} onClick={() => void decide(selectedBooking, 'under_review')}>Mark Under Review</Button>}{selectedBooking.status !== 'approved' && <Button size="sm" disabled={savingId === selectedBooking.id} onClick={() => void decide(selectedBooking, 'approved')}>Approve Request</Button>}{selectedBooking.status !== 'rejected' && <Button size="sm" variant="secondary" disabled={savingId === selectedBooking.id} onClick={() => void decide(selectedBooking, 'rejected')}>Reject Request</Button>}</div></div>}>
      {selectedBooking && <div className="grid max-h-[72vh] gap-3 overflow-y-auto pr-1">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-sage/10 px-4 py-3"><div><p className="text-[9px] font-semibold uppercase tracking-wider text-charcoal/45">Request status</p><Badge className={cn(STATUS_STYLE[selectedBooking.status] ?? STATUS_STYLE.pending)}>{STATUS_LABEL[selectedBooking.status] ?? selectedBooking.status}</Badge></div><p className="text-[10px] text-charcoal/50">Request {selectedBooking.id} · Submitted {formatDate(selectedBooking.createdAt)}</p></div>

        {selectedBooking.statusNote && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-950"><strong>Latest admin message</strong><p className="mt-1 whitespace-pre-wrap">{selectedBooking.statusNote}</p></div>}

        <ReviewSection title="A. Customer Information"><DetailGrid><DetailLine label="Customer" value={selectedBooking.requesterName} /><DetailLine label="Email" value={selectedBooking.requesterEmail} /><DetailLine label="Customer ID" value={selectedBooking.userId} /></DetailGrid></ReviewSection>
        <ReviewSection title="B. Event Information"><DetailGrid><DetailLine label="Occasion" value={selectedBooking.eventType} /><DetailLine label="Date" value={formatDate(selectedBooking.eventDate)} /><DetailLine label="Time" value={details.eventTime} /><DetailLine label="Venue or city" value={selectedBooking.venue} /><DetailLine label="Estimated guests" value={details.guestCount} /><DetailLine label="Setting" value={details.setting} /></DetailGrid></ReviewSection>

        <ReviewSection title="C. Customer’s Selected Design">
          {designName ? <div className="grid gap-3 md:grid-cols-[minmax(0,1.25fr)_minmax(220px,.75fr)]">{snapshot?.scene ? <div className="overflow-hidden rounded-xl border border-sage/25 bg-ivory"><SceneView scene={snapshot.scene} uid={`admin-detail-${selectedBooking.id}`} className="block max-h-[300px] w-full" aria-hidden="true" /></div> : snapshot?.elements?.length ? <div className="h-[260px] overflow-hidden rounded-xl border border-sage/25"><DesignCanvas elements={snapshot.elements} selectedId={null} settings={snapshot.settings} venuePlan={snapshot.venuePlan} zoom={0.75} preview onSelect={() => {}} onUpdateElement={() => {}} /></div> : <div className="grid min-h-32 place-items-center rounded-xl border border-dashed border-sage/40 bg-ivory p-4 text-center text-xs text-charcoal/50">Design preview is unavailable. The stable design reference is retained.</div>}
            <div className="grid content-start gap-3"><DetailGrid><DetailLine label="Design name" value={designName} /><DetailLine label="Stable design ID" value={designId} /><DetailLine label="Design type" value={snapshot?.designType ?? selectedBooking.designType} /><DetailLine label="Design categories" value={(snapshot?.decorationCategories ?? []).join(', ')} /><DetailLine label="Selected design colors" value={(snapshot?.colors ?? []).join(', ')} /><DetailLine label="Design style" value={snapshot?.style} /><DetailLine label="Customization" value={snapshot?.customization?.elementNames?.join(', ')} /></DetailGrid>{showSnapshot && <Button size="sm" variant="secondary" className="justify-center" onClick={() => setShowFullDesign(true)}><Eye size={14} />View Full Design</Button>}</div>
          </div> : <p className="text-xs text-charcoal/55">No saved design was attached to this request.</p>}
        </ReviewSection>

        <ReviewSection title="D. Decoration Preferences"><DetailGrid><DetailLine label="Requested services" value={(details.services ?? []).join(', ')} /><DetailLine label="Preferred style" value={details.style} /><DetailLine label="Preferred colors" value={(details.colors ?? []).join(', ')} /><DetailLine label="Design colors" value={(snapshot?.colors ?? []).join(', ')} /></DetailGrid></ReviewSection>
        <ReviewSection title="E. Budget Information"><DetailGrid><DetailLine label="Approximate budget" value={details.budgetAmount ? `${details.budgetCurrency ?? 'INR'} ${Number(details.budgetAmount).toLocaleString()}` : ''} /><DetailLine label="Budget includes" value={details.budgetScope} /></DetailGrid></ReviewSection>
        <ReviewSection title="F. Venue Requirements"><DetailGrid><DetailLine label="Access and setup window" value={details.accessTime} /><DetailLine label="Venue restrictions" value={details.venueRestrictions} /><DetailLine label="Accessibility" value={details.accessibility} /><DetailLine label="Contact preference" value={details.contactPreference} /><DetailLine label="Contact details" value={details.contactDetails} /></DetailGrid></ReviewSection>
        <ReviewSection title="G. Additional Requirements"><p className="whitespace-pre-wrap text-xs leading-relaxed text-charcoal/75">{details.requirements || selectedBooking.notes || 'No additional requirements provided.'}</p></ReviewSection>

        {selectedBooking.status !== 'approved' && selectedBooking.status !== 'rejected' && <ReviewSection title="Request Changes"><label className="grid gap-1 text-[10px] font-semibold text-charcoal/65">Message to customer<textarea value={decisionNotes[selectedBooking.id] ?? ''} onChange={(event) => setDecisionNotes((current) => ({ ...current, [selectedBooking.id]: event.target.value }))} placeholder="Explain what needs clarification or updating" className="min-h-20 rounded-lg border border-sage/40 bg-white px-3 py-2 text-xs font-normal" /></label><Button size="sm" variant="secondary" className="mt-3" disabled={savingId === selectedBooking.id} onClick={() => void decide(selectedBooking, 'changes_requested')}><MessageSquareText size={14} />Request Changes</Button></ReviewSection>}
      </div>}
    </Modal>

    <Modal open={showFullDesign && Boolean(selectedBooking)} onClose={() => setShowFullDesign(false)} title={designName || 'Submitted design snapshot'} size="lg">{snapshot?.scene ? <div className="max-h-[75vh] overflow-auto rounded-xl bg-ivory"><SceneView scene={snapshot.scene} uid={`admin-full-${selectedBooking?.id}`} className="h-auto w-full" /></div> : snapshot?.elements?.length ? <div className="h-[65vh] overflow-hidden rounded-xl"><DesignCanvas elements={snapshot.elements} selectedId={null} settings={snapshot.settings} venuePlan={snapshot.venuePlan} zoom={1} preview onSelect={() => {}} onUpdateElement={() => {}} /></div> : <p className="text-sm text-charcoal/60">The submitted design preview is unavailable.</p>}</Modal>
  </div>;
}
