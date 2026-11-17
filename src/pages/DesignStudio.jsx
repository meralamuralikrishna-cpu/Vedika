import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import DesignStudioEditor from '@/components/studio/DesignStudio';
import { templates } from '@/data/templates';
import { ELEMENT_MAP } from '@/studio/elements';
import { DEFAULT_SETTINGS, getTheme } from '@/data/themes';
import { useApp } from '@/context/AppContext';
import { emptyScene } from '@/studio/useSceneEditor';
import { THEMES as STUDIO_THEMES } from '@/studio/themes';
import { createSharedDesign, shareUrl } from '@/lib/share';
import { useToast } from '@/components/ui/Toast';

function toLegacyElements(scene) {
  return scene.elements.map((element, index) => {
    const definition = ELEMENT_MAP[element.type];
    return {
      id: element.id,
      libraryId: element.type,
      category: definition?.category?.toLowerCase() ?? 'props',
      name: definition?.name ?? element.type,
      x: element.x,
      y: element.y,
      width: element.w,
      height: element.h,
      rotation: element.rotation ?? 0,
      color: element.color,
      zIndex: index + 1,
    };
  });
}

export function DesignStudio() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { designs, saveDesign, setActiveDesignId, canSaveData } = useApp();
  const template = templates.find((item) => item.id === params.get('template'));
  const design = designs.find((item) => item.id === params.get('design'));
  const themeId = params.get('theme');
  const studioTheme = STUDIO_THEMES.find((item) => item.id === themeId);
  const appTheme = themeId && !studioTheme ? getTheme(themeId) : null;
  const themedScene = studioTheme
    ? { ...emptyScene, name: `${studioTheme.name} look`, bg: studioTheme.bg, floor: studioTheme.floor, palette: studioTheme.palette }
    : appTheme
      ? { ...emptyScene, name: `${appTheme.name} look`, bg: [appTheme.palette.backdrop, appTheme.palette.secondary], floor: [appTheme.palette.platform, appTheme.palette.accent], palette: [appTheme.palette.primary, appTheme.palette.secondary, appTheme.palette.accent, appTheme.palette.backdrop, appTheme.palette.platform] }
      : undefined;
  const initialScene = template?.scene ?? design?.scene ?? themedScene;
  const initialSettings = design?.settings ?? template?.settings ?? DEFAULT_SETTINGS;
  const routeKey = template?.id ?? design?.id ?? (themeId ? `theme-${themeId}` : 'blank');
  const idRef = useRef({ routeKey, id: design?.id ?? uuid() });
  if (idRef.current.routeKey !== routeKey) idRef.current = { routeKey, id: design?.id ?? uuid() };
  const { toast } = useToast();

  const handleSave = (scene, currentSettings) => {
    const now = new Date().toISOString();
    const existing = designs.find((item) => item.id === idRef.current.id);
    const saved = {
      ...existing,
      id: idRef.current.id,
      name: scene.name,
      scene,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      thumbnailTheme: currentSettings?.themeId ?? existing?.thumbnailTheme ?? DEFAULT_SETTINGS.themeId,
      elements: toLegacyElements(scene),
      settings: currentSettings ? { ...(existing?.settings ?? DEFAULT_SETTINGS), ...currentSettings } : (existing?.settings ?? { ...DEFAULT_SETTINGS }),
      venuePlan: {
        ...scene.venue,
        widthFt: Number(scene.venue.widthM || 12) * 3.28084,
        depthFt: Number(scene.venue.depthM || 8) * 3.28084,
        imageDataUrl: scene.venue.image,
      },
    };
    saveDesign(saved);
    setActiveDesignId(saved.id);
    toast('Design saved successfully!', 'success');
  };

  const handleShare = async (scene, currentSettings) => {
    try {
      const now = new Date().toISOString();
      const existing = designs.find((item) => item.id === idRef.current.id);
      const saved = {
        ...existing,
        id: idRef.current.id,
        name: scene.name,
        scene,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        thumbnailTheme: currentSettings?.themeId ?? existing?.thumbnailTheme ?? DEFAULT_SETTINGS.themeId,
        elements: toLegacyElements(scene),
        settings: currentSettings ? { ...(existing?.settings ?? DEFAULT_SETTINGS), ...currentSettings } : (existing?.settings ?? { ...DEFAULT_SETTINGS }),
        venuePlan: {
          ...scene.venue,
          widthFt: Number(scene.venue.widthM || 12) * 3.28084,
          depthFt: Number(scene.venue.depthM || 8) * 3.28084,
          imageDataUrl: scene.venue.image,
        },
      };
      if (canSaveData) {
        saveDesign(saved);
        setActiveDesignId(saved.id);
      }
      const share = await createSharedDesign({
        designId: saved.id,
        name: saved.name,
        elements: saved.elements,
        settings: saved.settings,
        venuePlan: saved.venuePlan,
      });
      const url = shareUrl(share.id);
      await navigator.clipboard.writeText(url);
      toast('Share link copied to clipboard!', 'success');
      return { success: true, url };
    } catch (err) {
      console.warn('Share error', err);
      await navigator.clipboard.writeText(window.location.href);
      toast('Studio URL copied to clipboard!', 'info');
      return { success: false, url: window.location.href, error: err.message };
    }
  };

  return (
    <DesignStudioEditor
      key={routeKey}
      initialScene={initialScene}
      initialSettings={initialSettings}
      onSave={canSaveData ? handleSave : undefined}
      onShare={handleShare}
      onClose={() => navigate(-1)}
    />
  );
}
