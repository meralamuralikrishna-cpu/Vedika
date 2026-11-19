import { useNavigate } from 'react-router-dom';
import { LayoutTemplate, Plus } from 'lucide-react';
import DashboardOverview from '@/components/workspace/DashboardOverview';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { BrandMark } from '@/components/brand/BrandMark';
import { Wordmark } from '@/components/brand/Wordmark';

export function Overview() {
  const navigate = useNavigate();
  const { locale, designs, moodboards, budgets, canSaveData, setActiveDesignId } = useApp();

  return (
    <div className="animate-fade-in">
      <section className="lookbook-hero min-h-[440px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center px-6 md:px-10 py-10 md:py-12">
        <div className="relative z-10 animate-brand-in">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-blush/90 mb-5">Event decorations design studio</p>
          <Wordmark text={t(locale, 'brand')} size="hero" light className="mb-5 block" />
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-ivory/90 leading-snug mb-4 max-w-xl font-normal">{t(locale, 'heroTitle')}</h1>
          <p className="text-ivory/55 max-w-md mb-8 leading-relaxed text-[15px]">{t(locale, 'heroSubtitle')}</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" className="border-0 bg-white hover:bg-white shadow-lg shadow-black/20" style={{ color: '#14332b' }} onClick={() => navigate('/studio')}>
              <Plus className="h-4 w-4" />{t(locale, 'startDesigning')}
            </Button>
            <Button size="lg" variant="ghost" className="text-ivory border border-white/25 hover:bg-white/10 hover:text-ivory" onClick={() => navigate('/templates')}>
              <LayoutTemplate className="h-4 w-4" />{t(locale, 'browseTemplates')}
            </Button>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-center md:justify-end pointer-events-none">
          <BrandMark tone="soft" animated className="w-[min(100%,420px)] max-w-[420px] scale-[1.2] origin-center opacity-90 animate-soft-float" />
        </div>
      </section>
      <div className="p-6 md:p-10">
        <DashboardOverview
          locale={locale}
          designs={designs}
          moodboards={moodboards}
          budgets={budgets}
          canSaveData={canSaveData}
          onOpenDesign={(design) => {
            setActiveDesignId(design.id);
            navigate(`/studio?design=${encodeURIComponent(design.id)}`);
          }}
          onNewDesign={() => navigate('/studio')}
          onBrowseTemplates={() => navigate('/templates')}
          onViewAllDesigns={() => navigate('/designs')}
          onViewMoodboards={() => navigate('/moodboards')}
          onCreateMoodboard={() => navigate('/moodboards')}
          onViewBudget={() => navigate('/budget')}
          onCreateBudget={() => navigate('/budget')}
          onOpenShared={(share) => navigate(`/share/${encodeURIComponent(share.id)}`)}
          onExploreCategory={(category) => navigate(`/templates?category=${encodeURIComponent(category)}`)}
        />
      </div>
    </div>
  );
}
