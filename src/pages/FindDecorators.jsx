import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, Clipboard, Download, Flower2, MapPin, Palette, Sparkles, Users, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useApp } from '@/context/AppContext';
import { ELEMENT_MAP } from '@/studio/elements';
import { getTheme } from '@/data/themes';
import SceneView from '@/studio/SceneView';
import { componentsById as COVER_COMPONENTS } from '@/assets/vedika-cover-assets/src/components/index.js';
import './findDecorators.css';

const SERVICES = ['Ceremony flowers', 'Stage & backdrop', 'Table styling', 'Lighting', 'Draping', 'Setup & teardown'];
const EVENT_TYPES = ['Wedding', 'Reception', 'Haldi', 'Mehendi', 'Sangeet', 'Birthday', 'Baby shower', 'Engagement', 'Anniversary', 'Corporate event', 'Other celebration'];
const STYLES = ['Modern', 'Traditional', 'Minimal', 'Luxury', 'Garden', 'Bohemian', 'Romantic', 'Contemporary'];
const COLORS = [
  ['Ivory', '#F5F0E6'], ['Sage', '#A8B5A0'], ['Dusty rose', '#CFA09C'], ['Champagne', '#C5A46D'],
  ['Terracotta', '#C67B5C'], ['Lavender', '#B8A9C9'], ['Deep green', '#355B4C'], ['Navy', '#354A63'],
];
const STEPS = [
  { number: 1, short: 'Event Details', title: 'Start with the essentials', description: 'A few details help shape the right plan.' },
  { number: 2, short: 'Decoration', title: 'Set the look and feel', description: 'Choose the details that matter to your celebration.' },
  { number: 3, short: 'Budget', title: 'Set your requirements', description: 'Share a comfortable range and any practical needs.' },
];

function Field({ label, value, onChange, error, optional = false, className = '', ...props }) {
  return <label className={`brief-field ${className}`}>
    <span>{label}{optional && <small>Optional</small>}</span>
    <input value={value} onChange={onChange} {...props} />
    {error && <em role="alert">{error}</em>}
  </label>;
}

function TextField({ label, value, onChange, optional = false, ...props }) {
  return <label className="brief-field">
    <span>{label}{optional && <small>Optional</small>}</span>
    <textarea value={value} onChange={onChange} {...props} />
  </label>;
}

function ReviewLine({ label, value }) {
  if (!value) return null;
  return <div className="brief-review-line"><dt>{label}</dt><dd>{value}</dd></div>;
}

export function FindDecorators() {
  const { toast } = useToast();
  const { designs } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDesignId = searchParams.get('designId') || '';
  const selectedDesignType = searchParams.get('designType') || '';
  const linkedDesign = designs.find((design) => design.id === selectedDesignId) ?? null;
  const linkedDesignName = linkedDesign?.name || searchParams.get('designName') || '';
  const [changingDesign, setChangingDesign] = useState(false);
  const today = (() => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; })();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [eventType, setEventType] = useState(searchParams.get('eventType') || 'Wedding');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [setting, setSetting] = useState('Not decided');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetCurrency, setBudgetCurrency] = useState('INR');
  const [budgetScope, setBudgetScope] = useState('');
  const [style, setStyle] = useState(searchParams.get('style') || '');
  const [colors, setColors] = useState('');
  const [customColor, setCustomColor] = useState('#CFA09C');
  const [services, setServices] = useState([]);
  const [accessTime, setAccessTime] = useState('');
  const [venueRestrictions, setVenueRestrictions] = useState('');
  const [requirements, setRequirements] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [contactPreference, setContactPreference] = useState('');
  const [contactDetails, setContactDetails] = useState('');

  const selectedColors = colors.split(',').map((color) => color.trim()).filter(Boolean);
  const linkedElements = linkedDesign?.scene?.coverElements ?? linkedDesign?.scene?.elements ?? [];
  const designCategories = [...new Set(linkedElements.map((element) => ELEMENT_MAP[element.type]?.category ?? (COVER_COMPONENTS[element.type]?.group ?? '')).filter(Boolean))];
  const designPalette = linkedDesign?.scene?.palette ?? [];
  const designStyle = linkedDesign?.settings?.themeId ? getTheme(linkedDesign.settings.themeId)?.name ?? linkedDesign.settings.themeId : '';
  const brief = useMemo(() => [
    'EVENT BRIEF',
    `Occasion: ${eventType}`,
    eventDate && `Date: ${eventDate}`,
    eventTime && `Time: ${eventTime}`,
    location.trim() && `City / venue: ${location.trim()}`,
    guestCount && `Estimated guests: ${guestCount}`,
    setting && `Setting: ${setting}`,
    '', 'DECORATION',
    services.length ? `Services requested: ${services.join(', ')}` : 'Services requested: To discuss',
    linkedDesignName && `Vedika design inspiration: ${linkedDesignName} (ID: ${selectedDesignId})`,
    style && `Style / mood: ${style}`,
    selectedColors.length && `Preferred colors: ${selectedColors.join(', ')}`,
    '', 'BUDGET',
    budgetAmount && `Approximate budget: ${budgetCurrency} ${budgetAmount}`,
    budgetScope && `Budget includes: ${budgetScope}`,
    requirements.trim() && `Additional requirements: ${requirements.trim()}`,
    '', 'VENUE AND ACCESS',
    accessTime.trim() && `Venue access / setup window: ${accessTime.trim()}`,
    venueRestrictions.trim() && `Venue restrictions: ${venueRestrictions.trim()}`,
    accessibility.trim() && `Accessibility needs: ${accessibility.trim()}`,
    '', 'CONTACT',
    contactPreference && `Preferred contact method: ${contactPreference}`,
    contactDetails.trim() && `Contact details: ${contactDetails.trim()}`,
  ].filter((line) => line !== false && line !== null && line !== undefined).join('\n').replace(/\n{3,}/g, '\n\n'), [
    eventType, eventDate, eventTime, location, guestCount, setting, services, linkedDesignName, selectedDesignId,
    style, colors, budgetAmount, budgetCurrency, budgetScope, requirements, accessTime, venueRestrictions,
    accessibility, contactPreference, contactDetails,
  ]);

  const toggleService = (service) => setServices((current) => current.includes(service)
    ? current.filter((item) => item !== service)
    : [...current, service]);
  const toggleColor = (color) => {
    const next = selectedColors.includes(color) ? selectedColors.filter((item) => item !== color) : [...selectedColors, color];
    setColors(next.join(', '));
  };
  const validateEventDetails = () => {
    const next = {};
    if (!eventDate) next.eventDate = 'Choose an event date to continue.';
    if (!location.trim()) next.location = 'Add a venue or city to continue.';
    if (!guestCount || Number(guestCount) < 1) next.guestCount = 'Enter an estimated guest count.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const continueStep = () => {
    if (step === 1 && !validateEventDetails()) return;
    setErrors({});
    setStep((current) => current === 3 ? 4 : Math.min(3, current + 1));
  };
  const goToStep = (target) => {
    if (target <= step || (step === 4 && target <= 3)) {
      setStep(target);
      setErrors({});
    }
  };
  const selectDesign = (id) => {
    const params = new URLSearchParams(searchParams);
    if (id) {
      const nextDesign = designs.find((design) => design.id === id);
      if (!nextDesign) return;
      params.set('designId', nextDesign.id);
      params.set('designName', nextDesign.name);
      params.set('designType', 'custom');
    } else {
      params.delete('designId');
      params.delete('designName');
      params.delete('designType');
    }
    setSearchParams(params);
    setChangingDesign(false);
  };

  const copyBrief = async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(brief);
      else {
        const temporary = document.createElement('textarea');
        temporary.value = brief;
        document.body.appendChild(temporary);
        temporary.select();
        document.execCommand('copy');
        temporary.remove();
      }
      toast('Event brief copied', 'success');
    } catch { toast('Could not copy the brief. Check clipboard permissions.', 'error'); }
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
  const requestUrl = `/bookings?${new URLSearchParams({
    new: '1', eventType, eventDate, venue: location.trim(), notes: brief,
    designId: selectedDesignId, designName: linkedDesignName, designType: selectedDesignType || (linkedDesign ? 'custom' : ''),
    eventDetails: JSON.stringify({ eventTime, guestCount, setting, services, style, colors: selectedColors, designStyle, budgetAmount, budgetCurrency, budgetScope, requirements, accessTime, venueRestrictions, accessibility, contactPreference, contactDetails }),
  }).toString()}`;
  const completion = step === 4 ? 100 : Math.round((step / 3) * 100);
  const budgetLine = budgetAmount ? `${budgetCurrency} ${Number(budgetAmount).toLocaleString()}` : '';

  return <div className="p-6 md:p-10 animate-fade-in max-w-6xl mx-auto event-brief-page">
    <PageHeader kicker="Planning tool" title="Event brief" description="Plan your celebration one step at a time, then review and share a clear brief." />

    <section className="brief-selected-design">
      <div className="brief-selected-design-heading">
        <div>
          <span className="brief-selected-design-icon"><Sparkles size={16} /></span>
          <div><small>DESIGN REFERENCE</small><h2>Your selected design</h2></div>
        </div>
        {selectedDesignId && (
          <div className="brief-design-actions">
            {linkedDesign && <Link to={`/studio?design=${encodeURIComponent(linkedDesign.id)}`} className="brief-design-view">View design <ArrowRight size={13} /></Link>}
            <button type="button" className="brief-design-remove" onClick={() => selectDesign('')}><X size={13} />Remove</button>
          </div>
        )}
      </div>
      {linkedDesign?.scene ? (
        <div className="brief-selected-design-body">
          <div className="brief-design-preview"><SceneView scene={linkedDesign.scene} uid={`event-brief-${linkedDesign.id}`} aria-hidden="true" /></div>
          <div className="brief-design-details">
            <strong>{linkedDesign.name}</strong>
            <small title={linkedDesign.id}>Design ID · {linkedDesign.id}</small>
            <p>{designCategories.length ? designCategories.join(' · ') : 'Decoration design'}{designStyle ? ` · ${designStyle}` : ''}</p>
            <p className="brief-design-customization">{linkedElements.length} decoration elements{designPalette.length ? ` · ${designPalette.length} palette colors` : ''}</p>
          </div>
        </div>
      ) : selectedDesignId ? (
        <div className="brief-design-missing">
          <div><strong>{linkedDesignName || 'Selected design'}</strong><p>This saved design is unavailable in your current workspace. Its ID will remain attached to the request.</p></div>
          <small title={selectedDesignId}>ID · {selectedDesignId}</small>
        </div>
      ) : (
        <div className="brief-design-missing brief-design-empty"><p>No design selected yet. Continue with preferences, or attach one from your saved designs.</p></div>
      )}
      {changingDesign ? (
        <div className="brief-design-change">
          <label className="brief-field"><span>Choose a saved design</span>
            <select value={selectedDesignId} onChange={(event) => selectDesign(event.target.value)}>
              <option value="">No design selected</option>
              {designs.map((design) => <option key={design.id} value={design.id}>{design.name}</option>)}
            </select>
          </label>
          <button type="button" onClick={() => setChangingDesign(false)}>Cancel</button>
        </div>
      ) : (
        <button type="button" className="brief-design-change-trigger" onClick={() => setChangingDesign(true)}>
          {selectedDesignId ? 'Change design' : 'Select a saved design'} <ArrowRight size={13} />
        </button>
      )}
    </section>

    <nav className="brief-stepper" aria-label="Event brief progress">
      <div className="brief-progress-track"><span style={{ width: `${completion}%` }} /></div>
      {STEPS.map((item) => {
        const complete = step > item.number;
        const active = step === item.number;
        return <button key={item.number} type="button" className={`brief-step${active ? ' is-active' : ''}${complete ? ' is-complete' : ''}`} onClick={() => goToStep(item.number)} aria-current={active ? 'step' : undefined} aria-label={`Step ${String(item.number).padStart(2, '0')}: ${item.short}${complete || step === 4 ? ', completed' : ''}`}>
          <span className="brief-step-number">{complete || step === 4 ? <Check size={14} /> : String(item.number).padStart(2, '0')}</span><span className="brief-step-label"><small>STEP {String(item.number).padStart(2, '0')}</small><strong>{item.short}</strong></span>
        </button>;
      })}
    </nav>
    <div className="brief-progress-copy"><span>{step === 4 ? 'Final review' : `Step ${String(step).padStart(2, '0')} of 03`}</span><span>{completion}% complete</span></div>

    <div className="brief-layout">
      <main className="brief-main-panel" key={step}>
        {step < 4 ? <>
          <header className="brief-step-heading"><span className="brief-step-kicker">STEP {String(step).padStart(2, '0')} · {STEPS[step - 1].short.toUpperCase()}</span><h2>{STEPS[step - 1].title}</h2><p>{STEPS[step - 1].description}</p></header>

          {step === 1 && <section className="brief-fields-grid" aria-label="Event details">
            <label className="brief-field"><span>Event occasion</span><select value={eventType} onChange={(event) => setEventType(event.target.value)}>{EVENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
            <Field label="Event date *" type="date" min={today} value={eventDate} error={errors.eventDate} onChange={(event) => { setEventDate(event.target.value); setErrors((current) => ({ ...current, eventDate: '' })); }} />
            <Field label="Event time" optional type="time" value={eventTime} onChange={(event) => setEventTime(event.target.value)} />
            <Field label="Venue or city *" placeholder="e.g. Hyderabad · Garden Hall" value={location} error={errors.location} onChange={(event) => { setLocation(event.target.value); setErrors((current) => ({ ...current, location: '' })); }} />
            <Field label="Estimated guest count *" type="number" min="1" placeholder="e.g. 150" value={guestCount} error={errors.guestCount} onChange={(event) => { setGuestCount(event.target.value); setErrors((current) => ({ ...current, guestCount: '' })); }} />
            <label className="brief-field"><span>Event setting</span><select value={setting} onChange={(event) => setSetting(event.target.value)}><option>Not decided</option><option>Indoor</option><option>Outdoor</option><option>Indoor and outdoor</option></select></label>
          </section>}

          {step === 2 && <div className="brief-decoration-step">
            <fieldset className="brief-choice-section"><legend>Services you may need <small>Select all that apply</small></legend><div className="brief-service-grid">{SERVICES.map((service) => { const selected = services.includes(service); return <button key={service} type="button" aria-pressed={selected} onClick={() => toggleService(service)} className={`brief-service-card${selected ? ' is-selected' : ''}`}>{selected && <span className="brief-choice-check"><Check size={13} /></span>}<span className="brief-service-icon"><Flower2 size={17} /></span><strong>{service}</strong></button>; })}</div></fieldset>
            <fieldset className="brief-choice-section"><legend>Decoration style <small>Choose the closest match</small></legend><div className="brief-style-options">{STYLES.map((option) => <button key={option} type="button" aria-pressed={style === option} onClick={() => setStyle(style === option ? '' : option)} className={style === option ? 'is-selected' : ''}>{option}</button>)}</div></fieldset>
            <fieldset className="brief-choice-section"><legend>Preferred colors <small>Select swatches or add a custom color</small></legend><div className="brief-color-options">{COLORS.map(([name, color]) => <button key={color} type="button" title={name} aria-label={`${name}${selectedColors.includes(name) ? ', selected' : ''}`} aria-pressed={selectedColors.includes(name)} onClick={() => toggleColor(name)} className={selectedColors.includes(name) ? 'is-selected' : ''}><i style={{ backgroundColor: color }} />{selectedColors.includes(name) && <Check size={12} />}</button>)}<label className="brief-custom-color" title="Add a custom color"><input type="color" value={customColor} onChange={(event) => { setCustomColor(event.target.value); if (!selectedColors.includes(event.target.value)) setColors([...selectedColors, event.target.value].join(', ')); }} /><span>Custom</span></label></div>{selectedColors.length > 0 && <p className="brief-selected-colors"><Palette size={13} />{selectedColors.join(' · ')}</p>}</fieldset>
          </div>}

          {step === 3 && <section className="brief-budget-step">
            <div className="brief-budget-row"><label className="brief-field"><span>Currency</span><select value={budgetCurrency} onChange={(event) => setBudgetCurrency(event.target.value)}><option value="INR">INR · ₹</option><option value="USD">USD · $</option><option value="EUR">EUR · €</option><option value="GBP">GBP · £</option></select></label><Field label="Approximate budget" optional type="number" min="0" placeholder="Enter an amount" value={budgetAmount} onChange={(event) => setBudgetAmount(event.target.value)} /></div>
            <label className="brief-field"><span>What should the budget include?</span><select value={budgetScope} onChange={(event) => setBudgetScope(event.target.value)}><option value="">Not specified</option><option>Materials and decoration only</option><option>Materials, setup, and teardown</option><option>All event decoration costs</option><option>Open to recommendations</option></select></label>
            <TextField label="Additional requirements" optional rows={3} placeholder="Anything else to help shape the plan?" value={requirements} onChange={(event) => setRequirements(event.target.value)} />
            <details className="brief-advanced-details"><summary>Additional venue & accessibility details <ChevronDown size={16} /></summary><div className="brief-advanced-fields"><TextField label="Venue access and setup window" optional placeholder="e.g. Access from 8 AM; setup must finish by 2 PM" value={accessTime} onChange={(event) => setAccessTime(event.target.value)} /><TextField label="Venue restrictions" optional placeholder="e.g. No drilling, open flames, or hanging fixtures" value={venueRestrictions} onChange={(event) => setVenueRestrictions(event.target.value)} /><TextField label="Accessibility requirements" optional placeholder="e.g. Keep a step-free path and wide walkways" value={accessibility} onChange={(event) => setAccessibility(event.target.value)} /><div className="brief-budget-row"><label className="brief-field"><span>Preferred contact method <small>Optional</small></span><select value={contactPreference} onChange={(event) => setContactPreference(event.target.value)}><option value="">Not specified</option><option>Email</option><option>Phone</option><option>WhatsApp</option></select></label><Field label="Contact details" optional placeholder="Email or phone number" value={contactDetails} onChange={(event) => setContactDetails(event.target.value)} /></div></div></details>
          </section>}

          <footer className="brief-step-actions">{step > 1 ? <Button variant="secondary" onClick={() => goToStep(step - 1)}><ArrowLeft size={15} />Back</Button> : <span className="brief-optional-note">* Required · Other details are optional.</span>}<Button className="brief-primary-action" onClick={continueStep}>{step === 3 ? 'Review your brief' : 'Continue'}<ArrowRight size={15} /></Button></footer>
        </> : <>
          <header className="brief-step-heading"><span className="brief-step-kicker">FINAL REVIEW</span><h2>Your event brief</h2><p>Review the details below. You can edit any step before copying, downloading, or submitting an internal request.</p></header>
          <div className="brief-review-sections">
            <section className="brief-review-section"><div><span>01</span><h3>Event overview</h3><button type="button" onClick={() => goToStep(1)}>Edit</button></div><dl><ReviewLine label="Occasion" value={eventType} /><ReviewLine label="Date" value={eventDate} /><ReviewLine label="Time" value={eventTime} /><ReviewLine label="Venue or city" value={location.trim()} /><ReviewLine label="Guests" value={guestCount} /><ReviewLine label="Setting" value={setting} /></dl></section>
            <section className="brief-review-section"><div><span>02</span><h3>Decoration preferences</h3><button type="button" onClick={() => goToStep(2)}>Edit</button></div><dl><ReviewLine label="Services" value={services.join(', ') || 'To discuss'} /><ReviewLine label="Style" value={style} /><ReviewLine label="Colors" value={selectedColors.join(', ')} /><ReviewLine label="Linked design" value={linkedDesignName} /></dl></section>
            <section className="brief-review-section"><div><span>03</span><h3>Budget & requirements</h3><button type="button" onClick={() => goToStep(3)}>Edit</button></div><dl><ReviewLine label="Budget" value={budgetLine} /><ReviewLine label="Includes" value={budgetScope} /><ReviewLine label="Additional requirements" value={requirements.trim()} /><ReviewLine label="Venue access" value={accessTime.trim()} /><ReviewLine label="Venue restrictions" value={venueRestrictions.trim()} /><ReviewLine label="Accessibility" value={accessibility.trim()} /><ReviewLine label="Contact method" value={contactPreference} /><ReviewLine label="Contact details" value={contactDetails.trim()} /></dl></section>
          </div>
          <footer className="brief-step-actions brief-review-tools">
            <Button variant="secondary" onClick={() => goToStep(3)}><ArrowLeft size={15} />Back</Button>
            <div className="brief-review-actions">
              <Button variant="secondary" onClick={copyBrief}><Clipboard size={14} />Copy</Button>
              <Button variant="secondary" onClick={downloadBrief}><Download size={14} />Download</Button>
              <Link to={requestUrl} className="brief-request-button">Create internal request <ArrowRight size={15} /></Link>
            </div>
          </footer>
        </>}
      </main>

      <aside className="brief-summary-card" aria-label="Live event summary">
        <button type="button" className="brief-summary-toggle" aria-expanded={summaryOpen} onClick={() => setSummaryOpen((open) => !open)}><span><Sparkles size={15} />Live summary</span><ChevronDown size={16} /></button>
        <div className={`brief-summary-content${summaryOpen ? ' is-open' : ''}`}>
          <div className="brief-summary-heading"><span><Sparkles size={15} /></span><div><small>YOUR PLAN SO FAR</small><h2>Event summary</h2></div></div>
          <strong className="brief-summary-event">{eventType || 'Your event'}</strong>
          <ul className="brief-summary-facts">{eventDate && <li><CalendarDays size={14} />{eventDate}{eventTime && ` · ${eventTime}`}</li>}{location.trim() && <li><MapPin size={14} />{location.trim()}</li>}{guestCount && <li><Users size={14} />About {guestCount} guests</li>}</ul>
          {(services.length > 0 || style || selectedColors.length > 0) && <div className="brief-summary-block"><small>DECORATION</small>{services.length > 0 && <p>{services.join(' · ')}</p>}{style && <p>{style} style</p>}{selectedColors.length > 0 && <div className="brief-summary-swatches">{selectedColors.map((color) => { const match = COLORS.find(([name]) => name === color); return <i key={color} title={color} style={{ backgroundColor: match?.[1] ?? color }} />; })}</div>}</div>}
          {budgetAmount && <div className="brief-summary-budget"><small>APPROXIMATE BUDGET</small><strong>{budgetLine}</strong></div>}
          {step !== 4 && <p className="brief-summary-hint">This summary updates as you plan.</p>}
        </div>
      </aside>
    </div>
    <p className="brief-disclaimer"><MapPin size={14} />An internal request goes to the Vedika admin team for review. It does not contact decorators or venues, reserve a venue, or share your contact details externally.</p>
  </div>;
}
