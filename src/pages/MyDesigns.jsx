import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Search, Trash2, Copy, Link2, ExternalLink, Ban, ClipboardList } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { getTheme } from '@/data/themes';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatDate, cn } from '@/lib/utils';
import { createSharedDesign, getMySharedDesigns, revokeSharedDesign, shareUrl } from '@/lib/share';
export function MyDesigns() {
    const { designs, deleteDesign, saveDesign, toggleDesignFavorite, setActiveDesignId, canSaveData } = useApp();
    const { toast } = useToast();
    const [q, setQ] = useState('');
    const [favOnly, setFavOnly] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [shares, setShares] = useState([]);
    const [shareError, setShareError] = useState('');
    const [revokingId, setRevokingId] = useState(null);
    const [creatingShareId, setCreatingShareId] = useState(null);
    const refreshShares = useCallback(async () => {
        if (!canSaveData) { setShares([]); return; }
        try { setShares(await getMySharedDesigns()); setShareError(''); }
        catch { setShareError('Could not load share links.'); }
    }, [canSaveData]);
    useEffect(() => { void refreshShares(); }, [refreshShares]);
    const filtered = useMemo(() => {
        return designs.filter((d) => {
            if (favOnly && !d.isFavorite)
                return false;
            if (q && !d.name.toLowerCase().includes(q.toLowerCase()))
                return false;
            return true;
        });
    }, [designs, q, favOnly]);
    return (<div className="p-6 md:p-10 animate-fade-in max-w-6xl mx-auto">
      <PageHeader kicker="Library" title="My Designs" description={canSaveData ? 'Your designs are saved to your Vedika account.' : 'Designs are temporary until you connect an account and sign in.'} action={<Link to="/studio" onClick={() => setActiveDesignId(null)}>
            <Button>
              <Plus className="h-4 w-4"/>
              New design
            </Button>
          </Link>}/>

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40"/>
          <Input className="pl-9" placeholder="Search designs…" value={q} onChange={(e) => setQ(e.target.value)}/>
        </div>
        <Button variant={favOnly ? 'primary' : 'secondary'} onClick={() => setFavOnly((v) => !v)} aria-pressed={favOnly}>
          <Heart className={cn('h-4 w-4', favOnly && 'fill-current')}/>
          Favorites
        </Button>
      </div>

      {canSaveData && <section className="mb-10 rounded-2xl border border-sage/30 bg-white/65 p-5 md:p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div><p className="section-kicker">Guest access</p><h2 className="font-display text-2xl text-forest">Shared links</h2><p className="text-xs text-charcoal/55 mt-1">Links stay active until you revoke them. Guests can view, rearrange, and resize shared elements.</p></div>
          <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-semibold text-forest">No expiry</span>
        </div>
        {shareError && <p role="alert" className="text-sm text-red-700">{shareError}</p>}
        {shares.length === 0 ? <p className="text-sm text-charcoal/55">No active links yet. Share a design from Studio to invite guests.</p> : <ul className="divide-y divide-sage/20">
          {shares.map((share) => <li key={share.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0"><p className="font-semibold text-sm text-forest truncate">{share.name}</p><p className="text-[11px] text-charcoal/50">Created {formatDate(share.createdAt)} · {share.status}</p></div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" aria-label={`Copy link for ${share.name}`} onClick={() => { void navigator.clipboard?.writeText(shareUrl(share.id)); toast('Share link copied', 'success'); }}><Link2 className="h-3.5 w-3.5"/><span className="hidden sm:inline">Copy</span></Button>
              <a href={shareUrl(share.id)} target="_blank" rel="noreferrer" aria-label={`Open share for ${share.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-forest hover:bg-sage/15"><ExternalLink className="h-3.5 w-3.5"/></a>
              <Button size="sm" variant="danger" disabled={revokingId === share.id} aria-label={`Revoke link for ${share.name}`} onClick={async () => { setRevokingId(share.id); try { await revokeSharedDesign(share.id); setShares((current) => current.filter((item) => item.id !== share.id)); toast('Share link revoked', 'info'); } catch (error) { toast(error instanceof Error ? error.message : 'Could not revoke link.', 'error'); } finally { setRevokingId(null); } }}><Ban className="h-3.5 w-3.5"/><span className="hidden sm:inline">Revoke</span></Button>
            </div>
          </li>)}
        </ul>}
      </section>}

      {filtered.length === 0 ? (<EmptyState title="No designs yet" description={designs.length === 0
                ? 'Open the Design Studio to create your first look.'
                : 'Nothing matches your search.'} action={<Link to="/studio">
              <Button>Start Designing</Button>
            </Link>}/>) : (<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d) => {
                const th = getTheme(d.thumbnailTheme);
                return (<Card key={d.id} className="overflow-hidden">
                <div className="h-32 relative" style={{
                        background: `linear-gradient(145deg, ${th.palette.backdrop}, ${th.palette.primary})`,
                    }}>
                  <button type="button" className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 flex items-center justify-center" aria-label="Toggle favorite" onClick={() => toggleDesignFavorite(d.id)}>
                    <Heart className={cn('h-4 w-4 text-forest', d.isFavorite && 'fill-blush text-blush')}/>
                  </button>
                </div>
                <CardBody className="pt-4">
                  <p className="font-display text-xl text-forest">{d.name}</p>
                  <p className="text-xs text-charcoal/50 mt-1">
                    {formatDate(d.updatedAt)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link to={`/studio?design=${d.id}`} className="flex-1" onClick={() => setActiveDesignId(d.id)}>
                      <Button size="sm" className="w-full">
                        Open
                      </Button>
                    </Link>
                    <Link to={`/designs/${encodeURIComponent(d.id)}/plan`} className="flex-1">
                      <Button size="sm" variant="secondary" className="w-full"><ClipboardList className="h-3.5 w-3.5"/>Build plan</Button>
                    </Link>
                    <Link to={`/decorators?designType=custom&designId=${encodeURIComponent(d.id)}&designName=${encodeURIComponent(d.name)}`} className="flex-1">
                      <Button size="sm" variant="secondary" className="w-full">Create event brief</Button>
                    </Link>
                    {canSaveData && <Button size="sm" variant="secondary" disabled={creatingShareId === d.id} onClick={async () => {
                      setCreatingShareId(d.id);
                      try {
                        const share = await createSharedDesign({ designId: d.id, name: d.name, elements: d.elements, settings: d.settings, venuePlan: d.venuePlan });
                        const url = shareUrl(share.id);
                        let copied = false;
                        try {
                          if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); copied = true; }
                        } catch { /* Link remains available in Shared links below. */ }
                        await refreshShares();
                        toast(copied ? 'Guest link created and copied' : 'Guest link created. Copy it from Shared links below.', copied ? 'success' : 'info');
                      } catch (error) {
                        toast(error instanceof Error ? error.message : 'Could not create the guest link.', 'error');
                      } finally { setCreatingShareId(null); }
                    }}><Link2 className="h-3.5 w-3.5"/><span>{creatingShareId === d.id ? 'Creating…' : 'Get link'}</span></Button>}
                    <Button size="sm" variant="secondary" aria-label={`Duplicate ${d.name}`} title="Duplicate design" onClick={() => {
                      const copy = { ...d, id: uuid(), name: `${d.name} copy`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), elements: d.elements.map((element) => ({ ...element, id: uuid() })) };
                      saveDesign(copy);
                      toast('Design duplicated', 'success');
                    }}>
                      <Copy className="h-3.5 w-3.5"/>
                    </Button>
                    <Button size="sm" variant="secondary" aria-label={`Delete ${d.name}`} onClick={() => setDeleteId(d.id)}>
                      <Trash2 className="h-3.5 w-3.5"/>
                    </Button>
                  </div>
                </CardBody>
              </Card>);
            })}
        </div>)}

      <ConfirmDialog open={!!deleteId} title="Delete design?" message="This cannot be undone. The design will be removed from your account." confirmLabel="Delete" danger onCancel={() => setDeleteId(null)} onConfirm={() => {
            if (deleteId) {
                deleteDesign(deleteId);
                toast('Design deleted', 'info');
            }
            setDeleteId(null);
        }}/>
    </div>);
}
