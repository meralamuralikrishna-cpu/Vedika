import MoodboardCollection from '@/components/workspace/Moodboards';
import { useApp } from '@/context/AppContext';
import { v4 as uuid } from 'uuid';

export function Moodboards() {
  const { moodboards, designs, saveMoodboard, deleteMoodboard, toggleMoodboardFavorite, canSaveData, offlineDemo, cloudSaveStatus } = useApp();
  const boards = moodboards.map((board) => ({
    ...board,
        name: board.name ?? board.title,
        note: board.note ?? board.notes,
    palette: board.palette ?? board.colors ?? [],
    scenes: board.scenes ?? [],
        designIds: board.designIds ?? [],
    favorite: board.favorite ?? board.isFavorite,
    linkedDesigns: designs.filter((design) => (board.designIds ?? []).includes(design.id)),
  }));

  const saveBoard = (draft) => {
    const existing = draft.id ? boards.find((board) => board.id === draft.id) : null;
    const designIds = draft.designIds ?? existing?.designIds ?? [];
    const linkedDesigns = designs.filter((design) => designIds.includes(design.id));
    const legacyScenes = existing && !existing.designIds?.length ? existing.scenes ?? [] : [];
    const now = new Date().toISOString();
    saveMoodboard({
      ...existing,
      id: existing?.id ?? uuid(),
      title: draft.name,
      name: draft.name,
      eventType: draft.eventType,
      eventDate: draft.eventDate,
      budget: draft.budget ?? existing?.budget ?? '',
      referenceUrl: draft.referenceUrl ?? existing?.referenceUrl ?? '',
      inspirations: draft.inspirations ?? existing?.inspirations ?? [],
      items: draft.items ?? existing?.items ?? [],
      palettes: draft.palettes ?? existing?.palettes ?? [],
      collage: draft.collage ?? existing?.collage ?? { tiles: [] },
      coverImage: draft.coverImage ?? '',
      coverMode: draft.coverMode ?? (draft.coverImage ? 'image' : 'mosaic'),
      notes: draft.note,
      note: draft.note,
      colors: draft.palette,
      palette: draft.palette,
      tags: existing?.tags ?? [],
      isFavorite: existing?.isFavorite ?? false,
      scenes: [...legacyScenes, ...linkedDesigns.map((design) => design.scene).filter(Boolean)],
      designIds,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
  };

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-6xl mx-auto">
      <MoodboardCollection
        moodboards={boards}
        designs={designs}
        canSaveData={canSaveData}
        offlineDemo={offlineDemo}
        cloudSaveStatus={cloudSaveStatus}
        onCreate={saveBoard}
        onUpdate={saveMoodboard}
        onDelete={deleteMoodboard}
        onToggleFavorite={toggleMoodboardFavorite}
      />
    </div>
  );
}
