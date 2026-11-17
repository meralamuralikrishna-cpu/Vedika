import { useNavigate } from 'react-router-dom';
import TemplateGrid from '@/components/templates/TemplateGrid';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import SaveToMoodboardButton from '@/components/workspace/SaveToMoodboardButton';

export function ExploreTemplates() {
  const navigate = useNavigate();
  const { templateFavorites, toggleTemplateFavorite } = useApp();

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-6xl mx-auto">
      <PageHeader kicker="Discovery catalogue" title="Explore Templates" description="Search event layouts, filter by celebration type, preview a scene, save favorites, or open one in Studio." />
      <TemplateGrid
        favorites={templateFavorites}
        onToggleFavorite={toggleTemplateFavorite}
        onOpen={(template) => navigate(`/studio?template=${template.id}`)}
      />
    </div>
  );
}
