import { useMemo, useState } from 'react';
import { ArrowRight, Check, Clipboard, Download, Flower2, MapPin, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

const SERVICES = ['Ceremony flowers', 'Stage & backdrop', 'Table styling', 'Lighting', 'Draping', 'Setup & teardown'];
const EVENT_TYPES = ['Wedding', 'Reception', 'Haldi', 'Mehendi', 'Sangeet', 'Birthday', 'Baby shower', 'Engagement', 'Anniversary', 'Corporate event', 'Other celebration'];

function Field({ label, value, onChange, ...props }) {
  return <label className="block space-y-1.5 text-sm font-medium text-charcoal/80">{label}<input value={value} onChange={onChange} {...props} className="w-full h-10 px-3 rounded-xl border border-sage/40 bg-white text-sm font-normal outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/25" /></label>;
}

function TextField({ label, value, onChange, ...props }) {
  return <label className="block space-y-1.5 text-sm font-medium text-charcoal/80">{label}<textarea value={value} onChange={onChange} {...props} className="w-full min-h-20 px-3 py-2 rounded-xl border border-sage/40 bg-white text-sm font-normal outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/25" /></label>;
}

export function FindDecorators() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const linkedDesign = {
    id: searchParams.get('designId') || '',
    name: searchParams.get('designName') || '',
    type: searchParams.get('designType') || '',
  };
  const today = (() => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; })();
  const [eventType, setEventType] = useState(searchParams.get('eventType') || 'Wedding');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [setting, setSetting] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetCurrency, setBudgetCurrency] = useState('INR');
  const [budgetScope, setBudgetScope] = useState('');
  const [style, setStyle] = useState(searchParams.get('style') || '');
  const [colors, setColors] = useState('');
  const [services, setServices] = useState([]);
  const [accessTime, setAccessTime] = useState('');
  const [venueRestrictions, setVenueRestrictions] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [contactPreference, setContactPreference] = useState('');
  const [contactDetails, setContactDetails] = useState('');

  const brief = useMemo(() => [
    'EVENT BRIEF',
    `Occasion: ${eventType}`,
    eventDate && `Date: ${eventDate}`,
    eventTime && `Time: ${eventTime}`,
    location.trim() && `City / venue: ${location.trim()}`,
    guestCount && `Estimated guests: ${guestCount}`,
    setting && `Setting: ${setting}`,
    '',
    'DECORATION',
    services.length ? `Services requested: ${services.join(', ')}` : 'Services requested: To discuss',
    linkedDesign.name && `Vedika design inspiration: ${linkedDesign.name}`,
    style.trim() && `Style / mood: ${style.trim()}`,
    colors.trim() && `Preferred colors: ${colors.trim()}`,
    '',
    'BUDGET',
    budgetAmount && `Approximate budget: ${budgetCurrency} ${budgetAmount}`,
    budgetScope && `Budget includes: ${budgetScope}`,
    '',
    'VENUE AND ACCESS',
    accessTime.trim() && `Venue access / setup window: ${accessTime.trim()}`,
    venueRestrictions.trim() && `Venue restrictions: ${venueRestrictions.trim()}`,
    accessibility.trim() && `Accessibility needs: ${accessibility.trim()}`,
    '',
    'CONTACT',
    contactPreference && `Preferred contact method: ${contactPreference}`,
    contactDetails.trim() && `Contact details: ${contactDetails.trim()}`,
  ].filter((line) => line !== false && line !== null && line !== undefined).join('\n').replace(/\n{3,}/g, '\n\n'), [
    eventType, eventDate, eventTime, location, guestCount, setting, services, linkedDesign.name,
    style, colors, budgetAmount, budgetCurrency, budgetScope, accessTime, venueRestrictions,
    accessibility, contactPreference, contactDetails,
  ]);

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      toast('Event brief copied', 'success');
    } catch {
      toast('Could not copy the brief. Check clipboard permissions.', 'error');
    }
  };

  const downloadBrief = () => {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${eventType.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'event'}-brief.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Event brief downloaded', 'success');
  };

  const toggleService = (service) => setServices((current) => current.includes(service)
    ? current.filter((item) => item !== service)
    : [...current, service]);

  const requestUrl = `/bookings?${new URLSearchParams({
    new: '1', eventType, eventDate, venue: location.trim(), notes: brief,
    designId: linkedDesign.id, designName: linkedDesign.name, designType: linkedDesign.type,
  }).toString()}`;

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-6xl mx-auto">
      <PageHeader kicker="Planning tool" title="Event brief" description="Gather event, decoration, budget, and venue details into a brief you can review and share. Vedika does not list or connect you with decorators." />

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5 items-start">
        <section className="rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-7 shadow-sm space-y-7">
          <div className="flex items-start gap-3">
            <span className="h-10 w-10 rounded-xl bg-champagne/20 text-forest flex items-center justify-center"><Flower2 className="h-5 w-5" /></span>
            <div><h2 className="font-display text-2xl text-forest">Plan your event</h2><p className="text-xs text-charcoal/55 mt-1">Add the details a decorator or venue may need. You can leave unknown items blank.</p></div>
          </div>

          {linkedDesign.name && <div className="rounded-xl border border-champagne/35 bg-champagne/10 px-4 py-3"><p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal/50">Linked Vedika design</p><p className="text-sm font-semibold text-forest mt-1">{linkedDesign.name}</p></div>}

          <section className="space-y-3"><div><p className="section-kicker">Event basics</p><h3 className="font-display text-xl text-forest">When and where</h3></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5 text-sm font-medium text-charcoal/80">Occasion<select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-sage/40 bg-white text-sm outline-none focus:border-champagne">{EVENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
              <Field label="Event date" type="date" min={today} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              <Field label="Event time" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
              <Field label="City or venue" placeholder="e.g. Hyderabad · Garden Hall" value={location} onChange={(e) => setLocation(e.target.value)} />
              <Field label="Estimated guest count" type="number" min="1" placeholder="e.g. 150" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} />
              <label className="block space-y-1.5 text-sm font-medium text-charcoal/80">Setting<select value={setting} onChange={(e) => setSetting(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-sage/40 bg-white text-sm outline-none focus:border-champagne"><option value="">Not decided</option><option>Indoor</option><option>Outdoor</option><option>Indoor and outdoor</option></select></label>
            </div>
          </section>

          <section className="space-y-3"><div><p className="section-kicker">Decoration</p><h3 className="font-display text-xl text-forest">Style and services</h3></div>
            <fieldset><legend className="text-sm font-medium text-charcoal/80 mb-2.5">What do you need help with?</legend><div className="flex flex-wrap gap-2">{SERVICES.map((service) => { const selected = services.includes(service); return <button key={service} type="button" aria-pressed={selected} onClick={() => toggleService(service)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs transition ${selected ? 'border-forest bg-forest text-ivory' : 'border-sage/40 bg-white text-charcoal/70 hover:border-sage'}`}>{selected && <Check className="h-3 w-3" />}{service}</button>; })}</div></fieldset>
            <div className="grid sm:grid-cols-2 gap-4"><Field label="Style or mood" placeholder="e.g. garden romance, modern, traditional" value={style} onChange={(e) => setStyle(e.target.value)} /><Field label="Preferred colors" placeholder="e.g. ivory, sage, and gold" value={colors} onChange={(e) => setColors(e.target.value)} /></div>
          </section>

          <section className="space-y-3"><div><p className="section-kicker">Budget</p><h3 className="font-display text-xl text-forest">Set expectations</h3></div>
            <div className="grid sm:grid-cols-[110px_1fr] gap-3"><label className="block space-y-1.5 text-sm font-medium text-charcoal/80">Currency<select value={budgetCurrency} onChange={(e) => setBudgetCurrency(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-sage/40 bg-white text-sm outline-none focus:border-champagne"><option value="INR">INR ₹</option><option value="USD">USD $</option><option value="EUR">EUR €</option><option value="GBP">GBP £</option></select></label><Field label="Approximate budget" type="number" min="0" placeholder="Amount" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} /></div>
            <label className="block space-y-1.5 text-sm font-medium text-charcoal/80">Budget includes<select value={budgetScope} onChange={(e) => setBudgetScope(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-sage/40 bg-white text-sm outline-none focus:border-champagne"><option value="">Not specified</option><option>Materials and decoration only</option><option>Materials, setup, and teardown</option><option>All event decoration costs</option><option>Open to recommendations</option></select></label>
          </section>

          <section className="space-y-3"><div><p className="section-kicker">Venue details</p><h3 className="font-display text-xl text-forest">Access and requirements</h3></div>
            <TextField label="Venue access or setup window" placeholder="e.g. Access from 8 AM; setup must finish by 2 PM" value={accessTime} onChange={(e) => setAccessTime(e.target.value)} />
            <TextField label="Venue restrictions" placeholder="e.g. No drilling, open flames, or hanging fixtures" value={venueRestrictions} onChange={(e) => setVenueRestrictions(e.target.value)} />
            <TextField label="Accessibility needs" placeholder="e.g. Keep a step-free path and wide walkways" value={accessibility} onChange={(e) => setAccessibility(e.target.value)} />
          </section>

          <section className="space-y-3"><div><p className="section-kicker">Contact</p><h3 className="font-display text-xl text-forest">How should they reach you?</h3></div>
            <div className="grid sm:grid-cols-2 gap-4"><label className="block space-y-1.5 text-sm font-medium text-charcoal/80">Preferred contact method<select value={contactPreference} onChange={(e) => setContactPreference(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-sage/40 bg-white text-sm outline-none focus:border-champagne"><option value="">Not specified</option><option>Email</option><option>Phone</option><option>WhatsApp</option></select></label><Field label="Contact details (optional)" placeholder="Email or phone number" value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} /></div>
          </section>
        </section>

        <aside className="lg:sticky lg:top-6 rounded-2xl border border-champagne/40 bg-ivory p-5 md:p-6">
          <div className="flex items-center gap-2 text-forest mb-3"><Sparkles className="h-4 w-4" /><h2 className="font-display text-xl">Review your brief</h2></div>
          <p className="text-xs leading-relaxed text-charcoal/55 mb-4">Edit the fields on the left; this preview updates as you go.</p>
          <pre className="rounded-xl bg-white/75 border border-sage/25 p-4 mb-4 max-h-[55vh] overflow-auto text-sm text-charcoal whitespace-pre-wrap leading-relaxed">{brief}</pre>
          <div className="flex flex-col gap-2">
            <Button onClick={copyBrief} className="w-full"><Clipboard className="h-4 w-4" />Copy brief</Button>
            <Button onClick={downloadBrief} variant="secondary" className="w-full"><Download className="h-4 w-4" />Download brief</Button>
            <Link to={requestUrl} className="inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-sage/40 bg-white/80 px-4 text-sm font-semibold text-forest hover:bg-white transition">Create internal request <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <p className="mt-5 pt-4 border-t border-sage/25 flex gap-2 text-[11px] leading-relaxed text-charcoal/50"><MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />Copy or download the brief to share it yourself. An internal request goes to the Vedika admin team; it does not contact decorators or venues, reserve a venue, or share your contact details externally.</p>
        </aside>
      </div>
    </div>
  );
}
