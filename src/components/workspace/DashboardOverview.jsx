import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Compass,
  ExternalLink,
  Flower2,
  Images,
  LayoutTemplate,
  Palette,
  Plus,
  Sparkles,
} from 'lucide-react';
import SceneView from '@/studio/SceneView';
import { DesignCanvas } from '@/components/studio/DesignCanvas';
import { DEFAULT_SETTINGS } from '@/data/themes';
import { AVAILABLE_TEMPLATE_COVERS, resolveTemplateCover } from '@/data/templateCovers';
import { getMySharedDesigns } from '@/lib/share';
import { budgetAllocated } from '@/lib/budget';
import { buildInspirationEntries, collectMosaicTiles, resolveMoodboardMedia } from '@/lib/moodboard';
import { formatINR } from '@/lib/utils';
import './dashboard.css';

const copy = {
  en: {
    label: 'Your creative workspace', greeting: 'Good evening, Designer.',
    welcome: "Your creative workspace is ready. Let's create something beautiful.",
    newDesign: '+ New Design', templates: 'Explore Templates',
    continue: 'Continue Creating', continueText: 'Pick up where your creative journey left off.',
    viewAll: 'View all designs', edit: 'Edit Design', modified: 'Last modified',
    category: 'Event category', startTitle: 'Your creative journey starts here.',
    startText: 'Begin with a blank canvas or find a starting point in the template library.',
    startDesigning: 'Start Designing', inspiration: 'Find Your Inspiration',
    inspirationText: 'Discover beautiful decoration concepts for your next celebration.',
    collections: 'Your Collections', collectionText: 'Moodboards, budgets, and shared looks — gathered in one place.',
    myMoodboards: 'My Moodboards', viewMoodboards: 'View Moodboards',
    savedIdeas: 'saved inspirations', noMoodboards: 'Your moodboard collection is ready for its first idea.',
    createMoodboard: 'Create a Moodboard',
    eventBudget: 'Event Budget', viewBudget: 'Open Budget', createBudget: 'Plan a Budget',
    noBudget: 'Set a total and track décor spend as your plans take shape.',
    remaining: 'remaining', ofTotal: 'of', totalLabel: 'total', allocated: 'allocated', overBudget: 'over plan',
    recentlyShared: 'Recently Shared',
    viewShared: 'View Shared Design', noShares: 'Shared designs will appear here when you create a guest link.',
    shareUnavailable: 'Shared links are available when signed in with a connected account.',
    shareLoading: 'Loading shared designs…', shareError: 'Shared designs could not be loaded.',
    previewUnavailable: 'Preview unavailable', noSavedDesigns: 'No saved designs yet',
    approved: 'Approved', pending: 'Awaiting feedback', changes: 'Changes requested',
    comments: 'comments', finalTitle: 'Every Beautiful Celebration Begins With an Idea.',
    blankTitle: 'Blank Canvas', blankText: 'Start a decoration design from scratch.',
    exploreTitle: 'Explore Templates', exploreText: 'Discover editable decoration concepts.',
    moodboardTitle: 'Create a Moodboard', moodboardText: 'Organize inspiration and styling ideas.',
    openStudio: 'Open Studio', explore: 'Explore', create: 'Create',
  },
  te: {
    label: 'మీ సృజనాత్మక కార్యస్థలం', greeting: 'శుభ సాయంత్రం, డిజైనర్.',
    welcome: 'మీ సృజనాత్మక కార్యస్థలం సిద్ధంగా ఉంది. అందమైనదాన్ని సృష్టిద్దాం.',
    newDesign: '+ కొత్త డిజైన్', templates: 'టెంప్లేట్లను చూడండి',
    continue: 'సృష్టించడం కొనసాగించండి', continueText: 'మీ సృజనాత్మక ప్రయాణాన్ని కొనసాగించండి.',
    viewAll: 'అన్ని డిజైన్లు చూడండి', edit: 'డిజైన్‌ను సవరించండి', modified: 'చివరిగా మార్చినది',
    category: 'వేడుక రకం', startTitle: 'మీ సృజనాత్మక ప్రయాణం ఇక్కడ మొదలవుతుంది.',
    startText: 'ఖాళీ కాన్వాస్‌తో లేదా టెంప్లేట్‌తో ప్రారంభించండి.', startDesigning: 'డిజైన్ ప్రారంభించండి',
    inspiration: 'మీకు ప్రేరణ', inspirationText: 'తదుపరి వేడుక కోసం అందమైన అలంకరణ ఆలోచనలు చూడండి.',
    collections: 'మీ సేకరణలు', collectionText: 'మూడ్‌బోర్డులు, బడ్జెట్లు, షేర్ చేసిన లుక్‌లు — ఒకేచోట.',
    myMoodboards: 'నా మూడ్‌బోర్డులు', viewMoodboards: 'మూడ్‌బోర్డులు చూడండి',
    savedIdeas: 'సేవ్ చేసిన ప్రేరణలు', noMoodboards: 'మీ మూడ్‌బోర్డ్‌లో మొదటి ఆలోచనను జోడించండి.',
    createMoodboard: 'మూడ్‌బోర్డ్ సృష్టించండి',
    eventBudget: 'ఈవెంట్ బడ్జెట్', viewBudget: 'బడ్జెట్ తెరవండి', createBudget: 'బడ్జెట్ ప్లాన్ చేయండి',
    noBudget: 'మొత్తం నిర్ణయించి అలంకరణ ఖర్చును ట్రాక్ చేయండి.',
    remaining: 'మిగిలినది', ofTotal: 'లో', totalLabel: 'మొత్తం', allocated: 'కేటాయించినది', overBudget: 'ప్లాన్ కంటే ఎక్కువ',
    recentlyShared: 'ఇటీవల షేర్ చేసినవి',
    viewShared: 'షేర్ చేసిన డిజైన్ చూడండి', noShares: 'అతిథి లింక్ సృష్టించినప్పుడు డిజైన్లు ఇక్కడ కనిపిస్తాయి.',
    shareUnavailable: 'కనెక్ట్ చేసిన ఖాతాతో సైన్ ఇన్ చేసినప్పుడు షేర్ లింకులు కనిపిస్తాయి.',
    shareLoading: 'షేర్ చేసిన డిజైన్లు లోడ్ అవుతున్నాయి…', shareError: 'షేర్ చేసిన డిజైన్లను లోడ్ చేయలేకపోయాం.',
    previewUnavailable: 'ప్రివ్యూ అందుబాటులో లేదు', noSavedDesigns: 'ఇంకా డిజైన్లు సేవ్ కాలేదు',
    approved: 'ఆమోదించబడింది', pending: 'అభిప్రాయం కోసం వేచి ఉంది', changes: 'మార్పులు కోరారు',
    comments: 'వ్యాఖ్యలు', finalTitle: 'ప్రతి అందమైన వేడుక ఒక ఆలోచనతో మొదలవుతుంది.',
    blankTitle: 'ఖాళీ కాన్వాస్', blankText: 'మొదటి నుంచి అలంకరణ డిజైన్ ప్రారంభించండి.',
    exploreTitle: 'టెంప్లేట్లను చూడండి', exploreText: 'సవరించగల అలంకరణ ఆలోచనలను కనుగొనండి.',
    moodboardTitle: 'మూడ్‌బోర్డ్ సృష్టించండి', moodboardText: 'ప్రేరణలు, అలంకరణ ఆలోచనలను సేకరించండి.',
    openStudio: 'స్టూడియో తెరవండి', explore: 'చూడండి', create: 'సృష్టించండి',
  },
};

function formatBudgetMoney(amount, currency = 'INR') {
  if (currency === 'INR') return formatINR(amount);
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function BudgetPreview({ budget, designs, text }) {
  if (!budget) {
    return (
      <div className="dash-budget-preview is-empty" aria-hidden="true">
        <div className="dash-budget-glow" />
        <div className="dash-budget-empty-mark">
          <span /><span /><span />
        </div>
        <p>{text.noBudget}</p>
      </div>
    );
  }

  const total = Number(budget.totalBudget) || 0;
  const allocated = budgetAllocated(budget, designs);
  const remaining = total - allocated;
  const over = total > 0 && remaining < 0;
  const pct = total > 0 ? Math.min(100, Math.round((allocated / total) * 100)) : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * (total > 0 ? Math.min(pct, 100) : 0)) / 100;
  const hero = total > 0
    ? formatBudgetMoney(Math.abs(remaining), budget.currency || 'INR')
    : allocated > 0
      ? formatBudgetMoney(allocated, budget.currency || 'INR')
      : '—';
  const heroLabel = total > 0 ? (over ? text.overBudget : text.remaining) : text.allocated;

  return (
    <div className={`dash-budget-preview${over ? ' is-over' : ''}`} aria-hidden="true">
      <div className="dash-budget-glow" />
      <div className="dash-budget-ring-wrap">
        <svg className="dash-budget-ring" viewBox="0 0 128 128">
          <circle className="dash-budget-ring-track" cx="64" cy="64" r={radius} />
          <circle
            className="dash-budget-ring-value"
            cx="64"
            cy="64"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={total > 0 ? offset : circumference}
          />
        </svg>
        <div className="dash-budget-ring-copy">
          <strong>{hero}</strong>
          <small>{heroLabel}</small>
        </div>
      </div>
      {total > 0 && (
        <p className="dash-budget-footnote">
          {formatBudgetMoney(allocated, budget.currency || 'INR')} {text.allocated}
          {' · '}
          {formatBudgetMoney(total, budget.currency || 'INR')} {text.totalLabel}
        </p>
      )}
    </div>
  );
}

const inspirationItems = AVAILABLE_TEMPLATE_COVERS.slice(0, 6).map((template) => ({
  title: template.title,
  category: template.category,
  image: template.cover,
  position: 'center',
}));

const formatDate = (value, locale) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'te' ? 'te-IN' : undefined, {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(date);
};

function ScenePreview({ scene, label, className = '' }) {
  return scene ? (
    <SceneView scene={scene} uid={`dash-${label.replace(/\W/g, '-')}`} className={className} aria-hidden="true" />
  ) : (
    <div className={`dash-preview-empty ${className}`}>{label}</div>
  );
}

function SharedDesignPreview({ latestShare, shareDesign }) {
  const previewRef = useRef(null);
  const [zoom, setZoom] = useState(0.35);

  useEffect(() => {
    const element = previewRef.current;
    if (!element || shareDesign?.scene) return undefined;
    const updateZoom = () => {
      const styles = getComputedStyle(element);
      const padX = (Number.parseFloat(styles.paddingLeft) || 0) + (Number.parseFloat(styles.paddingRight) || 0);
      const padY = (Number.parseFloat(styles.paddingTop) || 0) + (Number.parseFloat(styles.paddingBottom) || 0);
      const width = Math.max(element.clientWidth - padX, 1);
      const height = Math.max(element.clientHeight - padY, 1);
      setZoom(Math.min(width / 800, height / 600, 1) || 0.35);
    };
    updateZoom();
    const observer = new ResizeObserver(updateZoom);
    observer.observe(element);
    return () => observer.disconnect();
  }, [shareDesign?.scene]);

  if (shareDesign?.scene) {
    return (
      <div className="dash-shared-preview-scene" aria-hidden="true">
        <SceneView scene={shareDesign.scene} uid={`dash-share-${latestShare.id}`} />
      </div>
    );
  }

  return (
    <div ref={previewRef} className="dash-shared-preview-canvas" aria-hidden="true">
      <DesignCanvas elements={latestShare.elements} selectedId={null} settings={{ ...DEFAULT_SETTINGS, ...(latestShare.settings ?? {}) }} venuePlan={latestShare.venuePlan} zoom={zoom} preview hideChrome onSelect={() => {}} onUpdateElement={() => {}} />
    </div>
  );
}

function MoodboardPreview({ moodboard, designs, emptyLabel }) {
  const mosaic = collectMosaicTiles(moodboard, designs, 4);
  const coverSrc = moodboard?.coverImage ? resolveMoodboardMedia(moodboard.coverImage) : '';

  if (coverSrc && moodboard?.coverMode !== 'mosaic') {
    return (
      <div className="dash-collection-media">
        <img className="dash-collection-media-blur" src={coverSrc} alt="" aria-hidden="true" />
        <img className="dash-collection-media-full" src={coverSrc} alt="" loading="lazy" />
      </div>
    );
  }

  if (mosaic.length > 0) {
    return (
      <div className={`dash-scene-mosaic count-${Math.min(mosaic.length, 4)}`} aria-hidden="true">
        {mosaic.slice(0, 4).map((tile) => {
          if (tile.mode === 'scene') {
            return <SceneView key={tile.key} scene={tile.scene} uid={`dash-mb-${moodboard.id}-${tile.key}`} />;
          }
          if (tile.mode === 'swatch') {
            return <span key={tile.key} className="dash-mosaic-swatch" style={{ backgroundColor: tile.color }} />;
          }
          return <img key={tile.key} src={tile.src} alt="" loading="lazy" />;
        })}
      </div>
    );
  }

  if (coverSrc) {
    return (
      <div className="dash-collection-media">
        <img className="dash-collection-media-blur" src={coverSrc} alt="" aria-hidden="true" />
        <img className="dash-collection-media-full" src={coverSrc} alt="" loading="lazy" />
      </div>
    );
  }

  return <div className="dash-collection-placeholder"><Images size={23} /><span>{emptyLabel}</span></div>;
}

function SectionHeading({ title, description, action }) {
  return (
    <div className="dash-section-heading">
      <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
      {action}
    </div>
  );
}

export default function DashboardOverview({
  locale = 'en', designs = [], moodboards = [], budgets = [], canSaveData = false,
  onOpenDesign, onNewDesign, onBrowseTemplates, onViewAllDesigns, onViewMoodboards,
  onCreateMoodboard, onViewBudget, onCreateBudget, onOpenShared, onExploreCategory,
}) {
  const text = copy[locale] ?? copy.en;
  const [sharedDesigns, setSharedDesigns] = useState([]);
  const [shareState, setShareState] = useState(canSaveData ? 'loading' : 'unavailable');
  const recent = useMemo(() => [...designs]
    .sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0) - new Date(a.updatedAt ?? a.createdAt ?? 0))
    .slice(0, 3), [designs]);
  const latestBudget = useMemo(() => [...budgets]
    .sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? 0) - new Date(a.updatedAt ?? a.createdAt ?? 0))[0], [budgets]);

  useEffect(() => {
    let active = true;
    if (!canSaveData) {
      setSharedDesigns([]);
      setShareState('unavailable');
      return () => { active = false; };
    }
    setShareState('loading');
    getMySharedDesigns().then((items) => {
      if (!active) return;
      setSharedDesigns(items);
      setShareState('ready');
    }).catch(() => {
      if (active) setShareState('error');
    });
    return () => { active = false; };
  }, [canSaveData]);

  const moodboard = moodboards[0];
  const moodboardColors = moodboard?.palette ?? moodboard?.colors ?? [];
  const savedIdeaCount = moodboard ? buildInspirationEntries(moodboard, designs).length : 0;
  const latestShare = sharedDesigns[0];
  const shareDesign = latestShare && designs.find((design) => design.id === latestShare.designId);

  return (
    <div className="dashboard-studio">
      <section className="dash-welcome">
        <div className="dash-welcome-copy">
          <p className="dash-eyebrow"><span />{text.label}</p>
          <h1>{text.greeting}</h1>
          <p className="dash-welcome-subtitle">{text.welcome}</p>
        </div>
        <div className="dash-welcome-actions">
          <button className="dash-button dash-button-primary" onClick={onNewDesign}><Plus size={17} />{text.newDesign}</button>
          <button className="dash-button dash-button-secondary" onClick={onBrowseTemplates}><LayoutTemplate size={16} />{text.templates}</button>
        </div>
      </section>

      <section className="dash-section">
        <SectionHeading title={text.continue} description={text.continueText} action={designs.length > 3 && (
          <button className="dash-text-action" onClick={onViewAllDesigns}>{text.viewAll}<ArrowRight size={15} /></button>
        )} />
        {recent.length ? (
          <div className="dash-design-grid">
            {recent.map((design) => {
              const category = design.eventCategory ?? design.eventType ?? design.category;
              const modified = formatDate(design.updatedAt ?? design.createdAt, locale);
              return (
                <article className="dash-design-card" key={design.id}>
                  <button className="dash-design-preview" onClick={() => onOpenDesign(design)} aria-label={`${text.edit}: ${design.name}`}>
                    <ScenePreview scene={design.scene} label={text.previewUnavailable} />
                    <span className="dash-preview-arrow"><ArrowRight size={17} /></span>
                  </button>
                  <div className="dash-design-details">
                    <div className="dash-design-title-line">
                      <h3>{design.name}</h3>
                      {category && <span>{category}</span>}
                    </div>
                    {modified && <p>{text.modified} · {modified}</p>}
                    <button className="dash-card-link" onClick={() => onOpenDesign(design)}>{text.edit}<ArrowRight size={14} /></button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="dash-empty-designs">
            <div className="dash-empty-art" aria-hidden="true"><span /><span /><span /><Flower2 size={26} /></div>
            <div><h3>{text.startTitle}</h3><p>{text.startText}</p></div>
            <button className="dash-button dash-button-primary" onClick={onNewDesign}><Plus size={16} />{text.startDesigning}</button>
          </div>
        )}
      </section>

      <section className="dash-section dash-inspiration-section">
        <SectionHeading title={text.inspiration} description={text.inspirationText} />
        <div className="dash-inspiration-grid">
          {inspirationItems.map((item) => (
            <button className="dash-inspiration-card" key={item.title} onClick={() => onExploreCategory(item.category)}>
              <img src={resolveTemplateCover(item.image)} alt="" style={{ objectPosition: item.position }} loading="lazy" />
              <span className="dash-inspiration-shade" />
              <span className="dash-inspiration-copy"><small>{item.category}</small><strong>{item.title}</strong></span>
              <span className="dash-inspiration-arrow"><ArrowRight size={16} /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="dash-section">
        <SectionHeading title={text.collections} description={text.collectionText} />
        <div className="dash-collection-grid dash-collection-grid-three">
          <article
            className="dash-collection-card is-clickable"
            role="button"
            tabIndex={0}
            aria-label={moodboard ? `${text.viewMoodboards}: ${moodboard?.name ?? moodboard?.title ?? text.myMoodboards}` : text.createMoodboard}
            onClick={moodboard ? onViewMoodboards : onCreateMoodboard}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                (moodboard ? onViewMoodboards : onCreateMoodboard)?.();
              }
            }}
          >
            <div className="dash-collection-preview">
              {moodboard
                ? <MoodboardPreview moodboard={moodboard} designs={designs} emptyLabel={text.noMoodboards} />
                : <div className="dash-collection-placeholder"><Images size={23} /><span>{text.noMoodboards}</span></div>}
            </div>
            <div className="dash-collection-body">
              <div><p className="dash-card-kicker">{text.myMoodboards}</p><h3>{moodboard?.name ?? moodboard?.title ?? text.noMoodboards}</h3>
                {moodboard && <p>{savedIdeaCount} {text.savedIdeas}</p>}
              </div>
              <span className="dash-button dash-button-secondary" aria-hidden="true">{moodboard ? text.viewMoodboards : text.createMoodboard}<ArrowRight size={15} /></span>
            </div>
            {moodboardColors.length > 0 && <div className="dash-palette-strip" aria-label="Moodboard palette">{moodboardColors.slice(0, 6).map((color) => <i key={color} style={{ backgroundColor: color }} />)}</div>}
          </article>

          <article
            className="dash-collection-card is-clickable"
            role="button"
            tabIndex={0}
            aria-label={latestBudget ? `${text.viewBudget}: ${latestBudget.name}` : text.createBudget}
            onClick={latestBudget ? onViewBudget : onCreateBudget}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                (latestBudget ? onViewBudget : onCreateBudget)?.();
              }
            }}
          >
            <div className="dash-collection-preview">
              <BudgetPreview budget={latestBudget} designs={designs} text={text} />
            </div>
            <div className="dash-collection-body">
              <div>
                <p className="dash-card-kicker">{text.eventBudget}</p>
                <h3>{latestBudget?.name ?? text.createBudget}</h3>
                {latestBudget
                  ? <p>{(latestBudget.designIds?.length || 0)} linked · {(latestBudget.categories?.length || 0)} categories</p>
                  : <p>{text.noBudget}</p>}
              </div>
              <span className="dash-button dash-button-secondary" aria-hidden="true">
                {latestBudget ? text.viewBudget : text.createBudget}<ArrowRight size={15} />
              </span>
            </div>
          </article>

          <article
            className={`dash-collection-card${latestShare ? ' is-clickable' : ''}`}
            role={latestShare ? 'button' : undefined}
            tabIndex={latestShare ? 0 : undefined}
            aria-label={latestShare ? `${text.viewShared}: ${latestShare.name}` : undefined}
            onClick={latestShare ? () => onOpenShared(latestShare) : undefined}
            onKeyDown={latestShare ? ((event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpenShared?.(latestShare);
              }
            }) : undefined}
          >
            <div className="dash-collection-preview dash-shared-preview">
              {latestShare?.elements?.length ? (
                <SharedDesignPreview latestShare={latestShare} shareDesign={shareDesign} />
              ) : latestShare ? (
                <div className="dash-collection-placeholder"><Sparkles size={23} /><span>{text.previewUnavailable}</span></div>
              ) : (
                <div className="dash-collection-placeholder"><Sparkles size={23} /><span>{shareState === 'loading' ? text.shareLoading : shareState === 'unavailable' ? text.shareUnavailable : shareState === 'error' ? text.shareError : text.noShares}</span></div>
              )}
            </div>
            <div className="dash-collection-body">
              <div><p className="dash-card-kicker">{text.recentlyShared}</p><h3>{latestShare?.name ?? text.noShares}</h3>
                {latestShare && <p className="dash-share-status"><span className={`status-${latestShare.status || 'pending'}`} />{text[latestShare.status] ?? latestShare.status ?? text.pending}{latestShare.comments?.length ? ` · ${latestShare.comments.length} ${text.comments}` : ''}</p>}
              </div>
              {latestShare && <span className="dash-button dash-button-secondary" aria-hidden="true">{text.viewShared}<ExternalLink size={14} /></span>}
            </div>
          </article>
        </div>
      </section>

      <section className="dash-final-cta">
        <div className="dash-final-heading"><p className="dash-eyebrow"><span />Vedika Studio</p><h2>{text.finalTitle}</h2></div>
        <div className="dash-action-grid">
          <button className="dash-action-card" onClick={onNewDesign}><span className="dash-action-icon"><Palette size={19} /></span><span><strong>{text.blankTitle}</strong><small>{text.blankText}</small></span><ArrowRight size={17} /></button>
          <button className="dash-action-card" onClick={onBrowseTemplates}><span className="dash-action-icon"><Compass size={19} /></span><span><strong>{text.exploreTitle}</strong><small>{text.exploreText}</small></span><ArrowRight size={17} /></button>
          <button className="dash-action-card" onClick={onCreateMoodboard}><span className="dash-action-icon"><Images size={19} /></span><span><strong>{text.moodboardTitle}</strong><small>{text.moodboardText}</small></span><ArrowRight size={17} /></button>
        </div>
      </section>
    </div>
  );
}
